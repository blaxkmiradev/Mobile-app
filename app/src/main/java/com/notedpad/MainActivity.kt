package com.notedpad

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.addTextChangedListener
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.StaggeredGridLayoutManager
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.notedpad.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var db: NoteDatabase
    private lateinit var adapter: NoteAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = NoteDatabase.getDatabase(this)
        setupRecyclerView()
        observeNotes()
        setupListeners()
    }

    private fun setupRecyclerView() {
        adapter = NoteAdapter(
            onNoteClick = { note -> showNoteDialog(note) },
            onDeleteClick = { note -> confirmDelete(note) }
        )
        binding.recyclerView.layoutManager = StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL)
        binding.recyclerView.adapter = adapter
    }

    private fun observeNotes() {
        lifecycleScope.launch {
            db.noteDao().getAllNotes().collect { notes ->
                adapter.submitList(notes)
                binding.emptyState.visibility = if (notes.isEmpty()) View.VISIBLE else View.GONE
            }
        }
    }

    private fun setupListeners() {
        binding.fabAdd.setOnClickListener { showNoteDialog(null) }
        
        binding.searchEditText.addTextChangedListener { text ->
            val query = "%${text.toString()}%"
            lifecycleScope.launch {
                db.noteDao().searchNotes(query).collect { notes ->
                    adapter.submitList(notes)
                }
            }
        }
    }

    private fun showNoteDialog(note: Note?) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_note_editor, null)
        val editTitle = dialogView.findViewById<EditText>(R.id.editTitle)
        val editContent = dialogView.findViewById<EditText>(R.id.editContent)

        note?.let {
            editTitle.setText(it.title)
            editContent.setText(it.content)
        }

        MaterialAlertDialogBuilder(this)
            .setTitle(if (note == null) R.string.add_note else R.string.edit_note)
            .setView(dialogView)
            .setPositiveButton(R.string.save) { _, _ ->
                val title = editTitle.text.toString()
                val content = editContent.text.toString()
                if (title.isNotBlank() || content.isNotBlank()) {
                    lifecycleScope.launch {
                        val newNote = note?.copy(
                            title = title,
                            content = content,
                            updatedAt = System.currentTimeMillis()
                        ) ?: Note(title = title, content = content)
                        db.noteDao().insert(newNote)
                    }
                }
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    private fun confirmDelete(note: Note) {
        MaterialAlertDialogBuilder(this)
            .setTitle(R.string.delete_confirm)
            .setMessage(note.title)
            .setPositiveButton("Delete") { _, _ ->
                lifecycleScope.launch {
                    db.noteDao().delete(note)
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
}

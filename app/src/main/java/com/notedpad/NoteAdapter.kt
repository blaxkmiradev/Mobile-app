
package com.notedpad

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.notedpad.databinding.ItemNoteBinding
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class NoteAdapter(
    private val onNoteClick: (Note) -> Unit,
    private val onDeleteClick: (Note) -> Unit
) : ListAdapter<Note, NoteAdapter.NoteViewHolder>(DiffCallback) {

    class NoteViewHolder(private val binding: ItemNoteBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(note: Note, onNoteClick: (Note) -> Unit, onDeleteClick: (Note) -> Unit) {
            binding.textTitle.text = note.title
            binding.textContent.text = note.content
            
            val sdf = SimpleDateFormat("MMM dd", Locale.getDefault())
            binding.textDate.text = sdf.format(Date(note.updatedAt))

            try {
                binding.cardView.setCardBackgroundColor(Color.parseColor(note.color))
            } catch (e: Exception) {
                binding.cardView.setCardBackgroundColor(Color.parseColor("#FEF7FF"))
            }

            binding.root.setOnClickListener { onNoteClick(note) }
            binding.btnDelete.setOnClickListener { onDeleteClick(note) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NoteViewHolder {
        val binding = ItemNoteBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return NoteViewHolder(binding)
    }

    override fun onBindViewHolder(holder: NoteViewHolder, position: Int) {
        holder.bind(getItem(position), onNoteClick, onDeleteClick)
    }

    companion object DiffCallback : DiffUtil.ItemCallback<Note>() {
        override fun areItemsTheSame(oldItem: Note, newItem: Note) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: Note, newItem: Note) = oldItem == newItem
    }
}


package com.notedpad

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "notes")
data class Note(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val content: String,
    val updatedAt: Long = System.currentTimeMillis(),
    val color: String = "#fef7ff"
)

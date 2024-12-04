const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Assuming there is a User model
      required: true,
    }
},
{
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

TaskSchema.pre("save", function (next) {
    if (new Date() > this.dueDate && this.status === "Pending") {
      this.status = "Overdue";
    }
    next();
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task
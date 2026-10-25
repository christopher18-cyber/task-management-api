import mongoose, {Schema, Document} from "mongoose";

export interface ICard extends Document{
    title: string;
    description?: string;
    columnId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    priority: "Low" | "Medium" | "High" | "Urgent";
    dueDate?: Date;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const CardSchema: Schema = new Schema(
{
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'], 
      default: 'Medium' 
    },
    dueDate: { type: Date, required: false },
    order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<ICard>("Card",CardSchema)
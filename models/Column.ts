import mongoose, { Schema, Document } from 'mongoose';

export interface IColumn extends Document {
  title: string;
  boardId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IColumn>('Column', ColumnSchema);
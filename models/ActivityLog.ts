import mongoose, {Schema,Document} from "mongoose";

export interface IActivityLog extends Document{
    boardId: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    action: String;
    details: String;
    createdAt: Date;
}


const ActivityLogSchema: Schema = new Schema(
  {
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Logs only need a creation timestamp
  }
);

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
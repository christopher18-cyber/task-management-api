import mongoose, {Schema, Document} from "mongoose";
export interface IBoard extends Document{
    title: string,
    description? : string;
    owner: mongoose.Types.ObjectId;
    member: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const BoardSchema: Schema = new Schema(
    {
        title: {type:String, required:true, trim:true},
        description : {type: String, trim: true},
        owner: {type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
        members: [{type:mongoose.Schema.Types.ObjectId, ref:"User"}]
    },
    {
        timestamps:true
    }
)


export default mongoose.model<IBoard>("Board",BoardSchema)
import mongoose, {Schema,Document} from "mongoose";

export interface IUser extends Document{
    name: String;
    email: String;
    password : String;
    avatar: String;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name:{type:String, required: true,trim:true},
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {type:String, required:true},
        avatar: {type:String, default:""}
    },{
        timestamps: true
    }
);


export default mongoose.model<IUser>("User", UserSchema)
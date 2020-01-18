import { Schema } from "mongoose";

export const UserImageSchema: Schema = new Schema({
    user_id: String,
    server_name: String,
    metrics: Array
}, {timestamps: true, strict: false});
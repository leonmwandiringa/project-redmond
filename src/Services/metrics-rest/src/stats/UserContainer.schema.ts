import { Schema } from "mongoose";

export const UserContainerSchema: Schema = new Schema({
    user_id: String,
    server_name: String,
    metrics: Object
}, {timestamps: true, strict: false});
import { Schema } from "mongoose";

export const AlertSchema: Schema = new Schema({
    user_id: String,
    server_name: String,
    type: String,
    host: String,
    topic: String,

}, {timestamps: true, strict: false});
import { Schema } from "mongoose";

export const AlertSchema: Schema = new Schema({
    user_id: String,
    server_name: String,
    target: String,
    instruction: Object,
    counter: Number,
}, {timestamps: true, strict: false});
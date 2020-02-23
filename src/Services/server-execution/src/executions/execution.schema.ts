import { Schema } from "mongoose";

export const ExecutionSchema: Schema = new Schema({
    user_id: String,
    server_name: String,
    target: String,
    instruction: Object,
    requested_at: Date,
    satisfied: {
      required: false,
      default: false
    },
    satisfied_at: Date
}, {timestamps: true, strict: false});
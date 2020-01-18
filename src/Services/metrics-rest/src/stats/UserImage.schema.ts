import { Schema } from "mongoose";

export const UserImageSchema: Schema = new Schema({
    user_id: String,
    server_name: String,
    metrics: [new Schema({
        image_id: String
      }, {strict: false, _id: false})]
}, {timestamps: true, strict: false});
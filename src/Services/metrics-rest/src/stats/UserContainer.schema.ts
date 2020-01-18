import { Schema } from "mongoose";

export const UserContainerSchema: Schema = new Schema({
    user_id: String,
    server_name: String,
    metrics: [new Schema({
        container_id: String
      }, {strict: false, _id: false})]
}, {timestamps: true, strict: false});
import { Schema } from "mongoose";

export const MetricSchema: Schema = new Schema({

   name: {
       type: String,
       required: false,
   }
}, {timestamps: true, strict: false});

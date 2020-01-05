import { Schema } from "mongoose";

export const AuthSchema: Schema = new Schema({

   name: {
       type: String,
       required: false,
   },
   surname: {
       type: String,
       required: false,
   },
   email: {
       type: String,
       required: false,
   },
   cell: {
       type: String,
       required: false,
   },
   province: {
       type: String,
       required: false,
   },
   favourites:{
        type: String,
        required: false,
   },
   city:{
        type: String,
        required: false
   },
   verification:{
        type: Object,
        required: false,
   }
}, {timestamps: true, strict: false});

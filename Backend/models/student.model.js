//Yeh schema hmne student ke lie create kra jo apne result check krege

import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required:true
    },
    _id: {
       type: String,
       required: true
     },
     class_id: {
        type: String,
        required: true,
        ref: "Class"
     },
     result:[{
        type:mongoose.Schema.Types.ObjectId,//making relation between student and result
        required:true,
        ref:"Result"
     }]
    },{timestamps:true});

export const Student = mongoose.model('Student', studentSchema);
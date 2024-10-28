//This schema is for student result
//Isme hm relation create krege with student , with class

import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
     student_id:{
        type:String,
        required:true,
        ref:"Student"
     },
     class_id:{
        type:String,
        required:true,
        ref:"Class"
     },
     result:[{
        name:{ type:String , required:true},
        score:{type:String , required:true},
        },
     ]
},{timestamps:true});

export const Result = mongoose.model('Result' , resultSchema);
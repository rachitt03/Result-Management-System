//yeh schema har education institute ki class represnt krne ke lie
//and isme hm ek relation table bnaege with student taki class me kaun kaun se studnets enrolled hai paata chl ske

import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    semester:{
        type:Number,
        required:true
    },
    subjects:[{//array create kra 
       type:String,
       required:true
    }],
    students:[{
        type:String,
        required:true,
        ref:"Student" 
    }],//made a relation with student
    result:[{//now making a relation with result
       type:mongoose.Schema.Types.ObjectId,
       required:true,
       ref:"Result"
    }]
},{timestamps:true});

export const Class = mongoose.model('Class' , classSchema);
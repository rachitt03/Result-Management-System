//In this we will write for uploadingResult , uploadingStudent , uploadingStudentClasses
//hm isme data upload krege using excel using dependency csvtojson

import csv from "csvtojson";
import { Result } from "../models/result.model.js";
import { Class } from "../models/class.model.js";
import { Student } from "../models/student.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";


//First we will write it for uploadResult
export const uploadResult = async(req,res)=>{
    try{
       //Now we will do csvparsing- read the upload csv file from the path where it is stored and jsonobj contains the json representation of the file data.
       const jsonobj = await csv().fromFile(req.file.path);
       
       jsonobj.forEach((element) => {
           // Ensure name and marks exist in the CSV data
           if (element.name && element.marks) {
          const nameArr = element.name.split(",");
          const marksArr = element.marks.split(",");
          // Ensure that nameArr and marksArr have the same length to avoid mismatches
          if (nameArr.length === marksArr.length) {
          const result = nameArr.map((name,i) => ({
            name,
            score:parseInt(marksArr[i],10)
          }));

          element.result = result;
          delete element.name;
          delete element.marks;
       }else {
        throw new Error("Mismatch between names and marks in CSV data.");
    }
    }});
 
       //bhot sare result jo hoge vo insert hojaege using insertMany
       const results = await Result.insertMany(jsonobj);
       
       for(const result of results){
        //yeh define hmne dashboard vale code pr kra tha classDoc and studentDoc jab hm add result kr rahe the tab
        const classDoc = await Class.findById(result.class_id);
        const studentDoc = await Student.findById(result.student_id);
        classDoc.result.push(result._id);
        await classDoc.save();
        studentDoc.result.push(result._id);
        await studentDoc.save();
       }
    
       return res.status(200).json({
        message:"Result uploaded successfully",
        success:true,
       });
    }catch(error){
        console.log(error);
    }
};

//Now we will do for uploadStudent

export const uploadStudent = async(req,res)=>{
    try{
       //Now we will do csvparsing- read the upload csv file from the path where it is stored and jsonobj contains the json representation of the file data.
       
       const jsonobj = await csv().fromFile(req.file.path);

       const students = await Student.insertMany(jsonobj);
       
       for(const student of students){
        const classDoc = await Class.findById(student.class_id);
        classDoc.students.push(student._id);
        await classDoc.save();
       }

       return res.status(200).json({
        message:"Students uploaded successfully",
        success:true,
       });
    }catch(error){
        console.log(error);
    }
}


//Now we will do it for upload student class or we can say updateClass

export const updateClass = async(req,res) => {
    try{ 
       const jsonobj = await csv().fromFile(req.file.path);

       for(const element of jsonobj){
         const student = await Student.findById(element.enrollment_no);
           // Check if student is found
           if (!student) {
            console.log(`Student with enrollment_no ${element.enrollment_no} not found.`);
            continue; // Skip to the next iteration if student is not found
           }

         const oldClass = await Class.findById(student.class_id);
         const newClass  =await Class.findById(element.class_id);
         if (!oldClass) {
            console.log(`Old class with id ${student.class_id} not found for student ${element.enrollment_no}.`);
            continue; // Skip to the next iteration if old class is not found
        }

        // Check if newClass is found
        if (!newClass) {
            console.log(`New class with id ${element.class_id} not found for student ${element.enrollment_no}.`);
            continue; // Skip to the next iteration if new class is not found
        }


         student.class_id = element.class_id;
         await student.save();
        
         //Student is removed from the old class ($pull) and added to the new class($push)
         await Class.findOneAndUpdate(
            { _id: oldClass._id},
            {$pull : {students:student._id}}
         );

         await Class.findOneAndUpdate(
            { _id: newClass._id},
            {$push : {students:student._id}}
         );
    }

    return res.status(200).json({
        message:"Classes updated successfully",
        success:true,
       });
    }catch(error){
        console.log(error);
    }
}

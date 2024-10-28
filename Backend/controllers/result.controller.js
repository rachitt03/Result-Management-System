import { Student } from "../models/student.model.js";
import { Result } from "../models/result.model.js";
import { Class } from "../models/class.model.js";

//now first we will make it for resultPage
//that is resultpage render krna using studentt enrollment number information

export const resultPage = async(req,res) => {
    try{
        const {enrollment_no, subject, marks} = req.body;
        
        // Query by enrollment_no instead of _id
        const student = await Student.findOne({ enrollment_no }).populate("class_id");


       if(student == null){
        return res.status(400).json({
            message:"Oops! No data found",
            success:false
        });
      }
        
       // Create a new result document
        const newResult = await Result.create({
            student_id:student._id,
            class_id:class_id._id,
            subject,
            marks,
        });

        // Send a response back to the client
        res.status(201).json({
            message: "Result created successfully",
            result: newResult,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error creating result",
            success: false,
        });
    }
};


//Now for getResult of student

export const getResult = async(req,res) => {
    try{
        console.log(req.query);

        //Jisme hmne query pass kra vese hm params bhi use kr skte hai params direct data url form me dikhega and by using query data key value pairs me dikhega
        const { enrollment_no, sem, branch } = req.query;

        const class_id = await Class.findOne({
            semester:parseInt(sem),
            branch:branch.trim()
          }, "_id"
        );
        
        //if class_id ni mili then 
       if(!class_id){
        return res.status(400).json({
            message:"Class not found for the specified semester and branch",
            success:false
        });
       }
       
       console.log("Class ID:", class_id);
    // Find the student by enrollment number
    const student = await Student.findOne({_id:enrollment_no});
    

    // If no student is found
    if (!student) {
       
      return res.status(400).json({
        message: "Student not found",
        success: false,
      });
    }

       const result = await Result.findOne({
         student_id:student._id,
         class_id:class_id._id
       });
       
      

       if(result == null){
        return res.status(401).json({
            message:"No result found for the given enrolment number and class",
            success:false,
            result:null,
        });
       }
       
       return res.status(200).json({
        message:"Result retrieved successfully",
        success:true,
        result:{
        marks: result.result,
        studentSem: sem,
        studentBranch: branch,
        enrollment_no: student.enrollment_no,
        fullname: student.fullname, // Adjust based on your schema
     
       }
    });
    }catch(error){
        console.log(error);
    }
}
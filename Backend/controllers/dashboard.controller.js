import { Student } from "../models/student.model.js";
import { Result } from "../models/result.model.js";
import { Class } from "../models/class.model.js";
import mongoose from "mongoose";

//Middleware to check authentication using jwt
import isAuthenticated from "../middlewares/isAuthenticated.js";

export const dashboard = (req,res) => {
    return res.status(200).json({
        message:"Welcome to the dashboard!",
        success:true,
    });
}

export const classDashboard = (req,res) => {
    return res.status(200).json({
        message:"Class dashboard accessed!",
        success:true,
    });
};

export const studentDashboard = (req,res) => {
    return res.status(200).json({
        message:"Student dashboard accessed!",
        success:true,
    });
};

//Now for result dashboard

export const resultDashboard = async(req,res) => {
    try{
        const classIds = await Class.find({}, "_id");
        return res.status(200).json({
            message:"Result dashboard accessed!",
            classes: classIds,
            success:true,
        })
    }catch(error){
        console.log(error);
    }
}

//Now bari hai getClass , getStudents , getResults

//First of getClass- sari classes get krna
export const getClass = async(req,res) => {
    try{
        const classes = await Class.find();

        if(!classes){
            return res.status(400).json({
                message:"Classes not found",
                success:false,
            });
        }
        return res.status(200).json({
            classes: classes,
            success:true,
       })
    }catch(error){
        console.log(error);
    }
}

//Now of getStudents - sare students get krna
export const getStudents = async(req,res) => {
    try{
        const students = await Student.find();

        if(!students){
            return res.status(400).json({
                message:"Students not found",
                success:false,
            });
        }
        return res.status(200).json({
            students: students,
            success:true,
       })
    }catch(error){
        console.log(error);
    }
}

//Now of getResults
export const getResults = async(req,res) => {
    try{
        const results = await Result.find();

        if(!results){
            return res.status(400).json({
                message:"Students not found",
                success:false,
            });
        }
        return res.status(200).json({
            results: results,
            success:true,
       })
    }catch(error){
        console.log(error);
    }
}

//Done with getClass, getStudents , getResults
//Now turn of addClass , addStudents , addResult

//First of addClass - classess aagr add krni ho uske lie
export const addClass = async(req,res) => {
    const { cid, branch, semester, subjects } = req.body;
    const subArray = subjects.split(",");
    const createdClass = await Class.create({
         _id:cid,
         branch,
         semester,
         subjects:subArray,
         students:[],
    });
    try{
        await createdClass.save();
        return res.status(200).json({
            message:"Class created successfully",
            success:true,
        });
    }catch(error){
        console.log(error);
    }
}

//Now turn of addStudents- agar admin ko studnets add krna ho tabhho toh uska result add kr paega
export const addStudents = async(req,res) => {
    const { cid , fullname , enrollment_no } = req.body;
    const createdStudent = new Student({
        _id:enrollment_no,
        fullname:fullname,
        class_id:cid,
        result:[],
    });

    let classDoc;
    try{
        classDoc = await Class.findById(cid);
        //agar koi class id present hi nhi hui then
        if(!classDoc){
            return res.status(400).json({
                message:"Class not found",
                success:false,
            });
        }
        
        //agar vo students ka enrollment no pehle se hi hai toh
        if(classDoc.students.includes(enrollment_no)){
            return res.status(400).json({
               message: "Enrollment number already exists.", 
               success: false,
            }); 
        }

        const sess= await mongoose.startSession();
        await sess.startTransaction();
        await createdStudent.save({session:sess});
        classDoc.students.push(createdStudent);
        await classDoc.save({session:sess});
        await sess.commitTransaction();
        
        return res.status(200).json({
            message:"Student added successfully",
            success:true,
        });
    }catch(error){
        console.log(error);
    } 
};

export const subjectByClassId = async (req, res) => {
    try {
        const obj = await Class.findById(req.params.cid, "subjects");
        return res.status(200).json({ 
           subjects: obj.subjects, 
           success: true 
      });
    } catch (error) {
        return res.status(500).json({ 
            message: "Failed to fetch subjects.", 
            success: false 
        });
    }
}


    //Now turn of - addResult
    export const addResult = async(req,res) => {
        try{
            const classDoc = await Class.findById(req.body.class_id);
            const studentDoc = await Student.findById(req.body.enrollment_no);

            const duplicate = await Result.findOne({
                student_id:req.body.enrollment_no,
                class_id: req.body.class_id,
            });

            //Ab agar duplicate aagya enrollemnt no ya class id
            if(duplicate != null){
                return res.status(400).json({
                    message:"Result already exists.",
                    success:false,
                });
            }
            
            //agar galat enrollment numbe rdal rahe ho ya already exist ho
            if(!classDoc.students.includes(req.body.enrollment_no)){
                return res.status(400).json({
                    message:"Invalid enrollment Number",
                    success:false,
                });
            }

            let result = req.body.subjects.map(subject => ({
                name: subject.name,
                score: subject.score
            }));
           

            const createdResult = await Result.create({
                student_id: req.body.enrollment_no,
                class_id: req.body.class_id,
                result: result,
            });


            const sess = await mongoose.startSession();
            await sess.startTransaction();
            await createdResult.save({ session: sess });
            classDoc.result.push(createdResult);
            await classDoc.save({ session: sess });
            studentDoc.result.push(createdResult);
            await studentDoc.save({ session: sess });
            await sess.commitTransaction();

            return res.json({ 
            message: "Result added successfully.", 
            success: true 
        });
        }catch (error) {
            return res.status(500).json({ 
            message: "Creating result failed.", 
            success: false });
        }
    };
        
    //Now turn of deleteResult , deleteClass, deleteStudent
    //first of deleteClass
    export const deleteClass = async (req, res) => {
        const id = req.params.cid;
        try {
            await Class.deleteOne({ _id: id });
            return res.json({ 
            message: "Class deleted successfully.", 
            success: true 
            });
        } catch (error) {
            return res.status(500).json({ 
            message: "Delete class failed.", 
            success: false 
            });
        }
    };


    //Now turn of deleteResult
    export const deleteResult = async (req, res) => {
        const id = new mongoose.Types.ObjectId(req.params.rid);
        try {
            const result = await Result.findById(id).populate("student_id").populate("class_id");
            //if result present hi nahi hai
            if (!result) {
                return res.status(400).json({
                    message: "Result not found.", 
                    success: false 
                });
            }
            
            const sess = await mongoose.startSession();
             sess.startTransaction();
            // Delete the result within the transaction
            await Result.deleteOne({ _id: id }, { session: sess });
              
             // Safely check if student_id exists before modifying it
        if (result.student_id) {
            result.student_id.result.pull(result._id);
            await result.student_id.save({ session: sess });
        }
           // Safely check if class_id exists before modifying it
        if (result.class_id) {
            result.class_id.result.pull(result._id);
            await result.class_id.save({ session: sess });
        }

           // Commit the transaction
        await sess.commitTransaction();
        
            return res.status(200).json({ 
            message: "Result deleted successfully.", 
            success: true 
            });
        } catch (error) {
            console.log(error);
        }
    };

//Now last for deleteStudents
export const deleteStudents = async (req, res) => {
    const id = req.params.sid;
    try {
        const student = await Student.findById(id).populate("class_id");
        if (!student) {
            res.status(400).json({ message: "Student not found.", success: false });
            return;
        }

        await Result.deleteMany({ student_id: id });

        const sess = await mongoose.startSession();
        await sess.startTransaction();
        // Delete the student within the transaction
        await Student.deleteOne({ _id: id }, { session: sess });

        student.class_id.students.pull(student);
        await student.class_id.save({ session: sess });
        await sess.commitTransaction();

        return res.status(200).json({ 
            message: "Student deleted successfully.", 
            success: true 
        });
    } catch (error) {
       console.log(error);
    }
};

//Done with every functionality
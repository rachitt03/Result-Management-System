import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import adminRoute from "./routes/admin.route.js";
import resultRoute from "./routes/result.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import excelUploadRoute from "./routes/excelUpload.route.js";

dotenv.config({});//Load .env file

const app = express();

//Basic get request or api ese api le skte hai
/*app.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"I am coming from backend",
        success:true
    })
});*/

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

//api's call- ab sari api aaegi yaha par
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/result", resultRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/excelupload", excelUploadRoute);


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})
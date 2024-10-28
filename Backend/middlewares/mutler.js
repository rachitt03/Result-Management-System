import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';


// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//storage configuration
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//multer instance banane ka process
var uploads = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "text/csv"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("please upload excel files"));
    }
  },
});

export default uploads.single("file");  // This ensures uploads is a middleware function;

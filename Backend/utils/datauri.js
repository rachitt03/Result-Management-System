import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (filePath, buffer) => {
    const parser = new DataUriParser();
    const extName = path.extname(filePath); // Use filePath to get the extension
    return parser.format(extName, buffer);
}

export default getDataUri;

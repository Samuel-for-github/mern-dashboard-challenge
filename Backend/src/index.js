import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import {app} from "./app.js";

connectDB().then(()=>{
    app.on("error", (error)=>{
        console.log("Error while starting app: ", error);
        throw error;
    })
    app.listen(process.env.PORT||3000,()=>{
        console.log("Server started on port: " + process.env.PORT || 3000);
    })
}).catch((error)=>{
    console.log("MongoDB connection Failed:", error);
})







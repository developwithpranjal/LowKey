import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

async function ConnectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DataBase Connected Succesfully");
  } catch (error) {
    console.log("Cannot Connect To DataBase : ", error);
  }
}

export default ConnectToDB
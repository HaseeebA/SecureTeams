import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
      console.log("Connected to Database");
    });
  })
  .catch((error) => {
    console.log(error);
  });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: String,
  teams: [String],
});

const User = mongoose.model("User", userSchema);


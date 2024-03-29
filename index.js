const express = require("express");
const app = express();
const cors=require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoutes = require("./routes/comment");
const multer = require("multer");
const path = require("path");
dotenv.config();

app.use(cors({
  origin: 'https://blogapppro.netlify.app',
}));
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(()=>console.log('Connected to db'))
  .catch((err)=> console.log("DB connection error",err));
  

 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use('/api/comments', commentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen("5000", () => {
  console.log("Backend is running.");
});
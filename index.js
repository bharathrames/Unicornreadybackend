// const express = require("express");
// const app = express();
// const cors=require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const authRoute = require("./routes/auth");
// const userRoute = require("./routes/users");
// const postRoute = require("./routes/posts");
// const commentRoutes = require("./routes/comment");
// const multer = require("multer");
// const path = require("path");
// dotenv.config();

// app.use(cors({
//   origin: 'https://blogapppro.netlify.app',
// }));
// app.use(express.json());
// app.use(cors());
// app.use("/images", express.static(path.join(__dirname, "/images")));


// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
    
//   })
//   .then(()=>console.log('Connected to db'))
//   .catch((err)=> console.log("DB connection error",err));
  

//  const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   res.status(200).json("File has been uploaded");
// });

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
// app.use('/api/comments', commentRoutes);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// app.listen("5000", () => {
//   console.log("Backend is running.");
// });



const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoutes = require("./routes/comment");
const multer = require("multer");
const cloudinary = require("cloudinary").v2; // Require cloudinary
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
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log("DB connection error", err));

  cloudinary.config({
    cloud_name: "dj5ftdvbx",
    api_key: "764463187271936",
    api_secret: "TCU4lTxJTSWtqvio0tLkEs-SVnE",
  });

const storage = multer.memoryStorage(); // Store the file in memory

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.buffer, {
      folder: "blog_images", // Optional: Specify a folder in your cloud storage
    });

    // Store the generated URL or unique ID in your database for later retrieval
    const imageUrl = result.secure_url; // The URL to access the image

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload file" });
  }
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

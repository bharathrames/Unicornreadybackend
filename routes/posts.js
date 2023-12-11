const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});


router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      
      return res.status(404).json("Post not found");
    }

    if (post.username === req.body.username) {
      res.status(200).json("Post has been deleted");
    } else {
      res.status(401).json("You can delete only your post");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});



router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const { title } = req.query;

  try {
    let posts;

    if (title) {
    
      posts = await Post.find({ title: { $regex: title, $options: "i" } });
    } else {
      posts = await Post.find();
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});


module.exports = router;
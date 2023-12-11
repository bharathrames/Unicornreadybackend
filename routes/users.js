const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");


router.put("/:id", async (req, res) => {
  const { userId, password, ...updateData } = req.body;

  if (userId === req.params.id) {
    try {
      if (password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "You can update only your account!" });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

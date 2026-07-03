const Story = require("../models/Story");

const createStory = async (req, res) => {
  try {

    const story = await Story.create({
      image: req.body.image,
      user: req.user.id
    });

    res.status(201).json(story);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const getStories = async (req, res) => {

  try {

    const stories = await Story.find()
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(stories);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  createStory,
  getStories
};
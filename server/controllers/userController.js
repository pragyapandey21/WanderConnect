const User = require("../models/User");
const Notification = require("../models/Notification");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const followUser = async (req, res) => {
    try {

        if(req.user.id === req.params.id){
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if(!userToFollow){
            return res.status(404).json({
                message: "User not found"
            });
        }

        if(userToFollow.followers.includes(req.user.id)){
            return res.status(400).json({
                message: "Already following"
            });
        }

        userToFollow.followers.push(req.user.id);
        currentUser.following.push(req.params.id);

        await userToFollow.save();
        await currentUser.save();

        await Notification.create({
    recipient: userToFollow._id,
    sender: req.user.id,
    type: "follow"
});

        res.status(200).json({
            message: "User followed successfully"
        });

    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);

    if (!userToUnfollow) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Remove from following array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id }
    });

    // Remove from followers array
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id }
    });

    res.json({
      message: "User unfollowed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.search;

    const users = await User.find({
      username: { $regex: keyword, $options: "i" }
    }).select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const editProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;
    user.openToChat =
      req.body.openToChat !== undefined
        ? req.body.openToChat
        : user.openToChat;

    const updatedUser = await user.save();

    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded"
      });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "wanderconnect_profiles" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    const user = await User.findById(req.user.id);

    user.profilePic = result.secure_url;

    await user.save();

    res.json({
      message: "Profile picture uploaded successfully",
      profilePic: result.secure_url
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get travelers by destination
const getTravelers = async (req, res) => {
  try {
    console.log("Inside getTravelers");

    const users = await User.find();

    console.log("Users fetched:", users);

    res.status(200).json(users);

  } catch (error) {
    console.log("ERROR INSIDE GETTRAVELERS:", error);

    res.status(500).json({
      message: "Failed to fetch travelers",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username profilePic openToChat"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  followUser,
  unfollowUser,
  searchUsers,
  editProfile,
  uploadProfilePic,
  getTravelers,
  getUserById,
  getMyProfile,
};
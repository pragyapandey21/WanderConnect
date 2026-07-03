const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      recipient: req.user.id
    })
      .populate("sender", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const markAsRead = async (req, res) => {
  try {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    notification.read = true;

    await notification.save();

    res.json({
      message: "Notification marked as read"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  getNotifications,
  markAsRead
};
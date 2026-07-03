const Group = require("../models/Group");

// Create Group
const createGroup = async (req, res) => {
  try {
    const {
      groupName,
      destination,
      description,
      startDate,
      endDate,
      maxMembers,
    } = req.body;

    const group = await Group.create({
      groupName,
      destination,
      description,
      startDate,
      endDate,
      maxMembers,
      createdBy: req.user.id,
members: [req.user.id],
      
    });

    res.status(201).json(group);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Groups by Destination
const getGroupsByDestination = async (req, res) => {
  try {

    const groups = await Group.find({
      destination: req.params.destination,
    })
      .populate("createdBy", "username profilePic")
      .populate("members", "username profilePic");

    res.json(groups);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Join Group
const joinGroup = async (req, res) => {
  try {

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    // Already joined?
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({
        message: "You are already a member",
      });
    }

    // Group full?
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({
        message: "Group is full",
      });
    }

    group.members.push(req.user.id);

    await group.save();

    res.json({
      message: "Joined group successfully",
      group,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Leave Group
const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    // Creator cannot leave
    if (group.createdBy.toString() === req.user.id) {
      return res.status(400).json({
        message: "Group creator cannot leave. Delete the group instead.",
      });
    }

    // User not a member
    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({
        message: "You are not a member of this group.",
      });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== req.user.id
    );

    await group.save();

    res.json({
      message: "Left group successfully",
      group,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Delete Group
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    // Only creator can delete
    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the group creator can delete this group.",
      });
    }

    await group.deleteOne();

    res.json({
      message: "Group deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "username profilePic")
      .populate("members", "username profilePic");

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createGroup,
  getGroupsByDestination,
  getGroupById,
  joinGroup,
  leaveGroup,
  deleteGroup,
};
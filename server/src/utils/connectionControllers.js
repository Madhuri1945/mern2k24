const { ConnectionRequest } = require("../models/connection");
const { Freelancer } = require("../models/freelancer");
const { Producer } = require("../models/producer");
const mongoose = require("mongoose");

const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId, receiverType } = req.body;
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        {
          senderId: req.user.userId,
          receiverId,
          status: { $in: ["pending", "accepted"] },
        },
        {
          senderId: receiverId,
          receiverId: req.user.userId,
          status: { $in: ["pending", "accepted"] },
        },
      ],
    });
    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res
          .status(400)
          .json({ message: "Connection request already pending" });
      } else if (existingRequest.status === "accepted") {
        return res.status(400).json({ message: "Users are already connected" });
      }
    }

    const connectionRequest = new ConnectionRequest({
      senderId: req.user.userId,
      senderType:
        req.user.role.charAt(0).toUpperCase() +
        req.user.role.slice(1).toLowerCase(),
      receiverId,
      receiverType:
        receiverType.charAt(0).toUpperCase() +
        receiverType.slice(1).toLowerCase(),
      status: "pending",
    });
    await connectionRequest.save();

    const senderModel = req.user.role === "FREELANCER" ? Freelancer : Producer;
    const receiverModel = receiverType === "Freelancer" ? Freelancer : Producer;

    // console.log(senderModel);
    // console.log(receiverModel);

    const sender = await senderModel.findById(req.user.userId);
    const receiver = await receiverModel.findById(receiverId);

    // console.log(sender);

    sender.connectionRequestsSent.push(connectionRequest._id);
    await sender.save();
    receiver.connectionRequestsReceived.push(connectionRequest._id);
    await receiver.save();

    res
      .status(201)
      .json({
        message: "Connection Request Sent Successfully",
        status: connectionRequest.status,
      });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const acceptConnectionRequest = async (req, res) => {
  try {
    const connectionRequestId = req.params.connectionRequestId;
    const connectionRequest = await ConnectionRequest.findById(
      connectionRequestId
    );
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    // console.log(connectionRequest.receiverId);
    // console.log(req.user.userId);
    if (
      connectionRequest.receiverId.toString() !== req.user.userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to accept this request" });
    }
    if (connectionRequest.status !== "pending") {
      return res
        .status(400)
        .json({
          message:
            "Connection request cannot be accepted because it is not pending",
        });
    }

    connectionRequest.status = "accepted";
    await connectionRequest.save();

    const senderModel =
      connectionRequest.senderType === "Freelancer" ? Freelancer : Producer;
    const receiverModel =
      connectionRequest.receiverType === "Freelancer" ? Freelancer : Producer;

    const sender = await senderModel.findById(connectionRequest.senderId);
    const receiver = await receiverModel.findById(connectionRequest.receiverId);

    sender.connectionRequestsSent.pull(connectionRequestId);
    receiver.connectionRequestsReceived.pull(connectionRequestId);

    if (connectionRequest.senderType === "Freelancer") {
      receiver.freelancerConnections.push(connectionRequest.senderId);
    } else if (connectionRequest.senderType === "Producer") {
      receiver.producerConnections.push(connectionRequest.senderId);
    }

    if (connectionRequest.receiverType === "Freelancer") {
      sender.freelancerConnections.push(connectionRequest.receiverId);
    } else if (connectionRequest.receiverType === "Producer") {
      sender.producerConnections.push(connectionRequest.receiverId);
    }

    await receiver.save();
    await sender.save();

    res
      .status(200)
      .json({ message: "Connection request accepted successfully" });
  } catch (error) {
    console.error("Error accepting connection request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const rejectConnectionRequest = async (req, res) => {
  try {
    const connectionRequestId = req.params.connectionRequestId;
    const connectionRequest = await ConnectionRequest.findById(
      connectionRequestId
    );

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    if (
      connectionRequest.receiverId.toString() !== req.user.userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to reject this request" });
    }
    if (connectionRequest.status !== "pending") {
      return res
        .status(400)
        .json({
          message:
            "Connection request cannot be rejected because it is not pending",
        });
    }
    connectionRequest.status = "rejected";
    await connectionRequest.save();

    const senderModel =
      connectionRequest.senderType === "Freelancer" ? Freelancer : Producer;
    const receiverModel =
      connectionRequest.receiverType === "Freelancer" ? Freelancer : Producer;

    const sender = await senderModel.findById(connectionRequest.senderId);
    const receiver = await receiverModel.findById(connectionRequest.receiverId);

    sender.connectionRequestsSent.pull(connectionRequestId);
    receiver.connectionRequestsReceived.pull(connectionRequestId);

    await receiver.save();
    await sender.save();

    res
      .status(200)
      .json({ message: "Connection request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting connection request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const allSentConnectionRequests = async (req, res) => {
  // All Sent connection requests pending against other users
  try {
    const role = req.user.role;
    const userModel = role === "FREELANCER" ? Freelancer : Producer;

    const user = await userModel.findById(req.user.userId);
    const connectionRequestsSent = user.connectionRequestsSent;

    res.status(200).json(connectionRequestsSent);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const allReceivedConnectionRequests = async (req, res) => {
  // All Received connection requests pending against the user
  try {
    const role = req.user.role;
    const userModel = role === "FREELANCER" ? Freelancer : Producer;

    const user = await userModel
      .findById(req.user.userId)
      .populate("connectionRequestsReceived");
    const connectionRequestsReceived = await Promise.all(
      user.connectionRequestsReceived.map(async (connectionRequest) => {
        const senderModel = mongoose.model(connectionRequest.senderType);
        const receiverModel = mongoose.model(connectionRequest.receiverType);

        const [sender, receiver] = await Promise.all([
          senderModel.findById(connectionRequest.senderId),
          receiverModel.findById(connectionRequest.receiverId),
        ]);

        return {
          ...connectionRequest.toObject(),
          senderId: sender,
          receiverId: receiver,
        };
      })
    );
    console.log(connectionRequestsReceived);
    res.status(200).json(connectionRequestsReceived);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkConnected = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const profileOwnerRole = req.params.role.toUpperCase();
    const profileOwnerUsername = req.params.username;

    const profileOwnerModel =
      profileOwnerRole === "FREELANCER" ? Freelancer : Producer;
    const profileOwner = await profileOwnerModel.findOne({
      username: profileOwnerUsername,
    });

    if (!profileOwner) {
      return res.status(404).json({ message: "Profile owner not found" });
    }

    const isConnected =
      profileOwner.freelancerConnections.includes(loggedInUserId) ||
      profileOwner.producerConnections.includes(loggedInUserId);

    const pendingRequest = await ConnectionRequest.findOne({
      senderId: loggedInUserId,
      receiverId: profileOwner._id,
      status: "pending",
    });

    let status = "";

    if (isConnected) {
      status = "connected";
    } else if (pendingRequest) {
      status = "pending";
    } else {
      status = "not_connected";
    }
    res.status(200).json({ status });
  } catch (error) {
    console.error("Error checking connection status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  checkConnected,
};

const removeConnection = async (req, res) => {};

module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  allSentConnectionRequests,
  allReceivedConnectionRequests,
  checkConnected,
  removeConnection,
};

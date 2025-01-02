const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getLastMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // Fetch the latest message between the users
    const message = await Messages.findOne({
      users: {
        $all: [from, to],
      },
    })
    .sort({ updatedAt: -1 })  // Sort messages in descending order (latest first)
    .limit(1);  // Limit to only one message

    if (message) {
      const projectedMessage = {
        fromSelf: message.sender.toString() === from,
        message: message.message.text,
      };
      return res.json(projectedMessage);
    } else {
      return res.json({ msg: "No messages found." });
    }
  } catch (ex) {
    next(ex);
  }
};


module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

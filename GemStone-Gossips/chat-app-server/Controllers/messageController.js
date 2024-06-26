const expressAsyncHandler = require("express-async-handler");
const Message = require("../Schema/message");
const User = require("../Schema/user");
const Chat = require("../Schema/chat");

const allMessages = expressAsyncHandler(async (req, res) => {
  // fetches all the messages of a chat
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name email").populate("reciever").populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    var message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await message.populate("reciever");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
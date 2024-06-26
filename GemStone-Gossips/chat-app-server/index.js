// dotenv -> for hiding PORT Address(uses environment variables)
const express=require("express");
const dotenv=require("dotenv");
const cors = require('cors')
const {default:mongoose} = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

const app=express();
app.use(
    cors({
      origin: "*",
    })
);
dotenv.config();
app.use(express.json());
app.use(cors())
const connectDb = async()=>{
    try {
        const connect= await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Server connected");    
    } catch (err) {
        console.log("Server is not connected to database",err.message);
    }
}
connectDb();

app.get("/",(req,res)=>{
    res.send("API is Running");
});
app.use("/message", messageRoutes);
app.use("/chat", chatRoutes);
app.use("/user",userRoutes);

const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,console.log("Server is Running"));

const io=require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
    pingTimeout:60000
});
 
io.on("connection",(socket)=>{
    socket.on("setup",(user)=>{
        socket.join(user.data._id);
        socket.emit("connected");
    })
    
    socket.on("join-chat",(room)=>{
        socket.join(room);
    })
    
    socket.on("new-message",(newMessageStatus)=>{
        var chat=newMessageStatus.chat;
        if (!chat.users) {
            return console.log("chat user not defined");
        }
        chat.users.forEach((user)=>{
            if(user._id==newMessageStatus.sender._id) return;
            socket.in(user._id).emit("message recieved",newMessageRecieved);
        });
    });
    socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});
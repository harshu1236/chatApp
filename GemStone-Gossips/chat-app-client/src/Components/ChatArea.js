import React,{useContext, useEffect, useState} from 'react'
import { IconButton } from '@mui/material'
// import DeleteIcon from '@mui/icons-material/DeleteForever';
import SendIcon from '@mui/icons-material/Send';
import MessageOthers from "./MessageOthers"
import MessageSelf from "./MessageSelf"
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client"

const endpoint="http://localhost:8080";
var socket;

function ChatArea() {
  const [messageContent, setMessageContent] = useState("");
  const dyParams = useParams();
  const [socketConnectionStatus,setSocketConnectionStatus]=useState(false);
  const [chat_id, chat_user] = dyParams._id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
  const sendMessage = () => {
    var data=null;
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
    .post(
      "http://localhost:8080/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
        )
        .then(({ response }) => {
          data=response;
          console.log("Message Fired");
        });
        socket.emit("newMessage",data);
    };

    useEffect(()=>{
      socket=io(endpoint);
      socket.emit("setup",userData);
      socket.on("connection",()=>{
        setSocketConnectionStatus(!socketConnectionStatus);
      })
      // eslint-disable-next-line
    },[]);

    useEffect(()=>{
      socket.on("message received",(newMessage)=>{
         if(!allMessagesCopy || allMessagesCopy._id!==newMessage._id){}
         else{
          setAllMessages([...allMessages],newMessage);
         }
      })
    })
    useEffect(() => {
        console.log("Users refreshed");
        const config = {
          headers: {
            Authorization: `Bearer ${userData.data.token}`,
          },
        };
        axios
          .get("http://localhost:8080/message/" + chat_id, config)
          .then(({ data }) => {
            setAllMessages(data);
            setloaded(true);
            socket.emit("join-chat",chat_id);
          });
          setAllMessagesCopy(allMessages);
          // eslint-disable-next-line
      }, [refresh, chat_id,userData.data.token,allMessages]);

      if (!loaded) {
        return (
          <div
            style={{
              border: "20px",
              padding: "10px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{ width: "100%", borderRadius: "10px" }}
              height={60}
            />
            <Skeleton
              variant="rectangular"
              sx={{
                width: "100%",
                borderRadius: "10px",
                flexGrow: "1",
              }}
            />
            <Skeleton
              variant="rectangular"
              sx={{ width: "100%", borderRadius: "10px" }}
              height={60}
        /> 
      </div>
    );
  } else {
    return (
      <div className={"chatArea-container"}>
        <div className={"chatArea-header"}>
          <p className={"con-icon"}>
            {chat_user[0]}
          </p>
          <div className={"header-text"}>
            <p className={"con-title"}>
              {chat_user}
            </p>
          </div>
          </div>
        <div className={"messages-container"}>
          {allMessages
            .slice(0)
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
                return <MessageSelf props={message} key={index} />;
              } else {
                return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div className={"text-input-area"}>
          <input
            placeholder="Type a Message"
            className={"search-box"}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            className={"icon"}
            onClick={() => {
              sendMessage();
              setRefresh(!refresh);
            }}
          >
            <SendIcon />
          </IconButton>
          </div>
    </div>
  );
}
}

export default ChatArea;

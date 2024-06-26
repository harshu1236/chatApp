import React, { useContext, useEffect, useState } from 'react'
import './style.css'
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VideoCallIcon from '@mui/icons-material/VideoCall';
// import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
// import NightlightIcon from '@mui/icons-material/Nightlight';
// import SearchIcon from '@mui/icons-material/Search';
// import ConversationsItem from './ConversationsItem';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { myContext } from "./MainContainer"; 

function Sidebar() {
  const navigate=useNavigate();
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios.get("http://localhost:8080/chat/", config).then((response) => {
      setConversations(response.data);
    });
  });

  return (
    <div className='sidebar-container'>
        <div className='sb-header'>
            <div>
                <IconButton onClick={() => {nav("/app/welcome");}}>
                    <AccountCircleIcon />
                </IconButton>
            </div>
            <div className='other-icons'>
                <IconButton onClick={()=>{navigate("users")}}>
                    <PersonAddIcon />
                </IconButton>
                <IconButton onClick={()=>{navigate("groups")}}>
                    <GroupAddIcon />
                </IconButton>
                <IconButton onClick={()=>{navigate("create-groups")}}>
                    <AddCircleIcon />
                </IconButton>
                <IconButton>
                    {/* <NightlightIcon /> */}
                    {/* {lightTheme && <NightlightIcon />}
                    {!lightTheme && <LightModeRoundedIcon />} */}
                    <VideoCallIcon onClick={()=>{navigate("video-call")}}/>
                </IconButton>
            </div>
        </div>
        {/* <div className='sb-search'>
            <IconButton>
                <SearchIcon />
            </IconButton>
            <input placeholder='Search' className='search-box'/>
        </div> */}
        <div className='sb-conversations'>
            {/* fetching data from the conversations array */}
        {conversations.map((conversation,index)=>{
          var chatName="";
          if(conversation.isGroupChat){
            chatName=conversation.chatName;
          } else{
            // eslint-disable-next-line
            conversation.users.map((user)=>{
              if(user._id!==userData.data._id){
                chatName=user.name;
              }
            });
          }
          if(conversation.latestMessage===undefined){
            return(
              <div key={index} onClick={()=>{
                setRefresh(!refresh);
              }}>
              <div key={index} className='conversation-container' onClick={()=>{
                navigate("chat/"+conversation._id+"&"+chatName);
              }}>
              <p className='con-icon'>{chatName[0]}</p>
              <p className='con-title'>{chatName}</p>
              <p className='con-lastMessage'>No previous Messages, click here to start a new chat</p>
              </div>
              </div>
            );
          }
          else{
            return(
              <div key={index} className='conversation-container' onClick={()=>{
                navigate("chat/"+conversation._id+"&"+chatName);
              }}>
                <p className='con-icon'>{chatName[0]}</p>
                <p className='con-title'>{chatName}</p>
                <p className='con-lastMessage'>{conversation.latestMessage.content}</p>
              </div>
            );
          }
        })}
        </div>
    </div>
  )
}
export default Sidebar;
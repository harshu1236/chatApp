import React, { useContext, useEffect, useState } from 'react'
import "./style.css"
import { IconButton } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
import logo from "../icons/chat.png"
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";

function Groups() {
   const { refresh, setRefresh } = useContext(myContext);
   const [groups, SetGroups] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  const user = userData.data;
  useEffect(() => {
    console.log("Users refreshed : ", user.token);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get("http://localhost:8080/chat/fetchGroups", config)
      .then((response) => {
        console.log("Group Data from API ", response.data);
        SetGroups(response.data);
      });
      // eslint-disable-next-line
  }, [refresh]);
  return (
    <div className='list-container'>
        <div className='ug-header'>
            <img src={logo} alt="logo" style={{height:"2rem",width:"2rem",marginLeft:"10px"}}/>
            <p className='ug-title'>Available Groups</p>
            <IconButton
            className={"icon"}
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </div>
        {/* <div className='sb-search'>
            <IconButton>
                <SearchIcon />
            </IconButton>
            <input placeholder='Search' className='search-box'/>
        </div> */}
        <div className='ug-list' id='grp-list'>
        {groups.map((group, index) => {
            return (
              <div className={"list-item"} key={index} 
                onClick={()=>{
                const config={
                  headers:{
                    Authorization:`Bearer ${userData.data.token}`,
                  },
                };
                axios.put("http://localhost:8080/chat/addSelfToGroup",{
                  chatId:group._id,
                  userId:userData.data._id,
                },config);
              }}
              >
                <p className={"con-icon"}>T</p>
                <p className={"con-title"}>{group.chatName}</p>
              </div>
            );})}
        </div>
    </div>
  )
}

export default Groups
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import "./style.css"
import { IconButton } from '@mui/material';
import axios from "axios";
import logo from "../icons/chat.png";
import {myContext} from "./MainContainer";
import RefreshIcon from "@mui/icons-material/Refresh";

function User_Groups() {
  const { refresh, setRefresh } = useContext(myContext);
  const [users, setUsers] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const nav = useNavigate();

  if (!userData) {
    console.log("User not Authenticated");
    nav(-1);
  }

  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios.get("http://localhost:8080/user/fetchUsers", config).then((data) => {
      setUsers(data.data);
    });
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <div className='list-container'>
        <div className='ug-header'>
            <img src={logo} alt="logo" style={{height:"2rem",width:"2rem",marginLeft:"10px"}}/>
            <p className='ug-title'>Online Users</p>
            <IconButton className='icon' onClick={()=>{
              setRefresh(!refresh);
            }}>
              <RefreshIcon />
            </IconButton>
        </div>
        {/* <div className='sb-search'>
            <IconButton>
                <SearchIcon />
            </IconButton>
            <input placeholder='Search' className='search-box'/>
        </div> */}
        <div className='ug-list'>
            {users.map((user,index)=>{
              return(
                <div className='list-item' key={index} onClick={()=>{
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.data.token}`,
                    },
                  };
                  axios.post(
                    "http://localhost:8080/chat/",
                    {
                      userId: user._id,
                    },
                    config
                  );
                }}>
                  <p className="con-icon">T</p>
                  <p className='con-title'>{user.name}</p>
                </div>
              )
            })}
        </div>
    </div>
  )
}

export default User_Groups
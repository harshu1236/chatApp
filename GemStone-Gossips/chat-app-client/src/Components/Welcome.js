import React from 'react'
import logo from "../icons/chat.png"
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const userData=JSON.parse(localStorage.getItem("userData"));
  const nav=useNavigate();
  if(!userData){
    console.log("User not authenticated");
    nav("/");
  }
  return (
    <div className='welcome-container'>
        <img src={logo} alt='Logo' className='welcome-logo'/>
        <b>Hi {userData.data.name}</b>
        <p>View and Text directly to people present in chat room</p>
    </div>
  );
}

export default Welcome
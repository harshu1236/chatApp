// Main File
import React from "react";
import './App.css';
import MainContainer from "./Components/MainContainer"; 
import Login from "./Components/Login";
import {Routes,Route} from "react-router-dom"
import ChatArea from './Components/ChatArea'
import Welcome from './Components/Welcome'
import CreateGroups from './Components/CreateGroups'
import UserGroups from './Components/User'
import Groups from "./Components/groups";
import VideoCall from './Components/VideoCall';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="app" element={<MainContainer/>}>
            <Route path="welcome" element={<Welcome/>}></Route>
            <Route path="chat/:_id" element={<ChatArea/>}></Route>
            <Route path="users" element={<UserGroups/>}></Route>
            <Route path="groups" element={<Groups/>}></Route>
            <Route path="create-groups" element={<CreateGroups/>}></Route>
            <Route path="video-call" element={<VideoCall/>}></Route>
          </Route>
      </Routes>
    </div>
  );
}

export default App;

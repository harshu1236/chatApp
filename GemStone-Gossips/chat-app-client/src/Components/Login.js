import React, { useState } from 'react'
import logo from "../icons/chat.png"
import { Button,TextField,Backdrop,CircularProgress} from '@mui/material'
import {useNavigate} from "react-router-dom";
import axios from "axios"
import Toaster from './Toaster';

function Login() {
  const [showlogin,setShowLogin]=useState(false);
  const [data,setData]=useState({name:"",email:"",password:""});
  const [loading,setLoading]=useState(false);

  const [logInStatus,setLogInStatus]=React.useState("");
  const [signInStatus,setSignInStatus]=React.useState("");

  const navigate=useNavigate();

  const changeHandler = (e)=>{
    setData({...data,[e.target.name]:e.target.value});
  };

  const loginHandler = async(e)=>{
    setLoading(true);
    try{
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };

      const response=await axios.post(
        "http://localhost:8080/user/login",
        data,
        config
      )
      setLogInStatus({msg:"Success",key:Math.random()});
      setLoading(false);
      localStorage.setItem("userData",JSON.stringify(response));
      navigate("/app/welcome");
    } catch(error){
      setLogInStatus({
        msg:"Invalid Username or Password",
        key: Math.random(),
      })
    }
    setLoading(false);
  }

  const signUpHandler = async ()=>{
    setLoading(true);
    try{
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };

      const response=await axios.post(
        "http://localhost:8080/user/register",
        data,
        config
      );
      setSignInStatus({msg:"Success",key:Math.random()});
      navigate("/app/welcome");
      localStorage.setItem("userData",JSON.stringify(response));
      setLoading(false);
    } catch(error){
      if(error.response.status===405){
        setLogInStatus({
          msg:"User with this email already exists",
          key: Math.random(),
        });
      }
      if(error.response.status===406){
        setLogInStatus({
          msg:"Username already taken, please try another one",
          key: Math.random(),
        });
      }
      setLoading(false);
    }
  }

  return (
    <>
      <Backdrop
        sx={{color:"afff" ,zIndex:(theme)=>theme.zIndex.drawer=1}}
        open={loading}
      >
        <CircularProgress color='secondary'/>
      </Backdrop>
      <div className='login-container'>
          <div className='image-container'>
              <img src={logo} alt='Logo' className='welcome-logo'/>
          </div>
          {showlogin && (
            <div className='login-box'>
                <h1 className='login-heading'>Gemstone Gossips</h1>
                <p className='login-text'>Login to your Account</p>
                <TextField onChange={changeHandler} id="standard-basic" label="Enter Your Username" variant="outlined" color='secondary' name='name'/>
                <TextField onChange={changeHandler} id='outlined-password-input' label="Password" type='password' color='secondary' name='password'/>
                <Button variant='outlined' color='secondary' onClick={loginHandler} isLoading>Login</Button>
                <p>Don't have an Account ? <span onClick={()=>{setShowLogin(false);}}>Sign Up</span></p>
                {logInStatus ? (
                  <Toaster key={logInStatus.key} message={logInStatus.msg} />
                ):null}
            </div>
          )}
          {!showlogin && (
            <div className='login-box'>
                <h1 className='login-heading'>Gemstone Gossips</h1>
                <p className='login-text'>Create your Account</p>
                <TextField onChange={changeHandler} id="standard-basic" label="Enter Your Username" variant="outlined" color='secondary' name='name'/>
                <TextField onChange={changeHandler} id="standard-basic" label="Enter Your Email" variant="outlined" color='secondary' name='email'/>
                <TextField onChange={changeHandler} id='outlined-password-input' label="Password" type='password' color='secondary' name='password'/>
                <Button variant='outlined' color='secondary' onClick={signUpHandler}>SignUp</Button>
                <p>Already have an Account ? <span onClick={()=>{setShowLogin(true);}}>Login</span></p>
                {signInStatus ? (
                  <Toaster key={signInStatus.key} message={logInStatus.msg} />
                ):null}
            </div>
          )}
      </div>
    </>
  )
}

export default Login;
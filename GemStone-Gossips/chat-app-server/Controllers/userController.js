const express= require("express");
const UserModel= require("../Schema/user")
const generateToken=require("../Config/generateToken");
const expressAsyncHandler = require("express-async-handler");

const loginController=expressAsyncHandler(async(req,res)=>{
    const {name,password}=req.body;
    const user=await UserModel.findOne({name});

    if (user && (await user.matchPassword(password))) {
        const response={
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id)
        };
        res.json(response);
    }
    else{
        res.status(401);
        throw new Error("Invalid Username or Password");
    }
});

const registerController =expressAsyncHandler (async (req,res)=>{
    const {name,email,password} = req.body;

    // check for all fields
    if(!name || !email || !password){
        res.send(400);
        throw Error("All necessary input fields have not been filed");
    }

    // if a user already exists
    const userExists = await UserModel.findOne({email});
    if(userExists){
        throw new Error("User already Exists");
    }

    // userName already Taken
    const userNameExists = await UserModel.findOne({email});
    if(userNameExists){
        throw new Error("Name already taken");
    }

    // Adding the user to database
    const user=await UserModel.create({name,email,password});
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400);
        throw new Error("Registration Error");
    }
});

const fetchAllUsersController=expressAsyncHandler(async (req,res)=>{
    const keyword=req.query.search?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}},
        ]
    }:{};
    const users=await UserModel.find(keyword).find({
        _id:{$ne:req.user._id},
    });
    res.send(users);
});

module.exports={loginController,registerController,fetchAllUsersController};
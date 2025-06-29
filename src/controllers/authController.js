const User = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');



const register = async(req,res) => {
  const { username,email,password,role } = req.body;
  const hashedPassword = await bcrypt.hash(password,12);
  try{
    const newUser = new User({username,email,password:hashedPassword,role});
    await newUser.save();
    res.status(201).json({message:`user registed with user name ${username}`});
  }catch(err){
    res.status(500).json({message:err.message});
  }
}

const login = async(req,res) => {

}

module.exports = {register,login};
const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User Already Exists"
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        });
        res.status(201).json({
            message:"User registered successfully",
            userId: user._id
        });

    }catch(error){
        console.error("REGISTER ERROR:",error);
        res.status(500).json({
            message:"Server error"
        });
    }
};
const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Email and password are required"
            });
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const token=jwt.sign(
            {
                userId:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        );
        res.json({
            message:"login successful",
            token
        });
    }catch(error){
        console.error("LOGIN ERROR:",error);
        res.status(500).json({
            message:"Server error"
        });
    }
};
module.exports={
    register,
    login
};
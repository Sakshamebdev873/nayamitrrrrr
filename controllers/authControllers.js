import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
export const register = async (req, res) => {
  try {
    const { firstName, email, password,confirmPassword,date,number,lastName } = req.body;
    if(password !== confirmPassword ){
      return res.status(400).json({msg:"password does not match...."})
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ firstName,lastName ,email, password: hashedPassword,confirmPassword:hashedPassword,date,number });
    res.status(201).json({ msg: "User created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Registrartion Failed" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exists" });
    }
    const verify = bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(400).json({ msg: "Invalid Password" });
    }
    const token = jwt.sign({userId : user._id,name : user.name}, "secret", {
      expiresIn: "7d",
    });
    const SevenDay = 7 * 24 * 60 * 60 * 1000;
    res.cookie("login", token, {
      maxAge: SevenDay,
      signed: true,
      secure: true,
      httpOnly: true,
    });
    res.status(201).json({ msg: "User login successfully", token,userId : user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "logging in failed" });
  }
};
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("login", {
    signed: true,
    secure: true,
    httpOnly: true,
  });
  res.status(200).json({ msg: "user logged out" });
});

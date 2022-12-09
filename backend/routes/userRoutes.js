import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { isAuth, generateToken } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const genRanSixNum = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

const userRouter = express.Router();

userRouter.post(
  "/verify",
  expressAsyncHandler(async (req, res) => {
    const requestEmail = req.body.email;
    console.log(requestEmail);
    const user = await User.findOne({ email: requestEmail });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const pinCode = genRanSixNum();
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: requestEmail,
          subject: "Please enter below PIN code to be verify",
          text: `PIN Code : ${pinCode}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email Sent : ${info.response}`);
          }
        });
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          pinCode: pinCode,
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    // const tempItem = localStorage.getItem("tempuserInfo")
    //   ? JSON.parse(localStorage.getItem("tempuserInfo"))
    //   : {};
    // const localStoragePinCode = tempItem.pinCode;

    const user = await User.findOne({ email: req.body.tempuserInfo.email });
    console.log(req.body);
    if (user) {
      // if (localStoragePinCode === req.body.pinCode) {
      if (req.body.pinCode == req.body.tempuserInfo.pinCode) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res
      .status(401)
      .send({
        message:
          "Invalid Pin Code, please enter 6-digit that we sent to your email",
      });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

export default userRouter;

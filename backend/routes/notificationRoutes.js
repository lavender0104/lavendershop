import express from "express";
import expressAsyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";

import { isAuth, isAdmin } from "../utils.js";

const notificationRouter = express.Router();

notificationRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newNotification = new Notification({
      to: req.body.to,
      message: req.body.message,
    });

    const notification = await newNotification.save();

    res.status(201).send({ message: "New Notification Created", notification });
  })
);

export default notificationRouter;

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
      title: req.body.title,
      message: req.body.message,
    });

    const notification = await newNotification.save();

    res.status(201).send({ message: "New Notification Created", notification });
  })
);

notificationRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const notifications = await Notification.find();
    res.send(notifications);
  })
);

notificationRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      res.send(notification);
    } else {
      res.status(404).send({ message: "Notification Not Found" });
    }
  })
);

export default notificationRouter;

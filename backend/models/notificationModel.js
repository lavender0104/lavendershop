// Create Mongo Model
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import Container from "react-bootstrap/esm/Container";
import { getError } from "../utils";
import Axios from "axios";
import { Store } from "../Store";

export default function Notification() {
  const [notification, setNotification] = useState("");
  const [title, setTitle] = useState("");
  const { state } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post(
        "/api/notification",
        {
          to: "All",
          title: title,
          message: notification,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("Notification Sent");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Send Notification For All User</title>
      </Helmet>
      <h1 className="my-3">Notification</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            placeholder="Title..."
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="notification">
          <Form.Label>Message to user</Form.Label>
          <Form.Control
            placeholder="Write something to notify all user..."
            name="notification"
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            required
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Send</Button>
        </div>
      </Form>
    </Container>
  );
}

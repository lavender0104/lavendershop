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
  const { state } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await Axios.post(
        "/api/notification",
        {
          to: "All",
          message: notification,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("notification sent");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Send Notification For All User</title>
      </Helmet>
      <h1 className="my-3">NOTIFICATION</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="notification">
          <Form.Label>Message to user</Form.Label>
          <Form.Control
            placeholder="Write something to send to all user..."
            name="notificatio"
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

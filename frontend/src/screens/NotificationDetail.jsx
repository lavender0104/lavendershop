import React, { useEffect, useReducer, useState } from "react";
import { Form, useParams } from "react-router-dom";

import axios from "axios";
import { getError } from "../utils";
import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function NotificationDetail() {
  const params = useParams(); // /notification/:id
  const { id: notificationId } = params;

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/notification/${notificationId}`);
        var createdDate = new Date(data.createdAt);
        var timeStamp = createdDate.toLocaleString();
        setDate(timeStamp);
        setTitle(data.title);
        setMessage(data.message);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [notificationId]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Notification</title>
      </Helmet>
      <h1>Notification</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div>{date}</div>
          <hr />
          <h2>{title}</h2>
          <hr />
          <h4>{message}</h4>
        </div>
      )}
    </Container>
  );
}

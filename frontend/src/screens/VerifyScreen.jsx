import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function VerifyScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";

  const [pinCode, setPinCode] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, tempuserInfo } = state;

  const pinCodeHandler = async (e) => {
    // prevent the page from refresh when clicking the button
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/signin", {
        pinCode,
        tempuserInfo,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  // to prevent signed in user to go to sign in page
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>2-Factor Authentication</title>
      </Helmet>
      <h1 className="my-3">A code has been emailed to you</h1>
      <Form onSubmit={pinCodeHandler}>
        <Form.Group className="mb-3" controlId="pincode">
          <Form.Label>Enter Code</Form.Label>
          <Form.Control
            type="text"
            required
            maxLength={6}
            onChange={(e) => {
              setPinCode(e.target.value);
            }}
          />
        </Form.Group>
        <h4>Code will expired after 300 seconds</h4>
        <div className="mb-3">
          <Button type="submit">Continue</Button>
        </div>
      </Form>
    </Container>
  );
}

import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    // prevent the page from refresh when clicking the button
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/users/verify", {
        email,
        password,
      });
      ctxDispatch({ type: "TEMP_USER_SIGNIN", payload: data });
      localStorage.setItem("tempuserInfo", JSON.stringify(data));
      setTimeout(() => {
        localStorage.removeItem("tempuserInfo");
        ctxDispatch({ type: "TEMP_USER_SIGNOUT", payload: null });
      }, 300000);
      const temp = JSON.parse(localStorage.getItem("tempuserInfo"));
      navigate("/verify");
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      toast.error(getError(err), {
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    console.log("useEffect being called");
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
        <div className="mb-3">
          New Customer?
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}

import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [formErrors, setFormErrors] = useState({});

  const formValidation = () => {
    console.log("Validating the form");
    // 8 to unlimited characters, must have like qW1@xxxx like pattern
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
    // 6 to 15 characters, must have 1 letter, number is optional, no special character and space
    const userNameRegex = /^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{6,15}$/;

    let errors = {};
    if (!name.match(userNameRegex)) {
      errors.name =
        "6 to 15 characters, must have 1 letter, number is optional, no special character and space";
    }
    if (!password.match(passwordRegex)) {
      errors.password =
        "password must be 8 and above characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "password and confirm password must be SAME";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      toast.error("Sign up unsuccessful");
    } else {
      try {
        const { data } = await Axios.post("/api/users/signup", {
          name,
          email,
          password,
        });
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate(redirect || "/");
      } catch (err) {
        toast.error(getError(err));
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {formErrors.name && <p className="text-danger">{formErrors.name}</p>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            placeholder="example@gmail.com"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {formErrors.password && (
            <p className="text-danger">{formErrors.password}</p>
          )}
        </Form.Group>
        {/* <Form.Control.Feedback type="invalid">
            {showMessage}
          </Form.Control.Feedback> */}
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {formErrors.confirmPassword && (
            <p className="text-danger">{formErrors.confirmPassword}</p>
          )}
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}

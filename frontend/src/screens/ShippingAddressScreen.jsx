import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [countryState, setCountryState] = useState(
    shippingAddress.countryState || ""
  );

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        countryState,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        countryState,
      })
    );
    navigate("/payment");
  };

  const handleSelect = (e) => {
    setCountryState(e);
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="state">
            <Form.Label>State</Form.Label>
            {/* <Form.Control
              value={countryState}
              onChange={(e) => setCountryState(e.target.value)}
              required
            /> */}
            <DropdownButton
              title={countryState ? countryState : "Select Your State"}
              id="dropdown-menu"
              variant="info"
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="Johor">Johor</Dropdown.Item>
              <Dropdown.Item eventKey="Kedah">Kedah</Dropdown.Item>
              <Dropdown.Item eventKey="Kelantan">Kelantan</Dropdown.Item>
              <Dropdown.Item eventKey="Kuala Lumpur">
                Kuala Lumpur
              </Dropdown.Item>
              <Dropdown.Item eventKey="Malacca">Malacca</Dropdown.Item>
              <Dropdown.Item eventKey="Negeri Sembilan">
                Negeri Sembilan
              </Dropdown.Item>
              <Dropdown.Item eventKey="Pahang">Pahang</Dropdown.Item>
              <Dropdown.Item eventKey="Penang">Penang</Dropdown.Item>
              <Dropdown.Item eventKey="Perak">Perak</Dropdown.Item>
              <Dropdown.Item eventKey="Perlis">Perlis</Dropdown.Item>
              <Dropdown.Item eventKey="Sabah">Sabah</Dropdown.Item>
              <Dropdown.Item eventKey="Sarawak">Sarawak</Dropdown.Item>
              <Dropdown.Item eventKey="Selangor">Selangor</Dropdown.Item>
              <Dropdown.Item eventKey="Terengganu">Terengganu</Dropdown.Item>
            </DropdownButton>
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

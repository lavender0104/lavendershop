import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import React, { useContext } from "react";
import { Store } from "../Store";
const truncateText = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};
const Product = (props) => {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. The product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  return (
    <Card
      style={{
        overflow: "hidden",
        maxHeight: "25rem",
        wordWrap: true,
      }}
    >
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          className="card-img-top"
          alt={product.name}
          style={{
            width: "18rem",
            height: "15rem",
          }}
        />
      </Link>
      <Card.Body>
        <Link
          to={`/product/${product.slug}`}
          style={{ textDecoration: "none" }}
        >
          <Card.Title style={{ ...truncateText }}>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} />
        <Card.Text>RM {product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;

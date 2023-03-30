import { Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { selectCart, totalPrice } from "../../features/cartSlice";
import { selectUser } from "../../features/userSlice";
import { useSelector } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

const AppNavbar = () => {
  const currentUser = useSelector(selectUser);
  const cartitems = useSelector(selectCart);
  const total = useSelector(totalPrice);
  const paymentMutation = useMutation({
    mutationFn: ({ url, body }) => {
      return axios.post(url, body);
    },
    onSuccess: (res) => {
      console.log("payment response", res);
    },
    onError: (error) => {
      console.log("Error!!!", error);
    },
  });
  const makePayment = (token) => {
    const product = { name: "Fruits", quantity: 4, price: 100 };
    const url = "http://localhost:4000/api/payment";
    let body = {
      product,
      token,
      email: currentUser.email,
    };
    cartitems.length > 0
      ? paymentMutation.mutate({ url, body })
      : alert("Cart is empty");
  };

  return (
    <Navbar bg="light  d-flex justify-content-around">
      <img
        src={`http://localhost:4000/api/${currentUser.image}`}
        width="50px"
      ></img>
      <a style={{ textDecoration: "none" }} href="/Profile">
        {currentUser.email == null && currentUser.isVerified == false
          ? "Not Login"
          : currentUser.email}
      </a>
      <Nav>
        <NavDropdown
          title={
            <>
              <FaShoppingCart
                className="color-light"
                style={{ fontSize: "1rem" }}
              />{" "}
              <Badge style={{ fontSize: "1rem" }} variant="primary">
                {cartitems.length}
              </Badge>
            </>
          }
          id="basic-nav-dropdown"
        >
          {cartitems.map((item) => (
            <NavDropdown.Item key={item.id}>
              {item.name} ({item.quantity})
            </NavDropdown.Item>
          ))}
          {cartitems.length === 0 ||
          currentUser.subscriptionStatus == "basic" ? (
            <NavDropdown.Item>
              <button className="btn btn-danger">Not able to purchase</button>
            </NavDropdown.Item>
          ) : (
            <NavDropdown.Item>
              <StripeCheckout
                stripeKey="pk_test_51MnglXL0GTUOyfP9fLbgDpPoowiSmqLLDylY0CEKIe0Mb1Djxh9hP0kJHlt7D4GYm1qADWCQUDcxzDzCrKchbo0t00g7BgrnAI"
                token={makePayment}
                amount={total}
                name="Buy Items"
              >
                <button className="btn btn-success">{`Buy Products in just ${total}`}</button>
              </StripeCheckout>
            </NavDropdown.Item>
          )}
        </NavDropdown>
      </Nav>
    </Navbar>
  );
};

export default AppNavbar;

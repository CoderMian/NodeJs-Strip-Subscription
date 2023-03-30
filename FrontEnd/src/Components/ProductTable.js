import React from "react";
import { Table, Button } from "react-bootstrap";
import {
  closeAddProduct,
  openAddProduct,
  setSelectedProduct,
} from "../features/productSlice";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { allProductMongoose } from "../features/productSlice";
import { useNavigate } from "react-router-dom";
import { selectUser, signout } from "../features/userSlice";
import { setCartItems, setTotal } from "../features/cartSlice";
const ProductTable = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(allProductMongoose);
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: (url) => {
      return axios.delete(url);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["product"], res);
      queryClient.invalidateQueries(["product"]);
    },
    onError: (error) => {
      console.log("Error!!!", error);
    },
  });

  const handleDeletion = (id) => {
    const url = `http://localhost:4000/api/product/${id}`;
    deleteProductMutation.mutate(url);
  };

  const logout = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:4000/api/logout",
        { email: user.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="mx-auto col-12 col-sm-10 pt-5">
      <Button
        className="btn btn-danger mb-2 ml-auto"
        onClick={() => {
          logout();
          dispatch(signout());
          localStorage.setItem("token", null);
          navigate("/");
        }}
      >
        {" "}
        Logout
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Image Url</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.createdAt}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.image}</td>
              <td className="d-flex justify-content-end gap-2 flex-wrap">
                <Button
                  variant="danger"
                  onClick={() => handleDeletion(product._id)}
                  disabled={
                    user.subscriptionStatus === "basic" ||
                    user.subscriptionStatus === "month"
                      ? true
                      : false
                  }
                >
                  Delete
                </Button>{" "}
                <Button
                  variant="primary"
                  onClick={() => {
                    console.log("update clicked");
                    dispatch(setSelectedProduct(product));
                    dispatch(closeAddProduct());
                    navigate("/addUpdateProduct");
                  }}
                  disabled={
                    user.subscriptionStatus === "basic" ||
                    user.subscriptionStatus === "month"
                      ? true
                      : false
                  }
                >
                  Update
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    dispatch(openAddProduct());
                    navigate("/addUpdateProduct");
                  }}
                  disabled={
                    user.subscriptionStatus === "basic" ||
                    user.subscriptionStatus === "month"
                      ? true
                      : false
                  }
                >
                  Add
                </Button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    dispatch(setCartItems(product));
                    dispatch(setTotal());
                  }}
                >
                  Add To Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductTable;

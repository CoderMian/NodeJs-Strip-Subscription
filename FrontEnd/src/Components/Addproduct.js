import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  openAddUpdate,
  closeAddProduct,
  updateProduct,
} from "../features/productSlice";
import { useNavigate } from "react-router-dom";
function Addproduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addUpdate = useSelector(openAddUpdate);
  const updatedProduct = useSelector(updateProduct);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: addUpdate == false ? updatedProduct.name : "",
    quantity: addUpdate == false ? updatedProduct.quantity : "",
    price: addUpdate == false ? updatedProduct.price : "",
    image: addUpdate == false ? updatedProduct.image : "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  // update data
  const handleUpdation = (event) => {
    event.preventDefault();
    const url = `http://localhost:4000/api/products/${updatedProduct._id}`;
    updateProductMutation.mutate({ url, formData });
  };
  const updateProductMutation = useMutation({
    mutationFn: ({ url, formData }) => {
      return axios.put(url, formData);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["product"], res);
      queryClient.invalidateQueries(["product"]);
      // setIsUpdate(false);
      setFormData({ name: "", quantity: "", price: "", image: "" });
      alert("Product Updated");
    },
    onError: (error) => {
      console.log("Error!!!", error);
    },
  });

  //add new data
  const sendDataToMongoose = (event) => {
    event.preventDefault();
    const url = "http://localhost:4000/api/product";
    newProductMutation.mutate(url);
  };

  const newProductMutation = useMutation({
    mutationFn: (url) => {
      return axios.post(url, { ...formData });
    },
    onSuccess: (res) => {
      console.log("entered in the successs");
      queryClient.setQueryData(["product"], res);
      queryClient.invalidateQueries(["product"]);
      setFormData({ name: "", quantity: "", price: "", image: "" });
    },
    onError: (error) => {
      console.log("Error!!!", error);
    },
  });

  return (
    <div
      className="bg-light"
      style={{ width: "100%", height: "100vh", paddingTop: "5rem" }}
    >
      <Form
        className="col-12 col-sm-8 mx-auto"
        onSubmit={addUpdate == false ? handleUpdation : sendDataToMongoose}
        // onSubmit={handleUpdation}
      >
        <Form.Group className="mb-3">
          <Form.Label>Product Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product Quantity</Form.Label>
          <input
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Qunatity"
            type="number"
            className="form-control"
            min="0"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product Price</Form.Label>
          <input
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            type="number"
            className="form-control"
            min="0"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product Image</Form.Label>
          <Form.Control
            type="text"
            placeholder="Image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <div className="d-flex flex-row justify-content-between">
          <Button
            variant={addUpdate === false ? "success" : "primary"}
            type="submit"
          >
            {addUpdate === false ? "Update" : "Add"}
          </Button>
          {
            <Button
              variant="danger"
              onClick={() => {
                dispatch(closeAddProduct());
                navigate("/showData");
              }}
            >
              Show
            </Button>
          }
        </div>
      </Form>
    </div>
  );
}

export default Addproduct;

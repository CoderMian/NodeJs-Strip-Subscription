const express = require("express");
const product_route = express();

const productController = require("../controller/productController");
product_route.use(express.json());
product_route.use(express.urlencoded({ extended: false }));

//for getting all products
product_route.get("/fetch/products", productController.getAllProduts);

//for getting single product
product_route.get("/products/:id", productController.getProductById);
//for setting the products
product_route.post("/product", productController.createProduct);
//for updating the products
product_route.put("/products/:id", productController.updateProductById);
//for deleting the products
product_route.delete("/product/:id", productController.deleteProductById);
module.exports = product_route;

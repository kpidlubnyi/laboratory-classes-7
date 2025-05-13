const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { STATUS_CODE } = require("../constants/statusCode");

exports.addProductToCart = (request, response) => {
  Product.add(request.body)
    .then(() => {
      return Cart.add(request.body.name);
    })
    .then(() => {
      response.status(STATUS_CODE.FOUND).redirect("/products/new");
    })
    .catch(err => {
      console.error(err);
      response.status(500).send("Error adding product to cart");
    });
};

exports.getProductsCount = async () => {
  try {
    return await Cart.getProductsQuantity();
  } catch (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }
};
const { CUSTOMER_SERVICE, SHOPPING_SERVICE } = require("../config");
const ProductService = require("../services/product-service");
const {
  PublishCustomerEvent,
  PublishShoppingEvent,
  PublishMessage,
} = require("../utils");
const UserAuth = require("./middlewares/auth");
const axios = require('axios');

module.exports = (app, channel) => {
  const service = new ProductService();

  app.post("/products/create", async (req, res, next) => {
    try{
       const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      // validation
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.json(data);
    }catch(err){
      return res.status(404).json({ error });

    }
   
  });

  app.get("/products/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });

    }
  });

  app.get("/products/get/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.post("/products/ids", async (req, res, next) => {
    const { ids } = req.body;
    const products = await service.GetSelectedProducts(ids);
    return res.status(200).json(products);
  });

  app.put("/products/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try{
      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.body._id },
        "ADD_TO_WISHLIST"
      );
  
      // PublishCustomerEvent(data);
      // PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      const customerResponse = await axios.post('http://localhost:8001/customer/add-to-wishlist', data,{
              headers: {
                  'Authorization': ` ${req.headers.authorization}`
              }
      });
  
      res.status(200).json(data.data.product);
    }catch(err){
      return res.status(404).json({ error });
    }
    
  });

  app.delete("/products/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try{
      const { data } = await service.GetProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_WISHLIST"
      );
      // PublishCustomerEvent(data);
      // PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      const customerResponse = await axios.post('http://localhost:8001/customer/add-to-wishlist', data,{
              headers: {
                  'Authorization': ` ${req.headers.authorization}`
              }
      });
  
      res.status(200).json(data.data.product);
    }catch(err){
      return res.status(404).json({ error });
    }
    
  });

  app.put("/products/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try{
      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.body._id, qty: req.body.qty },
        "ADD_TO_CART"
      );
  
      // PublishCustomerEvent(data);
      // PublishShoppingEvent(data);
  
      // PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      const customerResponse = await axios.post('http://localhost:8001/customer/add-to-cart', data,{
              headers: {
                  'Authorization': ` ${req.headers.authorization}`
              }
      });
  
  
      // PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));
      const shoppingResponse = await axios.post('http://localhost:8003/shopping/add-to-cart', data,{
              headers: {
                  'Authorization': ` ${req.headers.authorization}`
              }
      });
  
      const response = { product: data.data.product, unit: data.data.qty };
  
      res.status(200).json(response);
    }catch(err){
      return res.status(404).json({ error });
    }
   
  });

  app.delete("/products/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try{
      const { data } = await service.GetProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_CART"
      );
  
      // PublishCustomerEvent(data);
      // PublishShoppingEvent(data);
  
      // PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      const customerResponse = await axios.post('http://localhost:8001/customer/remove-from-cart', data,{
              headers: {
                  'Authorization': ` ${req.headers.authorization}`
              }
      });
      // PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));
      const shoppingResponse = await axios.post('http://localhost:8003/shopping/remove-from-cart', data,{
              headers: {
                  'Authorization': ` ${req.headers.authorization}`
              }
      });
  
      const response = { product: data.data.product, unit: data.data.qty };
  
      res.status(200).json(response);
    }catch(err){
      return res.status(404).json({ error });
    }

    
  });

  app.get("/products/whoami", (req, res, next) => {
    return res
      .status(200)
      .json({ msg: "/ or /products : I am products Service" });
  });

  //get Top products and category
  app.get("/products/view", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });
};

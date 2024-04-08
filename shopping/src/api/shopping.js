const ShoppingService = require("../services/shopping-service");
const { PublishCustomerEvent, SubscribeMessage } = require("../utils");
const  UserAuth = require('./middlewares/auth');
const { CUSTOMER_SERVICE } = require('../config');
const { PublishMessage } = require('../utils')

module.exports = (app, channel) => {
    
    const service = new ShoppingService();

    SubscribeMessage(channel, service)

    app.post('/shopping/order',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;
        try{
            const { data } = await service.PlaceOrder({_id, txnNumber});
        
            const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER')
    
            // PublishCustomerEvent(payload)
            PublishMessage(channel,CUSTOMER_SERVICE, JSON.stringify(payload))
    
            res.status(200).json(data);
        }
        catch(err){
            res.json({ error: err.message });
        }
        

    });

    app.get('/shopping/orders',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        
        try{
            const { data } = await service.GetOrders(_id);
        
            res.status(200).json(data);
        }
        catch(err){
            res.json({ error: err.message });
        }
        

    });

    app.put('/shopping/cart',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        try{
            const { data } = await service.AddToCart(_id, req.body._id);
        
            res.status(200).json(data);
        }
        catch(err){
            res.json({ error: err.message });
        }
        

    });

    app.delete('/shopping/cart/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        try{
            const { data } = await service.AddToCart(_id, req.body._id);
        
            res.status(200).json(data);
        }
        catch(err){
            res.json({ error: err.message });
        }

    });
    
    app.get('/shopping/cart', UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        try{
            const { data } = await service.GetCart({ _id });
        
            res.status(200).json(data);
        }
        catch(err){
            res.json({ error: err.message });
        }
    });

    app.get('/shopping/whoami', (req,res,next) => {
        try{
            return res.status(200).json({msg: '/shoping : I am Shopping Service'})
        }
        catch(err){
            res.json({ error: err.message });
        }
    })
 
}

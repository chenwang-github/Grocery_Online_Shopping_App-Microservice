const CustomerService = require('../services/customer-service');
const  UserAuth = require('./middlewares/auth');
const { SubscribeMessage } = require('../utils');


module.exports = (app, channel) => {
    
    const service = new CustomerService();

    // To listen
    // SubscribeMessage(channel, service);

    app.post('/customer/signup', async (req,res,next) => {
        const { email, password, phone } = req.body;
        const { data } = await service.SignUp({ email, password, phone}); 
        res.json(data);

    });

    app.post('/customer/login',  async (req,res,next) => {
        
        const { email, password } = req.body;

        const { data } = await service.SignIn({ email, password});

        res.json(data);

    });

    app.post('/customer/address', UserAuth, async (req,res,next) => {
        
        const { _id } = req.user;


        const { street, postalCode, city,country } = req.body;

        const { data } = await service.AddNewAddress( _id ,{ street, postalCode, city,country});

        res.json(data);

    });
     

    app.get('/customer/profile', UserAuth ,async (req,res,next) => {

        const { _id } = req.user;
        const { data } = await service.GetProfile({ _id });
        res.json(data);
    });
     

    app.get('/customer/shoping-details', UserAuth, async (req,res,next) => {
        const { _id } = req.user;
       const { data } = await service.GetShopingDetails(_id);

       return res.json(data);
    });
    
    app.get('/customer/wishlist', UserAuth, async (req,res,next) => {
        const { _id } = req.user;
        const { data } = await service.GetWishList( _id);
        return res.status(200).json(data);
    });

    app.get('/customer/whoami', (req,res,next) => {
        return res.status(200).json({msg: '/customer : I am Customer Service'})
    })

    app.post('/customer/add-to-cart', UserAuth, async (req,res,next) => {
        const { _id } = req.user;

        const { userId, product, order, qty } = req.body.data;

        const { data } = await service.ManageCart(_id,product, qty, false);

        return res.json(data);
    });

    app.post('/customer/remove-from-cart', UserAuth, async (req,res,next) => {
        const { _id } = req.user;

        const { userId, product, order, qty } = req.body.data;

        const { data } = await service.ManageCart(_id,product, qty, true);

        return res.json(data);
    });

    app.post('/customer/add-to-wishlist', UserAuth, async (req,res,next) => {
        const { _id } = req.user;

        const { userId, product, order, qty } = req.body.data;

        const { data } = await service.AddToWishlist(userId,product);

        return res.json(data);
    });

    app.post('/customer/create-order', UserAuth, async (req,res,next) => {
        const { _id } = req.user;

        const { userId, product, order, qty } = req.body.data;

        const { data } = await service.ManageOrder(userId,order);

        return res.json(data);
    });



}

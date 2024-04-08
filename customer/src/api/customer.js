const CustomerService = require('../services/customer-service');
const  UserAuth = require('./middlewares/auth');
const { SubscribeMessage } = require('../utils');


module.exports = (app, channel) => {
    
    const service = new CustomerService();

    // To listen
    SubscribeMessage(channel, service);

    app.post('/customer/signup', async (req,res,next) => {
        const { email, password, phone } = req.body;

        try{
            const { data } = await service.SignUp({ email, password, phone}); 
            res.json(data);
        }catch(err){
            res.json({ error: err.message });
        }
        

    });

    app.post('/customer/login',  async (req,res,next) => {
        
        const { email, password } = req.body;

        try{
            const { data } = await service.SignIn({ email, password});

            res.json(data);
        }
        catch(err){
            res.json({ error: err.message });
        }

        

    });

    app.post('/customer/address', UserAuth, async (req,res,next) => {
        
        const { _id } = req.user;

        const { street, postalCode, city,country } = req.body;

        try{
            const { data } = await service.AddNewAddress( _id ,{ street, postalCode, city,country});

            res.json(data);
        }
        catch(err){
            res.json({ error: err.message });
        }

    });
     

    app.get('/customer/profile', UserAuth ,async (req,res,next) => {

        const { _id } = req.user;

        try{
            const { data } = await service.GetProfile({ _id });
            res.json(data);
        }catch(err){
            res.json({ error: err.message });
        }
        
    });
     

    app.get('/customer/shoping-details', UserAuth, async (req,res,next) => {
        const { _id } = req.user;
        try{
            const { data } = await service.GetShopingDetails(_id);

            return res.json(data);
        }
        catch(err){
            res.json({ error: err.message });
        }
       
    });
    
    app.get('/customer/wishlist', UserAuth, async (req,res,next) => {
        const { _id } = req.user;

        try{
            const { data } = await service.GetWishList( _id);
            return res.status(200).json(data);
        }
        catch(err){
            res.json({ error: err.message });
        }
        
    });

    app.get('/customer/whoami', (req,res,next) => {
        try{
            return res.status(200).json({msg: '/customer : I am Customer Service'})

        }
        catch(err){
            res.json({ error: err.message });
        }
    })
}

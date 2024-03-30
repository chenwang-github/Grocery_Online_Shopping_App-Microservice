const CustomerService = require("../services/customer-service");

module.exports = (app) => {
    
    const service = new CustomerService();
    app.use('/customer/app-events',async (req,res,next) => {

        const { payload } = req.body;

        //handle subscribe events
        service.SubscribeEvents(payload);

        console.log("============= customer ================");
        console.log(payload);
        res.json(payload);

    });

}

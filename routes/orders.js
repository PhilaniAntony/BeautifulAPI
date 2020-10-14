const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const auth = require('../middleware/auth');

//@desc require orders models
const Order = require('../models/Orders');


//@desc Getting orders
//@meth GET
//@route /orders
//@auth Private
router.get('', auth,async (req, res)=>{
   
    //@desc fetch orders from database
    try {
        //@desc fetch all orders and store them in a variable orders
        const orders = await Order.find().populate('product', 'name price');
        if(!orders){
            res.status(404).json({
                message : "Not Found"
            });
        }
        const response = {
            message : "Fetched all orders",
            count : orders.length,
            orders : orders.map(order=>{
                return {
                    id : order._id,
                    product : order.product,
                    quantity : order.quantity,
                    request : {
                       type : "GET",
                       url: `http://localhost/3000/orders/${order._id}` 
                    }
                }
            })
        }
        //@desc return a response 
        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        });
    }
});


//@desc Adding a new order
//@meth GET
//@route /orders/:id
//@auth Private
router.get('/:id', auth, async (req, res)=>{
   
    //@desc fetch orders from database
    try {
        order =  await Order.findById(req.params.id).populate('product', 'name price');
        const response = {
            message : "Fetch product",
            id : order._id,
            product: order.product,
            quantity : order.quantity,
            request: {
                type : "GET",
                url : `http://localhost/3000/orders/${order._id}`
            }
        }
        res.status(200).json(response);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        });
    }
});


//@desc Adding a new order
//@meth POST
//@route /orders
//@auth Private
router.post('',[auth, [
    //@desc perfom checks on user data with express-validator
    check('productId', 'Product id must not be empty').not().isEmpty(),
    check('quantity', 'Order must have a quantity').isNumeric(),
]], async (req, res)=>{
    
    //@desc Check if validation results have errors
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         res.status(500).json({
             errors: errors.array()
         });
     }
    //@desc Create a new instace of the order and save to database
    try {
        
        const order = new Order({
            quantity :req.body.quantity,
            product : req.body.productId
        });

        await order.save();
        const response = {
            message : "Order created",
            count : order.length,
            order : {
                    id : order._id,
                    product : order.product,
                    quantity : order.quantity,
                    request : {
                       type : "POST",
                       url: `http://localhost/3000/orders/${order._id}` 
                    }
            }
        }
        //@desc return response     
        res.status(200).json(response);;
    } catch (error) {
       console.error(error.message);
       res.status(200).json({
           message : error.message
       }); 
    }
    
});


//@desc Deleting a  order
//@meth DELETE
//@route /orders/:1
//@auth Private
router.delete('/:id', auth, async(req, res)=>{
    //@desc find order by ID and remove
    try {
        const id = req.params.id;
        await Order.findByIdAndRemove({_id : id});
        res.status(200).json({
            message : "Product removed",
            id : id
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message : error.message
        });
    }
});

module.exports = router;
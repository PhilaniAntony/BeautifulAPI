const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult} = require('express-validator');
const multer = require('multer');
const auth = require('../middleware/auth');

//@desc require users models
const User = require('../models/User');
//desc config multer for upload

  
//@config multer for product image
const storage = multer.diskStorage({
    //@desc set destination folder for products upload
    destination : (req, file, next)=>{
        next(null, 'uploads/');
    },
    //@desc setup filename for upload file
    filename : (req, file, next)=>{
        next(null, new Date.now().toISOString() + file.origilname);
    }
});


//desc filter only jpeg/png for products upload
const filefilter =(req, file, next)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        next(null, true);
    }else{
        next(null, false);
    }
};

//@desc setup upload middleware
const upload = multer({
    storage: storage,
    fileFilter :filefilter,
    limits: {
        fileSize : 1024*1024*5
    }
});


//@desc require Product model
const Product = require('../models/Products');


//@desc Adding a new product
//@meth GET
//@route /products
//@auth Public
router.get('', (req, res)=>{
    //@desc get all prducts from the database
    
    const products = Product.find().select("name price _id image")
    
    .then(products=>{
         const response = {
            message : "All products",
            count : products.length,
            products : products.map(product=>{
                return {
                    id : product._id,
                    name : product.name,
                    price : product.price,
                    image : product.image,
                    request : {
                       type : "GET",
                       url: `http://localhost/3000/products/${product._id}` 
                    }
                }
            })
         }       
        res.status(200).json(response); 
    })
    .catch (err=>{
        console.error(err.message);
        res.status(500).json({
            message : err.message
        });
    });
});

//@desc Getting product by id
//@meth GET
//@route /products/:1
//@auth Public
router.get('/:id', auth, async (req,res)=>{
    const id = req.params.id;
    try {
        //@DESC FIND ONE PRODUCT BASED ON ID
        const product = await Product.findById(id);
        const response = {
            message : "Product based on id",
            count : product.length,
            product : {
                    id : product._id,
                    name : product.name,
                    price : product.price,
                    image : product.image,
                    request : {
                       type : "GET",
                       url: `http://localhost/3000/products/${product._id}` 
                    }
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


//@desc Adding a new product
//@meth POST
//@route /products
//@auth Public
router.post('',[auth, upload.array('images', 5), [
    //@desc Perfom check on body using express-validator
    check('name', 'Product must have a name').not().isEmpty(),
    check('price', 'Product must have a price').not().isEmpty().isNumeric(),
    ]
],(req, res)=>{
    console.log(req.file);
     //@desc  check if validation results have errors
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         res.status(400).json({
             errors : errors.array()
         })
     }
 
     //@desc save product to database
    
     //@desc create an instance of model 
     const product = new Product({
         name : req.body.name,
         price: req.body.price,
         image : req.file.path,
     });
 
     //@desc save  product to database
     product.save()
     .then(product=>{
         const response = {
             message : "Product based on id",
             count : product.length,
             product : {
                     id : product._id,
                     name : product.name,
                     price : product.price,
                     image : product.image,
                     request : {
                        type : "POST",
                        url: `http://localhost/3000/products/${product._id}` 
                     }
             }
         }     
         res.status(200).json(response);
     })  
    .catch (err=>{
     res.status(400).json({
         message : err.message
     })
     console.error(err.message);
    }); 
    
});


//@desc Updating a  product
//@meth PATCH
//@route /products/:1
//@auth Private
router.patch('/:id',[auth, upload.array('images', 5), [
    check('name', 'Add a name').not().isEmpty(),
    check('price', 'Add a price').not().isEmpty().isNumeric()
]],(req,res)=>{
    const id = req.params.id;
     //@desc  check if validation results have errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
         res.status(500).json({
             errors : errors.array()
         })
    }
 
    //@desc save product to database
    const product = Product.findByIdAndUpdate({_id : id },{
            $set :{ name : req.body.name,
                    price : req.body.price,
                    image :req.file.path
                 }
    })
    .then(product=>{
        const response = {
            message : "Product based on id",
            count : product.length,
            product : {
                    id : product._id,
                    name : product.name,
                    price : product.price,
                    image : product.image,
                    request : {
                       type : "PATCH",
                       url: `http://localhost/3000/products/${product._id}` 
                    }
            }
        }    
        res.status(200).json(response);
    })  
    .catch(err=>{
        console.error(err.message);
        res.status(500).json({
            message :err.message
        });
    }) 
    
});

//@desc Deleting a  product
//@meth DELETE
//@route /products/:1
//@auth Private
router.delete('/:id', auth,async (req, res)=>{
    const id = req.params.id;
    //@desc remove one prduct based on id
    try {
        await Product.findByIdAndRemove({_id: id});
        res.status(200).json({ 
            message: "Product delete",
            id: id
         });
    } catch (error) {
       
        console.error(error.message);
        res.status(500).json({
            message : error.message
        });
    }
    
});


module.exports = router;
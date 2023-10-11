const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { isLoggedIn, isAdmin, validateProduct } = require('../middleware');
const product = require('../models/product');
// const { verifyToken } = require('../utilities/token');


router.get('/', async (req,res, next)=>{

    try {
        const products = await Product.find({});

        res.render('product/index', {products});
    } catch (error) {
        next(error);
    }
})

router.get('/new', isLoggedIn, isAdmin ,(req,res)=>{

    res.render('product/new');
})

router.post('/new', isLoggedIn, isAdmin , validateProduct,async (req,res,next)=>{

    try {
        const product = new Product(req.body);

        await product.save();

        res.redirect('/');
    } catch (error) {
        next(error);
    }
})

router.get('/product/:id', async (req,res,next)=>{


    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        const user = req.user;

        // const token = req.signedCookies.AT;

        if(!product) {
            return res.redirect('/');
        }

        if(!user){
           return res.render('product/show', {product, user : null});
        }

        // const user = await verifyToken(token);

        res.render('product/show', {product, user});
    } catch (error) {
        next(error)
    }
})

router.get('/product/:id/edit', isLoggedIn, isAdmin,async (req,res,next)=>{

    try {
        const {id} = req.params;

        const product = await Product.findById(id);

        if(!product) {
            return res.redirect('/');
        }

        res.render('product/edit', {product});
    } catch (error) {
        next(error)
        // console.log(error);
    }
})


router.patch('/product/:id/edit', isLoggedIn, isAdmin, validateProduct, async (req,res,next)=>{

    try {
        const {id} = req.params;

        await Product.findByIdAndUpdate(id, req.body);

        res.redirect(`/product/${id}`);
    } catch (error) {
        next(error)
    }
})

router.delete('/product/:id', isLoggedIn, isAdmin, async (req,res,next)=>{

    try{
        const {id} = req.params;

        await Product.findByIdAndDelete(id);

        res.redirect('/');
    }
    catch(error){
        next(error);
    }
})

router.patch('/products', isLoggedIn, isAdmin, async (req,res,next)=>{

    try {
        const {gst} = req.body;

        const products = await Product.find({});

        for(let product of products){

            product.gst = gst;
            await product.save();
        }

        // products.forEach(async (product)=>{

        //     try {
        //         product.gst = gst;

        //         await product.save();
        //     } catch (error) {
        //         next(error);
        //     }
        // })

        res.redirect('/');
    } catch (error) {
        next(error);
    }

})

module.exports = router;
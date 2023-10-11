const express = require('express');
const { returnTo, isLoggedIn } = require('../middleware');
const Cart = require('../models/cart');
const Product = require('../models/product');
// const { createToken, verifyToken } = require('../utilities/token');
const User = require('../models/user');
const ExpressError = require('../utilities/ExpressError');
const router = express.Router();

router.use((req, res, next) => {

    const user = req.user;

    if (user && user.role === 'admin') {
        

        const message = `Sorry you don't have accces to this route`;
        // return res.status(401).send(`Sorry you don't have accces to this route`);
        throw new ExpressError(message,401);
    } else {

        next();
    }
})

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const owner = req.user;

        let cart = null;
        if (owner) {

            cart = await Cart.findAndUpdateCart(owner._id);

        }
        else {
            return res.redirect('/user/login');
        }

        res.render('other/cart', { cart });
        // res.json(cart)
    } catch (error) {
        // console.log(error);
        next(error)
    }

})

router.post('/', async (req, res, next) => {

    try {
        const owner = req.user;
        const { productId, quantity } = req.body;
        const foundProduct = await Product.findById(productId);

        if (!foundProduct) {

            const message = 'Product not found';

            throw new ExpressError(message,401);
            // res.status(404).send('Product not found');
            // return;
        }

        const price = foundProduct.price;
        const name = foundProduct.name;
        const image = foundProduct.image;
        const gst = foundProduct.gst;
        let cart = null;

        // if cart already exist

        if (owner) {
            cart = await Cart.findOne({ owner: owner._id });
            // res.send(cart);

            if (cart) {
                const productIndex = cart.products.findIndex((product) => {
                    return product.productId == productId;
                })

                // check if product is already Exist
                if (productIndex > -1) {

                    let product = cart.products[productIndex];
                    product.quantity += +quantity;

                    cart.bill = cart.products.reduce((previous, current) => {

                        return previous + (current.quantity * current.price);
                    }, 0);

                    cart.products[productIndex] = product;
                    await cart.save();
                    return res.redirect('/cart');
                }
                else {

                    cart.products.push({ productId, name, image, quantity, price ,gst});
                    cart.bill = cart.products.reduce((previous, current) => {

                        return previous + (current.quantity * +current.price);
                    }, 0)
                    cart.gst = gst;

                    await cart.save();
                    return res.redirect('/cart');
                }
            }
            // if no cart exist
            else {
                const newCart = new Cart({
                    products: [{ productId, name, image, quantity, price ,gst}],
                    bill: quantity * price,
                    gst : gst,
                })

                cart = await newCart.save();
            }
            cart.owner = owner._id;
            await cart.save();

            res.redirect('/cart');
        }
        else {
            res.redirect('/user/login')
        }
    } catch (error) {
        next(error);
    }
})

router.post('/checkout', isLoggedIn, async (req, res, next) => {

    try {
        const user = req.user;
        const cart = await Cart.findAndUpdateCart(user._id);

        if(cart) {
            
            let totalAmount = (cart.bill + (cart.bill*(cart.gst/100))).toFixed(2);
            const changeInBalance = totalAmount;
            
            if(totalAmount > user.balance) {

                return res.send('Low balance');
            }

            cart.products.forEach(async (product)=>{
                const foundProduct = await Product.findById(product.productId);
                foundProduct.quantity--;
                await foundProduct.save();
            })
            
            await User.findAndDebitBalance(user,changeInBalance);
            const deletedCart = await Cart.findByIdAndDelete(cart._id);
        }else{

            return res.render('other/checkedOut',{success:false});

        }

        res.render('other/checkedOut',{success:true});
    } catch (error) {
        // res.status(500).send('Something Went Wrong')
        next(error);
    }
})

module.exports = router
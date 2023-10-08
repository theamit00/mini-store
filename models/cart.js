const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = new Schema({

    owner: {
        type: ObjectId,
        // required: true,
        ref: 'User'
    },
    products: [{
        productId: {
            type: ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        image : String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: Number,
        gst: {
            type: Number,
            default : 18,
        }
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    },
    gst: {
        type: Number,
        default : 18,
    }
},{timestamps: true})


cartSchema.statics.findAndUpdateCart = async function(owner){

    const cart = await this.findOne({owner}).populate('products.productId');

    if(!cart) return null;

    cart.products = cart.products.filter((product)=>{
        return product.productId.quantity > 0;
    })
    .map((product)=>{
        
        product.price = product.productId.price
        product.gst = product.productId.gst;
        return product;
    });
    

    cart.bill = cart.products.reduce((previous, current)=>{
        return previous + current.price * current.quantity;
    },0)

    await cart.save();
    return cart;
}


module.exports = Cart = mongoose.model('Cart', cartSchema);
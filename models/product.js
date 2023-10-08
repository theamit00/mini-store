const { boolean } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({

    name : {
        type : String,
        // required: true
    },

    image : {
        type : String,
    },

    price : {
        type : Number,
    },

    description : {
        type : String,
    },

    quantity : {
        type : Number,
        default : 0
    },
    gst: {
        type: Number,
        default : 18,
    }
});

module.exports = Product = mongoose.model('Product', productSchema);
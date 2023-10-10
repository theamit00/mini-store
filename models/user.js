const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema;

const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        // required: true,
        unique: true
    },

    password: {
        type: String,
        // required : true
    },

    role: {
        type: String,
        enum: ['admin', 'student'],
        default: "student"
    },

    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    googleId: {
        type: String,
        default: null
    },
    facebookId: {
        type: String,
        default: null
    }
})


userSchema.statics.findAndValidate = async function (username, password) {

    try {
        const foundUser = await this.findOne({ username });

        if (foundUser) {

            const isValidPassword = await bcrypt.compare(password, foundUser.password);

            if (isValidPassword) {
                // return foundUser;
                return foundUser;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return error;
    }

}

userSchema.statics.findAndCreditBalance = async function (user, changeInBalance) {
    try {
        let currentBalance = user.balance;

        let updatedBalance = Math.round(currentBalance + changeInBalance);

        const updatedUser = await this.findByIdAndUpdate(user._id, { balance: updatedBalance });

        return updatedUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

userSchema.statics.findAndDebitBalance = async function (user, changeInBalance) {
    try {
        let currentBalance = user.balance;

        let updatedBalance = Math.round(currentBalance - changeInBalance);

        const updatedUser = await this.findByIdAndUpdate(user._id, { balance: updatedBalance });

        return updatedUser;
    } catch (error) {
        console.log(error);
        return error
    }
}


userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)
    next();
})

userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = User;
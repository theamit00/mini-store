
class ExpressError extends Error{

    constructor(message,status){

        super(); // to get access of all the methods of Error Class
        this.message = message;
        this.status = status;
    }
}

module.exports = ExpressError;
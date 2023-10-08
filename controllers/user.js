const User = require('../models/user');
const {createToken} = require('../utilities/token');

const getLoginPage = (req,res)=>{

    if(!req.user){
        // console.log(req.user);
        return res.render('user/login');
    }
    res.redirect('/');
}

const handleLoginUser = async (req,res,next)=>{

    try {
        
        const { username, password } = req.body;

        const user = await User.findAndValidate(username, password);

        if(user){

            const token = await createToken(user);

            res.cookie('AT', token,{
                expires : new Date(Date.now() + 1000 * 60 * 30),
                httpOnly : true,
                signed : true
            });

            if(user.role === 'admin'){
                return res.redirect('/admin/');
            }

            
            // const {CT} = req.signedCookies;
            // const {cartId} = await verifyToken(CT);
            // if(cartId){
                
            //     user.cart = cartId;
            //     await user.save();
            // }
            
            const returnTo = res.locals.returnTo || '/';
            res.redirect(returnTo);
        }
        else{
            res.send('Invalid Username or Password');
        }
    } catch (error) {
        next(error);
    }
}


const handleLogoutUser = (req,res)=>{

    res.clearCookie('AT');

    res.redirect('/');
}

module.exports = {
    getLoginPage,
    handleLoginUser,
    handleLogoutUser
}
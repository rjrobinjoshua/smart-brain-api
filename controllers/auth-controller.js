const userDao = require('../dao/user-dao');
const authService = require('../services/auth-service');

signIn = (req, res) => {
    const {email, password} = req.body;

    if(!email || !password )
        return res.status(400).json('incorrect form submission');

    authService.authenticate(email, password)
        .then(isValid => {
            if(isValid)
                userDao.findUserByEmail(email).then(users => sendUser(users, res));
            else
                res.status(400).json("Invalid credentials");      
        });
}

register = (req, res) => {

    const { email, name, password } = req.body;

    if(!email || !name || !password )
        return res.status(400).json('incorrect form submission');
    
    authService.register(email, name, password)
        .then(users => sendUser(users, res, "Unable to register"));


};

module.exports = {
    signIn,
    register
}

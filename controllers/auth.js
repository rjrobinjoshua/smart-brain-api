
const loginDao = require('../dao/login');
const userDao = require('../dao/user');
const bcrypt = require('bcrypt-nodejs');

signIn = (req, res) => {
    const {email, password} = req.body;

    if(!email || !password )
        return res.status(400).json('incorrect form submission');

    loginDao.findLogin(email).then(login => {
        let isValid = false;
        if(login.length > 0){
            isValid = bcrypt.compareSync(password, login[0].hash);
            if(isValid)
            userDao.findUserByEmail(email).then(users => sendUser(users, res));
        }

        if(!isValid)
            res.status(400).json("Invalid credentials");

    })
}

register = (req, res) => {

    const { email, name, password } = req.body;

    if(!email || !name || !password )
        return res.status(400).json('incorrect form submission');
    
    const user = {
        name: name,
        email: email,
        entries: 0,
        joined: new Date()   
    }

    const hashPass = bcrypt.hashSync(password); 

    const trx = userDao.createTransaction();

    trx.then(trx => {

        loginDao.insertLogin({
            hash: hashPass,
            email: email
        }, trx)
        .then(login => {
            user.email = login[0].email;
            return userDao.insertUser(user, trx)
                .then(users => 
                    sendUser(users, res, "unable to register"));
        })
        .then(trx.commit)
        .catch(trx.rollback);

    })

};

module.exports = {
    signIn,
    register
}

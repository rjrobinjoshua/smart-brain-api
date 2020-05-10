const loginDao = require('../dao/login-dao');
const userDao = require('../dao/user-dao');
const bcrypt = require('bcrypt');


const saltRounds = 10;

authenticate = (email, password) => {
    return loginDao.findLogin(email).then(login => {
                return bcrypt.compare(password, login[0].hash)
                    .then( result => result);
            })
            .catch(err =>{
                console.log("Authentication error " +err.detail);
                return false;
            })
}


hashPassword = (password) => {
    return bcrypt.hash(password, saltRounds);
}

register = (email, name, password) => {

    const user = {
        name: name,
        email: email,
        entries: 0,
        joined: new Date()   
    }


    const trx = loginDao.createTransaction();


    return trx.then(trx => {
        return userDao.insertUser(user, trx)
                .then(users => {
                        return hashPassword(password).then(hashPass => {
                            return loginDao.insertLogin({
                                hash: hashPass,
                                email: email
                            }, trx)
                            .then(login => {
                                trx.commit();
                                return users;  
                            })
                        })   
                }).catch( err => {
                    console.log("Register error => " +err.detail);
                    trx.rollback();
                    return [];
                })
    })

}

module.exports = {
    authenticate,
    register
}
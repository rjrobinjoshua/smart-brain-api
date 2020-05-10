const loginDao = require('../dao/login-dao');
const userDao = require('../dao/user-dao');
const bcrypt = require('bcrypt-nodejs');
// const bcrypt = require('bcrypt');


const saltRounds = 10;

authenticate = (email, password) => {
    console.log('email ->', email);
    console.log('password ->', password);
    return loginDao.findLogin(email).then(login => {
                console.time('bcrypt');
                let isValid = false;
                if(login.length > 0) {
                    isValid = bcrypt.compareSync(password, login[0].hash);                      
                }
                console.timeEnd('bcrypt');
                return isValid;
                
            })
}

register = (email, name, password) => {

    const user = {
        name: name,
        email: email,
        entries: 0,
        joined: new Date()   
    }


    const trx = loginDao.createTransaction();
    const hashPass = bcrypt.hashSync(password); 


    return trx.then(trx => {
        return userDao.insertUser(user, trx)
                .then(users => {
                        loginDao.insertLogin({
                            hash: hashPass,
                            email: email
                        }, trx)
                        .then(login => {
                            trx.commit(); 
                        })
                    return users;    

                }).catch( err => {
                    trx.rollback();
                    return [];
                })
    })

}

module.exports = {
    authenticate,
    register
}
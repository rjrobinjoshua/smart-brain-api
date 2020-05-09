const loginDao = require('../dao/login-dao');
const userDao = require('../dao/user-dao');
const bcrypt = require('bcrypt-nodejs');

authenticate = (email, password) => {

    return loginDao.findLogin(email).then(login => {
                let isValid = false;
                if(login.length > 0) {
                    isValid = bcrypt.compareSync(password, login[0].hash);                      
                }
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
    console.log('trx',trx);

    return trx.then(trx => {

            return loginDao.insertLogin({
                    hash: hashPass,
                    email: email
                }, 
            trx)
            .then(login => {
                    user.email = login[0].email;
                    return userDao.insertUser(user, trx);
                }
            )
            .then(users => {
                    trx.commit();
                    return users;
                }
            )
            .catch((err) => {
                console.log(err)
                trx.rollback();
                return [];
                }
            );
        }
    )

}

module.exports = {
    authenticate,
    register
}
const { db } = require('../config/db');


findLogin = (email) => {
    return db.select('*').from('login').where({email}).then(login => {
            return login;
        });
}


insertLogin = (login, trx) => {

    return trx('login').returning('*')
            .insert(login).then(login => {
                return login;
            });
}

createTransaction = () => {
    return db.transaction();
}

module.exports = {
    findLogin,
    insertLogin,
    createTransaction
}
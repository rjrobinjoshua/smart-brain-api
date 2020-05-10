const { db } = require('../config/db');


findLogin = (email) => {
    return db.select('*').from('login').where({email}).then(login => {
            return login;
        }).catch(err => {
            console.log('Select error -> ',err);
            return [];
        });
}


insertLogin = (login, trx) => {

    return trx('login').returning('*')
            .insert(login).then(login => {
                return login;
            }).catch(err => {
                console.log('Login insert error -> ',err);
                throw err;
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
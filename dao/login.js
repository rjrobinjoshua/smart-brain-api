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
                console.log('Insert error -> ',err);
                return [];
            });
}

module.exports = {
    findLogin,
    insertLogin
}
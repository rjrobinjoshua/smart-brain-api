const { db } = require('../config/db');


findUserById = (id) => {

    return db.select('*').from('users').where({id}).then(users => {
            return users;
        }).catch(err => {
            console.log('User select error -> ',err);
            return [];
        });
}

findUserByEmail = (email) => {

    return db.select('*').from('users').where({email}).then(users => {
            return users;
        }).catch(err => {
            console.log('User select error -> ',err);
            return [];
        });
}

updateUser = (user, id) => {

    return db('users').where({id}).update(user)
            .then(count => {
                return count;
            }).catch(err => {
                console.log('User update error -> ',err);
                return 0;
            });
}

insertUser = (user, trx) => {

    return trx('users').returning('*')
            .insert(user).then(users => {
                return users;
            }).catch(err => {
                console.log('User insert error -> ',err);
                throw err;
            });
}

module.exports = {
    findUserById,
    findUserByEmail,
    updateUser,
    insertUser
}
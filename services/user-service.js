const userDao = require('../dao/user-dao');

findUser = (id) => {

    return userDao.findUserById(id)
        .then(users => users);

}

incrementEntries = (id) => {

    return userDao.findUserById(id).then(users => {
        if(users.length > 0){
            users[0].entries++;
            userDao.updateUser(users[0], id);
        }
        return users;
    });

}

module.exports = {
    findUser,
    incrementEntries
}
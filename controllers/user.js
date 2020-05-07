const userDao = require('../dao/user');

findUser = (req, res) => {

    const { id } = req.params;

    userDao.findUserById(id).then(users => sendUser(users, res));

}

updateEntries = (req, res) => {

    const { id } = req.body;

    userDao.findUserById(id).then(users => {
        if(users.length > 0){
            users[0].entries++;
            userDao.updateUser(users[0], id);
        }
        sendUser(users, res);
    });
}

sendUser = (users, res, msg) => {
    if(!msg)
        msg="No such user";

    if(users.length > 0)
        res.json(users[0]);
    else
        res.status(404).json(msg);
}



module.exports = {
    findUser,
    updateEntries
}
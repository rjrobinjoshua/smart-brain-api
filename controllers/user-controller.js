const userDao = require('../dao/user-dao');
const userService = require('../services/user-service');

findUser = (req, res) => {

    const { id } = req.params;

    if(!id) {
        return res.status(400).json('required input not found');
    }

    userService.findUser(id).then(users => sendUser(users, res));

}

updateEntries = (req, res) => {

    const { id } = req.body;

    if(!id) {
        return res.status(400).json('required input not found');
    }

    userService.incrementEntries(id).then(users => sendUser(users, res));
        
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
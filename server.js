const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'smartbrain',
      password : 'smartbrain123',
      database : 'smart-brain'
    }
});

const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'Robin',
            email: 'robinjoshua@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '456',
            name: 'Evan',
            email: 'evanjoshua@gmail.com',
            password: 'honey',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json(database.users);
});

app.post('/signin', (req, res) => {

    const {email, password} = req.body;

    findLogin(email).then(login => {
        let isValid = false;
        if(login.length > 0){
            isValid = bcrypt.compareSync(password, login[0].hash);
            if(isValid)
                findUser(email).then(users => sendUser(users, res));
        }

        if(!isValid)
            res.status(400).json("Invalid credentials");

    })

});

app.post('/register', (req, res) => {

    const { email, name, password } = req.body;
    
    const user = {
        name: name,
        email: email,
        entries: 0,
        joined: new Date()   
    }

    const hashPass = bcrypt.hashSync(password);

    
    
    db.transaction(trx => {

        trx.insert({
            hash: hashPass,
            email: email
        }).into('login')
        .returning('email')
        .then(async loginEmail => {
            user.email = loginEmail[0];
            await insertUser(user, trx)
                .then(users => 
                    sendUser(users, res, "unable to register"));
        })
        .then(trx.commit)
        .catch(trx.rollback);

    })


});


app.get('/profile/:id', (req,res) => {

    const { id } = req.params;

    findUser(id).then(users => sendUser(users, res));

});

app.put('/image', (req, res) => {

    const { id } = req.body;

    findUser(id).then(users => {
        if(users.length > 0){
            users[0].entries++;
            updateUser(users[0], id);
        }
        sendUser(users, res);
    });
})

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });
// bcrypt.hash(password, null, null, function(err, hash) {
//     console.log(hash);
// });

sendUser = (users, res) => {
    if(users.length > 0)
        res.json(users[0]);
    else
        res.status(404).json("No such user");
}

sendUser = (users, res, msg) => {
    if(users.length > 0)
        res.json(users[0]);
    else
        res.status(404).json(msg);
}
findUser = (id) => {

    return db.select('*').from('users').where({id}).then(users => {
            return users;
        }).catch(err => {
            console.log('Select error -> ',err);
            return [];
        });
}

findUser = (email) => {

    return db.select('*').from('users').where({email}).then(users => {
            return users;
        }).catch(err => {
            console.log('Select error -> ',err);
            return [];
        });
}

findLogin = (email) => {

    return db.select('*').from('login').where({email}).then(login => {
            return login;
        }).catch(err => {
            console.log('Select error -> ',err);
            return [];
        });
}

updateUser = (user, id) => {

    return db('users').where({id}).update(user)
            .then(count => {
                console.log('updatedCount -> ' ,count);
                return count;
            }).catch(err => {
                console.log('Update error -> ',err);
                return 0;
            });
}

insertUser = (user) => {

    return db('users').returning('*')
            .insert(user).then(users => {
                return users;
            }).catch(err => {
                console.log('Insert error -> ',err);
                return [];
            });
}

insertUser = (user, trx) => {

    return trx('users').returning('*')
            .insert(user).then(users => {
                return users;
            }).catch(err => {
                console.log('Insert error -> ',err);
                return [];
            });
}

app.listen(3000, () => {
    console.log('app is running at 3000');
})

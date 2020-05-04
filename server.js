const express = require('express');
const bodyParser = require('body-parser');

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

app.get('/', (req, res) => {
    res.json(database.users);
});

app.post('/signin', (req, res) => {

    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password)
        res.json("success");
    else
        res.status(400).json("error logging in");

});

app.post('/register', (req, res) => {

    const { email, name, password } = req.body;

    const user = {
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    }

    database.users.push(user);

    res.json(user);


});


app.get('/profile/:id', (req,res) => {

    const { id } = req.params;

    database.users.forEach(user => {
        if(user.id == id){
            res.json(user);
        }
    })

    res.status(404).json("No such user");

})

app.put('/image', (req, res) => {

    const { id } = req.body;

    let user = database.users.filter(user => user.id === id);
    console.log(user);
    user[0].entries++;

    res.json(user);
})

app.listen(3000, () => {
    console.log('app is running at 3000');
})

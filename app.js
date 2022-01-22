const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
if(process.env.NODE_ENV !== 'prod'){
    require('dotenv').config()
}

const usePassport = require('./config/passport')
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const PORT = 3000

app.engine('hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))


usePassport(app)




app.get('/', (req, res) => {
    return Todo.findAll({
        raw: true,
        nest: true
    })
    .then(todos => res.render('index', { todos: todos }))
    .catch(error => res.status(422).json(error))
})


app.get('/todos/:id', (req, res) => {
    const id = req.params.id
    return Todo.findByPk(id)
        .then(todo => res.render('detail', {todo: todo.toJSON()}))
        .catch(error => console.log(error))
})

app.get('/users/login', (req,res)=>{
    res.render('login')
})

app.post('/users/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

app.get('/users/register', (req,res)=>{
    res.render('register')
})

app.post('/users/register', (req,res)=>{
    const {name, email, password, confirmPassword } = req.body
    const errors = []
    if (!email || !password || !confirmPassword) {
        errors.push({ message: 'some column(s) is(are) missing.' })
    }
    if (password !== confirmPassword) {
        errors.push({ message: 'Password does not match.' })
    }
    User.findOne( {where: { email }})
    .then(user => {
        if(user){
            // errors.push({message: '這個 Email 已經註冊過了。' });
            console.log('User already exists')
            return res.render('register', { errors, name, email, password, confirmPassword });
        }
        
        return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(password, salt))
            .then(hash => User.create({
                name,
                email, 
                password: hash
            }))
            .then(() => res.redirect('/'))
            .catch(err => console.log(err));
    });
})

app.post('/users/logout', (req,res)=>{
    res.send('logout')
})


app.listen(PORT, ()=> {
    console.log(`App is running on http://localhost${PORT}`)
})
const express = require('express')
const router = express.Router()
const db = require('../../models')
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = db.User

router.get('/login', (req,res)=>{
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

router.get('/register', (req,res)=>{
    res.render('register')
})

router.post('/register', (req,res)=>{
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

router.post('/logout', (req,res)=>{
    res.send('logout')
})

module.exports = router;
const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/', (req, res) => {
    
    const userId = req.user.id
    return User.findByPk(userId)
        .then(user => {
            if(!user){
                throw new Error('user not exists')
            }
            return Todo.findAll({
                raw: true,
                nest: true,
                where: { userId  }
            })

        })
        .then(todos => res.render('index', { todos: todos }))
        .catch(error => res.status(422).json(error))
})

module.exports = router
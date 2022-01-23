const express = require('express')
const router = express.Router()
const db = require('../../models')

const Todo = db.Todo


router.get('/new', (req, res) => {
    return res.render('new')
})


router.post('/', (req, res) => {
    const {name} = req.body
    const userId = req.user.id
    console.log(userId)
    return Todo.create({
        name, 
        UserId: userId
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    const userId = req.user.id
    return Todo.findOne({
        where : {id, UserId: userId}
    })
    .then(todo => res.render('detail', {todo: todo.toJSON()}))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    const userId = req.user.id
    return Todo.findOne({
        where : {id, UserId: userId}
    })
    .then(todo => res.render('edit', {todo: todo.toJSON()}))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
    const {name} = req.body
    const id = req.params.id
    const userId = req.user.id
    return Todo.update({
        name,
        updatedAt: new Date()
    }, 
    { where: { id, UserId: userId }
    }).then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    const userId = req.user.id
    return Todo.destroy({
        where : {id, UserId: userId}
    }).then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


module.exports = router
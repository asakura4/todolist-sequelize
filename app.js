const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
if(process.env.NODE_ENV !== 'prod'){
    require('dotenv').config()
}

const routes = require('./routes')
const usePassport = require('./config/passport')

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
app.use(routes)

app.listen(PORT, ()=> {
    console.log(`App is running on http://localhost${PORT}`)
})
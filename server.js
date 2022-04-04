const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()
const Book = require('./models/book')

//mongo db connection
require('./connection')()

//jwt secret in env ,run into cli
//export TOKEN_SECRET = 'qqmvbuq368fbbg1'

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'fdlencryption',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}))


//verify token througth headerAuth
const verifyToken = require('./middlewares/verifyToken')

//register controller
const registerController = require('./controllers/registerController')

//login controller
const loginController = require('./controllers/loginController')

//routes

app.get('/', function(req, res) {
    res.send("<h1>Présentation de BookApi</h1>")
})

app.post('/register', function(req, res) {
    registerController(req, res, (data) => {
        res.json({
            "message": data
        })
    })
})

app.post('/login', function(req, res) {
    loginController(req, res, (data) => {
        res.json({
            "message": data
        })
    })
})

app.post('/new', verifyToken, function(req, res) { //i need name author parution year(year) and description
    if (req.body.name === undefined || req.body.author === undefined || req.body.year === undefined || req.body.description === undefined) {
        res.statusCode = 500
        res.json({ "success": false, "message": "Send all informations:name,author,year,description" })
    } else {
        //recup datas
        var name = req.body.name
        var author = req.body.author
        var year = parseInt(req.body.year)
        var description = req.body.description

        //create and store book
        new Book({
            name: name,
            author: author,
            year: year,
            description: description
        }).save().then(function() {
            res.statusCode = 200
            res.json({ "success": true, "message": "Informations sent successfully.Book have been" })
        })
    }
})


app.get('/book/:id', verifyToken, function(req, res) {
    var id = req.params.id
    Book.findById(id, function(err, book) {
        if (err) console.log(err)
        res.statusCode = 200
        res.json({ "success": true, "data": book })
    })
})

app.get('/book', verifyToken, function(req, res) {
    (async function() {
        const books = await Book.find({})

        res.statusCode = 200
        res.json({ "success": true, "data": books })
    })()
})

app.put('/book/:id', verifyToken, function(req, res) {
    var id = req.params.id
    if (req.body.name === undefined || req.body.author === undefined || req.body.year === undefined || req.body.description === undefined) {
        res.statusCode = 500
        res.json({ "success": false, "message": "Send all informations:name,author,year,description" })
    } else {

        Book.findById(id, function(err, book) {
            if (err) {
                console.log(err)
                res.statusCode = 500
                res.json({ "success": false, "message": "No such book in database.Invalid ID" })
            } else {
                (async function() {
                    book.name = req.body.name
                    book.author = req.body.author
                    book.year = req.body.year
                    book.description = req.body.description
                    await book.save()
                    res.statusCode = 200
                    res.json({ "success": true, "message": "Book have been updated" })
                })()
            }
        })
    }
})

app.delete('/book/:id', verifyToken, function(req, res) {
    var id = req.params.id
    Book.findById(id, function(err, book) {
        if (err) {
            console.log(err)
            res.statusCode = 500
            res.json({ "success": false, "message": "No such book in database for deletion.Invalid ID" })
        } else {
            (async function() {
                await book.deleteOne({ id: id })
                res.statusCode = 200
                res.json({ "success": true, "message": "Book have been updated" })
            })()
        }
    })
})


app.listen(8080)
const mongoose = require('mongoose')

module.exports = function() {
    mongoose.connect('mongodb://localhost:27017/bookapi')

    mongoose.connection.once('open', function() {
        console.log('Connection have been made.Now fireworks')
    }).on('error', function(err) {
        console.log('Error' + err)
    })
}
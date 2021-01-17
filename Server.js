var express = require('express')
var bodyParser = require('body-parser')
const { Socket } = require('dgram')
var app = express()
//for server to notify client
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

//as middleware
app.use(express.static(__dirname))
app.use(bodyParser.json())
// what comes from browser is url encoded
app.use(bodyParser.urlencoded({ extended: false }))

//if going to production store in a safe configuration file
var dbURL = 'mongodb+srv://admin:<password>@cluster0.hejeo.mongodb.net/<dbname>?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {

        res.send(messages)
    })
})
app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save()
        .then(() => {
            return Message.findOne({ message: 'badword' })
                .then((censored) => {


                    if (censored) {
                        console.log('censored word found', censored)
                        return Message.remove({ _id: censored.id })

                    }
                    io.emit('message', req.body)
                    res.sendStatus(200)
                })

        })
        .catch(err => {
            sendStatus(500)
            return console.error(err)
        })
})

io.on("connection", (socket) => {
    console.log("a user is connected")
})

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log('mongo connection error:', err)
})

var server = http.listen(4000, () => {
    console.log('server is listening on port', server.address().port

    )
})
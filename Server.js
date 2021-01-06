var express = require('express')
var bodyParser = require('body-parser')
const { Socket } = require('dgram')
var app = express()
//for server to notify client
var http = require('http').Server(app)
var io = require('socket.io')(http)

//as middleware
app.use(express.static(__dirname))
app.use(bodyParser.json())
// what comes from browser is url encoded
app.use(bodyParser.urlencoded({ extended: false }))

var messages = [{ name: 'Aya', message: 'Hey!' },
{ name: 'Joe', message: 'Wlcome!' }]

app.get('/messages', (req, res) => {
    res.send(messages)
})
app.post('/messages', (req, res) => {
    messages.push(req.body)
    io.emit('message', req.body)
    res.sendStatus(200)
})

io.on("connection", (socket) => {
    console.log("a user is connected")
})
var server = http.listen(4000, () => {
    console.log('server is listening on port', server.address().port

    )
})
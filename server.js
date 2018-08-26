const express = require('express');
const path = require('path');
const mongo = require('mongodb').MongoClient;
const os = require('os');
const socketioclient = require("socket.io-client");
const client = require('socket.io').listen(process.env.PORT || 4000).sockets;
const client_server = socketioclient(os.hostname + process.env.PORT);


const app = express();
// DB Config 
// const db1 = require('./config/database');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

// Connect to mongo
mongo.connect('mongodb://Brad:turnover121@ds131932.mlab.com:31932/mongochat_for_test', function (err, db) {
    if (err) {
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function (socket) {
        let chat = db.collection('chats');

        // Create function to send status
        sendStatus = function (s) {
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {
            if (err) {
                throw err;
            }

            // Emit the messages
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function (data) {
            let name = data.name;
            let message = data.message;

            // Check for name and message
            if (name == '' || message == '') {
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insert({ name: name, message: message }, function () {
                    client.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        // Handle clear
        socket.on('clear', function (data) {
            // Remove all chats from collection
            chat.remove({}, function () {
                // Emit cleared
                socket.emit('cleared');
            });
        });
    });
});
app.listen(5111, () => {
    console.log("Server Started at port 5111");
});
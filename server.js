const express = require('express');

const socket = require('socket.io');

const app = express();

const server = require('http').createServer(app);

const io = socket(server , {
    cors:{
        origin:'*',
        methods:['GET' , 'POST']
    }
});

let port = 5500;
const users = []


server.listen(port , ()=> {
    console.log('lisening on port 5500');
});

io.on('connection' , (strem) => {
    console.log('connection' , strem.id);

    strem.on("adduser", (username) => {
        strem.user = username;
        users.push(username)
        console.log("latest users", users)
        io.sockets.emit("users", users)
    });

    strem.on("message", (message) => {
        io.sockets.emit("message", {
            user: strem.user,
            message: message,
        })
    });

    strem.on("disconnect", () => {
        console.log("deleting ", strem.user)

        if (strem.user) {
            users.splice(users.indexOf(socket.user), 1);
        }
        io.sockets.emit("users", users)
        console.log('remaining users: ', users)
    })
});
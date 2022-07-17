const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const PhasmoTool = require("./phasmoTool.js");

const defaultPort = 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || defaultPort;

const publicDirectoryPath = path.join(__dirname, '/public');

app.use(express.static(publicDirectoryPath));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// ***** Global Variables *****
let phasmoTool = new PhasmoTool();

// ***** SocketIO Events *****
io.on('connection', function(socket) {
    console.log(`User Connected with id: [${socket.id}]`);

    // User Disconnection Event
    socket.on('disconnect', function() {
        phasmoTool.userDisconnect(socket.id, io);
    });

    // Connect to Lobby
    socket.on('lobbyConnect', function(lobbyCode) {

        // Create Lobby
        if(lobbyCode === null) {
            phasmoTool.newLobby(socket.id, io);
        }
        // Join Lobby
        else {
            phasmoTool.lobbyConnect(lobbyCode, socket.id, io);
        }
    });

    // *** Lobby Events ***

    // Change Ghost Name
    socket.on('ghostNameChange', function (data) {
        phasmoTool.changeGhostName(data.lobbyCode, data.name, io);
    });

    // Objective Change
    socket.on('objectiveChange', function (data) {
        phasmoTool.changeObjectiveIndex(data.lobbyCode, data.id, data.index, io);
    });

    // Objective Complete
    socket.on('objectiveComplete', function (data) {
        phasmoTool.changeObjectiveStatus(data.lobbyCode, data.id, io);
    });

    // Evidence Select
    socket.on('evidenceSelect', function (data) {
        phasmoTool.evidenceSelect(data.lobbyCode, data.id, io);
    });

    // Reset
    socket.on('reset', function (data) {
        phasmoTool.resetLobby(data.lobbyCode, io);
    });

});



// ***** Listen to Port ******
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})



/*  *** Important Info ***
    npm install –save express
    npm install -save socket.io

    *** Commands ***
    node server.js  -> run server
    ctrl + c        -> stop server


    *** Testing ***
    http://localhost:3000


*/
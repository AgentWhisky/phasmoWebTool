// Evidence Button IDs (Copied from tools.js)
const emf5 = "emf5";
const dots = "dots";
const fingerprints = "fp";
const ghostOrbs = "go";
const ghostWriting = "gw";
const spiritBox = "sb";
const freezingTemps = "ft";

// Class to store all active lobbies
class PhasmoTool {
    constructor() {
        this.lobbies = {}
    }

    // ***** Events *****


    /* User Disconnected
            -> Remove User from lobby if possible
     */
    userDisconnect(socketID, io) {
        for (const [key, value] of Object.entries(this.lobbies)) {
            if(value.userDisconnect(socketID, io) && value.userNum === 0) {
                // Remove Lobby if it is empty
                delete this.lobbies[key];
            }
        }
    }

    /* User Creates a new Lobby
        -> Create a new lobby and connect user to it
     */
    newLobby(socketID, io) {
        let code = this.newCode();

        this.lobbies[code] = new Lobby(code);
        this.lobbies[code].userConnect(socketID, io);

    }

    /*
        User Connects to an Existing Lobby
            -> Connect user to lobby if it exists, or respond with an error message
     */
    lobbyConnect(lobbyCode, socketID, io) {

        // If the Lobby Exists
        if(lobbyCode in this.lobbies) {
            this.lobbies[lobbyCode].userConnect(socketID, io);
        }
        // Lobby Does not Exist
        else {
            io.to(socketID).emit('invalidCode');
        }
    }

    /*
        User Changes the ghost name in a lobby
            -> Alter the ghost name of a lobby if it exists
     */
    changeGhostName(lobbyCode, name, io) {
        // If the Lobby Exists
        if(lobbyCode in this.lobbies) {
            this.lobbies[lobbyCode].changeGhostName(name, io);
        }

    }

    /*
        User changes the Objective Index in a lobby
            -> Alter the index of specified objective in the lobby if it exists
     */
    changeObjectiveIndex(lobbyCode, objID, objIndex, io) {
        // If the Lobby Exists
        if(lobbyCode in this.lobbies) {
            this.lobbies[lobbyCode].changeObjective(objID, objIndex, io);
        }
    }

    /*
        User changes the Objective status in a lobby
            -> Alter the status of a specified objective in the lobby if it exists
     */
    changeObjectiveStatus(lobbyCode, objID, io) {
        // If the Lobby Exists
        if(lobbyCode in this.lobbies) {
            this.lobbies[lobbyCode].changeObjectiveStatus(objID, io);
        }
    }

    /*
        User selected or deselected an evidence in a lobby
            -> Alter the current evidence state using the given evidence (toggle) if lobby exists
     */
    evidenceSelect(lobbyCode, id, io) {
        // If the Lobby Exists
        if(lobbyCode in this.lobbies) {
            this.lobbies[lobbyCode].selectEvidence(id, io);
        }
    }

    /*
        User reset the lobby
            -> Reset the lobby settings to default, excluding user data, if lobby exists
     */
    resetLobby(lobbyCode, io) {
        // If the Lobby Exists
        if(lobbyCode in this.lobbies) {
            this.lobbies[lobbyCode].reset(io);
        }
    }




    // ***** Helper Functions *****

    // Function to generate a new unused 6 digit lobby code
    newCode() {
        let min = 100000;
        let max = 900000;

        let code;

        while(true) {
            code = Math.floor(Math.random()*max) + min;

            if(!(code in this.lobbies)) {
                return code;
            }
        }
    }

}

// Class that stores all info pertaining to a lobby
class Lobby {
    constructor(code) {
        // Lobby Code
        this.lobbyCode = code;

        // Ghost Name
        this.ghostName = "";

        // Objectives
        this.objectives = {
            obj1: {index: 0, status: 0},
            obj2: {index: 0, status: 0},
            obj3: {index: 0, status: 0}
        }

        // *** Evidence ***
        // emf | dots | fingerprints | ghost Orbs | ghost Writing | sprit Box | freezing Temps

        this.evidence = [0, 0, 0, 0, 0, 0, 0];
        this.evidenceNum = 0;

        // User Data
        this.socketIDs = [];
        this.userNum = 0;
    }

    // ***** Events *****
    // User Connection
    userConnect(socketID, io) {
        this.socketIDs.push(socketID);
        this.userNum++;

        this.updateUsers(io);
    }
    // User Disconnection
    userDisconnect(socketID, io) {
        if(this.socketIDs.includes(socketID)) {
            // Remove User from IDs
            this.socketIDs = this.socketIDs.filter(s => s !== socketID);
            this.userNum--;

            this.updateUsers(io);

            return true;
        }
        return false;
    }
    // Change Ghost Name
    changeGhostName(name, io) {
        this.ghostName = name;

        this.updateUsers(io);
    }
    // Change Objective Index
    changeObjective(objID, objIndex, io) {
        if(objID === "objSelect1") {
            this.objectives.obj1.index = objIndex;
        }
        else if(objID === "objSelect2") {
            this.objectives.obj2.index = objIndex;
        }
        else if(objID === "objSelect3") {
            this.objectives.obj3.index = objIndex;
        }


        this.updateUsers(io);
    }
    // Change Objective Status
    changeObjectiveStatus(objID, io) {
        if(objID === "objToggle1") {
            if(this.objectives.obj1.status === 1) {
                this.objectives.obj1.status = 0;
            }
            else {
                this.objectives.obj1.status = 1
            }
        }
        else if(objID === "objToggle2") {
            if(this.objectives.obj2.status === 1) {
                this.objectives.obj2.status = 0;
            }
            else {
                this.objectives.obj2.status = 1
            }
        }
        else if(objID === "objToggle3") {
            if(this.objectives.obj3.status === 1) {
                this.objectives.obj3.status = 0;
            }
            else {
                this.objectives.obj3.status = 1
            }
        }

        this.updateUsers(io);
    }
    // Change Evidence given selected
    selectEvidence(id, io) {
        let index;

        // Get the Evidence Index
        switch(id) {
            case emf5: index = 0;
                break;
            case dots: index = 1;
                break;
            case fingerprints: index = 2;
                break;
            case ghostOrbs: index = 3;
                break;
            case ghostWriting: index = 4;
                break;
            case spiritBox: index = 5;
                break;
            case freezingTemps: index = 6;
                break;
        }

        // Toggle Evidence
        if(this.evidence[index] === 1) {
            this.evidence[index] = 0;
            // Ignore Ghost Orbs
            if(index !== 3) {
                this.evidenceNum--;
            }
        }
        else {
            this.evidence[index] = 1;
            // Ignore Ghost Orbs
            if(index !== 3) {
                this.evidenceNum++;
            }
        }


        this.updateUsers(io);
    }

    // Reset Lobby
    reset(io) {
        // Reset Ghost Name
        this.ghostName = "";

        // Reset Objectives
        this.objectives = {
            obj1: {index: 0, status: 0},
            obj2: {index: 0, status: 0},
            obj3: {index: 0, status: 0}
        }

        // Reset Evidence
        this.evidence = [0, 0, 0, 0, 0, 0, 0];
        this.evidenceNum = 0;

        this.updateUsers(io);
    }

    // Helper Functions

    // Get the current state of the lobby (Sent to the Client)
    getState() {
        return {
            lobbyCode: this.lobbyCode,
            ghostName: this.ghostName,
            objectives: this.objectives,
            evidence: this.evidence,
            evidenceNum: this.evidenceNum,
            buttonStates: this.getButtonStates(),
            userNum: this.userNum
        };
    }

    // Emit Update to All Users in lobby
    updateUsers(io) {
        for (const id of this.socketIDs) {
            io.to(id).emit('lobbySync', this.getState());
        }
    }

    // Get Current states for each button to display on the client
    getButtonStates() {
        let state;

        if(this.evidenceNum === 3) {
            state = [2, 2, 2, 2, 2, 2, 2];
        }
        else {
            state = [0, 0, 0, 0, 0, 0, 0];
        }

        for(let i = 0; i < this.evidence.length; i++) {
            if(this.evidence[i] === 1) {
                state[i] = 1;
            }
        }

        return state;
    }
}


// DO NOT TOUCH
module.exports = PhasmoTool;
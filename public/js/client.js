const e = React.createElement;


class Client extends React.Component {
    // Constructor
    constructor(props) {
        super(props);

        // State Variables
        this.state = {
            connectedToLobby: false,
            lobbyState: {},
            offlineLobbyCode: ""
        }

        // Bind Events
        this.onLobbyCodeChange = this.onLobbyCodeChange.bind(this);
        this.onConnect = this.onConnect.bind(this);

        this.onGhostNameChange = this.onGhostNameChange.bind(this);
        this.onObjectiveChange = this.onObjectiveChange.bind(this);
        this.onObjectiveComplete = this.onObjectiveComplete.bind(this);
        this.onEvidenceSelect = this.onEvidenceSelect.bind(this);
        this.onReset = this.onReset.bind(this);


        // SocketIO
        this.socket = io();

        // SocketIO Events
        this.socketIOEvents();

        // Try to load initial lobbyCode from cookies
        this.pageLoad();

    }
    // ***** Socket IO *****
    socketIOEvents() {
        // Sync client with server
        this.socket.on('lobbySync', (data) => {
            this.setState({
                connectedToLobby: true,
                lobbyState: data
            });

            // Update Ghost Name
            document.getElementById(ghostNameInput).value = this.state.lobbyState.ghostName;

            // Update Objective Index
            document.getElementById(objSelect1).selectedIndex = this.state.lobbyState.objectives.obj1.index;
            document.getElementById(objSelect2).selectedIndex = this.state.lobbyState.objectives.obj2.index;
            document.getElementById(objSelect3).selectedIndex = this.state.lobbyState.objectives.obj3.index;

            // Save LobbyCode as cookie for easy reconnection
            setCookie(cookieName, this.state.lobbyState.lobbyCode);
        });

        // Receive lobby connection error message
        this.socket.on('invalidCode', function () {
            alert("Invalid Lobby Code");
        });
    }

    // ***** Page Load *****

    // Load lobbyCode cookie on page load
    pageLoad() {

        let lobbyCode = getCookie(cookieName);

        // Prevent null lobbyCode
        if(lobbyCode == null) {
            lobbyCode = "";
        }

        this.state.offlineLobbyCode = lobbyCode;
    }

    // ***** Events *****

    // Connection

    // Change initial lobby code current connection screen
    onLobbyCodeChange(event) {
        event.preventDefault();

        this.setState({
                offlineLobbyCode: event.target.value
            });


    }
    // Connect to or create new lobby
    onConnect(event) {
        event.preventDefault();

        // Connect to Lobby
        if(event.target.id === connectButton) {
            this.socket.emit('lobbyConnect', this.state.offlineLobbyCode);
        }
        // Create Lobby
        else if(event.target.id === createButton) {
            this.socket.emit('lobbyConnect', null);
        }
    }
    // *** Lobby ***

    // Handle ghost name change
    onGhostNameChange(event) {
        event.preventDefault();

        this.socket.emit('ghostNameChange', {lobbyCode: this.state.lobbyState.lobbyCode, name: event.target.value});
    }

    // Handle objective index change
    onObjectiveChange(event) {
        event.preventDefault();

        this.socket.emit('objectiveChange', {lobbyCode: this.state.lobbyState.lobbyCode, index: event.target.selectedIndex, id: event.target.id});
    }

    // Handle objective status change
    onObjectiveComplete(event) {
        event.preventDefault();

        this.socket.emit('objectiveComplete', {lobbyCode: this.state.lobbyState.lobbyCode, id: event.target.id});
    }

    // Handle evidence change
    onEvidenceSelect(event) {
        event.preventDefault();

        this.socket.emit('evidenceSelect', {lobbyCode: this.state.lobbyState.lobbyCode, id: event.target.id});
    }

    // Handle reset
    onReset(event) {
        event.preventDefault();

        this.socket.emit('reset', {lobbyCode: this.state.lobbyState.lobbyCode});
    }

    // ***** Components *****

    // Build Ghost Name Input Component
    buildGhostName() {
        return (
            <div className="ghostNameDiv">
                <h2>Ghost Name</h2>
                <input type="text" id={ghostNameInput} placeholder="Enter Ghost Name" onChange={this.onGhostNameChange}/>
            </div>
        )
    }

    // Create objectives for select component
    createObjectives() {
        let objs = [];

        objs.push(<option disabled defaultValue> -- Select an Objective -- </option>)

        for(let i = 0; i < objectives.length; i++) {
            objs.push(<option>{objectives[i]}</option>);
        }
        return objs;
    }

    // Create objective select components
    createObjectiveComps(selectID, buttonID) {
        let obj;

        let index;
        let complete;
        let num;

        if(selectID === objSelect1) {
            complete = this.state.lobbyState.objectives.obj1.status === 1;
            num = 1;
        }
        else if(selectID === objSelect2) {
            complete = this.state.lobbyState.objectives.obj2.status === 1;
            num = 2;
        }
        else if(selectID === objSelect3) {
            complete = this.state.lobbyState.objectives.obj3.status === 1;
            num = 3;
        }


        if(complete) {
            obj = <div>
                <label>Objective #{num}: </label>
                <select id={selectID} onChange={this.onObjectiveChange} disabled>/</select>
                <button className="highLight" id={buttonID} type="button" onClick={this.onObjectiveComplete}>Complete</button>
            </div>
        }
        else {
            obj = <div>
                <label>Objective #{num}: </label>
                <select id={selectID} onChange={this.onObjectiveChange}>
                    {this.createObjectives()}
                </select>
                <button id={buttonID} type="button" onClick={this.onObjectiveComplete}>Not Complete</button>
            </div>
        }


        return obj;
    }

    // Build Objective Div
    buildObjectives() {
        return (
            <div className="objDiv">
                <h2>Ghost Objectives</h2>
                {this.createObjectiveComps(objSelect1, objToggle1)}
                {this.createObjectiveComps(objSelect2, objToggle2)}
                {this.createObjectiveComps(objSelect3, objToggle3)}
            </div>
        )
    }

    // Build Settings Div
    buildSettings() {
        return (
            <div className="settings">
                <h4>Lobby Code<br/>{this.state.lobbyState.lobbyCode}</h4>
                <h4>Connected Users: {this.state.lobbyState.userNum}</h4>
                <button id={resetButton} type="button" onClick={this.onReset}>Reset</button>
            </div>
        )
    }

    // Build the Info Div
    buildInfo() {
        return (
          <div className="infoDiv">
              {this.buildGhostName()}
              {this.buildObjectives()}
              {this.buildSettings()}
          </div>
        );
    }

    // Create Evidence button for given ID
    createEvidenceButton(id) {
        let state;
        let text;

        switch(id) {
            case emf5: state = this.state.lobbyState.buttonStates[0];
                text = "EMF 5";
                break;
            case dots: state = this.state.lobbyState.buttonStates[1];
                text = "D.O.T.S.";
                break;
            case fingerprints: state = this.state.lobbyState.buttonStates[2];
                text = "Fingerprints";
                break;
            case ghostOrbs: state = this.state.lobbyState.buttonStates[3];
                text = "Ghost Orbs";
                if(state === 2) {
                    state = 0;
                }
                break;
            case ghostWriting: state = this.state.lobbyState.buttonStates[4];
                text = "Ghost Writing";
                break;
            case spiritBox: state = this.state.lobbyState.buttonStates[5];
                text = "Spirit Box";
                break;
            case freezingTemps: state = this.state.lobbyState.buttonStates[6];
                text = "Freezing Temps";
                break;
        }

        // Normal
        if(state === 0) {
            return(<button id={id} type="button" onClick={this.onEvidenceSelect}> {text}</button>)
        }
        // Highlighted
        else if(state === 1) {
            return(<button id={id} className="highLight" type="button" onClick={this.onEvidenceSelect}>{text}</button>)
        }
        // Disabled
        else if(state === 2) {
            return(<button id={id} type="button" onClick={this.onEvidenceSelect} disabled>{text}</button>)
        }

    }

    // Build The Evidence Div
    buildEvidenceDiv() {
        return (
            <div className="buttonDiv">
                {this.createEvidenceButton(emf5)}
                {this.createEvidenceButton(dots)}
                {this.createEvidenceButton(fingerprints)}
                {this.createEvidenceButton(ghostOrbs)}
                {this.createEvidenceButton(ghostWriting)}
                {this.createEvidenceButton(spiritBox)}
                {this.createEvidenceButton(freezingTemps)}
            </div>
        );
    }

    // Create the ghost data Div
    createNormalGhost(ghostData) {
        let key = ghostData[0];
        let neededEvidence = ghostData[1];

        let ghost = ghosts[key];

        let neededEvidenceString = getNeededEvidenceString(neededEvidence)

        let ghostDiv;

        if(showAdvanced(this.state.lobbyState.evidence)) {
            ghostDiv = <div className="ghostNormalDiv">

                <a href={ghost.wikiLink} target="_blank">{ghost.name}</a>
                <div>
                    <label><b>Evidence:</b> {neededEvidenceString}</label><br/>
                    <label><b>Strengths:</b> {ghost.strength}</label><br/>
                    <label><b>Weaknesses:</b> {ghost.weakness}</label><br/>
                    <label><b>Abilities:</b> {ghost.abilities}</label>
                </div>

            </div>
        }
        else {
            ghostDiv = <div className="ghostNormalDiv">

                <a href={ghost.wikiLink} target="_blank">{ghost.name}</a>
                <label><b>Evidence:</b>  {neededEvidenceString}</label>

            </div>
        }



        return (ghostDiv);
    }

    // Build the Ghost Div
    buildGhostDiv() {
        let ghostsArr = [];

        let ghostData = getPossibleGhosts(this.state.lobbyState.evidence, this.state.lobbyState.evidenceNum);

        for(let i = 0; i < ghostData.length; i++) {
            ghostsArr.push(this.createNormalGhost(ghostData[i]));
        }

        return (
            <div className="ghostDiv">
                <div className="possibleGhosts">
                    {ghostsArr}
                </div>
            </div>
        );
    }


    // ***** Screens *****

    // Lobby Screen
    buildMain() {
        let div;

        if(showGhosts(this.state.lobbyState.evidence)) {
            div = <div className="lobbyDiv">
                {this.buildInfo()}
                {this.buildEvidenceDiv()}
                {this.buildGhostDiv()}
            </div>
        }
        else {
            div = <div className="lobbyDiv">
                {this.buildInfo()}
                {this.buildEvidenceDiv()}
            </div>
        }


        return(div);
    }

    // Login Screen
    buildConnect() {
        return (<div className="connectDiv">
            <h2>Lobby Connect</h2>
            <div className="connectInput">
                <input id={connectInput} value={this.state.offlineLobbyCode} type="text" placeholder="Enter Lobby Code" onChange={this.onLobbyCodeChange}/>
                <br/>
                <button id={connectButton} type="button" onClick={this.onConnect}>Connect to Lobby</button>
                <button id={createButton} type="button" onClick={this.onConnect}>Create Lobby</button>
            </div>
        </div>);
    }


    // ***** App *****
    // Function to build App to Render
    buildApp() {
        let appDiv;

        if(this.state.connectedToLobby) {
            appDiv = this.buildMain();
        }
        else {
            appDiv = this.buildConnect();
        }


        return (appDiv);
    }


    // ***** Render Function *****
    render() {
        return (this.buildApp())
    }
}

// Renders the ReactDom in div 'main_container'
const domContainer = document.querySelector('#root');
ReactDOM.render(e(Client), domContainer);
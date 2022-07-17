// ***** Component IDs *****

// Connection IDs
const connectInput = "connectInput";
const connectButton = "connectButton";
const createButton = "createButton";

// ***** Main IDs *****

// Ghost Name
const ghostNameInput = "ghostNameInput";

// Objectives
const objSelect1 = "objSelect1";
const objSelect2 = "objSelect2";
const objSelect3 = "objSelect3";

const objToggle1 = "objToggle1";
const objToggle2 = "objToggle2";
const objToggle3 = "objToggle3";

// Evidence Buttons
const emf5 = "emf5";
const dots = "dots";
const fingerprints = "fp";
const ghostOrbs = "go";
const ghostWriting = "gw";
const spiritBox = "sb";
const freezingTemps = "ft";

// Settings
const resetButton = "resetButton";


// Functions

// Function to get an array of possible [ghostKey, neededEvidence] pairs
function getPossibleGhosts(evidence, evidenceNum) {
    // emf | dots | fingerprints | ghost Orbs | ghost Writing | sprit Box | freezing Temps

    let ghostList = [];

    let ghostCount;
    let neededEvidence;

    if(evidence[3] === 1) {
        evidenceNum++;
    }

    // Iterate the Ghost List
    for (const [key, value] of Object.entries(ghosts)) {
        ghostCount = 0;
        neededEvidence = [];

        // Iterate each Evidence
        for(let i = 0; i < numberOfEvidence; i++) {
            if(evidence[i] === 1 && value.evidence[i] === 1) {
                ghostCount++;
            }
            else if(value.evidence[i] === 1) {
                neededEvidence.push(i);
            }
        }

        if(ghostCount >= evidenceNum) {
            ghostList.push([key, neededEvidence]);
        }

    }


    return ghostList;

}

// Function to determine if lobby should display advanced ghost info given evidence
function showAdvanced(evidence) {
    let count = 0;

    for(let i = 0; i < evidence.length; i++) {
        if(evidence[i] === 1) {
            count++;
        }
    }
    return count >= 2;

}

// Function to determine if lobby should display ghost info give evidence
function showGhosts(evidence) {
    for(let i = 0; i < evidence.length; i++) {
        if(evidence[i] === 1) {
            return true;
        }
    }
    return false;
}

// Function to convert an array of evidence indices to a formatted string
function getNeededEvidenceString(neededEvidence) {
    let neededEvidenceString = "";

    if(neededEvidence.length === 0) {
        return "N/A";
    }

    for(let i = 0; i < neededEvidence.length; i++) {
        neededEvidenceString += getEvidenceName(neededEvidence[i]);

        if(i < neededEvidence.length - 1) {
            neededEvidenceString += ", ";
        }
    }

    return neededEvidenceString;
}

// Function to get an evidence name from an index
function getEvidenceName(index) {
    switch (index) {
        case 0:
            return "EMF 5";
        case 1:
            return "D.O.T.S";
        case 2:
            return "Fingerprints";
        case 3:
            return "Ghost Orbs";
        case 4:
            return "Ghost Writing";
        case 5:
            return "Spirit Box";
        case 6:
            return "Freezing Temps";
    }
}

// Ghost Data
// Objectives
const objectives = [
    "Find evidence of paranormal activity with an EMF Reader",
    "Capture a photo of the ghost",
    "Detect a ghost's presence with a Motion Sensor",
    "Prevent the ghost from hunting with a Crucifix",
    "Have a member of your team witness a Ghost event",
    "Cleanse the area near the ghost using Smudge Sticks",
    "Get a Ghost to walk through Salt",
    "Repel the Ghost with a Smudge Stick while it's chasing someone",
    "Get the Ghost to blow out a Candle",
    "Have a member of the team escape the Ghost during a Hunt",
    "Get an average sanity below 25%"
];

const numberOfEvidence = 7;



// emf | dots | fingerprints | ghostOrbs | ghostWriting | spritBox | freezingTemps

/*

: {
        name: "",
        evidence: [0, 0, 0, 0, 0, 0, 0],
        strength: "",
        weakness: "",
        abilities: "",
        wikiLink: "https://phasmophobia.fandom.com/wiki/",
        tips: ""
    }



 */

const ghosts = {
    banshee: {
        name: "Banshee",
        evidence: [0, 1, 1, 1, 0, 0, 0],
        strength: "Focuses on the same player until that player is killed or has left the game",
        weakness: "N/A",
        abilities: "Can produce a unique screech on the parabolic microphone and performs melodic ghost events more often than other ghost types",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Banshee",
        tips: ""
    },

    demon: {
        name: "Demon",
        evidence: [0, 0, 1, 0, 1, 0, 1],
        strength: "Can hunt from 70% sanity with a rare chance to hunt at any sanity percentage",
        weakness: "Increased effective crucifix range",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Demon",
        tips: ""
    },

    deogen: {
        name: "Deogen",
        evidence: [0, 1, 0, 0, 1, 1, 0],
        strength: "Always knows where players are during a hunt and moves at a high speed with no player nearby",
        weakness: "Significantly slows down when near the player and has a lower hunt sanity threshold",
        abilities: "Produces a unique response through the Spirit Box",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Deogen",
        tips: ""
    },

    goryo: {
        name: "Goryo",
        evidence: [1, 1, 1, 0, 0, 0, 0],
        strength: "Only shows itself passing through D.O.T.S. on video camera when no players are nearby",
        weakness: "When not hunting, its wandering distance will be shorter",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Goryo",
        tips: ""
    },

    hantu: {
        name: "Hantu",
        evidence: [0, 0, 1, 1, 0, 0, 1],
        strength: "Moves much quicker in colder areas during hunts",
        weakness: "Moves slower in warmer areas",
        abilities: "Emits frosty breath in freezing rooms",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Hantu",
        tips: ""
    },

    jinn: {
        name: "Jinn",
        evidence: [1, 0, 1, 0, 0, 0, 1],
        strength: "Travels at faster speeds if its target is far away",
        weakness: "Turning off the location's power source will prevent the Jinn from using its ability",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Jinn",
        tips: ""
    },

    mare: {
        name: "Mare",
        evidence: [0, 0, 0, 1, 1, 1, 0],
        strength: "Hunts at a higher sanity threshold in the dark",
        weakness: "Hunts at a lower sanity threshold in a lit room",
        abilities: "Turns off lights and breaks light-bulbs more often; May turn off a light immediately after a player turns one on; Chooses unlit rooms to remain in more often",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Mare",
        tips: ""
    },

    moroi: {
        name: "Moroi",
        evidence: [0, 0, 0, 0, 1, 1, 1],
        strength: "Moves noticeably faster at low player sanity",
        weakness: "Smudge sticks blind the ghost for longer during hunts",
        abilities: "Can curse players, making them lose sanity faster while investigating",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Moroi",
        tips: ""
    },

    myling: {
        name: "Myling",
        evidence: [1, 0, 1, 0, 1, 0, 0],
        strength: "Has quieter footsteps during hunts",
        weakness: "Produces paranormal sounds more frequently",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Myling",
        tips: ""
    },

    obake: {
        name: "Obake",
        evidence: [1, 0, 1, 1, 0, 0, 0],
        strength: "Fingerprints disappear faster than for other ghost types",
        weakness: "Can leave a unique fingerprint pattern",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Obake",
        tips: ""
    },

    oni: {
        name: "Oni",
        evidence: [1, 1, 0, 0, 0, 0, 1],
        strength: "More active when people are nearby and throws objects farther than other ghost types",
        weakness: "Cannot produce \"airball\" ghost events",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Oni",
        tips: ""
    },

    onryo: {
        name: "Onryo",
        evidence: [0, 0, 0, 1, 0, 1, 1],
        strength: "Chance to hunt at any sanity after blowing out a flame",
        weakness: "Presence of flames prevents the ghost from hunting",
        abilities: "Blows out fiery objects (candles, campfire) more often than other ghost types",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Onryo",
        tips: ""
    },

    phantom: {
        name: "Phantom",
        evidence: [0, 1, 1, 0, 0, 1, 0],
        strength: "Additional sanity drain from players within its line-of-sight during manifestations and hunts",
        weakness: "Taking a picture of the Phantom renders it temporarily invisible and when hunting, the model phases in and out less frequently",
        abilities: "Can roam towards random players, leaving behind a trail of evidence",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Phantom",
        tips: ""
    },

    poltergeist: {
        name: "Poltergeist",
        evidence: [0, 0, 1, 0, 1, 1, 0],
        strength: "Can throw multiple objects at once",
        weakness: "Ineffective in empty rooms with no throwables",
        abilities: "Decrease sanity by throwing objects",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Poltergeist",
        tips: ""
    },

    raiju: {
        name: "Raiju",
        evidence: [1, 1, 0, 1, 0, 0, 0],
        strength: "Active electronics boost its speed during hunts",
        weakness: "Disrupts electronics from further away when manifesting",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Raiju",
        tips: ""
    },

    revenant: {
        name: "Revenant",
        evidence: [0, 0, 0, 1, 1, 0, 1],
        strength: "Travels at a faster speed when it has line-of-sight of a player during a hunt",
        weakness: "Travels very slowly with no line-of-sight established",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Revenant",
        tips: ""
    },
    shade: {
        name: "Shade",
        evidence: [1, 0, 0, 0, 1, 0, 1],
        strength: "Harder to find due to it being generally less active",
        weakness: "Has a low hunt sanity threshold, will not manifest around multiple players, and will not hunt with any player near it",
        abilities: "Prefers hissing and shadowy form ghost events",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Shade",
        tips: ""
    },
    spirit: {
        name: "Spirit",
        evidence: [1, 0, 0, 0, 1, 1, 0],
        strength: "N/A",
        weakness: "Using Smudge Sticks while nearby prevents it from hunting for longer",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Spirit",
        tips: ""
    },

    thaye: {
        name: "Thaye",
        evidence: [0, 1, 0, 1, 1, 0, 0],
        strength: "Becomes very active the first time a player gets nearby",
        weakness: "The more time players spend near it, the quieter and slower it becomes",
        abilities: "N/A",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Thaye",
        tips: ""
    },

    mimic: {
        name: "The Mimic",
        evidence: [0, 0, 1, 1, 0, 1, 1],
        strength: "Mimics other ghost types one after another for brief periods of time",
        weakness: "N/A",
        abilities: "Induces Ghost Orbs as fourth evidence (third on Nightmare)",
        wikiLink: "https://phasmophobia.fandom.com/wiki/The_Mimic",
        tips: ""
    },

    twins: {
        name: "The Twins",
        evidence: [1, 0, 0, 0, 0, 1, 1],
        strength: "Can hunt from a different place than expected",
        weakness: "Can interact with the environment simultaneously",
        abilities: "Differing speeds depending on which twin hunts",
        wikiLink: "https://phasmophobia.fandom.com/wiki/The_Twins",
        tips: ""
    },

    wraith: {
        name: "Wraith",
        evidence: [1, 1, 0, 0, 0, 1, 0],
        strength: "Doesn't leave footprints after stepping in salt",
        weakness: "Stepping in salt temporarily makes it more active",
        abilities: "Can briefly manifest itself around players when they're not in its room",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Wraith",
        tips: ""
    },

    yokai: {
        name: "Yokai",
        evidence: [0, 1, 0, 1, 0, 1, 0],
        strength: "",
        weakness: "Can only hear and detect electronics within 2 metres of it",
        abilities: "Talking near it will increase its chance of hunting",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Yokai",
        tips: ""
    },

    yurei: {
        name: "Yurei",
        evidence: [0, 1, 0, 1, 0, 0, 1],
        strength: "N/A",
        weakness: "Will be temporarily confined to its room after smudging",
        abilities: "May randomly shut a door and deduct nearby players' sanity and prefers \"airball\" ghost events",
        wikiLink: "https://phasmophobia.fandom.com/wiki/Yurei",
        tips: ""
    }
}


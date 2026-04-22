import { Pokemon, getPokemon, getRandomPokemon } from "./api.js";

// HTML elements
const card1 = document.querySelector("#card-1");
const cardImg1 = document.querySelector("#card-1 > .card-img");
const cardSubtitle1 = document.querySelector("#card-1 > .subtitle");

const card2 = document.querySelector("#card-2");
const cardImg2 = document.querySelector("#card-2 > .card-img");
const cardSubtitle2 = document.querySelector("#card-2 > .subtitle");

//stat being selected 
var selectedStat = "HP";

//pokemon being compared
var pokemon1;
var pokemon2;

// set both pokemon
// start a new game
async function setBothPokemon() {
    pokemon1 = await getRandomPokemon();
    pokemon2 = await getRandomPokemon();
    cardImg1.style.backgroundImage = `url(${pokemon1.imageUrl})`;
    cardImg2.style.backgroundImage = `url(${pokemon2.imageUrl})`;
    //set selectedStat
    selectedStat = getRandomStat();
    cardSubtitle1.textContent = `${pokemon1.name}, ${getProperStatName(selectedStat)}: ${pokemon1[selectedStat]}`;
    cardSubtitle2.textContent = `${pokemon2.name}, ${getProperStatName(selectedStat)}: ${pokemon2[selectedStat]}`;
}

function getRandomStat() {
    const stats = ["hp", "att", "spAtt", "def", "spDef", "spd"];
    const index = Math.floor(Math.random() * stats.length);
    return stats[index];
}

function getProperStatName(abbrev) {
    const map = {
        hp: "HP",
        att: "Attack",
        spAtt: "Special Attack",
        def: "Defense",
        spDef: "Special Defense",
        spd: "Speed"
    };

    return map[abbrev] || abbrev;
}

setBothPokemon();

 
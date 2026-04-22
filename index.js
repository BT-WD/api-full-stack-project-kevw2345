import { Pokemon, getPokemon } from "./api.js";

// HTML elements
const card1 = document.querySelector("#card-1");
const cardImg1 = document.querySelector("#card-1 > .card-img");
const cardSubtitle1 = document.querySelector("#card-1 > .subtitle");

var selectedStat = "HP";

async function setPokemon() {
    const pokemon = await getPokemon(681);
    console.log(pokemon);
    cardImg1.style.backgroundImage = `url(${pokemon.imageUrl})`;
    //set selectedStat
    selectedStat = getRandomStat();
    cardSubtitle1.textContent = `${pokemon.name}, ${getProperStatName(selectedStat)}: ${pokemon[selectedStat]}`;
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

setPokemon()

 
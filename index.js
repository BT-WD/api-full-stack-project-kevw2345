import { Pokemon, getPokemon, getRandomPokemon } from "./api.js";

// HTML elements
const card1 = document.querySelector("#card-1");
const cardImg1 = document.querySelector("#card-1 > .card-img");
const cardName1 = document.querySelector("#card-1 > .subtitle > h2");
const cardStat1 = document.querySelector("#card-1 > .subtitle > h3");

const card2 = document.querySelector("#card-2");
const cardImg2 = document.querySelector("#card-2 > .card-img");
const cardName2 = document.querySelector("#card-2 > .subtitle > h2");
const cardStat2 = document.querySelector("#card-2 > .subtitle > h3");

const infoText = document.querySelector("#info-text");
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
    selectedStat = getRandomStat()
    //update card text
    updateCardText(1, `${pokemon1.name}`, `${getProperStatName(selectedStat)}: ???`)
    updateCardText(2, `${pokemon2.name}`, `${getProperStatName(selectedStat)}: ???`)
    //update info text
    infoText.innerHTML = `Which Pokemon has the higher <u>${getProperStatName(selectedStat)}?</u>`;
}

// update card name and stat

function updateCardText(cardNumber, name, stat) {
  if (cardNumber === 1) {
    cardName1.textContent = name;
    cardStat1.textContent = stat;
  } else if (cardNumber === 2) {
    cardName2.textContent = name;
    cardStat2.textContent = stat;
  } else {
    console.error("Invalid card number. Use 1 or 2.");
  }
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

//check guess
function checkGuess(cardNumber) {
    // Get the values for the currently selected stat
    const stat1 = pokemon1[selectedStat];
    const stat2 = pokemon2[selectedStat];

    if (cardNumber === 1) {
        // Return true if Card 1 is higher or equal to Card 2
        return stat1 >= stat2;
    } else if (cardNumber === 2) {
        // Return true if Card 2 is higher or equal to Card 1
        return stat2 >= stat1;
    } else {
        console.error("Invalid card number. Use 1 or 2.");
        return null;
    }
}

function getResult(cardNumber) {
  const correct = checkGuess(cardNumber);
  if (correct === true) {
    // Give card correct class
    if (cardNumber === 1) {
      card1.classList.add("correct");
    } else {
      card2.classList.add("correct");
    }
    infoText.textContent = "Correct!!";
  } else {
    // Wrong guess
    if (cardNumber === 1) {
      card1.classList.add("wrong");
    } else {
      card2.classList.add("wrong");
    }
    infoText.textContent = "Nuh uhhhh";
  }
  // Reveal Stats
  updateCardText(1, `${pokemon1.name}`, `${getProperStatName(selectedStat)}: ${pokemon1[selectedStat]}`);
  updateCardText(2, `${pokemon2.name}`, `${getProperStatName(selectedStat)}: ${pokemon2[selectedStat]}`);
}

function onCardClick(cardNumber) {
  getResult(cardNumber);
}

document.getElementById('card-1').addEventListener('click', () => onCardClick(1));
document.getElementById('card-2').addEventListener('click', () => onCardClick(2));
setBothPokemon();

 
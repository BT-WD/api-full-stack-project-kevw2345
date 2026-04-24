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
const streakText = document.querySelector("#streak-text");
const maxStreakText = document.querySelector("#max-streak-text");

// NEW: next button element
const nextBtn = document.querySelector("#next-btn");

//stat being selected 
var selectedStat = "HP";

//pokemon being compared
var pokemon1;
var pokemon2;

// selection made
var selectionMade = false;

// streak counter
var streak = 0;
// chosen card
var chosenCard = 1;
// max streak (loaded from localStorage)
var maxStreak = loadMaxStreak();

// update streak and max streak UI
function updateStreakUI() {
  if (streakText) streakText.textContent = `Streak: ${streak}`;
  if (maxStreakText) maxStreakText.textContent = `Max: ${maxStreak}`;
}

// load saved max streak from localStorage
function loadMaxStreak() {
  const raw = localStorage.getItem("pokemonMaxStreak");
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// save max streak to localStorage
function saveMaxStreak(value) {
  try {
    localStorage.setItem("pokemonMaxStreak", String(value));
  } catch (e) {
    console.warn("Could not save max streak to localStorage", e);
  }
}

// update max streak if current streak beats it
function updateMaxStreakIfNeeded() {
  if (streak > maxStreak) {
    maxStreak = streak;
    saveMaxStreak(maxStreak);
    updateStreakUI();
  }
}

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
    // clear result classes and allow a new selection
    card1.classList.remove("correct", "wrong");
    card2.classList.remove("correct", "wrong");
    selectionMade = false;

    // refresh streak UI
    updateStreakUI();
}

// Shift pokemon2 into slot 1, get a new pokemon2, update UI
async function setOnePokemon(winnerCard) {
  // if winnercard is 2, move pokemon 2 to pokemon 1
  if (winnerCard === 2) {
    pokemon1 = pokemon2;
  }
  // update card1 image and placeholder stat
  cardImg1.style.backgroundImage = `url(${pokemon1.imageUrl})`;
  updateCardText(1, `${pokemon1.name}`, `${getProperStatName(selectedStat)}: ???`);

  // fetch a new pokemon for slot 2
  pokemon2 = await getRandomPokemon();
  cardImg2.style.backgroundImage = `url(${pokemon2.imageUrl})`;
  updateCardText(2, `${pokemon2.name}`, `${getProperStatName(selectedStat)}: ???`);

  // clear result classes and allow a new selection
  card1.classList.remove("correct", "wrong");
  card2.classList.remove("correct", "wrong");
  selectionMade = false;

  // update prompt with current streak
  infoText.innerHTML = `Which Pokemon has the higher <u>${getProperStatName(selectedStat)}?</u><br><small>Streak: ${streak}</small>`;

  // refresh streak UI
  updateStreakUI();
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
  selectionMade = true;
  if (correct === true) {
    // increment streak
    streak += 1;

    // Give card correct class
    if (cardNumber === 1) {
      card1.classList.add("correct");
    } else {
      card2.classList.add("correct");
    }
    infoText.textContent = `Correct!!`;
  } else {
    // reset streak on wrong guess
    streak = 0;

    // Wrong guess
    if (cardNumber === 1) {
      card1.classList.add("wrong");
    } else {
      card2.classList.add("wrong");
    }
    infoText.textContent = `Nuh uhhhh`;
  }
  // Reveal Stats
  updateCardText(1, `${pokemon1.name}`, `${getProperStatName(selectedStat)}: ${pokemon1[selectedStat]}`);
  updateCardText(2, `${pokemon2.name}`, `${getProperStatName(selectedStat)}: ${pokemon2[selectedStat]}`);

  updateMaxStreakIfNeeded();

  // refresh streak UI after result
  updateStreakUI();

  // show next button instead of auto-advancing
  showNextButton(correct, cardNumber);

  return correct;
}

// show the Next button and stash state needed for advancing
function showNextButton(correct, chosenCardNumber) {
  if (!nextBtn) return;
  nextBtn.hidden = false;
  nextBtn.setAttribute("aria-hidden", "false");
  nextBtn.dataset.correct = correct ? "1" : "0";
  nextBtn.dataset.chosen = String(chosenCardNumber || 1);
  // focus for accessibility so keyboard users can proceed quickly
  nextBtn.focus();
}

// handle Next button click
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const correct = nextBtn.dataset.correct === "1";
    const chosen = Number(nextBtn.dataset.chosen) || 1;
    // hide button while we advance
    nextBtn.hidden = true;
    nextBtn.setAttribute("aria-hidden", "true");

    if (correct) {
      setOnePokemon(chosen);
    } else {
      setBothPokemon();
    }
  });
}

// onCardClick no longer auto-advances; it simply produces the result and shows Next button
function onCardClick(cardNumber) {
  if (!selectionMade) {
    chosenCard = cardNumber;
    getResult(cardNumber);
    // removed setTimeout auto-advancing logic
  }
}

document.getElementById('card-1').addEventListener('click', () => onCardClick(1));
document.getElementById('card-2').addEventListener('click', () => onCardClick(2));
setBothPokemon();


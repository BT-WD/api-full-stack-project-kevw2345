
// class for Pokemon
export class Pokemon {
    constructor(imageUrl, name, hp, att, def, spAtt, spDef, spd) {
        this.imageUrl = imageUrl;
        this.name = name;
        this.hp = hp;
        this.att = att;
        this.spAtt = spAtt;
        this.def = def;
        this.spDef = spDef;
        this.spd = spd;
    }
}

//change pokemon name to title case
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

//get random pokemon
export async function getRandomPokemon() {
    const id = Math.floor(Math.random()*1025) + 1;
    console.log(id)
    return getPokemon(id);
}
export async function getPokemonJSON (id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// uses Json data from above function to create a Pokemon object
export async function getPokemon(id) {
    try {
        const pokemonJson = await getPokemonJSON(id);
        return new Pokemon(
            pokemonJson["sprites"]["other"]["official-artwork"]["front_default"],
            toTitleCase(pokemonJson.name),
            pokemonJson["stats"][0]["base_stat"],
            pokemonJson["stats"][1]["base_stat"],
            pokemonJson["stats"][2]["base_stat"],
            pokemonJson["stats"][3]["base_stat"],
            pokemonJson["stats"][4]["base_stat"],
            pokemonJson["stats"][5]["base_stat"]
        );
    } catch (error) {
        console.error(error.message);
        return null;
    }
}
async function gen1Pokemon() {
    let gen1 = await axios.get('https://pokeapi.co/api/v2/generation/1');
    let allPoke = gen1.data.pokemon_species;
    return printPokemon(allPoke);
}

async function printPokemon(results) {
    let allGen1 = [];
    for (let i = results.length - 1; i > 0; i--){ 
        let pokeURL = results[i].url;
        let getInfo = await axios.get(pokeURL);
        allGen1.push(getInfo.data);
    };
    return allGen1;
}

function data() {
  return {
    pokeData: [],
    init() {
      gen1Pokemon().then((resolve) => {
        this.pokeData = resolve;
      });
    }
  }
}

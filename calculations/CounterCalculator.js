const Pokemon = require("../pokemons/Pokemon");

const connection = require("../database/database-connection");

const QueryTypes = connection.QueryTypes;

class CounterCalculator{
    
    static getList(list){
        return new Promise((resolve, reject) => {
            switch(list){
                case "none": 
                    Pokemon.findAll({
                        where: {
                            rarity: "N"
                        }
                    }).then(pokemons => {
                        resolve(pokemons);
                    }).catch(error => {
                        reject(error);
                    });
                break;
                case "mythicals": 
                    try {
                        connection.query("select * from pokemons where rarity not in('S', 'L')", { type: QueryTypes.SELECT }).then(pokemons => {
                            resolve(pokemons);
                        });
                    } catch(error) {
                        reject(error);
                    }                 
                break;
                case "mythicals-sub-legendaries": 
                    try {
                        connection.query("select * from pokemons where rarity != 'L'", { type: QueryTypes.SELECT }).then(pokemons => {
                            resolve(pokemons);
                        });
                    } catch(error) {
                        reject(error);
                    }   
                break;
                case "everything": 
                    Pokemon.findAll().then(pokemons => {
                        resolve(pokemons);
                    }).catch(error => {
                        reject(error);
                    });
                break;
                default: 
                    resolve(undefined);
                break;
            }
        });
    }
    
    static findPokemon(name) {
        return new Promise((resolve, reject) => {
            Pokemon.findOne({
                where: {
                    name: name
                }
            }).then(pokemon => {
                resolve(pokemon);
            }).catch(error => {
                reject(error);
            });
        });
    }
    
    static findWeaknesses(pokemon) {
        
        let weaks2 = [];
        let weaks4 = [];
    
        let weakskeys = ["normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
        "dragon", "dark", "steel", "fairy"];
    
        for (let i = 0; i < weakskeys.length; i++) {
            if (pokemon[weakskeys[i]] == "2"){
                weaks2.push(weakskeys[i])
            }
            else if (pokemon[weakskeys[i]] == "4") {
                weaks4.push(weakskeys[i])
            }
        }
        
        let weaknesses = [weaks2, weaks4];
        
        return weaknesses;
    }
    
    static findResistances(pokemon){
        
        let resists2 = [];
        let resists4 = [];
        let immune = [];
    
        let resistkeys = ["normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
        "dragon", "dark", "steel", "fairy"];
    
        for (let i = 0; i < resistkeys.length; i++) {
            if (pokemon[resistkeys[i]] == "0.5"){
                resists2.push(resistkeys[i])
            }
            else if (pokemon[resistkeys[i]] == "0.25") {
                resists4.push(resistkeys[i])
            }
            else if(pokemon[resistkeys[i]] == "0"){
                immune.push(resistkeys[i])
            }
        }
        
        let resistances = [resists2, resists4, immune];
        
        return resistances;
    }
    
    static findWeaknessesAndResistances(pokemon){
        let weaknesses = this.findWeaknesses(pokemon);
        let resistances = this.findResistances(pokemon);
        let weaknessesAndResistances = [weaknesses, resistances];
        return weaknessesAndResistances;
    }
    
    static typeAgainstDefensor(defensor, type){
        let weaks = this.findWeaknesses(defensor);
        switch(true){
            case weaks[1].includes(type):
                return 8;
            case weaks[0].includes(type):
                return 4
            default:
                return 0;
        }
    }
    
    static offensiveMatchupsTable(weaks, attacker){
        
        let type1 = attacker.type1.toLowerCase();
        let type2 = attacker.type2.toLowerCase();
        
        if (type2 == "-") {
            if(weaks[1].includes(type1)){
                return 4;
            }
            else if(weaks[0].includes(type1)){
                return 2;
            }
            return 0;
        }
        else{
            switch(true){
                case weaks[1].includes(type1) && weaks[1].includes(type2):
                    return 8;
                case weaks[1].includes(type1) && weaks[0].includes(type2):
                    return 6;
                case weaks[0].includes(type1) && weaks[1].includes(type2):
                    return 6;
                case weaks[0].includes(type1) && weaks[0].includes(type2):
                    return 4;
                case weaks[1].includes(type1) && !weaks[0].includes(type2):
                    return 4;
                case !weaks[0].includes(type1) && weaks[1].includes(type2):
                    return 4;
                case weaks[0].includes(type1) && !weaks[0].includes(type2):
                    return 2;
                case !weaks[0].includes(type1) && weaks[0].includes(type2):
                    return 2;
            }
            return 0;
        }
    }
    
    static findOffensiveCounters(target, pokemonsList) {
                       
        let weaks = this.findWeaknesses(target);

        let counters = [];

        pokemonsList.forEach(pokemon => {
            let coeficient = this.offensiveMatchupsTable(weaks, pokemon);
            pokemon.coeficient = coeficient;
            if(coeficient !== 0) counters.push(pokemon);
        })

        let best = this.calculateScore(counters, target, "offensive");

        return best;
   
    }
    
    static findDefensiveCounters(attacker, pokemonsList) {
        
        let type1 = attacker.type1.toLowerCase();
        let type2 = attacker.type2.toLowerCase();
        let counters = [];
        
        for(let i = 0; i < pokemonsList.length; i++) {
            let defensor = pokemonsList[i];
            let resists = this.findResistances(defensor);
            if (type2 == "-") {
                if(resists[0].includes(type1)){
                    defensor.coeficient = 2;
                    counters.push(defensor);
                }
                else if(resists[1].includes(type1)){
                    defensor.coeficient = 4;
                    counters.push(defensor);
                }
                else if(resists[2].includes(type1)){
                    defensor.coeficient = 8;
                    counters.push(defensor);
                }
            }
            else{
                let difference = null;
                switch(true){
                    case resists[2].includes(type1) && resists[2].includes(type2): //16
                        defensor.coeficient = 16;
                        counters.push(defensor); break;

                    case resists[2].includes(type1) && resists[1].includes(type2): //12
                        defensor.coeficient = 12;
                        counters.push(defensor); break;
    
                    case resists[1].includes(type1) && resists[2].includes(type2): //12
                        defensor.coeficient = 12;
                        counters.push(defensor); break;
    
                    case resists[0].includes(type1) && resists[2].includes(type2): //10
                        defensor.coeficient = 10;
                        counters.push(defensor); break;
    
                    case resists[2].includes(type1) && resists[0].includes(type2): //10
                        defensor.coeficient = 10;
                        counters.push(defensor); break;
    
                    case resists[1].includes(type1) && resists[1].includes(type2): //8
                        defensor.coeficient = 8;
                        counters.push(defensor); break;
    
                    case resists[1].includes(type1) && resists[0].includes(type2): //6
                        defensor.coeficient = 6;
                        counters.push(defensor); break;
    
                    case resists[0].includes(type1) && resists[1].includes(type2): //6
                        defensor.coeficient = 6;
                        counters.push(defensor); break;
    
                    case resists[0].includes(type1) && resists[0].includes(type2): //4
                        defensor.coeficient = 4;
                        counters.push(defensor); break;
    
                    case resists[2].includes(type1) && !resists[0].includes(type2): //8-?
                        difference = 8 - this.typeAgainstDefensor(defensor, type2);
                        if(difference > 0){
                            defensor.coeficient = difference;
                            counters.push(defensor);
                        } 
                    break;
    
                    case !resists[0].includes(type1) && resists[2].includes(type2): //8-?
                        difference = 8 - this.typeAgainstDefensor(defensor, type1);
                        if(difference > 0){
                            defensor.coeficient = difference;
                            counters.push(defensor);
                        } 
                    break;
    
                    case resists[1].includes(type1) && !resists[0].includes(type2): //4-?
                        difference = 4 - this.typeAgainstDefensor(defensor, type2);
                        if(difference > 0){
                            defensor.coeficient = difference;
                            counters.push(defensor);
                        } 
                    break;
    
                    case !resists[0].includes(type1) && resists[1].includes(type2): //4-?
                        difference = 4 - this.typeAgainstDefensor(defensor, type1);
                        if(difference > 0){
                            defensor.coeficient = difference;
                            counters.push(defensor);
                        } 
                    break;
    
                    case resists[0].includes(type1) && !resists[0].includes(type2): //2-?
                        difference = 2 - this.typeAgainstDefensor(defensor, type2);
                        if(difference > 0){
                            defensor.coeficient = difference;
                            counters.push(defensor);
                        } 
                    break;
    
                    case !resists[0].includes(type1) && resists[0].includes(type2): //2-?
                        difference = 2 - this.typeAgainstDefensor(defensor, type1);
                        if(difference > 0){
                            defensor.coeficient = difference;
                            counters.push(defensor);
                        } 
                    break;
                }
            }
        }
    
        let best = this.calculateScore(counters, attacker, "defensive");
    
        return best;
    }
    
    static calculateScore(counters, targetOrAttacker, ofensiveOrDefensive){    
        
        if(ofensiveOrDefensive === "offensive"){
            for (let i = 0; i < counters.length; i++){
                let pokemon = counters[i];
                pokemon.score = Math.ceil(Math.max(pokemon.atk/targetOrAttacker.def, pokemon.spatk/targetOrAttacker.spdef) * pokemon.coeficient * 100);
            }
        }
        else{
            for (let i = 0; i < counters.length; i++){
                let pokemon = counters[i];
                pokemon.score = Math.ceil(Math.min(pokemon.def/targetOrAttacker.atk, pokemon.spdef/targetOrAttacker.spatk) * pokemon.coeficient * 100 + (pokemon.hp * 1.5));
            }
        }
    
        let best = counters.sort((a, b) => {
            return b.score - a.score;
        }).slice(0, 30);

        let bestJSON = [];
        
        best.forEach(pokemon => {
            bestJSON.push({
                pokemonInfo: {
                    name: pokemon.name,
                    dexnumber: pokemon.dexnumber,
                    type1: pokemon.type1,
                    type2: pokemon.type2,
                    hp: pokemon.hp,
                    atk: pokemon.atk,
                    def: pokemon.def,
                    spatk: pokemon.spatk,
                    spdef: pokemon.spdef,
                    speed: pokemon.speed,
                    bug: pokemon.bug,
                    dragon: pokemon.dragon,
                    electric: pokemon.electric,
                    fairy: pokemon.fairy,
                    fighting: pokemon.fighting,
                    fire: pokemon.fire,
                    flying: pokemon.flying,
                    ghost: pokemon.ghost,
                    grass: pokemon.grass,
                    ground: pokemon.ground,
                    ice: pokemon.ice,
                    normal: pokemon.normal,
                    poison: pokemon.poison,
                    psychic: pokemon.psychic,
                    rock: pokemon.rock,
                    steel: pokemon.steel,
                    water: pokemon.water,
                    ability1: pokemon.ability1,
                    ability2: pokemon.ability2,
                    ability3: pokemon.ability3,
                    rarity: pokemon.rarity
                },
                coeficient: pokemon.coeficient,
                score: pokemon.score
            });
        });

        return bestJSON;
    }
}

module.exports = CounterCalculator;
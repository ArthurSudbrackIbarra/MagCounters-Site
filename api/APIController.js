const express = require("express");

const router = express.Router();

const CounterCalculator = require("../calculations/CounterCalculator");

router.get("/api/counters", async (req, res) => {
    
    let {pokemon, option, allows} = req.query;

    if(pokemon == undefined){
        res.sendStatus(400);
        return;
    }

    let pokemonObj = null;
    
    try {
        pokemonObj = await CounterCalculator.findPokemon(pokemon);
    } catch(error) {
        res.sendStatus(500);
        return;
    }

    if(pokemonObj == null){
        res.sendStatus(404);
        return;
    }

    let list = null;
    let counters = null;

    switch(true){
        
        case option == undefined && allows == undefined:
            try{
                list = await CounterCalculator.getList("everything");
                counters = CounterCalculator.findOffensiveCounters(pokemonObj, list);
                res.status = 200;
                res.json(counters);
            } catch(error){
                res.sendStatus(500);
            }
        break;
        
        case option != undefined && allows == undefined:
            if(option.toLowerCase() != "offensive" && option.toLowerCase() != "defensive"){
                res.sendStatus(400);
            }
            else{
                try {
                    list = await CounterCalculator.getList("everything");
                    if(option.toLowerCase() == "offensive"){
                        counters = CounterCalculator.findOffensiveCounters(pokemonObj, list);
                    }
                    else{
                        counters = CounterCalculator.findDefensiveCounters(pokemonObj, list);
                    }          
                    res.status = 200;
                    res.json(counters); 
                } catch(error) {
                    res.sendStatus(500);
                }                    
            }
        break;

        case option == undefined && allows != undefined:
            try {
                list = await CounterCalculator.getList(allows.toLowerCase());               
                if(list == undefined){
                    res.sendStatus(400);
                }
                else{
                    counters = CounterCalculator.findOffensiveCounters(pokemonObj, list);
                    res.status = 200;
                    res.json(counters);
                }
            } catch(error) {
                res.sendStatus(500);
            }
        break;

        case option != undefined && allows != undefined:
            if(option.toLowerCase() != "offensive" && option.toLowerCase() != "defensive"){
                res.sendStatus(400);
            }
            else{              
                try {
                    list = await CounterCalculator.getList(allows.toLowerCase());
                    if(list == undefined){
                        res.sendStatus(400);
                    }
                    else{
                        if(option.toLowerCase() == "offensive"){
                            counters = CounterCalculator.findOffensiveCounters(pokemonObj, list);
                        }
                        else{
                            counters = CounterCalculator.findDefensiveCounters(pokemonObj, list);
                        }          
                        res.status = 200;
                        res.json(counters);
                    }  
                } catch(error) {
                    res.sendStatus(500);
                }
            }
        break;
    }
    
});

router.get("/api/pokemons", async (req, res) => {
    try {
        let list = await CounterCalculator.getList("everything");
        res.status = 200;
        res.json(list);
    } catch(error) {
        res.sendStatus(500);
    }
});

router.get("/api/pokemon", async (req, res) => {
    
    let pokemon = req.query.pokemon;

    if(pokemon == undefined){
        res.sendStatus(400);
        return;
    }
    
    try {
        let pokemonObj = await CounterCalculator.findPokemon(pokemon);
        if(pokemonObj == null){
            res.sendStatus(404);
        }
        else{
            res.status = 200;
            res.json(pokemonObj);
        }
    } catch(error) {
        res.sendStatus(500);
    }

});

module.exports = router;
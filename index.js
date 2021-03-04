const express = require("express");

const APIController = require("./api/APIController");

const axios = require("axios");

const connection = require("./database/database-connection");

const Pokemon = require("./pokemons/Pokemon");

const app = express(); 

app.set("view engine", "ejs");

app.use(APIController);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connection.authenticate().then(() => {
    console.log("Database Connection With Success!");
}).catch((error) => {
    console.log(error);
});

app.get("/", async (req, res) => {
      
    let {pokemon, option, allows} = req.query;

    let routeCounters = "http://localhost/api/counters"
    let routePokemon = "http://localhost/api/pokemon";
    let routeAllPokemons = "http://localhost/api/pokemons";

    let paramPokemon = pokemon == undefined ? "abomasnow" : pokemon;
    let paramOption = option == undefined ? "offensive" : option;
    let paramAllows = allows == undefined ? "everything" : allows;

    try {
        
        let countersResponse = await axios.get(routeCounters, {
            params: {
                pokemon: paramPokemon,
                option: paramOption,
                allows: paramAllows

            }
        });

        let pokemonResponse = await axios.get(routePokemon, {
            params: {
                pokemon: paramPokemon
            }
        });

        let allPokemonsResponse = await axios.get(routeAllPokemons);

        res.render("index", {
            counters: countersResponse.data,
            pokemon: pokemonResponse.data,
            allPokemons: allPokemonsResponse.data
        });
        
    } catch(error) {
        res.redirect("/?error=invalid-pokemon");
    }
     
});

app.get("/api", (req, res) => {
    res.render("api");
})

app.listen(80, (error) => {
    if(!error) console.log("Server Online!");
});

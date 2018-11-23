const express = require('express');
const summonerRouter = express.Router();
const axios = require('axios');

axios.defaults.adapter = require('axios/lib/adapters/http');


/**
 * REPLACE THIS API KEY WITH YOUR OWN
 */
const API_KEY = "RGAPI-8226d21c-c1f3-4bda-8816-021225656903";

/**
 * Wrap a function parameter in a promise.
 * Trick to not having to repeat code and
 * avoiding a lot of try/catch blocks
 * @param {*} fn 
 */
const wrapPromise = fn =>
    (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

const getSummonerInformation = async (summonerName) => {
    const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${API_KEY}`);
    return response.data;
}

summonerRouter.get("/:name", wrapPromise(async (req, res, next) => {
    const data = await getSummonerInformation(req.params.name);
    res.json(data);
}));

module.exports = summonerRouter;

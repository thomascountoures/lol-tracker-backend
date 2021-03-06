const express = require('express');
const summonerRouter = express.Router();
const axios = require('axios');

// basic axios config
axios.defaults.adapter = require('axios/lib/adapters/http');


/**
 * REPLACE THIS API KEY WITH YOUR OWN
 */
const API_KEY = "";

/**
 * NA SERVER
 */
const SERVER = "https://na1.api.riotgames.com";

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

/**
 * GET /lol/summoner/v3/summoners/by-name/:summonerName
 * @param {*} summonerName 
 */
const getSummonerInformation = async (summonerName) => {
    const response = await axios.get(`${SERVER}/lol/summoner/v3/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${API_KEY}`);
    return response.data;
}

/**
 * GET /lol/summoner/v3/summoners/by-name/:summonerName
 * Gets 10 latest matches
 * @param {*} summonerName 
 */
const getRecentMatches = async (summonerData, resultsDesired) => {
    const response = await axios.get(`${SERVER}/lol/match/v3/matchlists/by-account/${summonerData.accountId}?endIndex=${resultsDesired}&api_key=${API_KEY}`);
    return response.data.matches;
}

/**
 * Returns JSON object to GUI with relevant information
 * @param {*} recentMatches 
 */
const getMatchData = async (recentMatches) => {
    try {
        if(recentMatches instanceof Array) {
            let results = await Promise.all(recentMatches.map(async (match) => {
                const matchData = await axios.get(`${SERVER}/lol/match/v3/matches/${match.gameId}?api_key=${API_KEY}`);
                const matchDetails = matchData.data;
                return {
                    gameCreation: matchDetails.gameCreation,
                    gameDuration: matchDetails.gameDuration,
                    gameMode: matchDetails.gameMode,
                    gameType: matchDetails.gameType,                    
                    playerIdentities: matchDetails.participantIdentities,
                    playerMatchDetails: matchDetails.participants
                }
            }));
            return results;            
        }
    } catch(e) {
        console.error(e.message);
    }
}

/**
 * GET /summoner/:name
 */
summonerRouter.get("/:name", wrapPromise(async (req, res, next) => {
    const summonerData = await getSummonerInformation(req.params.name);
    const recentMatches = await getRecentMatches(summonerData, req.query.resultsDesired);
    const matchDetails = await getMatchData(recentMatches);
    res.json(matchDetails);
}));

module.exports = summonerRouter;

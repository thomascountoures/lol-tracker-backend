const bodyParser = require('body-parser');

// routing information
const summonerRoutes = require('../routes/summoner');

module.exports = function(app) {

    try {
        // setup bodyparser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded( { extended: true }));

        // define routes, add more if needed (scalable)
        app.use("/summoner", summonerRoutes);

    } catch(e) {
        // log a basic error if anything
        console.error(e.message);
    }

}
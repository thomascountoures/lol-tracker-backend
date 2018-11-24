const bodyParser = require('body-parser');
const cors = require('cors');

// routing information
const summonerRoutes = require('../routes/summoner');

module.exports = function(express, app) {

    try {
        // setup bodyparser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded( { extended: true }));

        // cors stuffs
        app.use(cors());

        // setup static file assets
        app.use(express.static("public"));    

        // define routes, add more if needed (scalable)
        app.use("/summoner", summonerRoutes);

    } catch(e) {
        // log a basic error if anything
        console.error(e.message);
    }

}
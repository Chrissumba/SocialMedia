const express = require('express');
const recommendationrouter = express.Router();
const { getRecomendation } = require('../controllers/recommendation');


recommendationrouter.get("/recomend/:userId", getRecomendation);


module.exports = recommendationrouter
'use strict';

const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DATABASE

const sequelize = new Sequelize('yu-gi-oh', 'root', 'root', {
    host: 'localhost',
    port: '8889',
    dialect: 'mysql'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch(err => {
        console.error(err);
    });

// CARDS

const Card = sequelize.define('card', {
    card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    card_name: {
        type: Sequelize.STRING
    },
    deck_id: {
        type: Sequelize.INTEGER
    }
},
    {
        timestamps: false,
        updatedAt: false,
        createdAt: false
    }
);

app.get('/cards', (req, res) => {
    Card.findAll().then(cards => {
        res.json(cards);
    });
});

app.post('/cards/add', (req, res) => {
    Card.create({
        card_name: req.body.card_name,
        deck_id: req.body.deck_id
    }).then(card => {
        res.json(card);
    });
});

// DECKS

const Deck = sequelize.define('deck', {
    deck_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    deck_name: {
        type: Sequelize.STRING
    },
    archive: {
        type: Sequelize.BOOLEAN
    },
},
    {
        timestamps: false,
        updatedAt: false,
        createdAt: false
    }
);

app.get('/decks', (req, res) => {
    Deck.findAll().then(decks => {
        res.json(decks);
    });
});

app.post('/decks', (req, res) => {
    Deck.create({
        deck_name: req.body.card_name,
        archive: req.body.archive
    }).then(card => {
        res.json(card);
    });
});

// START SERVER

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
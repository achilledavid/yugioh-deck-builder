let filters = [null, null, null, null];
let filersValues = [null, null, null, null];
let cardPrompt = '';
let currentName;

// MENU

function menu() {
    let burger = document.querySelector('.burger');
    let menu = document.querySelector('menu');
    menu.classList.toggle('menu--active');
    burger.classList.toggle('burger--active');
}

// RÉINITIALISATION DES FILTRES

function clearFilters() {
    filters = [null, null, null, null];
    filersValues = [null, null, null, null];
    cardPrompt = '';
    document.querySelector('input').value = "";
    document.querySelector('select').value = "default";
}

function clearDashboard() {
    if (window.location.pathname == '/cartes/') {
        document.querySelector('.content__cards').innerHTML = '<p class="error">Veuillez faire une recherche.</p>';
    } else if (window.location.pathname == '/decks/') {
        document.querySelector('.deck__cards').innerHTML = '<p class="error">Veuillez séléctionner un deck</p>';
    }
}

// FILTRES

function addFilter(obj) {
    if (obj.id == "race") {
        filters[0] = obj.id;
        if (obj.value != '') {
            filersValues[0] = obj.value;
        } else {
            filters[0] = null;
            filersValues[0] = null;
        }
    } else if (obj.id == "attribute") {
        filters[1] = obj.id;
        if (obj.value != '') {
            filersValues[1] = obj.value;
        } else {
            filters[1] = null;
            filersValues[1] = null;
        }
    } else if (obj.id == "fname") {
        filters[2] = obj.id;
        if (obj.value != '') {
            filersValues[2] = obj.value;
        } else {
            filters[2] = null;
            filersValues[2] = null;
        }
    } else if (obj.id == "level") {
        filters[3] = obj.id;
        if (obj.value != '') {
            filersValues[3] = obj.value;
        } else {
            filters[3] = null;
            filersValues[3] = null;
        }
    } else if (obj.id == "archetype") {
        filters[4] = obj.id;
        if (obj.value != '') {
            filersValues[4] = obj.value;
        } else {
            filters[4] = null;
            filersValues[4] = null;
        }
    } else if (obj.id == "type") {
        filters[5] = obj.id;
        if (obj.value != '') {
            filersValues[5] = obj.value;
        } else {
            filters[5] = null;
            filersValues[5] = null;
        }
    } else {
        addFilter('Une erreur est survenue, veuillez réessayer. (Code: 1)');
    }
    getPrompt();
}

function getPrompt() {
    cardPrompt = '';
    for (let i = 0; i < filters.length; i++) {
        if (filters[i] != null) {
            cardPrompt += filters[i] + '=' + filersValues[i] + '&';
        }
    }
}

getFilteredCards = () => {
    let content_cards = document.querySelector('.content__cards');
    clearDashboard();
    if (cardPrompt != '') {
        content_cards.innerHTML = '<div class="loader"></div>';
        try {
            fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?" + cardPrompt + "language=fr")
                .then(response => response.json())
                .then(data => {
                    content_cards.innerHTML = ' ';
                    if (data.error != null) {
                        content_cards.innerHTML = '<p class="error" ">Aucune carte ne correspond à votre recherche.</p>';
                    } else {
                        for (let i = 0; i < data.data.length; i++) {
                            content_cards.innerHTML += '<div class="card" id="' + data.data[i].name + '" onclick="showModal(this)"><img src="' + data.data[i].card_images[0].image_url + '" alt=""><p>' + data.data[i].name + '</p></div>';
                        }
                    }
                });
        } catch (error) {
            console.log(error);
        }
    } else {
        alert('Veuillez remplir au moins un filtre.');
    }
}

getArchetypes = () => {
    try {
        fetch("https://db.ygoprodeck.com/api/v7/archetypes.php")
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    document.querySelector('#archetype').innerHTML += '<option value="' + data[i].archetype_name + '">' + data[i].archetype_name + '</option>';
                }
            });
    } catch (error) {
        console.log(error);
    }
}

// MODAL

let currentCardName = '';
let currentCard = '';

showModal = (obj) => {
    let modal = document.querySelector('.modal');
    modal.classList.toggle('modal--active');
    if (obj != null) {
        currentCardName = obj.id;
        getCardInfo();
    } else {
        resetCardInfo();
    }
}

getCardInfo = () => {
    if (currentCardName != '') {
        try {
            fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?name=" + currentCardName + "&language=fr", { mode: 'cors', method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    currentCard = data.data[0];
                    let modal__title = document.querySelector('.modal__title');
                    modal__title.style.background = assingColor(currentCard.attribute);
                    modal__title.innerHTML = currentCard.name;
                    let modal__desc = document.querySelector('.modal__desc');
                    modal__desc.innerHTML = currentCard.desc;
                    let modal__image = document.querySelector('.modal__img');
                    modal__image.src = currentCard.card_images[0].image_url;
                    let modal__prices = document.querySelector('.modal__prices');
                    modal__prices.innerHTML = getPrices(currentCard.card_prices[0].cardmarket_price, currentCard.card_prices[0].amazon_price, currentCard.card_prices[0].ebay_price);
                });
        } catch (error) {
            console.log(error);
        }
    }
    else {
        alert('Une erreur est survenue, veuillez réessayer. (Code: 2)');
    }
}

getPrices = (cardmarket, amazon, ebay) => {
    return "<p>Cardmarket : " + cardmarket + "€</p><p>Amazon : $" + amazon + "</p><p>Ebay : $" + ebay + "</p>";
}

assingColor = (attribute) => {
    if (attribute == 'DARK') {
        return '#000';
    } else if (attribute == 'LIGHT') {
        return 'linear-gradient(42deg, rgba(255,217,0,1) -40%, rgba(75,48,7,1) 98%)';
    } else if (attribute == 'WATER') {
        return 'linear-gradient(42deg, rgb(92 123 255) -40%, rgb(0, 179, 255) 100%)';
    } else if (attribute == 'FIRE') {
        return 'linear-gradient(42deg, rgba(217,56,56,1) -40%, rgba(255,0,0,1) 100%)';
    } else if (attribute == 'EARTH') {
        return '#000';
    } else if (attribute == 'WIND') {
        return '#000';
    } else if (attribute == 'DIVINE') {
        return '#000';
    } else {
        return '#000';
    }
}

resetCardInfo = () => {
    let modal__title = document.querySelector('.modal__title');
    modal__title.innerHTML = '';
    let modal__desc = document.querySelector('.modal__desc');
    modal__desc.innerHTML = '';
    let modal__image = document.querySelector('.modal__img');
    modal__image.src = '';
    let modal__prices = document.querySelector('.modal__prices');
    modal__prices.innerHTML = '';
}

// DECKS

let allDecks = {};

getDecks = () => {
    try {
        fetch("http://0.0.0.0:3000/decks", {
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        })
            .then(response => response.json())
            .then(data => {
                allDecks = data;
                if (window.location.pathname == '/decks/') {
                    getDecksDetails(allDecks);
                } else {
                    assingDecksToSelect();
                }
            });
    } catch (error) {
        console.log(error);
        alert('Une erreur est survenue, veuillez réessayer. (Chargement des decks)');
    }
}

let currentDeck = {
    deck_id: '',
    cards: []
};

getCardsFromDeck = (deck_id) => {
    if (deck_id != '') {
        currentDeck.deck_id = deck_id;
        currentDeck.cards = [];
        document.querySelector('.deck__cards').innerHTML = '';
        try {
            fetch("http://0.0.0.0:3000/cards")
                .then(response => response.json())
                .then(data => {
                    let j = 0;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].deck_id == deck_id) {
                            try {
                                fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?name=" + data[i].card_name + "&language=fr", { mode: 'cors', method: 'GET' })
                                    .then(response => response.json())
                                    .then(data => {
                                        currentDeck.cards[j] = data;
                                        document.querySelector('.deck__cards').innerHTML += "<div class='card' onclick='openCardModal(" + j + ")'><img src='" + currentDeck.cards[j].data[0].card_images[0].image_url + "' alt='card'><p>" + currentDeck.cards[j].data[0].name + "</p></div>";
                                        j++;
                                    });
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                });
            console.log(currentDeck);
        } catch (error) {
            console.log(error);
        }
    } else {
        alert('Une erreur est survenue, veuillez réessayer. (Deck non trouvé)');
    }
}

getSelectedDeck = () => {
    let select = document.querySelector('#deck-select');
    if (select != null) {
        let deck_id = select.options[select.selectedIndex].value;
        if (deck_id != '') {
            currentDeck.deck_id = deck_id;
            currentDeck.cards = [];
        } else {
            alert('Une erreur est survenue, veuillez réessayer. (Deck non trouvé)');
        }
    }
}

addCardToDeck = () => {
    if (currentDeck != '') {
        if (currentCardName != '') {
            try {
                fetch("http://0.0.0.0:3000/cards/add", {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify({
                        deck_id: currentDeck.deck_id,
                        card_name: currentCardName,
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                    });
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Une erreur est survenue, veuillez réessayer. (Carte non trouvée)');
        }
    } else {
        alert('Une erreur est survenue, veuillez réessayer. (Deck non trouvé)');
    }
}

assingDecksToSelect = () => {
    let select = document.querySelector('#deck-select');
    if (select != null) {
        for (let i = 0; i < allDecks.length; i++) {
            select.innerHTML += "<option value='" + allDecks[i].deck_id + "'>" + allDecks[i].deck_name + "</option>";
        }
    }
}

getDecksDetails = (decks) => {
    for (let i = 0; i < decks.length; i++) {
        let deck = decks[i];
        let deck__container = document.querySelector('.decks');
        deck__container.innerHTML += "<div class='deck' onclick='getCardsFromDeck(" + deck.deck_id + ")'><h1>" + deck.deck_name + "</h1></div>";
    }
}
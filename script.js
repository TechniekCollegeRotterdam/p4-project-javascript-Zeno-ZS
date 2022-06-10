let cards = []; //array for all cards 

//creating deck of cards
let suits = ['spades', 'hearts', 'clubs', 'diamonds'];

//for every deck 13 different type: 1,2,3 etc
let numb = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
//arrray to see cards held by plyer and dealer and see output
let playerCard = [];
let dealerCard = [];
//needed for gameplay\
let cardCount = 0; // gives us first card
let mydollars = 100;
let endplay = false;
//variables to get elements
let message = document.getElementById('message');
let output = document.getElementById('output');
let dealerCards = document.getElementById('dealerCards');
let playerCards = document.getElementById('playerCards');
let pValue = document.getElementById('playerValue');
let dValue = document.getElementById('dealerValue');
let dollarValue = document.getElementById('dollar');


//event listener
document.getElementById('mybet').onchange = function() { 
    if(this.value < 0 ) {
        this.value = 0;
    }
    //limiting minimum and maximum values for bet
    if(this.value > mydollars) {
        this.value = mydollars;
    }
    message.innerHTML = 'Bet changed to $' + this.value;
};

//build deck of cards by loop
for(s in suits){
    let suit = suits[s][0].toUpperCase(); //pick first character and make uppercase

    //when doing through suits, background color for element
    let bgcolor = suit == 'S' || suit == 'C' ? 'black' : 'red'; //black to spades and clubs, red to hearts and diamonds
    for (n in numb) {
        //output.innerHTML += "<span style='color:"  + bgcolor + "'>&" + suits[s] + ";" + numb[n] + "</span>";
        let cardValue = n > 9 ? 10 : parseInt(n) + 1; //generating cards values for A,K,Q,J
        // let cardValue = 1;

        //generting a ranaom card
        //creating card object
        let card = {
            suit: suit,
            icon: suits[s],
            bgcolor: bgcolor,
            cardnum: numb[n],
            cardValue: cardValue //cards worth
        };
        cards.push(card);
    }
}
// goed gebruik gemaakt van comments!
function Start() {
    shuffleDeck(cards); //changing order of cards
    dealNew(); //after shuffling deal new deck of cards
    document.getElementById('start').style.display = 'none';
    dollarValue.innerHTMl = mydollars;
}

function dealNew(){
    dValue.innerHTML = '?';
    playerCard = [] //clear out dealer and player cards
        dealerCard = []; //when dealing new cards it's clear
        dealerCards.innerHTML ='';  //same for innerHTMl for dealer and player
        playerCards.innerHTML = '';
        let betvalue = document.getElementById('mybet').value;
        mydollars = mydollars - betvalue;
        document.getElementById('dollar').innnerHTML = mydollars;  //presentation
        document.getElementById('actions').style.display = 'block';
        message.innerHTML = 'Get up to 21 and beat the dealer to win.<br>Current bet is $' + betvalue;
        document.getElementById('mybet').disabled = true;
        document.getElementById('maxbet').disabled = true;
        deal();
        document.getElementById('btndeal').style.display = 'none';
    }

function redeal () {
    cardCount++;     //to move to the next card
    if (cardCount > 40) {     //checks if cardcount is over max cards
        console.log('new deck');
        shuffleDeck(cards);
        cardCount = 0;  //    cardcount to zero after shuffling
        message.innerHTML = 'New shuffle';
        
    }
}

function deal(){
    for (x = 0; x < 2; x++)   {   //u start with 2 cards in blackjack
        dealerCard.push(cards[cardCount]); //pushing into dealer card array
        dealerCards.innerHTML += cardOutput(cardCount, x);
        if (x == 0) {
            dealerCards.innerHTML += '<div id "cover" style "left:100px;"></div>'; //covering dealer first card
        }
        redeal();
        playerCard.push(card[cardCount]);  //pushing into player card arraay
        playerCards.innerHTML += cardOutput(cardCount, x);  //outputting card
        redeal();
    }
    let playervalue = checktotal(playerCard);
    if (playervalue == 21 && playerCard.length == 2){    //check to see if the player got a blackjack so exactly 21
        playend();    //if they did game ends
    }
    pValue.innerHTML = playervalue;
}

// Je hebt een typ fout in de comment hieronder gezet.

function cardOutput(n,x) {  //caard number,  and position the card on top of another 
    let hpos = x > 0 ? x * 60 + 100 : 100  //if not first card, move over the card
    return(                               //creating a play card and outputting styled card
            '<div class="icard ' +
            cards[n].icon +                 //card values here 
            '" style="left:' +
            hpos +                           //getting position value
            'px;"> <div class "top-card suit">' +
            cards[n].cardnum +
            '<br></div> <div class="content-card suit"></div> <div class ="bottom-card suit">'  +
            cards[n].cardnum +
            '<br></div>  </div>'
    );

}

function maxbet() {
    document.getElementById('mybet').value = mydollars;  //take value within mydollars
    message.innerHTML = 'Bet changed to $' + mydollars;
}
// Mooie code
//player actions 
function cardAction(a){
    console.log(a);
    switch (a) {
        case 'hit':
                playucard(); // add new card to player hand
                break;
        case 'stand':
                playend();  //playout the game, so letting dealer play his hand 
                break;
        case 'double':   //combination of hit and hold
    //double current bet, remove value from mydollars
                let betvalue = parseInt(document.getElementById('mybet').valye);
                if (mydollars - betvalue < 0) {
                    betvalue = betvalue + mydollars;
                    mydollars = 0;
                } else {
                    mydollars = mydollars - betvalue;
                    betvalue = betvalue * 2;  //take th betvalue and double that with mydollars
                }
                document.getElementById('dollar').innerHTML = mydollars;
                document.getElementById('mybet').value = betvalue;
                playucard(); //add new card to player hand
                playend(); //playout and calculate
                break;
        default:                        //if not hit, stand or double
                console.log('done');
                playend();   //playout and calculate =
                
    }
}

//grab the next card and pushing it into the player card array and adding into output
function playucard(){
    playerCard.push(cards[cardCount]);  //adding a new card 
    playerCards.innerHTML += cardOutput(cardCount, playerCard.length - 1);
    redeal();
    let rValu = checktotal(playerCard);     //picking up the current value and checkign the total
    pValue.innerHTML = rValu;
    if (rValu > 21) {
        message.innerHTML = 'Busted!'
        playend();
    }
}

//when game ends, when player chooses to stand
function playend() {
    endplay = true;
    document.getElementById('cover').style.display = 'none'; 
    document.getElementById('myactions').style.display = 'none'; 
    document.getElementById('btndeal').style.display = 'block';
    document.getElementById('mybet').disabled = false;
    document.getElementById('maxbet').disabled = false;
    message.innerHTML = 'Game Over<br>';
    let payoutJack = 1;
    let dealervalue = checktotal(dealerCard);
    dValue.innerHTML = dealervalue;

    //when does dealer grab cards
    while (dealervalue < 17 ){
        dealerCard.push(cards[cardCount]);
        dealerCards.innerHTML += cardOutput(cardCount, dealerCard.length - 1);
        redeal();
        dealervalue = checktotal(dealerCard);
        dValue.innerHTML = dealervalue;
    }

    //who won 
    let playervalue = checktotal(playerCard);  //final check to see who won
    if (playervalue == 21 && playerCard.length == 2) {  //quick check to see if it is blackjack
        message.innerHTML = 'Player Blackjack';
        payoutJack = 1.5;
    }
// Dit is allemaal een beetje op elkaar, kan het niet wat beter uitgesprijd worden zodat het makkelijker is om te lezen?
    //determines who won and winnings get calculated
    let betvalue = parseInt(document.getElementById('mybet').value) * payoutJack;
    if ((playervalue < 22 && dealervalue < playervalue) || (dealervalue > 21 && playervalue < 22)) {
        message.innerHTML += '<span style="color:green;">You Win!  You won $' + betvalue + '</span>';
        mydollars = mydollars + betvalue * 2;
    } else if (playervalue > 21 ) {
        message.innerHTML += '<span style="color:red;">Dealer Wins! You lost $' + betvalue + '</span>';
    } else if (playervalue == dealervalue) {
        message.innerHTML += '<span style="color:blue;">PUSH</span>';
        mydollars = mydollars + betvalue;
    } else {
        message.innerHTML += '<span style="color:red;">Dealer Wins! You lost $' + betvalue + '</span>'
    }
    pValue.innerHTML = playervalue;
    dollarValue.innerHTML = mydollars;
}

function checktotal(arr) {
    let rValue = 0;
    let aceAdjust = false; //Adjustment for ace, it can be 1 or 11 
    for(let i in arr) {
        if(arr[i].cardnum == 'A' && !aceAdjust) {
            aceAdjust = true;
            rValue = rValue + 10;
        }
        rValue = rValue + arr[i].cardValue;
    }

    if(aceAdjust && rValue > 21) {
        rValue = rValue - 10;
    }
    return rValue;
}

function shuffleDeck(array) {       //shuffle deck
    for(let i = array.length - 1; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1));  //getting random values
                let temp = array[i];  // a temporary holder to hold the value of i 
                array[i] = array[j];  //creating value of i by a random value
                array[j] = temp;
    }
    return array;
}

// Dit is allemaal een comment, als het niet nodig is kan je het verwijderen.

// function outputCard() {
// 	output.innerHTML +=
// 		"<span style='color:" +
// 		cards[cardCount].bgcolor +
// 		"'>" +
// 		cards[cardCount].cardnum +
// 		'&' +
// 		cards[cardCount].icon +
// 		';</span>  ';
// }




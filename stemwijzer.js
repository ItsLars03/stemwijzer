
let currentSubject = 0;
var partyResults = [];
var partySize = 9;

parties.forEach(party => {
    party.points = 0;
});

subjects.forEach(subject => {
    subject.important = false;
});

const introHome = document.getElementById("introHome");
const startButton = document.getElementById("startBtn");
const titleHeader = document.getElementById("title");
const statementPara = document.getElementById("statement");
const choiceBtns = document.getElementById("choiceButtons");
const backBtn = document.getElementById("returnButton");
const nextButton = document.getElementById("nextBtn");
const skipStatement = document.getElementById("skipStatement");
const seeResults = document.getElementById("checkResults");
const calcRes = document.getElementById("showResults")
const importantStatement = document.getElementById("important");
const filterSecular = document.getElementById("secular");
const filterAll = document.getElementById("all");
const filterBig = document.getElementById("big");
const agreeButton = document.getElementById("pro");
const neitherButton = document.getElementById("none");
const disagreeButton = document.getElementById("contra");
const uitslagen = document.getElementById("uitslagen");
const partijen = document.getElementById("partijen");
const buttons = document.getElementsByClassName("btn");
const home = document.getElementById("home");


home.onclick = returnHome;
startButton.onclick = clickStartBtn;
backBtn.onclick = previousStatement;
skipStatement.onclick = skipStatements;
calcRes.onclick = resultCalc;
filterSecular.onclick = getSecularParties;
filterAll.onclick = getAllParties;
filterBig.onclick = getBigParties;
agreeButton.onclick = (event) => {
    processAnswer("pro");
};
neitherButton.onclick = (event) => {
    processAnswer("none");
};
disagreeButton.onclick = (event) => {
    processAnswer("contra");
};



//show element
function show (element){
    element.classList.remove("hidden");
}

//hide element
function hide(element){
    element.classList.add("hidden");
}


//show subjects title and statement instead of default text
function clickStartBtn(){

    const container = document.getElementById("container");
    show(container);
    hide(startButton);
    show(choiceBtns);
    show(backBtn);
    hide(introHome);
    show(skipStatement);

    titleHeader.innerHTML = subjects[currentSubject].title;
    statementPara.innerHTML = subjects[currentSubject].statement;
    console.log(currentSubject);
}

// this function displays the title and the statement of the current subject
function displayStatament(){
    titleHeader.innerHTML = subjects[currentSubject].title;
    statementPara.innerHTML = subjects[currentSubject].statement;
    colorBtn();
}

//this function checks if subjects[currentSubject].myAnswer has a value, if true
// the class remember button will be removed on all buttons, then it will add
// the class remember button to a match between myAnswer and the id of the button
function colorBtn(){
    if(subjects[currentSubject].myAnswer){
        agreeButton.classList.remove("remember-btn");
        neitherButton.classList.remove("remember-btn");
        disagreeButton.classList.remove("remember-btn");
        document.getElementById(subjects[currentSubject].myAnswer).classList.add("remember-btn");
    }else{
        agreeButton.classList.remove("remember-btn");
        neitherButton.classList.remove("remember-btn");
        disagreeButton.classList.remove("remember-btn");
    }
}

// go to previous statement on button click
function previousStatement(){  
    currentSubject--
    if(currentSubject >=0){
        displayStatament();    
    }else {
        currentSubject ++
    }
    console.log(currentSubject);
}

// skip the question/statement
function skipStatements(){
    currentSubject++
    if(currentSubject < subjects.length){
        displayStatament();      
    }else {
        currentSubject--
        rememberChoice();
    }

    if ((subjects.length -1) == currentSubject){
        calculate();
        displayResultButtons();
        sortParties();
    }
    console.log(currentSubject);
}
 
function processAnswer(insert){
    choice(insert);
    if ((subjects.length -1) == currentSubject){
        calculate();
        displayResultButtons();
        sortParties();
    }else {
        currentSubject ++;
        displayStatament(); 
        rememberChoice();
    }
    console.log(currentSubject);
}

// this function creates an array which will be stored with your answers
/**
 * this function creates an array which will be stored with your answers.
 * 
 * @param {subjects[currentSubject].myAnswer} this is your answer on the current statement.
 */
function choice(insert){
    subjects[currentSubject].myAnswer = insert;
    subjects[currentSubject].important = importantStatement.checked;
    console.log(subjects[currentSubject].myAnswer);
}

// this function checks if the statement is set on "important"
function rememberChoice(){
    importantStatement.checked = false;

    if(subjects[currentSubject].important == true){
        importantStatement.checked = true;
    }
}


/**
 * this function compares your answer with the opinion on a statement of all parties.
 * If your opinion is the same as a party, that party gets 1 point, if you
 * selected the checkbox, every party with the same opinion gets 2 points
 * 
 */
function calculate(){

    subjects.forEach(subject => {
        subject.parties.forEach(partyPar =>{
            if(subject.myAnswer == partyPar.position){
                var scoreParty = parties.find(party => party.name == partyPar.name);
                if(subject.important == true) {
                    scoreParty.points+=2;
                }else {
                    scoreParty.points+=1;
                }
            }
        });      
    });
}

// this function filters all secular parties
function getSecularParties() {
    partyResults = [];

    filterAll.classList.remove("remember-btn");
    filterBig.classList.remove("remember-btn");
    filterSecular.classList.add("remember-btn");

    partyResults = parties.filter(party => {
        return party.secular == true;
    }); 
}


// this function selects all parties within the party array
function getAllParties() {
    partyResults = [];

    filterBig.classList.remove("remember-btn");
    filterSecular.classList.remove("remember-btn");
    filterAll.classList.add("remember-btn");

    partyResults = parties;
}

// this function selects all parties that are "big". This value is set within a var on row 4
function getBigParties() {
    partyResults = [];

    filterAll.classList.remove("remember-btn");
    filterSecular.classList.remove("remember-btn");
    filterBig.classList.add("remember-btn");

    partyResults = parties.filter(party => {
        return party.size >= partySize;
    });
}


// this function sorts the parties from highest points to lowest
function displayResultButtons(){
    hide(container);
    hide(skipStatement);
    hide(choiceBtns);
    show(seeResults);
    hide(backBtn);
}

function sortParties(){
    parties.sort(function (a, b) {
        return b.points - a.points;
    });
    console.log(parties);
}

// this function lets you choose between the 3 filter options and shows the result of the filtered parties
function resultCalc(){
    if(partyResults.length == 0) {
        return alert('Kies uit de drie onderstaande knoppen om je resultaat te zien');
    }

    hide(seeResults);
    show(uitslagen);
    hide(backBtn);
    displayPartyResults();
}

// this functions shows the results of the voting guide
function displayPartyResults(){
    partyResults.forEach(party => {
        var percentage = 100 / subjects.length * party.points;
        if (percentage > 100){
            var percentage = 100 / subjects.length * party.points / 2;
        }
        var p = percentage.toFixed(0);
            partijen.innerHTML+=party.name + " " + p + "%" + "</br>";      
    });
}


function returnHome(){
    location.reload();
}
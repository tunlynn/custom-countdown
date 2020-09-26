const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');
const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownButton = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const completeEl = document.getElementById('complete');
const completeInfo = document.getElementById('complete-info');
const completeButton = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

// Set Mininum Date for Date Picker with Today's Date
const today = new Date().toISOString().split('T')[0];
dateEl.min = today;

// Populate Countdown / Complete UI
function updateDom() {
    // Show Countdown
    countdownEl.hidden = false;
    // Hide Input
    inputContainer.hidden = true;
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        // If the countdown has ended, show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // Show the countdown in progress
            const days = Math.floor(distance / day);
            const hours = Math.floor((distance % day) / hour);
            const minutes = Math.floor((distance % hour) / minute);
            const seconds = Math.floor((distance % minute) / second);
            // Populate Countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
        }   
    }, second);
    
}

// Take Value from Form Inputs
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // Check for valid date
    if (countdownDate === '') {
        alert ('Please select a date for the countdown.');
    } else if (countdownTitle === '') {
        alert ('Please select a title for the countdown.');
    } else {
        // Get number version of current date, updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}
    
// Rest All Values
function reset() {
    // Hide Countdown, show Input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop the countdown
    clearInterval(countdownActive);
    countdownTitle = '';
    countdownDate = '';
    // Remove data from local storage
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // Get countdown from local storage if available
    if(localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}

// Event Listeners 
countdownForm.addEventListener('submit', updateCountdown);
countdownButton.addEventListener('click', reset);
completeButton.addEventListener('click', reset);

// On Load 
restorePreviousCountdown();
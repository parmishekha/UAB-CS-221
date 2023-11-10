document.getElementById('rock').addEventListener('click', () => playGame('rock'));
document.getElementById('paper').addEventListener('click', () => playGame('paper'));
document.getElementById('scissors').addEventListener('click', () => playGame('scissors'));

function playGame(userChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(userChoice, computerChoice);

    document.getElementById('result').innerText = `You chose ${userChoice}, Computer chose ${computerChoice}.\n${result}`;
}

function getComputerChoice() {
    const choices = ["rock", "paper", "scissors"];
    return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(user, computer) {
    if (user === computer) {
        return "It's a tie!";
    }
    if ((user === "rock" && computer === "scissors") || 
        (user === "scissors" && computer === "paper") || 
        (user === "paper" && computer === "rock")) {
        return "You win!";
    } else {
        return "Computer wins!";
    }
}

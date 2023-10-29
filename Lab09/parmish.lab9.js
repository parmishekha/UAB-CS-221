function playGame() {
    let userChoice = prompt("Enter your choice: Rock, Paper, or Scissors").toLowerCase();

    while (userChoice !== "rock" && userChoice !== "paper" && userChoice !== "scissors") {
        alert("Invalid choice! Please enter Rock, Paper, or Scissors.");
        userChoice = prompt("Enter your choice: Rock, Paper, or Scissors").toLowerCase();
    }

    const computerChoice = getComputerChoice();

    console.log(`User chose: ${userChoice}`);
    console.log(`Computer chose: ${computerChoice}`);

    const result = determineWinner(userChoice, computerChoice);
    console.log(result);

    const playAgain = confirm("Do you want to play again?");
    if (playAgain) {
        playGame();
    }
}

function getComputerChoice() {
    const choices = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function determineWinner(user, computer) {
    if (user === computer) {
        return "It's a tie!";
    }
    if ((user === "rock" && computer === "scissors") || 
        (user === "scissors" && computer === "paper") || 
        (user === "paper" && computer === "rock")) {
        return "User wins!";
    } else {
        return "Computer wins!";
    }
}

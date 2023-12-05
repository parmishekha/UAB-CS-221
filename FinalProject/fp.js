//Chat GPT prompt: "How do I save to local storage using javascript" This prompt provided two functions; saveToLocalStorage and getFromLocalStorage
function saveToLocalStorage(key, data) { //Saves data to the brower's local storage
    localStorage.setItem(key, JSON.stringify(data));  //Converts a javascript value to a JSON string https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
}

function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function logWorkout() { //Logs workouts based on user inputs
    const workoutType = document.getElementById('workoutType').value;  //Creates two constant variables that takes input field from the workoutType and workoutCount Ids
    const workoutCount = document.getElementById('workoutCount').value; 

    if (!workoutType || workoutCount === '') {
        alert("Please enter both workout type and count."); //Displays an error message if there aren't any inputs for workoutType and workoutCount
        return;
    }

    const workouts = getFromLocalStorage('workouts'); // Create a variable that reads into the local storage to see if there were any workouts
    workouts.push({ date: new Date().toLocaleDateString(), type: workoutType, count: workoutCount }); //Pushes a new workout entry w the date, type and count
    saveToLocalStorage('workouts', workouts); //Saves  the updated workout to local storage
    displayWorkouts(); //Displays the workouts
}

function displayWorkouts() {   //Function to display workouts 
    const workouts = getFromLocalStorage('workouts'); // Variable to access the list of workouts from the local storage
    const workoutLog = document.getElementById('workoutLog'); //Variable to manipulate the html id workoutLog to display
    workoutLog.innerHTML = workouts.map((w, index) => 
        `<p>${w.date}: ${w.type} - ${w.count}
         <button onclick="deleteWorkout(${index})">Delete</button>
         </p>`
    ).join('');
}
function deleteWorkout(index) { //Function to delete workouts
    let workouts = getFromLocalStorage('workouts');
    workouts.splice(index, 1); // Remove the workout at the specified index
    saveToLocalStorage('workouts', workouts);
    displayWorkouts(); // Updates the display
}

function setGoals() { //Function to set goals
    const goalInput = document.getElementById('goalType').value; //Variable Goal input is gets its value from the html ID goalType
    let goals = getFromLocalStorage('goals'); //Gets the existing goals from the local storage
    if (!Array.isArray(goals)) {  //If goals is not in an array
        goals = []; //Create an empty array for goals
    }
    goals.push({ date: new Date().toLocaleDateString(), goal: goalInput }); //Push a new goal entry with the date, 
    saveToLocalStorage('goals', goals); // Saves the array to the goals variable
    displayGoals(); //Calls display goals function
}

document.addEventListener('DOMContentLoaded', () => { //Event listener for the goal setting button
    const setGoalsButton = document.getElementById('setGoalsButton');
    if (setGoalsButton) {
        setGoalsButton.addEventListener('click', setGoals);
    }
    displayGoals();
});

function displayGoals() { //Function to display goals on the HTML doc
    const goals = getFromLocalStorage('goals') || []; //Variable to contain the list of goals from the local storage, or if none exists, create an empty array to store the goals
    const goalDisplay = document.getElementById('goalDisplay'); //It will be displayed on the html id goalDisplay
    goalDisplay.innerHTML = goals.map((entry, index) => `
        <p>${entry.date}: ${entry.goal} 
            <button onclick="deleteGoal(${index})">Delete</button>
        </p>
    `).join('');
}

function deleteGoal(index) { //Function to delete goals 
    let goals = getFromLocalStorage('goals'); //Gets the list of goals from the local storage
    goals.splice(index, 1); // Removes the goal at the specified index
    saveToLocalStorage('goals', goals); //Saves the updated goals (if there are any goals removed) to the local storage
    displayGoals(); 
}
/* Chat GPT prompt: "Create a function in javascript that gets its nutrition data from a public api.
The url to the api is https://api.api-ninjas.com/v1/nutrition and an additional function displayNutrition to display
the data from the API. The functions searchNutrition and displayNutrition listed below were the outputs from the prompt*/
function searchNutrition() {
    var query = document.getElementById('searchInput').value; // Get user input
    const url = 'https://api.api-ninjas.com/v1/nutrition?query=' + encodeURIComponent(query);
    const apiKey = 'Ymj8/tbtbVtRE7jrf28HLw==8jE8wPLDtYcIpVKT'; // Replace with your actual API key

    fetch(url, {
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayNutrition(data); // Function to handle the display of nutrition data
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}
function displayNutrition(data) {
    var foodListDiv = document.getElementById('foodList');
    foodListDiv.innerHTML = ''; // Clear previous results

    data.forEach(item => {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'food-item'; // Class for styling

        // Create detailed nutrition information
        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>Calories: ${item.calories.toFixed(2)} kcal</p>
            <p>Serving Size: ${item.serving_size_g.toFixed(2)}g</p>
            <p>Total Fat: ${item.fat_total_g.toFixed(2)}g (Saturated Fat: ${item.fat_saturated_g.toFixed(2)}g)</p>
            <p>Protein: ${item.protein_g.toFixed(2)}g</p>
            <p>Sodium: ${item.sodium_mg.toFixed(2)}mg</p>
            <p>Potassium: ${item.potassium_mg.toFixed(2)}mg</p>
            <p>Cholesterol: ${item.cholesterol_mg.toFixed(2)}mg</p>
            <p>Total Carbohydrates: ${item.carbohydrates_total_g.toFixed(2)}g (Fiber: ${item.fiber_g.toFixed(2)}g, Sugar: ${item.sugar_g.toFixed(2)}g)</p>
            <button class="add-to-tracker" onclick="addToTracker('${item.name}', ${item.calories})">Add to Tracker</button>
        `;

        foodListDiv.appendChild(itemDiv);
    });
}


let totalCalories = 0;
const calorieGoal = 2000; // Set your calorie goal. This is the average for most so it is set to 2k.

function addToTracker(foodName, calories) { //Function to add the food items to the tracker
    var nutritionLogDiv = document.getElementById('nutritionLog'); //It will be displayed on the html ID nutrition log

    // Update total calories
    totalCalories += calories; 
    updateTotalCaloriesDisplay(); //Calls the update total calorie display function

    // Add food item to the tracker
    let trackedItemDiv = document.createElement('div'); // the variable trackedItemDiv creates a new html element for tracked food items
    trackedItemDiv.className = 'tracked-item'; 
    trackedItemDiv.innerHTML = `<p>${foodName}: ${calories.toFixed(2)} kcal</p>`; //The inner html of the element will display the food name and calories
    nutritionLogDiv.appendChild(trackedItemDiv);  //Appends the element to the nutrition log
    updateChart(); //Calls on the updateChart function
}

function updateTotalCaloriesDisplay() {
    document.getElementById('totalCalories').innerText = `Total Calories: ${totalCalories.toFixed(2)} kcal`; //Updates the ID with total calories
}

function updateChart() { //Updates the calorie chart display
    const chart = document.getElementById('calorieChart'); //Gets the element representing the calorie chart
    const percentage = Math.min((totalCalories / calorieGoal) * 100, 100); // Calculates the percentage of calorie goal met
    chart.style.width = `${percentage}%`; //Updates the chart's width based on the calculated percentage above
    chart.innerText = percentage.toFixed(2) + '%'; 
}

document.getElementById('trackNutritionButton').addEventListener('click', searchNutrition);

/* Chat GPT Prompt:Write JavaScript code to create a function named prepareChartData that takes a 'weeklyData' object as a parameter. 
This function should prepare data for a bar chart, extracting labels, consumed data, and burnt data from the 'weeklyData' object. 
The function should return an object with 'labels' and 'datasets' properties. The 'datasets' property should contain two sets of data: one for 'Calories Consumed' and another for 'Calories Burnt,' each with specific styling.
Additionally, create a function named renderBarGraph that takes 'chartData' as a parameter.
 This function should render a bar graph using the 'Chart.js' library, displaying the 'Calories Consumed' and 'Calories Burnt' datasets on the 'progressChart' canvas. */
function prepareChartData(weeklyData) {
    const labels = Object.keys(weeklyData);
    const consumedData = labels.map(day => weeklyData[day].consumed);
    const burntData = labels.map(day => weeklyData[day].burnt);

    return {
        labels: labels,
        datasets: [
            {
                label: 'Calories Consumed',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                data: consumedData,
            },
            {
                label: 'Calories Burnt',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: burntData,
            }
        ]
    };
}

// Function to render the bar graph
function renderBarGraph(chartData) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function displayWeeklyProgress() { //Function to display the weekly progress using a bar graph
    const weeklyData = getWeeklyProgressData(); // Gets weekly progress data
    const chartData = prepareChartData(weeklyData); 
    renderBarGraph(chartData); //Calls the renderbargraph function on the page
}

document.addEventListener('DOMContentLoaded', displayWeeklyProgress);

function checkLoggedIn(page){ //Function to check if the user has filled out the user and password form
    if(localStorage.getItem("loggedIn") == true){ //If true, allows the users to access the other html files
        window.location.href = page;
    }
    else{
        alert("Try to login first!");
        window.location.href = "index.html"; //If not logged in, redirect to the log in page
    }
}
// DOM Elements
const categoryPage = document.getElementById("category-page");
const subcategoryPage = document.getElementById("subcategory-page");
const quizPage = document.getElementById("quiz-page");
const categoryList = document.getElementById("category-list");
const subcategoryList = document.getElementById("subcategory-list");
const subcategoryTitle = document.getElementById("subcategory-title");
const questionElement = document.getElementById("questions");
const answersBtnList = document.getElementById("answersBtnList");
const backToCategoriesButton = document.getElementById("back-to-categories");
const currentQuestionElement = document.getElementById("current-question");
const totalQuestionsElement = document.getElementById("total-questions");
const progressBar = document.getElementById("progress-bar");

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let selectedCategory = null;
let selectedSubcategory = null;
let quizData = [];
let userAnswers = []; // Track user's answers

// Available Categories and Subcategories
const categories = {
    geography: ["countries", "capitals", "landmarks"],
    science: ["biology", "chemistry", "physics", ],
    history: ["ancient_history", "historical_figures", ],
    pop_culture: ["movies", "tv_shows", ],
    literature: ["classic_literature", "modern_literature",],
    general_knowledge: ["current-affairs"]
};

// Function to Display Categories
function displayCategories() {
    for (const category in categories) {
        const button = document.createElement("button");
        button.textContent = category.toUpperCase();
        button.classList.add("w-full", "bg-gray-200", "hover:bg-gray-300", "text-gray-800", "font-semibold", "py-2", "px-4", "rounded", "transition", "duration-300", "ease-in-out", "transform", "hover:scale-105");
        button.addEventListener("click", () => selectCategory(category));
        categoryList.appendChild(button);
    }
}

// Function to Handle Category Selection
function selectCategory(category) {
    selectedCategory = category;
    categoryPage.classList.add("hidden");
    subcategoryPage.classList.remove("hidden");
    subcategoryTitle.textContent = `Choose a ${category.toUpperCase()} Subcategory`;
    displaySubcategories();
}

// Function to Display Subcategories
function displaySubcategories() {
    subcategoryList.innerHTML = ""; // Clear previous subcategories
    categories[selectedCategory].forEach(subcategory => {
        const button = document.createElement("button");
        button.textContent = subcategory.toUpperCase();
        button.classList.add("w-full", "bg-gray-200", "hover:bg-gray-300", "text-gray-800", "font-semibold", "py-2", "px-4", "rounded", "transition", "duration-300", "ease-in-out", "transform", "hover:scale-105");
        button.addEventListener("click", () => selectSubcategory(subcategory));
        subcategoryList.appendChild(button);
    });
}

// Function to Handle Subcategory Selection
async function selectSubcategory(subcategory) {
    selectedSubcategory = subcategory;
    try {
        const response = await fetch(`data/${selectedCategory}/${subcategory}.json`);
        quizData = await response.json();
        subcategoryPage.classList.add("hidden");
        quizPage.classList.remove("hidden");
        userAnswers = []; // Reset user answers
        currentQuestionIndex = 0; // Reset question index
        score = 0; // Reset score
        displayQuestion();
    } catch (error) {
        console.error("Error loading quiz data:", error);
    }
}

// Function to Display Question
function displayQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    // Update progress indicators
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    totalQuestionsElement.textContent = quizData.length;
    progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
    

    // Clear previous answer buttons
    answersBtnList.innerHTML = "";

    // Create buttons for each answer
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("w-full", "bg-gray-200", "hover:bg-gray-300", "text-gray-800", "font-semibold", "py-2", "px-4", "rounded", "transition", "duration-300", "ease-in-out", "transform", "hover:scale-105");
        button.addEventListener("click", () => selectAnswer(answer));
        answersBtnList.appendChild(button);
    });
}

// Function to Handle Answer Selection
function selectAnswer(selectedAnswer) {
    const currentQuestion = quizData[currentQuestionIndex];
    userAnswers.push(selectedAnswer); // Track user's answer

    if (selectedAnswer === currentQuestion.correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// Function to End the Quiz
function endQuiz() {
    questionElement.textContent = `Quiz Over! Your score is ${score} out of ${quizData.length}.`;
    answersBtnList.innerHTML = "";

    // Display results for each question
    quizData.forEach((question, index) => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("mb-4");

        // Display the question
        const questionText = document.createElement("p");
        questionText.textContent = `Q${index + 1}: ${question.question}`;
        questionText.classList.add("font-semibold", "text-gray-800");
        resultDiv.appendChild(questionText);

        // Display the user's answer
        const userAnswerText = document.createElement("p");
        userAnswerText.textContent = `Your Answer: ${userAnswers[index]}`;
        userAnswerText.classList.add(userAnswers[index] === question.correctAnswer ? "text-green-600" : "text-red-600", "font-medium");
        resultDiv.appendChild(userAnswerText);

        // Display the correct answer
        const correctAnswerText = document.createElement("p");
        correctAnswerText.textContent = `Correct Answer: ${question.correctAnswer}`;
        correctAnswerText.classList.add("text-green-600", "font-medium");
        resultDiv.appendChild(correctAnswerText);

        answersBtnList.appendChild(resultDiv);
    });

    // Add a "Restart Quiz" button
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Quiz";
    restartButton.classList.add("mt-6", "w-full", "bg-blue-600", "hover:bg-blue-700", "text-white", "font-bold", "py-2", "px-4", "rounded-full", "transition", "duration-300", "ease-in-out", "transform", "hover:scale-105");
    restartButton.addEventListener("click", restartQuiz);
    answersBtnList.appendChild(restartButton);
}

// Function to Restart the Quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = []; // Reset user answers
    quizPage.classList.add("hidden");
    categoryPage.classList.remove("hidden");
    progressBar.style.width = "0%"; // Reset progress bar
    currentQuestionElement.textContent = "1"; // Reset question counter
    answersBtnList.innerHTML = "";
}

// Event Listener for Back to Categories Button
backToCategoriesButton.addEventListener("click", () => {
    subcategoryPage.classList.add("hidden");
    categoryPage.classList.remove("hidden");
});

// Initialize Quiz App
displayCategories();
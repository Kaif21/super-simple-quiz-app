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
    geography: ["countries", "capitals", "landmarks", "rivers", "mountains", "continents", "flags", "cities", "deserts", "oceans"],
    science: ["biology", "chemistry", "physics", "astronomy", "earth science", "environmental science", "medicine", "zoology", "botany", "genetics"],
    history: ["ancient history", "world wars", "historical figures", "revolutions", "empires", "medieval history", "modern history", "archaeology", "inventions", "explorers"],
    pop_culture: ["movies", "tv shows", "music", "celebrities", "comics", "video games", "anime", "internet memes", "fashion", "awards"],
    literature: ["classic literature", "modern literature", "poetry", "authors", "book quotes", "fictional characters", "genres", "nobel prize winners", "best sellers", "mythology"],
    sports: ["football", "basketball", "cricket", "tennis", "olympics", "world cup", "athletics", "golf", "rugby", "extreme sports"],
    technology: ["computers", "programming", "gadgets", "artificial intelligence", "space technology", "internet", "robotics", "cybersecurity", "blockchain", "video games"],
    food_and_drink: ["cuisines", "recipes", "beverages", "desserts", "street food", "fine dining", "fast food", "healthy eating", "alcoholic drinks", "food history"],
    art_and_design: ["painting", "sculpture", "architecture", "photography", "graphic design", "fashion design", "modern art", "classical art", "art movements", "famous artists"],
    mathematics: ["algebra", "geometry", "calculus", "statistics", "trigonometry", "number theory", "probability", "puzzles", "famous mathematicians", "math history"],
    mythology: ["greek mythology", "norse mythology", "egyptian mythology", "hindu mythology", "celtic mythology", "mythical creatures", "gods and goddesses", "folklore", "legends", "fairy tales"],
    religion: ["christianity", "islam", "hinduism", "buddhism", "judaism", "sikhism", "taoism", "shinto", "religious festivals", "sacred texts"],
    entertainment: ["movies", "tv shows", "music", "theater", "stand-up comedy", "magic", "circus", "dance", "opera", "reality shows"],
    lifestyle: ["travel", "fitness", "health", "beauty", "home decor", "gardening", "pets", "hobbies", "self-improvement", "minimalism"],
    business: ["entrepreneurship", "marketing", "finance", "economics", "startups", "management", "investing", "stock market", "leadership", "business history"],
    education: ["languages", "science", "history", "mathematics", "literature", "philosophy", "psychology", "engineering", "medicine", "law"],
    nature: ["animals", "plants", "ecosystems", "weather", "climate change", "geology", "oceans", "forests", "mountains", "national parks"],
    trivia: ["random facts", "world records", "fun facts", "historical trivia", "science trivia", "pop culture trivia", "sports trivia", "geography trivia", "literature trivia", "movie trivia"],
    personality: ["what character are you?", "what career suits you?", "what food are you?", "what country should you live in?", "what era do you belong to?", "what superpower do you have?", "what animal are you?", "what movie genre are you?", "what song defines you?", "what is your personality type?"],
    seasonal: ["christmas", "halloween", "easter", "new year", "valentine's day", "thanksgiving", "independence day", "holiday traditions", "festivals around the world", "seasonal recipes"],
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
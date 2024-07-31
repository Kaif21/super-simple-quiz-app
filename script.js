const questionList =[
    {
        question: "Which is the largest animal in the world",
        answers:[
            {text: "shark", correct: false},
            {text: "Blue Whale", correct: false},
            {text: "Elephant", correct: true},
            {text: "Giraffe", correct: false},
        ]
    },
    {
        question: "Which is the long animal in the world",
        answers:[
            {text: "dog", correct: false},
            {text: "cow", correct: false},
            {text: "Elephant", correct: false},
            {text: "godzila", correct: true},
        ]
    }
]

const questionElement = document.getElementById("questions")
const answerIdElement = document.getElementById("answersBtnList")
const nextBtn = document.getElementById("next-btn")

let currentQuestionIndex = 0 
let score = 0

function startQuiz(){
    currentQuestionIndex = 0 
    score = 0
    nextBtn.innerHTML = "Next"
    showQuestion()
}

function showQuestion(){
    // reset the quiz
    reset()
    // questions
    let currentQuestion =  questionList[currentQuestionIndex]
    let questionNo = currentQuestionIndex + 1
    questionElement.innerHTML = questionNo + "." + currentQuestion.question

    //answerIdElemet
    currentQuestion.answers.forEach(answers => {
        const answerBtnElement = document.createElement("button")
        answerBtnElement.innerHTML = answers.text
        answerBtnElement.classList.add("w-full", "text-left", "bg-gray-100", "hover:bg-gray-200", "py-2", "px-4", "rounded", "transition", "duration-300", "ease-in-out")
        answerIdElement.appendChild(answerBtnElement)
        if(answers.correct){
            answerBtnElement.dataset.correct = answers.correct
        }
        answerBtnElement.addEventListener("click", selectAnswer)
    })
}
function reset(){
    nextBtn.style.display="none"
    while(answerIdElement.firstChild){
        answerIdElement.removeChild(answerIdElement.firstChild)
    }
}
function selectAnswer(e){
    const selectedBtn = e.target
    const isCorrect = selectedBtn.dataset.correct === "true"
    if (isCorrect){
        selectedBtn.classList.remove("bg-gray-100", "hover:bg-gray-200")
        selectedBtn.classList.add("bg-green-500", "text-white")
        score++
    }else{
        selectedBtn.classList.remove("bg-gray-100", "hover:bg-gray-200")
        selectedBtn.classList.add("bg-red-500", "text-white")
    }
    Array.from(answerIdElement.children).forEach(button =>{
        if (button.dataset.correct === "true"){
            button.classList.remove("bg-gray-100", "hover:bg-gray-200")
            button.classList.add("bg-green-500", "text-white")
        }
        button.disabled = true
    })
    nextBtn.style.display = "block"
}

function showScore(){
    reset()
    questionElement.innerHTML = ` You have got ${score} out of ${questionList.length}`
    nextBtn.innerHTML = "Start again"
    nextBtn.style.display = "block"
}
function handleNextBtn(){
    currentQuestionIndex++
    if (currentQuestionIndex < questionList.length){
        showQuestion()
    }else{
        showScore()
    }
}

nextBtn.addEventListener("click",()=>{
    if(currentQuestionIndex < questionList.length){
        handleNextBtn()
    }else{
        startQuiz()
    }
})

startQuiz(); 
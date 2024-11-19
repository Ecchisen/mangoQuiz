function startQuiz(subject, numQuestions, timeLimit) {
    const quizContainer = document.getElementById("quiz-container");
    const timerElement = document.getElementById("timer");

    fetch("./data/questions.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load questions: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            const subjectQuestions = data[subject];
            if (!subjectQuestions || subjectQuestions.length === 0) {
                alert("No questions available for this subject!");
                return;
            }

            const selectedQuestions = shuffleArray(subjectQuestions).slice(0, numQuestions);

            // Initialize quiz variables
            let currentQuestionIndex = 0;
            let score = 0;

            // Show quiz container
            quizContainer.style.display = "block";

            // Render the first question
            renderQuestion(selectedQuestions, currentQuestionIndex, score, timeLimit, timerElement);

            // Start timer if time limit is set
            if (timeLimit !== null) {
                startTimer(timeLimit * 60, timerElement, () => {
                    alert("Time's up!");
                    displayResults(score, selectedQuestions.length);
                });
            }
        })
        .catch((error) => {
            console.error("Error loading questions:", error);
            alert("There was an error loading the questions. Please try again later.");
        });
}

function startTimer(duration, timerElement, onTimeUp) {
    let timeRemaining = duration;

    const timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        timerElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, "0")}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            onTimeUp();
        }

        timeRemaining--;
    }, 1000);
}

function renderQuestion(questions, currentIndex, score, timeLimit, timerElement) {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "";

    if (currentIndex >= questions.length) {
        // Quiz complete
        displayResults(score, questions.length, questions);
        return;
    }

    const question = questions[currentIndex];

    // Create question element
    const questionElement = document.createElement("div");
    questionElement.classList.add("question");
    questionElement.textContent = question.question;

    // Create answers container
    const answersContainer = document.createElement("div");
    answersContainer.classList.add("answers");

    question.answers.forEach((answer, index) => {
        const answerButton = document.createElement("button");
        answerButton.textContent = answer;
        answerButton.classList.add("answer-btn");

        // Check the answer when clicked
        answerButton.addEventListener("click", () => {
            if (index === question.correct) {
                score++;
                answerButton.classList.add("correct");
            } else {
                answerButton.classList.add("incorrect");
                // Highlight the correct answer
                Array.from(answersContainer.children).forEach((btn, i) => {
                    if (i === question.correct) {
                        btn.classList.add("correct");
                    }
                });
            }

            setTimeout(() => {
                renderQuestion(questions, currentIndex + 1, score, timeLimit, timerElement);
            }, 1000);
        });

        answersContainer.appendChild(answerButton);
    });

    // Append question and answers to the container
    quizContainer.appendChild(questionElement);
    quizContainer.appendChild(answersContainer);
}

function displayResults(score, totalQuestions, questions) {
    const quizContainer = document.getElementById("quiz-container");
    const timerElement = document.getElementById("timer");

    // Hide timer
    timerElement.style.display = "none";

    // Display score
    const resultsHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your Score: ${score}/${totalQuestions}</p>
        <h3>Review of Questions:</h3>
    `;

    // Generate review cards for all questions
    const reviewCards = questions.map((question, index) => {
        const correctAnswer = question.answers[question.correct];
        return `
            <div class="review-card">
                <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                <p><strong>Correct Answer:</strong> ${correctAnswer}</p>
            </div>
        `;
    }).join("");

    quizContainer.innerHTML = resultsHTML + reviewCards;
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

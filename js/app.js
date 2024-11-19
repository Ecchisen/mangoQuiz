document.addEventListener("DOMContentLoaded", () => {
    const subjectSections = document.querySelectorAll(".subject");
    const settingsDialog = document.getElementById("settings-dialog");
    const startQuizBtn = document.getElementById("start-quiz");
    const cancelSettingsBtn = document.getElementById("cancel-settings");

    let selectedSubject = "";

    // Show the settings dialog when a subject is clicked
    subjectSections.forEach((section) => {
        section.addEventListener("click", () => {
            selectedSubject = section.dataset.subject;
            console.log(`Selected subject: ${selectedSubject}`);
            settingsDialog.style.display = "block"; // Show dialog
        });
    });

    // Start Quiz button handler
    startQuizBtn.addEventListener("click", () => {
        const numQuestions = parseInt(document.getElementById("num-questions").value, 10);
        const infiniteTime = document.getElementById("infinite-time").checked;
        const timeLimit = infiniteTime ? null : parseInt(document.getElementById("time-limit").value, 10);

        if (isNaN(numQuestions) || numQuestions <= 0) {
            alert("Please enter a valid number of questions.");
            return;
        }
        if (!infiniteTime && (isNaN(timeLimit) || timeLimit <= 0)) {
            alert("Please enter a valid time limit or select 'Infinite Time'.");
            return;
        }

        settingsDialog.style.display = "none"; // Hide dialog

        // Pass data to quiz.js
        startQuiz(selectedSubject, numQuestions, timeLimit);
    });

    // Cancel button handler
    cancelSettingsBtn.addEventListener("click", () => {
        settingsDialog.style.display = "none"; // Hide dialog
    });
});

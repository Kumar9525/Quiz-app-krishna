document.addEventListener("DOMContentLoaded", function () {
  let quizData = null;
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      quizData = data;
      initSections();
    });
  document.getElementById("think-img").style.display = "none";
  function initSections() {
    let sections = document.querySelectorAll(".section");
    sections.forEach((sections) => {
      sections.addEventListener("click", () => {
        let sectionNumber = parseInt(sections.getAttribute("data-section"));
        startQuiz(sectionNumber);
      });
    });
  }

  function startQuiz(index) {
    const currentQuestions = quizData.sections[index].questions;
    let currentQuestionIndex = 0;
    let score = 0;
    let answerSelected = false;

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
    document.querySelector(".left-text").style.display = "none";
    document.querySelector(".title-box").style.display = "none";
    document.getElementById("think-img").style.display = "block";
    document.getElementById("question-container").innerHTML = `
       <p id="score">Score: 0</p>
       <div id="question"></div>
       <div id="options"></div>
       <button id = "next-button">Next</button>
       `;

    showQuestion();

    function showQuestion() {
      const question = currentQuestions[currentQuestionIndex];
      const questionElement = document.getElementById("question");
      const optionsElement = document.getElementById("options");

      questionElement.textContent = question.question;
      optionsElement.innerHTML = "";

      if (question.questionType === "mcq") {
        question.options.forEach((option) => {
          const optionElement = document.createElement("div");
          optionElement.textContent = option;
          optionElement.addEventListener("click", function () {
            if (!answerSelected) {
              answerSelected = true;
              optionElement.classList.add("selected");
              checkAnswer(option, question.answer);
              console.log("selected", option);
            }
          });
          optionsElement.appendChild(optionElement);
        });
      }
      else if (question.questionType === 'bool') {
        question.options.forEach((option) => {
          const optionElement = document.createElement('button');
          optionElement.textContent = option;
          optionElement.classList.add('custom-button');
          optionElement.addEventListener("click", function () {
            if (!answerSelected) {
              answerSelected = true;
              checkAnswer(option, question.answer);
              optionElement.style.backgroundColor = "#00008B";
              optionElement.style.color = "white";
              optionElement.style.border = "1px solid white";
            }
          });
          optionsElement.appendChild(optionElement);
        });
      }

      else {
        const inputElement = document.createElement("input");
        inputElement.type =
          question.questionType === "number" ? "number" : "text";
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit Answer";
        submitButton.className = "submit-answer";
        inputElement.style.fontSize = "30px";
        inputElement.style.fontWeight = "600";

        submitButton.onclick = () => {
          if (!answerSelected) {
            answerSelected = true;

            checkAnswer(
              inputElement.value.toString(),
              question.answer.toString()
            );
          }
        };
        optionsElement.appendChild(inputElement);
        optionsElement.appendChild(submitButton);
      }


      function checkAnswer(givenAnswer, correctAnswer) {
        const feedbackElement = document.createElement("div");
        feedbackElement.id = "feedback";
        if (
          givenAnswer === correctAnswer ||
          correctAnswer.toLowerCase() === givenAnswer.toLowerCase()
        ) {
          score++;

          feedbackElement.textContent = "Correct!";
          feedbackElement.style.color = "green";
          feedbackElement.style.fontWeight = "800";
          feedbackElement.style.fontSize = "34px";
          feedbackElement.style.textShadow = "1px 1px #fff,-1px 1px #fff,1px -1px #fff,-1px -1px #fff";
        } else {
          feedbackElement.textContent = `Wrong. Correct answer: ${correctAnswer}`;
          feedbackElement.style.color = "#810000";
          feedbackElement.style.fontWeight = "800";
          feedbackElement.style.fontSize = "34px";
          feedbackElement.style.textShadow = "1px 1px #fff,-1px 1px #fff,1px -1px #fff,-1px -1px #fff";
        }
        const optionElement = document.getElementById("options");
        optionElement.appendChild(feedbackElement);
        updateScore();
      }

      function updateScore() {
        document.getElementById("score").textContent = "Score: " + score;
      }
    }
    function endQuiz() {
      let questionContainer = document.getElementById("question-container");
      let quizContainer = document.getElementById("quiz-container");
      let titleBox = document.querySelector(".title-box");
      let letfText = document.querySelector(".left-text");
      document.getElementById("think-img").style.display = "none";

      questionContainer.innerHTML = `
      <div class = "quiz-end">
            <h1 class="quiz-completed-msg">Quiz Completed!</h1>
            <p>Your final Score: ${score}/${currentQuestions.length}</p>
            <button id="home-button">Go to Home</button><br>
            <img src="end.gif" alt ="image can't find">
        
        </div>    `;
      document
        .getElementById("home-button")
        .addEventListener("click", function () {
          quizContainer.style.display = "grid";
          titleBox.style.display = "block";
          letfText.style.display = "block";
          questionContainer.style.display = "none";
        });
    }

    document.getElementById("next-button").addEventListener("click", () => {
      if (currentQuestionIndex == currentQuestions.length - 1) {
        console.log("quiz is over !!");
        endQuiz();
      } else {
        answerSelected = false;
        currentQuestionIndex++;
        showQuestion();
      }
    });
  }
});

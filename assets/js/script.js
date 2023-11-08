let Start = document.getElementById("start-btn");
/*let next = document.getElementById("next-btn");*/
let questionBox =  document.getElementById("question-box");
let questionCard = document.getElementById("question");
let answerButtons = document.getElementById("answer-btn");
let results = document.getElementById("results");
let score = 0;
let incorrect = 0;
let gameStarted = false;
let replayMenu = document.getElementById("replay-menu");
let PlayAgain = document.getElementById("play-again-btn");
let title = document.getElementById("title");
/*let Quit = document.getElementById("quit-btn");*/

let shuffleQuestions, currentQuestionIndex;


/*next.addEventListener("click", nextCard);*/

function checkPage() {
  if(document.title === "Quiz Homepage") {
    document.getElementById("home-start-btn").addEventListener("click", function() {
      document.getElementById("homepage").classList.add("hide");
      document.getElementById("quiz").classList.remove("hide");
    });
  }
  else
  {
    document.getElementById("start-btn").addEventListener("click", function() {
      document.getElementById("quiz").classList.remove("hide");
    })
  }
}

checkPage();

  replayMenu.style.display = "none";

  function nextCard(){
    resetState();

    if ( incorrect >= 3) {
      gameOver();
    }
     else if (currentQuestionIndex < questions.length) {
      
      showQuestion(shuffleQuestions[currentQuestionIndex]);
    }
    else
    {
      showResult();
      startGame();
  }
}

/**
 * This function is responisble for displaying the progressbar
 */

function progressBar(currentQuestionIndex, totalQuestions) {// This function is inspired by https://www.w3schools.com/howto/howto_js_progressbar.asp
  let progress = Math.round((currentQuestionIndex / totalQuestions) * 100);
  let elem = document.getElementById("my-bar");
  elem.style.width = progress + "%";
  elem.innerHTML = progress + "%";
}
  /**
   * This function will start the quiz, and show 15 Questions out of a pool of 40 questions in randomised order.
   */
  
  function startGame(){

    let playerName = prompt("Please enter your name:");

    if (playerName != null && playerName != '') {
      
      Start.classList.add("hide");
      
      //Shuffle questions and select 15 questions
      shuffleQuestions = questions.sort(() => Math.random() - 0.5);
      let selectedQuestions = shuffleQuestions.slice(0, 15);
      
      //use selected questions in the quiz
      shuffleQuestions = selectedQuestions;
      
      currentQuestionIndex = 0;
      questionBox.classList.remove("hide");
      document.getElementById("counter").style.display = "block"; // show the counter
      nextCard();
    }
    showQuestion(shuffleQuestions[currentQuestionIndex]);

    document.getElementById("progress-bar").style.visibility = "visible";
    document.getElementById("mute-btn").style.display = "block";

    gameSound.play();
  }
  
  /**
   * This function will listen to clicking the start button. 
   * When a player clicks the button the question Cards with all theire elements get displayed.
   */
let gameSound = document.getElementById("audio");
let correctSound = document.getElementById("correct");
let wrongSound = document.getElementById("wrong")

  Start.addEventListener("click", function() {
      startGame();
      gameStarted = true;
      score = 0;
      incorrect = 0;
      document.getElementById("score").textContent = score;
      document.getElementById("incorrect").textContent = incorrect;
      document.querySelector(".score-area").classList.remove("hide");
      document.getElementById("start-btn").style.visibility = "hidden"; //Hide start button after initialy clicked

      document.getElementById("mute-btn").addEventListener("click", function () {
        gameSound.muted = !gameSound.muted;
        wrongSound.muted = !wrongSound.muted;
        correctSound.muted = !correctSound.muted;
        this.textContent = gameSound.muted ? "Unmute" : "Mute";
        this.textContent = wrongSound.muted ? "Unmute" : "Mute";
        this.textContent = correctSound.muted ? "Unmute" : "Mute";
      }); 
    });
    
    /**
     * 
     * This function is responsible for displaying a question and its corresponding answer options to the user. 
     */

    function showQuestion(question) {
      
      questionCard.innerText = question.question;
      answerButtons.innerHTML = "";

      question.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.classList.add("btn");
        button.innerText = answer;

        button.dataset.answer = index;

        button.addEventListener("click", () => checkAnswer(index));

        answerButtons.appendChild(button);
    });

    //update the counter
    document.getElementById("counter").textContent = (currentQuestionIndex + 1) + "/" + questions.length;
    
    progressBar(currentQuestionIndex, shuffleQuestions.length);
  }

/**
 * This function will remove all child nodes from a specific element in the Document Object Model (DOM). 
 */

  function resetState(){

    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
    /*next.classList.remove("hide");*/
  }

/**
 * 
 * This function check the selected Answer of the Player and mark the background of correct answers green and incorrect red. 
 * If the Player select the wrong answer the correct answer get highlighted with green as well, to show the user the correct answer as well. 
 * the number 1000 at the end of the function, will display the next card after selecting the answer within a timeframe of 1000ms
 */

 

  function checkAnswer(selectedIndex) {
    
    const correctIndex = questions[currentQuestionIndex].correctAnswer;
    const buttons = answerButtons.getElementsByTagName("button");
  
    if (selectedIndex === correctIndex) {
      buttons[selectedIndex].style.backgroundColor = "green";
      score++;
      document.getElementById("score").textContent = score;

      correctSound.play();
      gameSound.play();
    } 
    else if (selectedIndex !== correctIndex)
    {
      buttons[selectedIndex].style.backgroundColor = "red";
      incorrect++;
      document.getElementById("incorrect").textContent = incorrect;
      wrongSound.play();
      gameSound.pause();

      //Highlight correct answer in green
      buttons[correctIndex].style.backgroundColor = "green";

      setTimeout(function() {
        gameSound.play();
      },1500);
    } 
    
    for (const button of buttons) {
      button.disabled = true;
    }
  
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        nextCard();
      } else 
      {
        showResult();
      }
    }, 1500);
    
    progressBar(currentQuestionIndex, shuffleQuestions.length);
}

/**
 * This function show a "Quiz Finished" message when quiz got completed and resets the game and it's counters.
 */

function showResult(){
    questionCard.innerText = "Quiz Finished!";
    resetState();
    reset(score, incorrect);
  }

  /**
 * This function resets the correct and incorrect answers counter, when game is completed or lost 
 */

  function reset() {
    incorrect = 0;
    score = 0;
    document.getElementById("score").textContent = score;
    document.getElementById("incorrect").textContent = incorrect;
  }

  /**
 * This function defines that the game will end and the Player will lose when he answers three times incorrectly
 */

  function gameOver() {
    if(incorrect === 3) {
        alert("Game Over, you were three times wrong!");
        resetState();
        reset(incorrect, score);
        replayMenu.style.display = "block"; //show replay menu
        title.classList.add("hide");
        gameSound.pause();
        questionBox.classList.add("hide");//hide question cards
    }
    // Hide mute button again
    document.getElementById("mute-btn").style.display = "none";
  }

  document.getElementById("play-again-btn").addEventListener("click", () => {
    replayMenu.style.display = "none";
    gameStarted = flase;
  });

  /*document.getElementById("quit-btn").addEventListener("click", () => {
    replayMenu.style.display = "none";
  });*/

  let questions = [
    {
    question: "What is JavaScript primarily used for?",
    answers: [
        "Data analysis",
        "Server administration",
        "Adding interactivity to websites",
        "Video editing"
    ],
    correctAnswer: 2,
    wrongAnswer: [1, 0, 3]
},
{
    question: "Which of the following is not a JavaScript data type?",
    answers: [
        "Number",
        "String",
        "Boolean",
        "Float"
    ],
    correctAnswer: 3,
    wrongAnswer: [0, 2, 1]
},
{
    question: "What does the 'DOM' stand for in JavaScript?",
    answers: [
        "Document Object Model",
        "Data Object Model",
        "Document Order Model",
        "Document of Manipulation"
    ],
    correctAnswer: 0,
    wrongAnswer: [1, 2, 3]
},
{
    question: "What is the correct way to define a variable in JavaScript with a global Scope?",
    answers: [
        "let",
        "const",
        "var",
        "int"
    ],
    correctAnswer: 1,
    wrongAnswer: [0, 2, 3]
},
{
    question: "Which of the following JavaScript frameworks is used for building user interfaces?",
    answers: [
        "JQuery",
        "Mongoose",
        "Express",
        "React"
    ],
    correctAnswer: 3,
    wrongAnswer: [1, 2, 0]
},
{
    question: "What is the purpose of the 'if' statement in JavaScript?",
    answers: [
        "Loop through an array",
        "Declare a function",
        "Make decisions in your code",
        "Create a class"
    ],
    correctAnswer: 2,
    wrongAnswer: [1, 0, 3]
},
{
    question: "What method is used to add a new element to the end of an array in JavaScript?",
    answers: [
        "append()",
        "push()",
        "insert()",
        "add()"
    ],
    correctAnswer: 1,
    wrongAnswer: [0, 2, 3]
},
{
    question: "Which JavaScript function is used to perform an action after a specific time interval?",
    answers: [
        "setTimer()",
        "delay()",
        "setInterval()",
        "wait"
    ],
    correctAnswer: 2,
    wrongAnswer: [0, 1, 3]
},
{
    question: "What is the correct way to write a comment in JavaScript?",
    answers: [
        "//This is a comment",
        "<!--This is a comment-->",
        "++This is a comment++",
        "**This is a comment**"
    ],
    correctAnswer: 0,
    wrongAnswer: [1, 2, 3]
},
    {
        question: "What is the purpose of the 'this' keyword in JavaScript?",
        answers: [
            "Refers to the previous function",
            "Refers to a specific HTML element",
            "Refers to the current object",
            "Refers to a global variable"
        ],
        correctAnswer: 2,
        wrongAnswer: [0, 1, 3]
},
{
  question: "Who invented Javascript?",
  answers: [//Question 11
      "Brenden Elch",
      "Hakon Wium Lie",
      "Tim Berners-Lee",
      "Guido van Rossum"
  ],
  correctAnswer: 0,
  wrongAnswer: [2, 1, 3]
},
{
  question: "What does the getAttribute()?",
  answers: [ //Question 12
      "Checks if element node has a specified attribute?",
      "sets the value of an attribute?",
      "gets the value of an attribute?",
      "removes an attribute from an element node?"
  ],
  correctAnswer: 2,
  wrongAnswer: [0, 1, 3]
},
{
  question: "What is the basic difference between JavaScript and Java?",
  answers: [ //Question 13
      "Functions are considered as fields",
      "Java is a compiled language and runs in a Java Virtual Machine, while JavaScript is an interpreted language and is used for creating interactive websites.",
      "Functions are values, and there is no hard distinction between methods and fields",
      "Variables are specific"
  ],
  correctAnswer: 1,
  wrongAnswer: [2, 0, 3]
},
{
  question: "Which of the following scoping type does JavaScript use??",
  answers: [ //Question 14
      "Sequential",
      "Segmental",
      "Lexical",
      "Literal"
  ],
  correctAnswer: 1,
  wrongAnswer: [0, 2, 3]
},
  {
    question: "What is a closure in JavaScript?",
    answers: [ //Question 15
        "A function that has access to its own scope, the outer function's scope, and the global scope",
        "A function that can be stored in a variable",
        "A function that cannot access variables from other functions",
        "A function that can only access its own variables"
    ],
    correctAnswer: 0,
    wrongAnswer: [2, 1, 3] 
  },
  {
    question: "Which of the following is the property that is triggered in response to JS errors?",
    answers: [ //Question 16
        "onclick",
        "onerror",
        "onmessage",
        "onexeption"
    ],
    correctAnswer: 1,
    wrongAnswer: [2, 1, 3]
  },
  {
    question: "Which of the following is not a framework?",
    answers: [ //Question 17
        "JavaScript .NET",
        "JavaScript",
        "CocoaJS",
        "JQuery"
    ],
    correctAnswer: 1,
    wrongAnswer: [2, 1, 3]
},
{
  question: "What is the purpose of the 'this' keyword in JavaScript?",
  answers: [ //Question 18
      "Refers to the previous function",
      "Refers to a specific HTML element",
      "Refers to the current object",
      "Refers to a global variable"
  ],
  correctAnswer: 2,
  wrongAnswer: [0, 1, 3]
},
{
  question: "Why event handlers is needed in JS?",
  answers: [ // Question 19
      "Allows JavaScript code to alter the behaviour of windows",
      "Adds innerHTML page to the code",
      "Change the server location",
      "Performs handling of exceptions and occurrences"
  ],
  correctAnswer: 0,
  wrongAnswer: [2, 1, 3]
},
{
  question: "What is the prototype represents in the following JavaScript code snippet?: function javascript() {}",
  answers: [ // Question 20
      "Not valid",
      "Prototype of a function",
      "Function javascript",
      "A custom constructor"
  ],
  correctAnswer: 3,
  wrongAnswer: [0, 1, 2]
},
{
  question: "What will be the result or type of error if p is not defined in the following JavaScript code snippet?: console.log(p)",
  answers: [ // Question 21
      "Value not found Error",
      "Reference Error",
      "Null",
      "Zero"
  ],
  correctAnswer: 1,
  wrongAnswer: [0, 2, 3]
},
{
  question: "Which of the following methods/operation does javascript use instead of == and !=?",
  answers: [ // Question 22
      "JavaScript uses equalto()",
      "JavaScript uses equals() and notequals() instead",
      "JavaScript uses bitwise checking",
      "javaScriptuses === and !== instead"
  ],
  correctAnswer: 3,
  wrongAnswer: [0, 1, 2]
},
{
  question: "Why JavaScript Engine is needed?",
  answers: [ //Question 23
      "Both Compiling & Interpreting the JavaScript",
      "Parsing the JavaScript",
      "Interpreting the JavaScript",
      "Compiling the JavaScript"
  ],
  correctAnswer: 2,
  wrongAnswer: [0, 1, 3]
},
{
  question: "What is the purpose of the 'this' keyword in JavaScript?",
  answers: [ // Question 24
      "Refers to the previous function",
      "Refers to a specific HTML element",
      "Refers to the current object",
      "Refers to a global variable"
  ],
  correctAnswer: 2,
  wrongAnswer: [0, 1, 3]
},
{
  question: " What is the basic difference between JavaScript and Java?",
  answers: [ //Question 25
      "Functions are considered as fields",
      "Functions are values, and there is no hard distinction between methods and fields",
      "Variables are specific",
      "There is no difference"
  ],
  correctAnswer: 1,
  wrongAnswer: [0, 2, 3]
},
{
  question: "Which of the following explains correctly what happens when a JavaScript program is developed on a Unix Machine?",
  answers: [ //Question 26
      "will work perfectly well on a Windows Machine",
      "will be displayed as JavaScript text on the browser",
      "will throw errors and exceptions",
      "must be restricted to a Unix Machine only"
  ],
  correctAnswer: 0,
  wrongAnswer: [2, 1, 3]
},
{
  question: " Which of the following can be used to call a JavaScript Code Snippet?",
  answers: [ //Question 27
      "Function/Method",
      "Preprocessor",
      "Triggering Event",
      "RMI"
  ],
  correctAnswer: 0,
  wrongAnswer: [2, 1, 3]
},
{
  question: "Which of the following object is the main entry point to all client-side JavaScript features and APIs?",
  answers: [ //Question 28
      "Position",
      "Window",
      "Standard",
      "Location"
  ],
  correctAnswer: 1,
  wrongAnswer: [0, 2, 3]
},
{
  question: " Where is Client-side JavaScript code is embedded within HTML documents?",
  answers: [ //Question 29
      "A URL that uses the special javascript: code",
      "A URL that uses the special javascript: protocol",
      "A URL that uses the special javascript: encoding",
      "A URL that uses the special javascript: stack"
  ],
  correctAnswer: 1,
  wrongAnswer: [0, 2, 3]
},
{
  question: "Arrays in JavaScript are defined by which of the following statements?",
  answers: [ //Question 30
      "It is an ordered list of values",
      "It is an ordered list of objects",
      "It is an ordered list of string",
      "It is an ordered list of functions"
  ],
  correctAnswer: 0,
  wrongAnswer: [2, 1, 3]
},
{
  question: "Among the given statements, which statement defines closures in JavaScript?",
  answers: [ //Question 31
      "JavaScript is a function that is enclosed with references to its inner function scope",
      "JavaScript is a function that is enclosed with references to its lexical environment",
      "JavaScript is a function that is enclosed with the object to its inner function scope",
      "None of the mentioned"
  ],
  correctAnswer: 1,
  wrongAnswer: [0, 2, 3]
},
  {
    question: "What does var stand for in JavaScript?",
    answers: [ //Question 32
        "Variable",
        "Very large",
        "Varying",
        "Variable and not reassigned"
    ],
    correctAnswer: 0,
    wrongAnswer: [1, 2, 3]
  },
  {
    question: "What is the correct way to write a JavaScript array?",
    answers: [ //Question 33
        'var colors = "red", "green", "blue";',
        'var colors = ["red", "green", "blue"];',
        'var colors = (1:"red", 2:"green", 3:"blue");',
        'var colors = {1:"red", 2:"green", 3:"blue"};'
    ],
    correctAnswer: 1,
    wrongAnswer: [0, 2, 3]
  },
  {
    question: "What is the correct way to write a JavaScript function?",
    answers: [ //Question 34
        "function:myFunction()",
        "function = myFunction()",
        "function myFunction()",
        "function:myFunction"
    ],
    correctAnswer: 2,
    wrongAnswer: [0, 1, 3]
  },
  {
    question: "How do you write a JavaScript for loop?",
    answers: [ //Question 35
        "for (i = 0; i <= 5; i++)",
        "for i = 0 to 5",
        "for (i <= 5; i++)",
        "for i = 0 to 5"
    ],
    correctAnswer: 0,
    wrongAnswer: [1, 2, 3]
  },
  {
    question: "What does == do in JavaScript?",
    answers: [ //Question 36
        "Assigns a value to a variable",
        "Compares two values",
        "Adds two values",
        "Subtracts two values"
    ],
    correctAnswer: 1,
    wrongAnswer: [0, 2, 3]
  },
  {
    question: "How do you write a JavaScript while loop?",
    answers: [ //Question 37
        "while i = 0 to 5",
        "while (i <= 5; i++)",
        "while (i <= 5)",
        "while i = 0 to 5"
    ],
    correctAnswer: 2,
    wrongAnswer: [0, 1, 3]
  },
  {
    question: 'What is the output of console.log(10 + 5 + "10");?',
    answers: [ //Question 38
        "25",
        "2010",
        "2510",
        "35"
    ],
    correctAnswer: 1,
    wrongAnswer: [0, 2, 3]
  },
  {
    question: "What does typeof do in JavaScript?",
    answers: [ //Question 39
        "Returns the type of a variable",
        "Changes the type of a variable",
        "Deletes a variable",
        "Multiplies a variable by 2"
    ],
    correctAnswer: 0,
    wrongAnswer: [1, 2, 3]
  },
  {
    question: "Which one of the following also known as Conditional Expression:",
    answers: [ //Question 40
        "Alternative to if-else",
        "Switch statement",
        "If-then-else statement",
        "immediate if"
    ],
    correctAnswer: 3,
    wrongAnswer: [0, 2, 1]
}]
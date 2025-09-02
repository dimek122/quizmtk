const startContainer = document.getElementById('start-container');
const quizContainer = document.getElementById('quiz-container');
const startBtn = document.getElementById('start-btn');
const backgroundMusic = document.getElementById('background-music');
const timerEl = document.getElementById('timer');
const questionContainer = document.getElementById('question-container');
const resultsContainer = document.getElementById('results-container');
const submitBtn = document.getElementById('submit-btn');

const totalQuestions = 50;
let score = 0;
let timeRemaining = 60 * 60; // 60 menit dalam detik
let timerInterval;

// Fungsi untuk menghasilkan soal matematika dasar
function generateQuestions() {
    const questions = [];
    for (let i = 0; i < totalQuestions; i++) {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operators = ['+', '-', '*'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let questionText;
        let correctAnswer;

        if (operator === '+') {
            questionText = `${num1} + ${num2} = ?`;
            correctAnswer = num1 + num2;
        } else if (operator === '-') {
            if (num1 < num2) {
                questionText = `${num2} - ${num1} = ?`;
                correctAnswer = num2 - num1;
            } else {
                questionText = `${num1} - ${num2} = ?`;
                correctAnswer = num1 - num2;
            }
        } else {
            questionText = `${num1} * ${num2} = ?`;
            correctAnswer = num1 * num2;
        }

        const options = generateOptions(correctAnswer);

        questions.push({
            question: questionText,
            options: options,
            answer: correctAnswer
        });
    }
    return questions;
}

// Fungsi untuk menghasilkan pilihan jawaban
function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);
    while (options.size < 4) {
        let randomOption = Math.floor(Math.random() * 400) + 1;
        if (Math.abs(randomOption - correctAnswer) < 50) {
            randomOption = Math.floor(Math.random() * 400) + 1;
        }
        options.add(randomOption);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
}

const quizQuestions = generateQuestions();

// Fungsi untuk menampilkan soal di halaman web
function renderQuestions() {
    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>${index + 1}. ${q.question}</p>
            <div class="options">
                ${q.options.map(option => `
                    <label>
                        <input type="radio" name="q${index}" value="${option}">
                        ${option}
                    </label>
                `).join('')}
            </div>
        `;
        questionContainer.appendChild(questionDiv);
    });
}

// Fungsi untuk memulai timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerEl.textContent = ` ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert("Waktu habis! Kuis akan diselesaikan secara otomatis.");
            submitQuiz();
        }
    }, 1000);
}

// Fungsi untuk memeriksa jawaban dan menampilkan hasil
function submitQuiz() {
    clearInterval(timerInterval);
    backgroundMusic.pause();

    let correctAnswers = 0;
    quizQuestions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        if (selectedOption && parseInt(selectedOption.value) === q.answer) {
            correctAnswers++;
        }
    });

    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = `<p>Anda telah menyelesaikan kuis!</p>
                                  <p class="correct">Skor Anda: ${correctAnswers} dari ${totalQuestions}</p>`;
}

// Event listener untuk tombol "Mulai Kuis"
startBtn.addEventListener('click', () => {
    startContainer.style.display = 'none';
    quizContainer.style.display = 'flex'; // Mengubah dari 'block' menjadi 'flex' agar layoutnya benar
    
    const selectedMusic = document.querySelector('input[name="music"]:checked').value;
    backgroundMusic.src = selectedMusic;
    backgroundMusic.play();
    
    startTimer();
    renderQuestions();
});
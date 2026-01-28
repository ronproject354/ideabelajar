// ===== QUIZ STATE =====
let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 5;

// ===== START QUIZ =====
window.startQuiz = function () {
    const overlay = document.getElementById('quiz-overlay');
    overlay.classList.remove('hidden');

    // Reset screens
    document.getElementById('quiz-start-screen').classList.remove('hidden');
    document.getElementById('quiz-game-screen').classList.add('hidden');
    document.getElementById('quiz-result-screen').classList.add('hidden');

    // Reset state
    score = 0;
    currentQuestionIndex = 0;

    // Shuffle and pick subset of questions
    shuffledQuestions = [...quizData].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
};

// ===== CLOSE QUIZ =====
window.closeQuiz = function () {
    document.getElementById('quiz-overlay').classList.add('hidden');
};

// ===== NEXT QUESTION =====
window.nextQuestion = function (isFirst = false) {
    if (isFirst) {
        document.getElementById('quiz-start-screen').classList.add('hidden');
        document.getElementById('quiz-game-screen').classList.remove('hidden');
    }

    if (currentQuestionIndex < TOTAL_QUESTIONS) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
        updateProgress();
    } else {
        showResult();
    }
};

// ===== SHOW QUESTION =====
function showQuestion(q) {
    document.getElementById('quiz-question').textContent = q.question;
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "quiz-option-btn w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white font-medium flex justify-between items-center group";
        btn.innerHTML = `
            <span>${opt}</span>
            <span class="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
        `;
        btn.onclick = () => handleAnswer(idx);
        optionsContainer.appendChild(btn);
    });
}

// ===== HANDLE ANSWER =====
function handleAnswer(selectedIndex) {
    const q = shuffledQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.answer;

    if (isCorrect) score++;

    // Visual Feedback
    const buttons = document.querySelectorAll('.quiz-option-btn');
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) {
            btn.classList.add('border-green-500', 'bg-green-500/20');
            btn.innerHTML += '<span class="material-symbols-outlined text-green-500">check_circle</span>';
        } else if (idx === selectedIndex && !isCorrect) {
            btn.classList.add('border-red-500', 'bg-red-500/20');
            btn.innerHTML += '<span class="material-symbols-outlined text-red-500">cancel</span>';
        }
    });

    // Speak explanation? Optional but nice
    // if (typeof speakText === 'function') speakText(q.explanation);

    currentQuestionIndex++;

    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

// ===== UPDATE PROGRESS =====
function updateProgress() {
    const progressText = document.getElementById('quiz-progress');
    const progressBar = document.getElementById('quiz-progress-bar');
    const scoreDisplay = document.getElementById('quiz-score');

    const count = currentQuestionIndex + 1;
    progressText.textContent = `Soal ${count} dari ${TOTAL_QUESTIONS}`;
    progressBar.style.width = `${(count / TOTAL_QUESTIONS) * 100}%`;
    scoreDisplay.textContent = `Skor: ${score}`;
}

// ===== SHOW RESULT =====
function showResult() {
    document.getElementById('quiz-game-screen').classList.add('hidden');
    document.getElementById('quiz-result-screen').classList.remove('hidden');

    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');
    const resultIcon = document.getElementById('result-icon');

    const percentage = (score / TOTAL_QUESTIONS) * 100;

    if (percentage === 100) {
        resultTitle.textContent = "Penjelajah Ahli!";
        resultIcon.className = "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-yellow-500 bg-yellow-500/20 text-yellow-500";
    } else if (percentage >= 60) {
        resultTitle.textContent = "Bagus Sekali!";
        resultIcon.className = "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-500 bg-blue-500/20 text-blue-500";
    } else {
        resultTitle.textContent = "Ayo Belajar Lagi!";
        resultIcon.className = "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-500 bg-gray-500/20 text-gray-500";
    }

    resultText.textContent = `Kamu berhasil menjawab ${score} dari ${TOTAL_QUESTIONS} soal dengan benar!`;
}

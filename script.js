const NUMBER_OF_OPERATORS = 10;
const MIN_RESULT = 100000;

let correctAnswer = 0;
let attempts = 0;

const problemElement =
    document.getElementById("problem");

const answerInput =
    document.getElementById("answer");

const submitBtn =
    document.getElementById("submitBtn");

const messageElement =
    document.getElementById("message");

const attemptElement =
    document.getElementById("attemptCount");

const music =
    document.getElementById("music");

const gameScreen =
    document.getElementById("gameScreen");

const successScreen =
    document.getElementById("successScreen");

const exitBtn =
    document.getElementById("exitBtn");


// ======================================
// TẠO BÀI TOÁN
// ======================================

function generateProblem() {

    const operatorsList = [
        "+",
        "-",
        "×",
        "÷"
    ];

    let expression = "";
    let answer = 0;

    let valid = false;

    while (!valid) {

        let numbers = [];
        let operators = [];

        // 11 số
        for (let i = 0; i <= NUMBER_OF_OPERATORS; i++) {

            numbers.push(
                Math.floor(
                    Math.random() * 50000
                ) + 1
            );

        }

        // 10 dấu
        for (
            let i = 0;
            i < NUMBER_OF_OPERATORS;
            i++
        ) {

            operators.push(
                operatorsList[
                    Math.floor(
                        Math.random() *
                        operatorsList.length
                    )
                ]
            );

        }

        expression =
            String(numbers[0]);

        for (
            let i = 0;
            i < NUMBER_OF_OPERATORS;
            i++
        ) {

            expression +=
                " " +
                operators[i] +
                " " +
                numbers[i + 1];

        }


        // Thử tính bài toán
        try {

            const convertedExpression =
                expression
                    .replaceAll("×", "*")
                    .replaceAll("÷", "/");

            answer =
                Function(
                    '"use strict"; return (' +
                    convertedExpression +
                    ')'
                )();

        } catch (error) {

            continue;

        }


        // Chỉ nhận kết quả nguyên > 100000
        if (
            Number.isFinite(answer) &&
            Number.isInteger(answer) &&
            answer > MIN_RESULT &&
            answer < Number.MAX_SAFE_INTEGER
        ) {

            valid = true;

        }

    }


    correctAnswer = answer;

    problemElement.textContent =
        expression + " = ?";


    console.log(
        "Đáp án:",
        correctAnswer
    );

}


// ======================================
// NHẠC
// ======================================

function startMusic() {

    music.volume = 1.0;

    const promise =
        music.play();

    if (promise !== undefined) {

        promise
            .then(() => {

                console.log(
                    "Nhạc đang phát."
                );

            })
            .catch(() => {

                console.log(
                    "Chrome đã chặn autoplay."
                );

            });

    }

}


// ======================================
// VÀO TRANG
// ======================================

generateProblem();

startMusic();


// Thử phát lại khi trang được hiển thị
document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState === "visible" &&
            !successScreen.classList.contains("hidden")
        ) {

            return;

        }

        if (
            document.visibilityState === "visible"
        ) {

            startMusic();

        }

    }
);


// ======================================
// KIỂM TRA
// ======================================

function checkAnswer() {

    const value =
        answerInput.value.trim();


    if (value === "") {

        messageElement.textContent =
            "⚠️ NHẬP ĐÁP ÁN ĐI!";

        messageElement.style.color =
            "orange";

        return;

    }


    const userAnswer =
        Number(value);


    attempts++;

    attemptElement.textContent =
        attempts;


    if (
        userAnswer === correctAnswer
    ) {

        messageElement.textContent =
            "✅ CHÍNH XÁC!";

        messageElement.style.color =
            "#00ff55";


        music.pause();


        setTimeout(() => {

            gameScreen.classList.add(
                "hidden"
            );

            successScreen.classList.remove(
                "hidden"
            );

        }, 500);


    } else {

        messageElement.textContent =
            "❌ SAI! GIẢI LẠI ĐI 😂";

        messageElement.style.color =
            "red";


        answerInput.value = "";

        answerInput.focus();


        // Rung màn hình
        document.body.animate(
            [
                {
                    transform: "translateX(0)"
                },
                {
                    transform: "translateX(-12px)"
                },
                {
                    transform: "translateX(12px)"
                },
                {
                    transform: "translateX(-8px)"
                },
                {
                    transform: "translateX(8px)"
                },
                {
                    transform: "translateX(0)"
                }
            ],
            {
                duration: 350
            }
        );

    }

}


// ======================================
// NÚT XÁC NHẬN
// ======================================

submitBtn.addEventListener(
    "click",
    checkAnswer
);


// ======================================
// ENTER
// ======================================

answerInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            checkAnswer();

        }

    }
);


// ======================================
// THOÁT
// ======================================

exitBtn.addEventListener(
    "click",
    async function () {

        try {

            if (
                document.fullscreenElement
            ) {

                await document.exitFullscreen();

            }

        } catch (error) {

            console.log(error);

        }

        window.location.href =
            "about:blank";

    }
);


// ======================================
// CHUỘT PHẢI
// ======================================

document.addEventListener(
    "contextmenu",
    function (event) {

        event.preventDefault();

    }
);

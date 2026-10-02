```javascript
// ==========================================
// CẤU HÌNH
// ==========================================

// Số lượng dấu phép tính
const NUMBER_OF_OPERATORS = 10;

// Kết quả tối thiểu
const MIN_RESULT = 100000;


// ==========================================
// BIẾN
// ==========================================

let correctAnswer = 0;
let attempts = 0;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const successScreen = document.getElementById("successScreen");

const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const exitBtn = document.getElementById("exitBtn");

const answerInput = document.getElementById("answer");
const problemElement = document.getElementById("problem");
const messageElement = document.getElementById("message");
const attemptElement = document.getElementById("attemptCount");

const music = document.getElementById("music");


// ==========================================
// FULLSCREEN
// ==========================================

async function enterFullscreen() {

    try {

        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }

    } catch (error) {

        console.log("Fullscreen không được phép:", error);

    }

}


// ==========================================
// TẠO SỐ NGẪU NHIÊN
// ==========================================

function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


// ==========================================
// TẠO BÀI TOÁN
// ==========================================

function generateProblem() {

    let expression = "";
    let numbers = [];
    let operators = [];

    const operatorList = [
        "+",
        "-",
        "×",
        "÷"
    ];


    // Tạo 10 dấu
    for (let i = 0; i < NUMBER_OF_OPERATORS; i++) {

        operators.push(
            operatorList[
                randomNumber(0, operatorList.length - 1)
            ]
        );

    }


    /*
        Để tránh chia ra số thập phân,
        ta tạo bài toán tuần tự sao cho
        phép chia luôn chia hết.
    */

    let result = randomNumber(20, 100);


    numbers.push(result);


    for (let i = 0; i < NUMBER_OF_OPERATORS; i++) {

        const operator = operators[i];

        let number;


        if (operator === "+") {

            number = randomNumber(1000, 50000);

            result = result + number;

        }

        else if (operator === "-") {

            number = randomNumber(1, Math.max(1, Math.floor(result / 2)));

            result = result - number;

        }

        else if (operator === "×") {

            number = randomNumber(2, 10);

            result = result * number;

        }

        else if (operator === "÷") {

            /*
                Chọn ước để kết quả luôn là số nguyên.
            */

            const divisors = [];

            for (let d = 2; d <= 20; d++) {

                if (result % d === 0) {
                    divisors.push(d);
                }

            }

            if (divisors.length > 0) {

                number =
                    divisors[
                        randomNumber(
                            0,
                            divisors.length - 1
                        )
                    ];

                result = result / number;

            } else {

                // Nếu không chia được thì đổi thành cộng
                operators[i] = "+";

                number = randomNumber(1000, 50000);

                result = result + number;

            }

        }

        numbers.push(number);

    }


    /*
        Nếu kết quả chưa đủ 100000,
        tăng số đầu tiên cho đến khi đủ.
    */

    while (result <= MIN_RESULT) {

        const extra = randomNumber(10000, 50000);

        numbers[0] += extra;

        result += extra;

    }


    // Tạo chuỗi bài toán
    expression = numbers[0];

    for (let i = 0; i < NUMBER_OF_OPERATORS; i++) {

        expression +=
            " " +
            operators[i] +
            " " +
            numbers[i + 1];

    }


    correctAnswer = result;


    problemElement.textContent =
        expression + " = ?";


    console.log(
        "Đáp án:",
        correctAnswer
    );

}


// ==========================================
// BẮT ĐẦU
// ==========================================

startBtn.addEventListener("click", async () => {

    // Phát nhạc ngay sau click
    try {

        music.volume = 1.0;

        await music.play();

    } catch (error) {

        console.log(
            "Trình duyệt không cho phát nhạc:",
            error
        );

    }


    // Fullscreen
    await enterFullscreen();


    // Chuyển màn hình
    startScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");


    // Tạo bài toán
    generateProblem();


    // Focus ô nhập
    setTimeout(() => {

        answerInput.focus();

    }, 300);

});


// ==========================================
// KIỂM TRA ĐÁP ÁN
// ==========================================

function checkAnswer() {

    const userAnswer =
        Number(
            answerInput.value.trim()
        );


    if (
        answerInput.value.trim() === ""
    ) {

        messageElement.textContent =
            "⚠️ Hãy nhập đáp án!";

        messageElement.style.color =
            "orange";

        return;

    }


    attempts++;

    attemptElement.textContent =
        attempts;


    if (userAnswer === correctAnswer) {

        // ĐÚNG
        messageElement.textContent =
            "✅ CHÍNH XÁC";

        messageElement.style.color =
            "#00ff55";


        setTimeout(() => {

            gameScreen.classList.add("hidden");

            successScreen.classList.remove("hidden");

            music.pause();

        }, 700);


    } else {

        // SAI
        messageElement.textContent =
            "❌ SAI! TIẾP TỤC ĐI 😂";

        messageElement.style.color =
            "red";


        // Xóa ô nhập
        answerInput.value = "";


        // Rung màn hình
        document.body.animate(
            [
                {
                    transform: "translateX(0)"
                },

                {
                    transform: "translateX(-10px)"
                },

                {
                    transform: "translateX(10px)"
                },

                {
                    transform: "translateX(-10px)"
                },

                {
                    transform: "translateX(0)"
                }
            ],
            {
                duration: 300
            }
        );


        answerInput.focus();

    }

}


// ==========================================
// CLICK XÁC NHẬN
// ==========================================

submitBtn.addEventListener(
    "click",
    checkAnswer
);


// ==========================================
// NHẤN ENTER
// ==========================================

answerInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            checkAnswer();

        }

    }
);


// ==========================================
// NÚT THOÁT
// ==========================================

exitBtn.addEventListener(
    "click",
    async () => {

        try {

            if (document.fullscreenElement) {

                await document.exitFullscreen();

            }

        } catch (error) {

            console.log(error);

        }

        window.location.href =
            "about:blank";

    }
);


// ==========================================
// CỐ GẮNG GIỮ NHẠC
// ==========================================

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
            document.visibilityState === "visible" &&
            gameScreen.classList.contains("hidden") === false
        ) {

            music.play().catch(() => {});

        }

    }
);


// ==========================================
// CHỐNG CHUỘT PHẢI
// ==========================================

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);
```

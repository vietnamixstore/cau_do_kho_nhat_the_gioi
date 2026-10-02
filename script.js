// ======================================
// CẤU HÌNH
// ======================================
const NUMBER_OF_TERMS = 4;      // số "cụm" trong bài toán (tăng lên = khó hơn)
const MAX_NUMBER = 30;          // số lớn nhất trong mỗi phép tính

let correctAnswer = 0;
let attempts = 0;
let locked = false;             // true khi đang khóa
let solved = false;

const $ = (id) => document.getElementById(id);

const startScreen   = $("startScreen");
const startBtn      = $("startBtn");
const gameScreen    = $("gameScreen");
const successScreen = $("successScreen");
const problemEl     = $("problem");
const answerInput   = $("answer");
const submitBtn     = $("submitBtn");
const messageEl     = $("message");
const attemptEl     = $("attemptCount");
const music         = $("music");
const exitBtn       = $("exitBtn");


// ======================================
// TẠO BÀI TOÁN (luôn ra số nguyên, không dùng vòng lặp thử sai)
// ======================================
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeTerm() {
    const type = rand(0, 2);

    // Số đơn
    if (type === 0) {
        const n = rand(2, MAX_NUMBER * 3);
        return { text: String(n), value: n };
    }

    // a × b
    const a = rand(2, MAX_NUMBER);
    const b = rand(2, 12);

    if (type === 1) {
        return { text: `${a} × ${b}`, value: a * b };
    }

    // (a × b) ÷ c với c là ước của a×b -> luôn chia hết
    const product = a * b;
    const divisors = [];
    for (let d = 2; d <= 12; d++) {
        if (product % d === 0) divisors.push(d);
    }

    if (divisors.length === 0) {
        return { text: `${a} × ${b}`, value: product };
    }

    const c = divisors[rand(0, divisors.length - 1)];
    return { text: `${a} × ${b} ÷ ${c}`, value: product / c };
}

function generateProblem() {
    let text = "";
    let total = 0;

    do {
        const first = makeTerm();
        text = first.text;
        total = first.value;

        for (let i = 1; i < NUMBER_OF_TERMS; i++) {
            const term = makeTerm();
            if (Math.random() < 0.5) {
                text += " + " + term.text;
                total += term.value;
            } else {
                text += " − " + term.text;
                total -= term.value;
            }
        }
    } while (total < 0);   // chỉ nhận đáp án dương cho dễ nhập

    correctAnswer = total;
    problemEl.textContent = text + " = ?";
    console.log("Đáp án:", correctAnswer);
}


// ======================================
// NHẠC
// ======================================
function startMusic() {
    music.volume = 1.0;
    const p = music.play();
    if (p !== undefined) {
        p.catch(() => console.log("Trình duyệt chặn phát nhạc."));
    }
}


// ======================================
// FULLSCREEN
// ======================================
async function enterFullscreen() {
    const el = document.documentElement;
    try {
        if (el.requestFullscreen) {
            await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        }
    } catch (e) {
        console.log("Không vào được fullscreen:", e);
    }
}

function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
}


// ======================================
// BẮT ĐẦU (bấm nút)
// ======================================
startBtn.addEventListener("click", async () => {
    locked = true;

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    startMusic();
    await enterFullscreen();

    generateProblem();
    answerInput.focus();

    // Bẫy nút Back
    history.pushState({ lock: true }, "", location.href);
});


// ======================================
// CHẶN THOÁT
// ======================================

// Nút Back (PC + mobile)
window.addEventListener("popstate", () => {
    if (locked && !solved) {
        history.pushState({ lock: true }, "", location.href);
    }
});

// Đóng tab / tải lại -> trình duyệt hỏi xác nhận
window.addEventListener("beforeunload", (e) => {
    if (locked && !solved) {
        e.preventDefault();
        e.returnValue = "";
    }
});

// Thoát fullscreen (Esc) -> hiện lại màn hình bấm để tiếp tục
function onFullscreenChange() {
    if (locked && !solved && !isFullscreen()) {
        gameScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    }
}
document.addEventListener("fullscreenchange", onFullscreenChange);
document.addEventListener("webkitfullscreenchange", onFullscreenChange);

// Quay lại tab -> phát nhạc tiếp
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && locked && !solved) {
        startMusic();
    }
});

// Nhạc bị tạm dừng bởi hệ thống -> phát lại
music.addEventListener("pause", () => {
    if (locked && !solved) startMusic();
});

// Chặn phím tắt thường gặp (không chặn được Ctrl+W / Alt+F4)
document.addEventListener("keydown", (e) => {
    if (!locked || solved) return;

    const key = e.key.toLowerCase();
    const blocked =
        e.key === "F5" ||
        e.key === "F11" ||
        e.key === "F12" ||
        (e.ctrlKey && ["r", "u", "s", "p"].includes(key)) ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key));

    if (blocked) e.preventDefault();
});

// Chuột phải
document.addEventListener("contextmenu", (e) => e.preventDefault());


// ======================================
// KIỂM TRA ĐÁP ÁN
// ======================================
function checkAnswer() {
    const value = answerInput.value.trim();

    if (value === "") {
        messageEl.textContent = "⚠️ NHẬP ĐÁP ÁN ĐI!";
        messageEl.style.color = "orange";
        return;
    }

    attempts++;
    attemptEl.textContent = attempts;

    if (Number(value) === correctAnswer) {
        solved = true;

        messageEl.textContent = "✅ CHÍNH XÁC!";
        messageEl.style.color = "#00ff55";
        music.pause();

        setTimeout(() => {
            gameScreen.classList.add("hidden");
            successScreen.classList.remove("hidden");
        }, 500);

    } else {
        messageEl.textContent = "❌ SAI! GIẢI LẠI ĐI 😂";
        messageEl.style.color = "red";

        answerInput.value = "";
        answerInput.focus();

        document.body.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-12px)" },
                { transform: "translateX(12px)" },
                { transform: "translateX(-8px)" },
                { transform: "translateX(8px)" },
                { transform: "translateX(0)" }
            ],
            { duration: 350 }
        );
    }
}

submitBtn.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
});


// ======================================
// THOÁT
// ======================================
exitBtn.addEventListener("click", async () => {
    solved = true;

    try {
        if (isFullscreen()) {
            if (document.exitFullscreen) await document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    } catch (e) {
        console.log(e);
    }

    window.location.href = "about:blank";
});

/* =====================================================
   BIẾN TOÀN CỤC
===================================================== */

let selectedSkills = [];
let usedSkill = {};

let current = 0;
let lives = 3;
let retryMode = false;
let timer;
let overCountdown;

let wrongQuestions = [];
let wrongQuestionIds = [];

// biến map 2
let map2Current = 0;
let map2Lives = 3;
let map2Time = 240;
let map2Retry = false;
let map2Timer;

/* =====================================================
   SOUND SYSTEM
===================================================== */

const introMusic =
    document.getElementById("introMusic");

const loginMusic =
    document.getElementById("loginMusic");

const gameMusic =
    document.getElementById("gameMusic");

const rainSound =
    document.getElementById("rainSound");

const typingSound =
    document.getElementById("typingSound");

const thunderSound =
    document.getElementById("thunderSound");

const monsterSound =
    document.getElementById("monsterSound");

const correctSound =
    document.getElementById("correctSound");

const wrongSound =
    document.getElementById("wrongSound");

const clickSound =
    document.getElementById("clickSound");
const skillSound =
    document.getElementById("skillSound");


function playSound(id) {

    let sound = document.getElementById(id);

    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;

    sound.play().catch(() => {});
}



window.onload = () => {

    introMusic.volume = 0.65;
    loginMusic.volume = 0.45;
    gameMusic.volume = 0.76;

    rainSound.volume = 0.30;
    rainSound.loop = true;

    typingSound.volume = 0.15;
    thunderSound.volume = 0.60;

    monsterSound.volume = 0.19;

    correctSound.volume = 0.60;
    wrongSound.volume = 0.60;

    clickSound.volume = 0.49;
    skillSound.volume = 0.4;

    //KHÔNG PLAY NGAY (tránh bị browser chặn audio)
    show("intro");

    startIntroStory();

    // delay nhẹ để đảm bảo audio context được unlock
    setTimeout(() => {

        introMusic.currentTime = 0;
        introMusic.play().catch(() => {});

        rainSound.currentTime = 0;
        rainSound.play().catch(() => {});

    }, 300);
};



// âm thanh khi click button
document
    .querySelectorAll("button")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {
                playSound(
                    "clickSound"
                );
            }
        );

    });


function updateAudioByScreen(id) {

    const intro = document.getElementById("introMusic");
    const login = document.getElementById("loginMusic");
    const rain = document.getElementById("rainSound");

    if (id === "intro") {

        intro.currentTime = 0;
        intro.play().catch(() => {});

        rain.currentTime = 0;
        rain.loop = true;
        rain.play().catch(() => {});

    } else if (id === "login") {

        intro.pause();

        login.currentTime = 0;
        login.play().catch(() => {});

        rain.currentTime = 0;
        rain.loop = true;
        rain.play().catch(() => {});

    } else {

        intro.pause();
        login.pause();

        rain.pause();
    }
}



/* =====================================================
   START GAME
===================================================== */

document.getElementById("start-game-btn").onclick = () => {

    const intro =
        document.getElementById("introMusic");

    const login =
        document.getElementById("loginMusic");

    const rain =
        document.getElementById("rainSound");

    const game =
        document.getElementById("gameMusic");

    if (intro) {
        intro.pause();
        intro.currentTime = 0;
    }

    if (login) {
        login.pause();
        login.currentTime = 0;
    }

    if (rain) {
        rain.pause();
        rain.currentTime = 0;
    }

    if (game) {
        game.volume = 0.4;
        game.play().catch(() => {});
    }

    buildSkillBar();

    startMap1();
};



/* =====================================================
   SWITCH SCREEN
===================================================== */

function show(id) {

    // 1. Ẩn tất cả screen
    document
        .querySelectorAll(".screen")
        .forEach(s => s.classList.remove("active"));

    // 2. Hiện screen được chọn
    document
        .getElementById(id)
        .classList.add("active");

    // 3. Update hiệu ứng môi trường
    updateRainEffect();
    updateIntroEffects();

    // 4. QUẢN LÝ ÂM THANH TẬP TRUNG
    updateAudioByScreen(id);
}

function updateAudioByScreen(id) {

    const intro = document.getElementById("introMusic");
    const login = document.getElementById("loginMusic");
    const rain = document.getElementById("rainSound");

    if (id === "intro") {

        intro.currentTime = 0;
        intro.play().catch(() => {});

        login.pause();

        rain.currentTime = 0;
        rain.loop = true;
        rain.play().catch(() => {});

    } else if (id === "login") {

        intro.pause();

        login.currentTime = 0;
        login.play().catch(() => {});

        rain.currentTime = 0;
        rain.loop = true;
        rain.play().catch(() => {});

    } else {

        intro.pause();
        login.pause();
        rain.pause();
    }
}



// camera chuyển cảnh ======================?
function screenShake() {

    document.body.classList.add("screen-shake");

    setTimeout(() => {

        document.body.classList.remove("screen-shake");

    }, 400);

}


// intro ================/
const introText = `The night before graduation.
You received an email with no sender.

The subject line was just one sentence:
"Do you truly know who you want to become?"

Curious, you went to school the next morning.
But the school was completely different.
The hallway was pitch black.
The classroom was empty.
There were no teachers.
No students.
Only dusty desks and old graduation photos hanging all over the walls.
The strangest thing was...
All of those photos had faces obscured with black marks.
A voice echoed from the loudspeaker:

"Welcome to the Dead Student Union."
"A place for students who have lost their dreams."
"Want to leave here..."
"Prove that you deserve a future."`;

function startIntroStory() {

    const textBox = document.getElementById("intro-story");
    const startBtn = document.getElementById("intro-btn");
    const typingSound = document.getElementById("typingSound");

    textBox.innerHTML = "";
    let i = 0;

    let typing = setInterval(() => {

        let char = introText.charAt(i);
        textBox.innerHTML += char;

        // auto scroll
        textBox.scrollTop = textBox.scrollHeight;

        // typing sound (FIX CHÍNH)
        if (
            i % 3 === 0 &&
            char !== " " &&
            char !== "\n"
        ) {
            try {
                const clone = typingSound.cloneNode(true);
                clone.volume = 0.15;

                clone.play().catch(() => {});
            } catch (e) {
                console.log("Typing sound error:", e);
            }
        }

        i++;

        // END TEXT
        if (i >= introText.length) {

            clearInterval(typing);

            // đảm bảo sound dừng sạch
            typingSound.pause();
            typingSound.currentTime = 0;

            startBtn.style.display = "inline-block";
        }

    }, 6);
}


/* MAP 1 */
let map1Index = 0;
let map1Lives = 3;
let map1Timer;
let map1Retry = false;

/* =====================================================
   HÀM CHUNG
===================================================== */

function getStartLives() {
    return selectedSkills.includes("LIFE") ? 4 : 3;
}

/* =====================================================
   SKILL BAR (FIX: CHỈ 1 BAR DUY NHẤT)
===================================================== */

function buildSkillBar() {
    const bar = document.getElementById("skill-bar");
    bar.innerHTML = "";

    const icons = {
        5050: "🎯",
        HELP: "🧠",
        RETRY: "🔁"
    };

    selectedSkills.forEach(skill => {

        if (skill === "TIME" || skill === "LIFE" || skill === "FIRST") return;

        let div = document.createElement("div");
        div.className = "skill-item";
        div.innerHTML = icons[skill];

        div.onclick = () => {

            if (
                document.getElementById("map1")
                .classList.contains("active")
            ) {

                useMap1Skill(skill, div);

            } else if (
                document.getElementById("map2")
                .classList.contains("active")
            ) {

                useMap2Skill(skill, div);

            } else {

                useSkill(skill, div);

            }
        };

        bar.appendChild(div);
    });
}

/* =====================================================
   UPDATE SKILL SLOT
===================================================== */

function updateSlots() {

    const icons = {
        TIME: "⏳",
        LIFE: "❤️",
        5050: "🎯",
        HELP: "🧠",
        RETRY: "🔁",
        FIRST: "⭐"
    };

    for (let i = 0; i < 3; i++) {
        let slot = document.getElementById("slot" + (i + 1));

        if (selectedSkills[i]) {
            slot.innerHTML = icons[selectedSkills[i]];
        } else {
            slot.innerHTML = "+";
        }
    }
}

/* =====================================================
   CHỌN SKILL
===================================================== */

document.querySelectorAll(".skill-card").forEach(card => {

    card.onclick = () => {

        let skill = card.dataset.skill;

        // Nếu đã chọn => bỏ chọn
        if (selectedSkills.includes(skill)) {

            selectedSkills =
                selectedSkills.filter(
                    s => s !== skill
                );

            card.classList.remove("selected");

            updateSlots();

            return;
        }

        // Giới hạn 3 skill
        if (selectedSkills.length >= 3)
            return;

        playSound("clickSound");

        selectedSkills.push(skill);

        card.classList.add("selected");

        updateSlots();
    };
});

/* =====================================================
   LOGIN -> SKILL
===================================================== */

function startSkill() {
    show("skill");
}


/* =====================================================
   MAP 1 DATA (GIỮ NGUYÊN)
===================================================== */
let map1 = [

    {
        q: "Many students dream of becoming successful, but only a few have the ______ to work hard every day.",
        o: ["determination", "vacation", "talent", "hobby"],
        a: 0,
        t: 25,
        explain: "Determination = sự quyết tâm. Chủ đề vượt khó để đạt mục tiêu."
    },

    {
        q: "She hopes ______ a scholarship to study abroad next year.",
        o: ["getting", "to get", "got", "get"],
        a: 1,
        t: 25,
        explain: "Hope + to V."
    },

    {
        q: "Many students worry about their future ______ after graduation.",
        o: ["careers", "holidays", "birthdays", "hobbies"],
        a: 0,
        t: 25,
        explain: "Future career = nghề nghiệp tương lai."
    },

    {
        q: "I enjoy ______ part in volunteer activities because they help me learn new skills.",
        o: ["take", "taking", "to take", "took"],
        a: 1,
        t: 25,
        explain: "Enjoy + V-ing. Take part in = tham gia."
    },

    {
        q: "Good grades are important, but work ______ is also valuable.",
        o: ["pressure", "success", "experience", "ambition"],
        a: 2,
        t: 25,
        explain: "Work experience = kinh nghiệm làm việc."
    },

    {
        q: "She has ______ English since she was a child.",
        o: ["study", "studied", "studying", "studies"],
        a: 1,
        t: 25,
        explain: "Present Perfect: has + V3."
    },

    {
        q: "Many students feel a lot of ______ because their families expect them to get high grades.",
        o: ["pressure", "freedom", "happiness", "excitement"],
        a: 0,
        t: 25,
        explain: "Pressure = áp lực. Chủ đề áp lực học tập."
    },

    {
        q: "Although he failed the exam once, he continued to ______ his dream of becoming a doctor.",
        o: ["pursue", "avoid", "cancel", "forget"],
        a: 0,
        t: 25,
        explain: "Pursue a dream = theo đuổi ước mơ."
    },

    {
        q: "Some students find it difficult to choose a career because they are not sure about their ______.",
        o: ["classrooms", "uniforms", "strengths", "schedules"],
        a: 2,
        t: 25,
        explain: "Strengths = điểm mạnh. Biết điểm mạnh giúp chọn nghề phù hợp."
    },

    {
        q: "Many students choose to take extra courses because they want to improve their ______ for future careers.",
        o: ["friendships", "memories", "interests", "qualifications"],
        a: 3,
        t: 25,
        explain: "Improve qualifications = nâng cao trình độ, bằng cấp."
    }

];
/* =====================================================
   START MAP 1
===================================================== */

function startMap1() {

    map1Index = 0;
    map1Retry = false;

    map1Lives = getStartLives();

    wrongQuestions = [];

    updateRainEffect();
    show("map1");
    loadMap1();
}

/* =====================================================
   LOAD MAP 1
===================================================== */

function loadMap1() {

    let q = map1[map1Index];

    document.getElementById("map1-question").innerText = q.q;
    document.getElementById("map1-progress").innerText =
        `Q${map1Index + 1}/${map1.length}`;

    document.getElementById("map1-lives").innerText =
        "❤️".repeat(map1Lives);

    let box = document.getElementById("map1-options");
    box.innerHTML = "";

    document.getElementById("map1-feedback").innerHTML = "";

    q.o.forEach((opt, i) => {

        let btn = document.createElement("button");
        btn.className = "btn-big";
        btn.innerText = opt;

        btn.onclick = () => checkMap1(i);

        box.appendChild(btn);
    });

    startMap1Timer(q.t);
}

/* =====================================================
   MAP 1 TIMER
===================================================== */

function startMap1Timer(t) {

    clearInterval(map1Timer);

    document.getElementById("map1-timer").innerText = t;

    if (selectedSkills.includes("TIME"))
        t += 2;

    document.getElementById("map1-timer").innerText = t;

    map1Timer = setInterval(() => {

        document.getElementById("map1-timer").innerText = t;
        t--;

        if (t < 0) {

            clearInterval(map1Timer);

            let data = map1[map1Index];

            wrongQuestions.push({
                map: 1,
                question: data.q,
                correct: data.o[data.a],
                explain: data.explain || "No explanation"
            });

            map1Wrong();
        }

    }, 1000);
}

/* =====================================================
   CHECK MAP 1 (FIX FULL SKILL LOGIC)
===================================================== */

function checkMap1(i) {

    let q = map1[map1Index];
    let buttons = document.querySelectorAll("#map1-options button");

    clearInterval(map1Timer);

    /* FIRST SKILL */
    if (map1Index === 0 && selectedSkills.includes("FIRST")) {
        map1Next();
        return;
    }

    /* ĐÚNG */
    if (i === q.a) {

        playSound("correctSound");

        buttons[i].classList.add("correct-answer");
        buttons.forEach(b => b.disabled = true);

        setTimeout(map1Next, 1000);
        return;
    }

    /* RETRY SKILL */
    if (map1Retry) {

        map1Retry = false;
        document.getElementById("map1-feedback").innerHTML =
            "🔁 Retry used - chọn lại";

        startMap1Timer(q.t);
        return;
    }

    /* SAI */
    buttons[i].classList.add("wrong-answer");
    buttons[q.a].classList.add("correct-answer");

    buttons.forEach(b => b.disabled = true);

    wrongQuestions.push({
        map: 1,
        question: q.q,
        correct: q.o[q.a],
        explain: q.explain || "No explanation"
    });

    setTimeout(map1Wrong, 1000);
}

/* =====================================================
   SKILL MAP 1 (FIX)
===================================================== */

function useMap1Skill(skill, el) {

    if (usedSkill[skill]) return;
    usedSkill[skill] = true;



    let q = map1[map1Index];

    /* 50/50 (MAP1 ONLY) */
    if (skill === "5050") {

        let buttons = document.querySelectorAll("#map1-options button");
        let wrong = [];

        buttons.forEach((b, i) => {
            if (i !== q.a) wrong.push(b);
        });

        wrong.sort(() => Math.random() - 0.5);

        wrong.slice(0, 2).forEach(b => b.style.display = "none");
    }

    /* HELP */
    if (skill === "HELP") {
        document.getElementById("map1-feedback").innerHTML =
            "🧠 Đáp án: " + q.o[q.a];
    }

    /* RETRY */
    if (skill === "RETRY") {
        map1Retry = true;
        document.getElementById("map1-feedback").innerHTML =
            "🔁 Retry đã bật";
    }

    el.style.opacity = 0.4;
}

/* =====================================================
   MAP 1 NEXT
===================================================== */

function map1Next() {

    map1Index++;

    if (map1Index >= map1.length) {


        show("map1win");

        typeWriterWin(
            `You survived the first trial.
The abandoned classrooms no longer feel empty.
But the voices in the corridor are becoming clearer.
Something deeper inside the school is waiting for you.`,
            "map1win-story",
            "map1win-btn",
            "map1answer-btn"
        );

        return;
    }

    loadMap1();
}

/* =====================================================
   MAP 1 WRONG
===================================================== */

function map1Wrong() {

    map1Lives--;
    playSound(
        "monsterSound"
    );
    screenShake();

    document.getElementById("map1-lives").innerText =
        "❤️".repeat(map1Lives);

    if (map1Lives <= 0) {

        document.getElementById("gameMusic").pause();
        document.getElementById("loseSound").play();

        show("over");

        setTimeout(() => {
            playJumpscare();
        }, 100);

        startGameOverTimer();
        return;
    }

    map1Next();
}

/* =====================================================
   CHUYỂN MAP 1 -> MAP 2
===================================================== */

function toMap3() {

    current = 0;
    lives = getStartLives();

    retryMode = false;
    usedSkill = {};

    clearInterval(timer);

    updateRainEffect();
    show("game");
    load();
}


// map 2

// start map2
function startMap2() {

    show("map2");

    buildSkillBar();

    map2Current = 0;

    map2Lives =
        selectedSkills.includes("LIFE") ?
        4 :
        3;

    map2Retry = false;

    usedSkill = {};

    map2Time =
        selectedSkills.includes("TIME") ?
        300 :
        240;

    updateMap2Lives();

    startMap2Timer();

    loadMap2Question();
}


// TIMER MAP 2
function startMap2Timer() {

    clearInterval(map2Timer);

    map2Timer = setInterval(() => {

        map2Time--;

        let minutes =
            Math.floor(map2Time / 60);

        let seconds =
            map2Time % 60;

        document.getElementById("map2-timer")
            .innerHTML =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

        if (map2Time <= 0) {

            clearInterval(map2Timer);

            playSound("loseSound");

            document.getElementById("gameMusic").pause();

            const q =
                map2Questions[map2Current];

            if (q) {

                wrongQuestions.push({

                    map: 2,

                    question: q.question,

                    correct: q.correct,

                    explain: q.explain || "No explanation"

                });

            }

            show("over");

            playJumpscare();

            startGameOverTimer();
        }

    }, 1000);
}


// LOAD CÂU HỎI MAP 2
function loadMap2Question() {
    document.getElementById(
        "map2-feedback"
    ).innerHTML = "";
    document
        .querySelectorAll(".answer")
        .forEach(e => e.remove());

    if (map2Current >= map2Questions.length) {

        map2Win();

        return;
    }

    const q =
        map2Questions[map2Current];

    document.getElementById("map2-question")
        .textContent =
        q.question;

    q.answers.forEach((answerText, index) => {

        const answer =
            document.createElement("div");

        answer.className =
            "answer";

        answer.textContent =
            answerText;

        answer.style.left =
            (window.innerWidth + index * 350) +
            "px";

        document
            .getElementById("map2")
            .appendChild(answer);

        let speed = 6;

        const move =
            setInterval(() => {

                let left =
                    parseFloat(
                        answer.style.left
                    );

                left -= speed;

                answer.style.left =
                    left + "px";

                if (left < -250) {

                    answer.style.left =
                        window.innerWidth +
                        "px";
                }

            }, 16);

        answer.onclick = () => {

            clearInterval(move);

            checkMap2Answer(
                answerText
            );

        };

    });
}


// CHECK ĐÁP ÁN MAP 2
function checkMap2Answer(answerText) {

    const q =
        map2Questions[map2Current];

    if (
        map2Current === 0 &&
        selectedSkills.includes("FIRST")
    ) {

        map2Current++;

        loadMap2Question();

        return;
    }

    if (answerText === q.correct) {

        if (answerText === q.correct) {

            playSound("correctSound");

            showCombo(
                "✔ CORRECT",
                "correct"
            );

            document
                .querySelectorAll(".answer")
                .forEach(box => {

                    if (
                        box.textContent ===
                        answerText
                    ) {

                        box.style.background =
                            "#13c554";

                    }

                });

        }

        setTimeout(() => {
            document.body.style.background =
                "";
        }, 200);

    } else {

        playSound("wrongSound");

        showCombo(
            "✖ WRONG",
            "wrong"
        );

        document
            .querySelectorAll(".answer")
            .forEach(box => {

                if (
                    box.textContent ===
                    answerText
                ) {

                    box.style.background =
                        "#d61b1b";

                }

            });

        if (map2Retry) {

            map2Retry = false;

            document.getElementById("map2-feedback").innerHTML =
                "🔁 Retry used - chọn lại";

            return;
        }

        wrongQuestions.push({

            map: 2,

            question: q.question,

            correct: q.correct,

            explain: q.explain || "No explanation"

        });

        map2Lives--;
        playSound(
            "monsterSound"
        );
        screenShake();

        updateMap2Lives();

        document.body.style.background =
            "#7a1e1e";

        setTimeout(() => {
            document.body.style.background =
                "";
        }, 200);

        if (map2Lives <= 0) {

            clearInterval(map2Timer);

            document.getElementById("gameMusic").pause();

            playSound("loseSound");

            show("over");

            setTimeout(() => {
                playJumpscare();
            }, 100);

            startGameOverTimer();

            return;
        }
    }

    document
        .querySelectorAll(".answer")
        .forEach(e => e.remove());

    map2Current++;

    setTimeout(
        loadMap2Question,
        300
    );
}


// UPDATE TIM 
function updateMap2Lives() {

    document.getElementById("map2-lives").innerHTML =
        "❤️".repeat(map2Lives);
}



// USE SKILL MAP 2
function useMap2Skill(skill, el) {

    if (usedSkill[skill])
        return;

    usedSkill[skill] = true;

    const q =
        map2Questions[
            map2Current
        ];

    if (skill === "5050") {

        let wrong =
            q.answers.filter(
                a => a !== q.correct
            );

        wrong.sort(
            () => Math.random() - 0.5
        );

        wrong.slice(0, 2)
            .forEach(removeAns => {
                document.getElementById(
                        "map2-feedback"
                    ).innerHTML =

                    "🎯 Đã loại bỏ 2 đáp án sai";
                document
                    .querySelectorAll(
                        ".answer"
                    )
                    .forEach(box => {

                        if (
                            box.textContent ===
                            removeAns
                        ) {
                            box.style.display =
                                "none";
                        }
                    });
            });
    }

    if (skill === "HELP") {

        document.getElementById(
                "map2-feedback"
            ).innerHTML =

            "<b>🧠 Đáp án:</b> " +
            q.correct

            +

            "<br><br>"

            +

            "<b>Giải thích:</b> " +
            q.explain;

    }

    if (skill === "RETRY") {

        map2Retry = true;

        document.getElementById(
                "map2-feedback"
            ).innerHTML =

            "🔁 Retry đã kích hoạt";
    }
    el.style.opacity = "0.4";
}


// WIN MAP 2
function map2Win() {

    clearInterval(map2Timer);


    show("map2win");

    typeWriterWin(
        `The shadows have started to remember your name.
The forgotten students are watching.
You are getting closer to the truth.
One final challenge remains.`,
        "map2win-story",
        "map2win-btn",
        "map2answer-btn"
    );
}


// câu hỏi map 2


let map2Questions = [

    {
        question: "The career workshop helped students become more ______ about their future plans.",
        answers: ["careless", "ordinary", "nervous", "confident"],
        correct: "confident",
        explain: "Confident about something = tự tin về điều gì."
    },

    {
        question: "Before choosing a major, students should carefully ______ their options.",
        answers: ["evaluate", "repeat", "ignore", "divide"],
        correct: "evaluate",
        explain: "Evaluate options = đánh giá các lựa chọn."
    },

    {
        question: "Taking part in group projects can improve your ______ skills.",
        answers: ["communication", "decoration", "transportation", "observation"],
        correct: "communication",
        explain: "Communication skills = kỹ năng giao tiếp."
    },

    {
        question: "It is important to ______ new skills to stay competitive in today's job market.",
        answers: ["develop", "destroy", "remove", "reduce"],
        correct: "develop",
        explain: "Develop skills = phát triển kỹ năng."
    },

    {
        question: "Many students seek advice from teachers when making important ______ about their future.",
        answers: ["decisions", "accidents", "inventions", "celebrations"],
        correct: "decisions",
        explain: "Make decisions = đưa ra quyết định."
    },

    {
        question: "Students are interested in ______ part in volunteer activities.",
        answers: ["take", "taking", "to take", "took"],
        correct: "taking",
        explain: "Interested in + V-ing."
    },

    {
        question: "She promised ______ harder to achieve her goals.",
        answers: ["work", "working", "to work", "worked"],
        correct: "to work",
        explain: "Promise + to V."
    },

    {
        question: "He succeeded in ______ a balance between study and personal life.",
        answers: ["find", "finding", "to find", "found"],
        correct: "finding",
        explain: "Succeed in + V-ing."
    },

    {
        question: "They are looking forward to ______ from industry experts.",
        answers: ["learn", "learning", "to learn", "learned"],
        correct: "learning",
        explain: "Look forward to + V-ing."
    },

    {
        question: "She was determined ______ her education despite many difficulties.",
        answers: ["continue", "continuing", "to continue", "continued"],
        correct: "to continue",
        explain: "Determined to + V."
    }

];




/* =====================================================
   MAP 3 (QUESTION DATA)
===================================================== */

let q = [


    {
        q: "She has a strong ____ to succeed in her career, which drives her to work late every night.",
        a: "ambition",
        t: 36,
        explain: "Have a strong ambition to do something = có tham vọng lớn để làm gì."
    },


    {
        q: "It is important to ____ a balance between your professional and personal life to avoid burnout.",
        a: "maintain",
        t: 36,
        explain: "Maintain a balance = duy trì sự cân bằng."
    },

    {
        q: "Some students give up on their goals too easily because they do not have enough ____ to overcome challenges.",
        a: "determination",
        t: 36,
        explain: "Determination = sự quyết tâm. Đây là phẩm chất quan trọng để đạt được mục tiêu."
    },

    {
        q: "After attending several career workshops, she finally realized which career she wanted to ____.",
        a: "pursue",
        t: 36,
        explain: "Pursue a career = theo đuổi sự nghiệp."
    },

    {
        q: "Participating in volunteer projects can provide valuable ____ that employers often look for.",
        a: "experience",
        t: 36,
        explain: "Valuable experience = kinh nghiệm quý giá."
    },

    {
        q: "Although his dream seemed difficult at first, he believed it was still ____ if he worked hard enough.",
        a: "achievable",
        t: 36,
        explain: "Achievable = có thể đạt được."
    },

    {
        q: "Reorder: always / dreamed / I / have / of / studying / abroad",
        a: "i have always dreamed of studying abroad",
        t: 86,
        explain: "Structure: S + have/has + always + V3. Dream of + V-ing."
    },

    {
        q: "Reorder: important / it / is / to / gain / work / experience",
        a: "it is important to gain work experience",
        t: 86,
        explain: "Structure: It is + adjective + to V."
    },

    {
        q: "Rewrite: She started learning English three years ago. → She has ____",
        a: "learned english for three years",
        t: 86,
        explain: "Started ... ago → have/has + V3 + for + khoảng thời gian."
    },

    {
        q: "Rewrite: My long-term ambition is to pursue a career in international business. → I aspire ____",
        a: "to pursue a career in international business",
        t: 86,
        explain: "Aspire to + V = khao khát, mong muốn đạt được điều gì."
    }

];


/* =====================================================
   LOAD MAP 3
===================================================== */

function load() {

    let x = q[current];

    document.getElementById("question").innerText = x.q;
    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerHTML = "";

    document.getElementById("progress").innerText =
        `Q${current + 1}/${q.length}`;

    updateLives();
    startTimer(x.t);
}

/* =====================================================
   TIMER MAP 3
===================================================== */

function startTimer(t) {

    clearInterval(timer);
    document.getElementById("timer").innerText = t;

    if (selectedSkills.includes("TIME")) t += 2;

    timer = setInterval(() => {

        document.getElementById("timer").innerText = t;
        t--;

        if (t < 0) {

            clearInterval(timer);

            let existed = wrongQuestions.some(
                item => item.question === q[current].q
            );

            if (!existed) {

                wrongQuestions.push({
                    map: 3,
                    question: q[current].q,
                    correct: q[current].a,
                    explain: q[current].explain || "No explanation"
                });

            }

            wrong();
        }

    }, 1000);
}

/* =====================================================
   CHECK MAP 3 (FIX FULL SKILL)
===================================================== */

function check() {

    let val = document.getElementById("answer")
        .value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

    let correct = q[current].a
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
    /* FIRST SKILL */
    if (current === 0 && selectedSkills.includes("FIRST")) {
        next();
        return;
    }

    /* ĐÚNG */
    if (val === correct) {

        clearInterval(timer);
        document.getElementById("correctSound").play();

        let box = document.getElementById("answer");

        box.style.background = "#16a34a";
        box.style.color = "white";

        setTimeout(() => {
            box.style.background = "";
            box.style.color = "";
            next();
        }, 1000);

        return;
    }

    /* RETRY SKILL */
    if (retryMode) {

        retryMode = false;

        document.getElementById("feedback").innerHTML =
            "🔁 Retry used - thử lại";

        return;
    }

    /* SAI */
    clearInterval(timer);
    document.getElementById("wrongSound").play();

    let existed = wrongQuestions.some(
        x => x.question === q[current].q
    );

    if (!existed) {
        wrongQuestions.push({
            map: 3,
            question: q[current].q,
            correct: q[current].a,
            explain: q[current].explain || "No explanation"
        });
    }

    document.getElementById("answer").style.background = "#dc2626";
    document.getElementById("answer").style.color = "white";

    setTimeout(wrong, 1000);
}

/* =====================================================
   SKILL MAP 3 (FIX 50/50 = HELP MODE)
===================================================== */

function useSkill(skill, el) {

    if (usedSkill[skill]) return;
    usedSkill[skill] = true;

    document.getElementById("skillSound").play();

    let x = q[current];

    /* 50/50 => MAP3 = HELP STYLE */
    if (skill === "5050") {
        document.getElementById("feedback").innerHTML =
            "🎯 Hint: " + x.a;
    }

    /* HELP */
    if (skill === "HELP") {
        document.getElementById("feedback").innerHTML =
            "🧠 Answer: " + x.a;
    }

    /* RETRY */
    if (skill === "RETRY") {
        retryMode = true;
        document.getElementById("feedback").innerHTML =
            "🔁 Retry enabled";
    }

    el.style.opacity = 0.4;
}

/* =====================================================
   WRONG (MAP 3)
===================================================== */

function wrong() {

    lives--;
    playSound(
        "monsterSound"
    );
    screenShake();

    updateLives();

    if (lives <= 0) {

        document.getElementById("gameMusic").pause();
        document.getElementById("loseSound").play();
        show("over");

        setTimeout(() => {
            playJumpscare();
        }, 100);

        startGameOverTimer();
        return;
    }

    next();
}

/* =====================================================
   NEXT MAP 3
===================================================== */

function next() {

    current++;

    if (current >= q.length) {

        clearInterval(timer);

        document.getElementById("gameMusic").pause();
        document.getElementById("winSound").play();
        document.getElementById("clapSound").play();

        show("win");

        typeWriterWin(
            `The school begins to crumble.
The black marks vanish from every graduation photo.
The forgotten students finally smile.
You have proven that your future still belongs to you.
You escaped the Dead Students Society.`,
            "win-story",
            "win-btn",
            "allanswer-btn"
        );

        return;
    }

    load();
}

/* =====================================================
   UPDATE LIVES
===================================================== */

function updateLives() {
    document.getElementById("lives").innerHTML =
        "❤️".repeat(lives);
}

/* =====================================================
   GAME OVER TIMER
===================================================== */

function startGameOverTimer() {

    let t = 10;
    let btn = document.getElementById("retry-btn");
    let box = document.getElementById("over-timer");

    btn.disabled = true;
    box.innerHTML = "Retry in " + t + "s";

    clearInterval(overCountdown);

    overCountdown = setInterval(() => {

        t--;
        box.innerHTML = "Retry in " + t + "s";

        if (t <= 0) {
            clearInterval(overCountdown);
            btn.disabled = false;
            box.innerHTML = "You can retry now";
        }

    }, 1000);
}


/* =====================================================
   POPUP LỜI GIẢI THUA
===================================================== */

function showWrongSolution() {

    const popup = document.getElementById("solution-popup");

    popup.style.display = "flex";
    popup.classList.add("active");

    document.getElementById("solution-title").innerHTML =
        "❌ WRONG ANSWERS";

    let html = "";

    if (wrongQuestions.length === 0) {
        html = `
        <div class="solution-card">
            <h3>Không có dữ liệu</h3>
            <p>Chưa ghi nhận câu trả lời sai.</p>
        </div>`;
    }

    wrongQuestions.forEach((item, i) => {
        html += `
        <div class="solution-card">
            <h3>Câu sai ${i + 1}</h3>
            <p><b>Câu hỏi:</b></p>
            <p>${item.question}</p>

            <p><b>Đáp án đúng:</b></p>
            <p>${item.correct}</p>

            <p><b>Giải thích:</b></p>
            <p>${item.explain}</p>
        </div>`;
    });

    document.getElementById("solution-content").innerHTML = html;
}


/* =====================================================
   POPUP LỜI GIẢI THẮNG
===================================================== */

function showWinSolution() {

    const popup = document.getElementById("solution-popup");

    popup.style.display = "flex";
    popup.classList.add("active");

    document.getElementById("solution-title").innerHTML =
        "🏆 FULL ANSWERS";

    let html = "";

    /* MAP 1 */

    html += `
    <div class="solution-card">
        <h2>MAP 1</h2>
    </div>`;

    map1.forEach((item, index) => {

        html += `
        <div class="solution-card">

            <h3>Câu ${index + 1}</h3>

            <p><b>Câu hỏi:</b></p>
            <p>${item.q}</p>

            <p><b>Đáp án:</b></p>
            <p>${item.o[item.a]}</p>

            <p><b>Giải thích:</b></p>
            <p>${item.explain || "Chưa có lời giải."}</p>

        </div>`;
    });
    html += `
<div class="solution-card">
<h2>MAP 2</h2>
</div>
`;

    map2Questions.forEach((item, index) => {

        html += `
<div class="solution-card">

<h3>Câu ${index+1}</h3>

<p><b>Câu hỏi:</b></p>
<p>${item.question}</p>

<p><b>Đáp án:</b></p>
<p>${item.correct}</p>

<p><b>Giải thích:</b></p>
<p>${item.explain}</p>

</div>
`;

    });
    /* MAP 3 */

    html += `
    <div class="solution-card">
        <h2>MAP 3</h2>
    </div>`;

    q.forEach((item, index) => {

        html += `
        <div class="solution-card">

            <h3>Câu ${index + 1}</h3>

            <p><b>Câu hỏi:</b></p>
            <p>${item.q}</p>

            <p><b>Đáp án:</b></p>
            <p>${item.a}</p>

            <p><b>Giải thích:</b></p>
            <p>${item.explain || "Chưa có lời giải."}</p>

        </div>`;
    });


    document.getElementById("solution-content").innerHTML = html;
}

/* =====================================================
   ĐÓNG POPUP
===================================================== */

function closeSolution() {

    const popup =
        document.getElementById("solution-popup");

    popup.classList.remove("active");
    popup.style.display = "none";
}


/* =====================================================
   RESTART GAME
===================================================== */

function restart() {
    location.reload();
}


// combo skill đúng sai
function showCombo(text, type = "correct") {

    let box = document.getElementById("combo-effect");

    if (!box) return;

    box.innerHTML = text;

    box.className = "";

    box.classList.add(
        type === "correct" ?
        "combo-correct" :
        "combo-wrong"
    );

    box.style.opacity = "1";

    setTimeout(() => {
        box.style.opacity = "0";
    }, 1000);
}


// mở popup lời giải 
function openSolution() {
    document
        .getElementById("solution-popup")
        .classList.add("active");
}


// giúp nút x có thể hd 
document
    .getElementById("solution-popup")
    .addEventListener("click", function (e) {

        if (e.target.id === "solution-popup") {

            closeSolution();

        }

    });


/* =====================================
RAIN EFFECT
===================================== */

function setRain(enable) {
    const rain = document.getElementById("rainSound");
    if (!rain) return;

    if (enable) {
        rain.loop = true;
        rain.volume = 0.3;
        rain.play().catch(() => {});
    } else {
        rain.pause();
        rain.currentTime = 0;
    }
}


const rain = document.getElementById("rain");

for (let i = 0; i < 150; i++) {

    let drop =
        document.createElement("div");

    drop.className = "raindrop";

    drop.style.left =
        Math.random() * 100 + "%";

    drop.style.animationDuration =
        (0.5 + Math.random()) + "s";

    drop.style.animationDelay =
        Math.random() * 2 + "s";

    rain.appendChild(drop);
}


/* =====================================
THUNDER EFFECT
===================================== */
function thunderFlash() {

    const thunder = document.getElementById("thunderSound");

    if (thunder) {
        thunder.currentTime = 0;
        thunder.play().catch(() => {});
    }

    const flash = document.getElementById("lightning");

    if (flash) {
        flash.classList.add("flash");

        setTimeout(() => {
            flash.classList.remove("flash");
        }, 300);
    }
}

// sét ngẫu nhiên
setInterval(() => {

    const intro =
        document.getElementById("intro")
        .classList.contains("active");

    const login =
        document.getElementById("login")
        .classList.contains("active");

    if (!intro && !login) return;

    if (Math.random() < 0.25) {
        thunderFlash()
        const flash =
            document.getElementById("lightning");

        flash.classList.add("flash");

        setTimeout(() => {
            flash.classList.remove("flash");
        }, 250);
    }

}, 4000);


// tự động ẩn mưa khi vào game 
function updateRainEffect() {

    const currentScreen =
        document.querySelector(".screen.active");

    if (!currentScreen) return;

    const rain =
        document.getElementById("rain");

    const lightning =
        document.getElementById("lightning");

    const showEffect =
        currentScreen.id === "intro" ||
        currentScreen.id === "login";

    if (rain) {
        rain.style.display =
            showEffect ? "block" : "none";
    }

    if (lightning) {
        lightning.style.display =
            showEffect ? "block" : "none";
    }
}


const ghost =
    document.getElementById("ghost-particles");

for (let i = 0; i < 30; i++) {

    let p = document.createElement("span");

    p.className = "ghost";

    p.style.left = Math.random() * 100 + "%";

    p.style.animationDelay =
        Math.random() * 10 + "s";

    ghost.appendChild(p);
}

function updateIntroEffects() {

    const screen =
        document.querySelector(".screen.active");

    if (!screen) return;

    const showEffect =
        screen.id === "intro" ||
        screen.id === "login";

    const fog =
        document.getElementById("fog");

    const ghost =
        document.getElementById("ghost-particles");

    const hall =
        document.getElementById("hall-light");

    if (fog)
        fog.style.display =
        showEffect ? "block" : "none";

    if (ghost)
        ghost.style.display =
        showEffect ? "block" : "none";

    if (hall)
        hall.style.display =
        showEffect ? "block" : "none";
}


/* ==========================
   MAP 1 ANSWERS
========================== */

function showMap1Solution() {

    document.getElementById("solution-title").innerHTML =
        "📖 MAP 1 ANSWERS";

    let html = "";

    map1.forEach((item, i) => {

        html += `
        <div class="solution-card">

            <h3>Question ${i + 1}</h3>

            <p><b>Question:</b></p>
            <p>${item.q}</p>

            <p><b>Answer:</b></p>
            <p>${item.o[item.a]}</p>

            <p><b>Explanation:</b></p>
            <p>${item.explain}</p>

        </div>
        `;
    });

    document.getElementById("solution-content").innerHTML = html;

    document.getElementById("solution-popup").style.display = "flex";
}

/* ==========================
   MAP 2 ANSWERS
========================== */

function showMap2Solution() {

    document.getElementById("solution-title").innerHTML =
        "📖 MAP 2 ANSWERS";

    let html = "";

    map2Questions.forEach((item, i) => {

        html += `
        <div class="solution-card">

            <h3>Question ${i + 1}</h3>

            <p><b>Question:</b></p>
            <p>${item.question}</p>

            <p><b>Answer:</b></p>
            <p>${item.correct}</p>

            <p><b>Explanation:</b></p>
            <p>${item.explain}</p>

        </div>
        `;
    });

    document.getElementById("solution-content").innerHTML = html;

    document.getElementById("solution-popup").style.display = "flex";
}


/* ==========================
   MAP 3 ANSWERS
========================== */

function showMap3Solution() {

    document.getElementById("solution-title").innerHTML =
        "📖 MAP 3 ANSWERS";

    let html = "";

    q.forEach((item, i) => {

        html += `
        <div class="solution-card">

            <h3>Question ${i + 1}</h3>

            <p><b>Question:</b></p>
            <p>${item.q}</p>

            <p><b>Answer:</b></p>
            <p>${item.a}</p>

            <p><b>Explanation:</b></p>
            <p>${item.explain}</p>

        </div>
        `;
    });

    document.getElementById("solution-content").innerHTML = html;

    document.getElementById("solution-popup").style.display = "flex";
}


// WIN STORY
function typeWriterWin(text, textId, buttonId, answerBtnId = null) {

    const box = document.getElementById(textId);
    const btn = document.getElementById(buttonId);

    let answerBtn = null;

    if (answerBtnId) {
        answerBtn = document.getElementById(answerBtnId);
        answerBtn.style.display = "none";
    }

    box.innerHTML = "";
    btn.style.display = "none";

    let i = 0;

    function typing() {

        if (i < text.length) {

            if (text.charAt(i) === "\n") {
                box.innerHTML += "<br>";
            } else {
                box.innerHTML += text.charAt(i);
            }

            i++;
            setTimeout(typing, 35);

        } else {

            btn.style.display = "inline-block";

            if (answerBtn) {
                answerBtn.style.display = "inline-block";
            }
        }
    }

    typing();
}

function playJumpscare() {

    const video =
        document.getElementById(
            "jumpscareVideo"
        );

    const title =
        document.getElementById(
            "over-title"
        );

    video.style.display = "block";

    title.style.opacity = "0.2";

    video.currentTime = 0;

    video.play().catch(() => {});

    video.onended = () => {

        video.style.display = "none";

        title.style.opacity = "1";

    };
}

function unlockAllInputs() {

    document.querySelectorAll("button").forEach(b => {
        b.disabled = false;
        b.style.pointerEvents = "auto";
    });

    document.querySelectorAll(".answer").forEach(a => {
        a.style.pointerEvents = "auto";
    });

    const over = document.getElementById("over");
    if (over) {
        over.style.pointerEvents = "auto";
    }

    const video = document.getElementById("jumpscareVideo");
    if (video) {
        video.style.pointerEvents = "none";
    }
}
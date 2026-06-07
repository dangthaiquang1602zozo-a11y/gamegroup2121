/**
 * rankScore.test.js
 * Quick sanity tests — run with:  node rankScore.test.js
 */

const { computeRankScore, normalise, toGrade } = require("./rankScore");

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✅  ${label}`);
    passed++;
  } else {
    console.error(`  ❌  ${label}`);
    failed++;
  }
}

// ── normalise ────────────────────────────────────────
console.log("\n[normalise]");
assert("50/100 = 0.5",        normalise(50, 100) === 0.5);
assert("0/100  = 0",          normalise(0, 100)  === 0);
assert("clamp over max → 1",  normalise(200, 100) === 1);
assert("clamp negative → 0",  normalise(-10, 100) === 0);

// ── computeRankScore ─────────────────────────────────
console.log("\n[computeRankScore]");

const perfect = computeRankScore({ quizScore: 100, timeStudied: 3600 });
assert("perfect score = 100",  perfect.rankScore === 100);
assert("perfect grade = S",    perfect.grade === "S");
assert("quiz component = 30",  perfect.quizComponent === 30);
assert("time component = 70",  perfect.timeComponent === 70);

const zero = computeRankScore({ quizScore: 0, timeStudied: 0 });
assert("zero score = 0",       zero.rankScore === 0);
assert("zero grade = F",       zero.grade === "F");

// 70/100 quiz, 1800/3600 time
// rankScore = round(0.7*30 + 0.5*70) = round(21+35) = 56
const mid = computeRankScore({ quizScore: 70, timeStudied: 1800 });
assert("mid score = 56",       mid.rankScore === 56);
assert("mid grade = C",        mid.grade === "C");

// Custom maxima
const custom = computeRankScore({
  quizScore: 40, maxQuizScore: 50,    // 80% quiz
  timeStudied: 60, maxTimeStudied: 120 // 50% time
});
// round(0.8*30 + 0.5*70) = round(24+35) = 59
assert("custom max score = 59", custom.rankScore === 59);

// ── toGrade ──────────────────────────────────────────
console.log("\n[toGrade]");
[["S",90],["A",75],["B",60],["C",45],["D",30],["F",0]].forEach(([g,s]) =>
  assert(`${s} → ${g}`, require("./rankScore").toGrade(s) === g)
);

// ── error handling ───────────────────────────────────
console.log("\n[error handling]");
try {
  computeRankScore({ quizScore: 80 }); // missing timeStudied
  assert("throws on missing timeStudied", false);
} catch {
  assert("throws on missing timeStudied", true);
}

// ── Summary ──────────────────────────────────────────
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);

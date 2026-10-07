const state = {
  round: 1,
  scoreA: 0,
  scoreB: 0,
  locked: false
};

const $ = id => document.getElementById(id);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createQuestion() {
  const x = randomInt(3, 9);
  const y = randomInt(3, 9);
  const correct = x * y;
  const choices = [correct];

  while (choices.length < 4) {
    let value;
    if (Math.random() < 0.45) {
      value = 8 + randomInt(0, 16);
    } else {
      value = randomInt(3, 9) * randomInt(3, 9);
    }
    if (!choices.includes(value)) choices.push(value);
  }

  choices.sort(() => Math.random() - 0.5);
  return { x, y, correct, choices };
}

function updateScores() {
  $("scoreA").textContent = state.scoreA;
  $("scoreB").textContent = state.scoreB;

  $("hpA").style.width =
    Math.max(15, 100 - state.scoreB / 110 * 85) + "%";
  $("hpB").style.width =
    Math.max(15, 100 - state.scoreA / 110 * 85) + "%";
}

function startRound() {
  state.locked = false;
  $("next").disabled = true;
  $("round").textContent = `Ronde ${state.round} / 11`;

  const q = createQuestion();
  $("question").textContent = `${q.x} × ${q.y} = ?`;
  $("answers").innerHTML = "";
  $("status").textContent = "⚡ Rebutan! Pilih jawaban secepat mungkin.";

  q.choices.forEach(value => {
    const button = document.createElement("button");
    button.className = "answer";
    button.type = "button";
    button.textContent = value;
    button.addEventListener("click", () => answer(button, value, q.correct));
    $("answers").appendChild(button);
  });
}

function answer(button, value, correct) {
  if (state.locked) return;
  state.locked = true;

  const isCorrect = value === correct;
  button.classList.add(isCorrect ? "correct" : "wrong");

  [...$("answers").children].forEach(btn => btn.disabled = true);

  if (isCorrect) {
    state.scoreA += 10;
    $("status").textContent = "🔥 BENAR! API INFERNO mendapat +10 poin!";
    $("monsterA").classList.add("hit");
    setTimeout(() => $("monsterA").classList.remove("hit"), 350);
  } else {
    $("status").textContent = "❌ Salah! HUTAN LIAR mengambil kesempatan...";
    setTimeout(() => {
      state.scoreB += 10;
      $("status").textContent = "👾 HUTAN LIAR mendapat +10 poin!";
      $("monsterB").classList.add("hit");
      setTimeout(() => $("monsterB").classList.remove("hit"), 350);
      updateScores();
    }, 250);
  }

  updateScores();
  $("next").disabled = false;
}

function finishGame() {
  state.locked = true;
  $("next").disabled = true;

  let result = "🤝 HASIL IMBANG!";
  if (state.scoreA > state.scoreB) result = "🏆 API INFERNO MENANG!";
  if (state.scoreB > state.scoreA) result = "🏆 HUTAN LIAR MENANG!";

  $("question").textContent = "PERTARUNGAN SELESAI";
  $("round").textContent = "SELESAI";
  $("status").textContent =
    `${result} Skor akhir: ${state.scoreA} - ${state.scoreB}.`;
}

$("next").addEventListener("click", () => {
  if (state.round >= 11) {
    finishGame();
    return;
  }
  state.round++;
  startRound();
});

$("restart").addEventListener("click", () => {
  state.round = 1;
  state.scoreA = 0;
  state.scoreB = 0;
  updateScores();
  startRound();
});

updateScores();
startRound();

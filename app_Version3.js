// --- Virtual Plant Pet ---

const plantStageEl = document.getElementById('plant-stage');
const waterStatusEl = document.getElementById('water-status');
const sunStatusEl = document.getElementById('sun-status');
const growthStatusEl = document.getElementById('growth-status');
const waterBtn = document.getElementById('water-btn');
const sunBtn = document.getElementById('sun-btn');
const resetBtn = document.getElementById('reset-btn');
const messageEl = document.getElementById('message');

// Plant states
const PLANT_STAGES = [
  {
    emoji: "🌱",
    label: "Seedling",
    req: { water: 0, sun: 0 }
  },
  {
    emoji: "🌿",
    label: "Sprout",
    req: { water: 2, sun: 1 }
  },
  {
    emoji: "🪴",
    label: "Potted Plant",
    req: { water: 4, sun: 3 }
  },
  {
    emoji: "🌻",
    label: "Blooming!",
    req: { water: 7, sun: 6 }
  },
  {
    emoji: "🌳",
    label: "Full Grown!",
    req: { water: 12, sun: 10 }
  }
];

// Load/save state to localStorage
function loadState() {
  const saved = localStorage.getItem('plant-pet-state');
  if (saved) return JSON.parse(saved);
  return { water: 0, sun: 0, growth: 0, lastWater: 0, lastSun: 0 };
}
function saveState(state) {
  localStorage.setItem('plant-pet-state', JSON.stringify(state));
}

// Get plant stage based on water/sun
function getPlantStage(state) {
  let idx = 0;
  for (let i = 0; i < PLANT_STAGES.length; i++) {
    const stage = PLANT_STAGES[i];
    if (state.water >= stage.req.water && state.sun >= stage.req.sun) {
      idx = i;
    }
  }
  return PLANT_STAGES[idx];
}

// --- UI updaters ---
function updateUI(state, msg = "") {
  const stage = getPlantStage(state);

  // Plant emoji with bounce if just advanced
  plantStageEl.innerHTML = `<span title="${stage.label}" style="display:inline-block">${stage.emoji}</span>`;
  waterStatusEl.textContent = `${state.water}`;
  sunStatusEl.textContent = `${state.sun}`;
  growthStatusEl.textContent = `${stage.label}`;

  if (msg) {
    messageEl.textContent = msg;
    setTimeout(() => messageEl.textContent = "", 2100);
  }
}

// --- Event handlers ---
function handleWater() {
  let state = loadState();
  state.water += 1;
  saveState(state);

  let stageBefore = getPlantStage({ ...state, water: state.water - 1 });
  let stageAfter = getPlantStage(state);
  let msg = (stageAfter !== stageBefore) ? `Your plant grew to: ${stageAfter.label}!` : "You watered the plant!";
  updateUI(state, msg);
}

function handleSun() {
  let state = loadState();
  state.sun += 1;
  saveState(state);

  let stageBefore = getPlantStage({ ...state, sun: state.sun - 1 });
  let stageAfter = getPlantStage(state);
  let msg = (stageAfter !== stageBefore) ? `Your plant grew to: ${stageAfter.label}!` : "Your plant enjoyed the sunlight!";
  updateUI(state, msg);
}

function handleReset() {
  if (!confirm("This will reset your plant and progress. Are you sure?")) return;
  const state = { water: 0, sun: 0, growth: 0, lastWater: 0, lastSun: 0 };
  saveState(state);
  updateUI(state, "Plant reset. Start fresh!");
}

// --- Wiring up ---
waterBtn.addEventListener('click', handleWater);
sunBtn.addEventListener('click', handleSun);
resetBtn.addEventListener('click', handleReset);

// --- Initial render ---
updateUI(loadState());
const crew = [
  { id: "nair", name: "CDR. Nair", role: "Mission Commander", initials: "AN", readiness: 92, vitals: { heartRate: 62, bp: 118, glucose: 92, temperature: 36.8, sleep: 7.2, mood: 3, ared: 150, radiation: 42.6 } },
  { id: "vance", name: "PLT. Vance", role: "Pilot", initials: "JV", readiness: 86, vitals: { heartRate: 71, bp: 126, glucose: 99, temperature: 37.0, sleep: 6.4, mood: 4, ared: 125, radiation: 39.2 } },
  { id: "sato", name: "MS1. Sato", role: "Flight Surgeon", initials: "KS", readiness: 96, vitals: { heartRate: 58, bp: 112, glucose: 88, temperature: 36.7, sleep: 7.8, mood: 2, ared: 180, radiation: 41.1 } },
  { id: "morales", name: "MS2. Morales", role: "Mission Specialist", initials: "LM", readiness: 78, vitals: { heartRate: 84, bp: 138, glucose: 112, temperature: 37.1, sleep: 5.8, mood: 6, ared: 92, radiation: 45.8 } }
];

const systems = {
  bone: { label: "MUSCULOSKELETAL", title: "Spine & bone loading", metric: "ARED exercise", key: "ared", unit: "min/wk", decimals: 0, chart: "boneLoad", copy: "Bones and muscles receive less load in microgravity, which can accelerate bone mineral loss and muscle atrophy. Resistive exercise helps preserve strength and skeletal health.", care: "Complete scheduled ARED resistance sessions using good form. Include squat and deadlift movements when prescribed.", alert: "Alert Flight Surgeon for new bone pain, injury, or inability to complete prescribed exercise.", good: v => v >= 150, warning: v => v >= 90 },
  brain: { label: "NEURO / CIRCADIAN", title: "Brain & circadian health", metric: "Sleep duration", key: "sleep", unit: "h", decimals: 1, chart: "sleepDebt", copy: "Microgravity does not create a natural day-night cue, and mission lighting can shift circadian timing. Sleep is the available onboard recovery measure for this scan; it is not a direct neural sensor.", care: "Keep a consistent sleep window. Use the cabin light cycle and eye protection during scheduled rest.", alert: "Alert Flight Surgeon if sleep is under 5 hours for 2 consecutive mission days, or if confusion or severe headache occurs.", good: v => v >= 7, warning: v => v >= 5 },
  lungs: { label: "RESPIRATORY", title: "Pulmonary health", metric: "Body temperature · illness screen", key: "temperature", unit: "°C", decimals: 1, chart: "heartRate", copy: "Fluid shifts and cabin air conditions can affect respiratory comfort. This dashboard has no oxygen-saturation or lung-function sensor; temperature is only an indirect illness screen.", care: "Maintain cabin hydration and follow prescribed exercise. Report cough, chest tightness, or unusual breathlessness rather than relying on this proxy reading.", alert: "Alert Flight Surgeon promptly for new or worsening shortness of breath, chest pain, or fever above 38 °C.", good: v => v >= 36 && v <= 37.5, warning: v => v >= 35.5 && v <= 38 },
  heart: { label: "CARDIOVASCULAR", title: "Cardiovascular", metric: "Resting heart rate", key: "heartRate", unit: "bpm", decimals: 0, chart: "heartRate", copy: "Without gravity pulling blood toward the legs, fluids shift toward the chest and head. Over time, the heart can decondition and respond differently to standing or exertion.", care: "Hydrate regularly and complete prescribed aerobic conditioning. Rise slowly after sleep and report dizziness.", alert: "Alert Flight Surgeon for persistent resting HR above 100 bpm, chest pain, or fainting.", good: v => v >= 50 && v <= 80, warning: v => v >= 45 && v <= 100 },
  liver: { label: "METABOLIC / LIVER", title: "Liver & metabolism", metric: "Blood glucose", key: "glucose", unit: "mg/dL", decimals: 0, chart: "heartRate", copy: "Meal timing, stress, and altered activity can influence metabolic regulation in flight. Glucose is a general metabolic marker here, not a direct liver-function test.", care: "Follow the planned meal schedule and hydration guidance. Record readings at consistent times relative to meals when possible.", alert: "Contact Flight Surgeon for repeated glucose readings outside the crew-specific plan or symptoms such as marked thirst or weakness.", good: v => v >= 70 && v <= 110, warning: v => v >= 60 && v <= 140 },
  stomach: { label: "GASTRIC", title: "Stomach & digestion", metric: "Mood / stress · motility context", key: "mood", unit: "/10", decimals: 0, chart: "sleepDebt", copy: "Microgravity can alter fluid distribution and orientation cues for the digestive system. The stress self-rating is only context for digestive comfort; nausea and abdominal symptoms are not directly measured in this dashboard.", care: "Eat slowly, keep meals predictable, and follow prescribed anti-nausea measures. Note digestive symptoms in the medical log.", alert: "Alert Flight Surgeon for persistent vomiting, severe abdominal pain, or inability to keep fluids down.", good: v => v <= 4, warning: v => v <= 7 },
  kidneys: { label: "RENAL / FLUID BALANCE", title: "Kidneys & fluid balance", metric: "Blood pressure · fluid-shift proxy", key: "bp", unit: "mmHg", decimals: 0, chart: "heartRate", copy: "In microgravity, fluid shifts toward the upper body and can change how the kidneys regulate fluid and electrolytes. Blood pressure is a contextual measure, not a direct renal-function test.", care: "Follow individualized fluid and nutrition guidance. Log blood pressure consistently and report changes in urine output.", alert: "Contact Flight Surgeon for blood pressure above 160 mmHg systolic, markedly reduced urine output, or flank pain.", good: v => v >= 90 && v < 130, warning: v => v >= 80 && v <= 160 },
  intestines: { label: "INTESTINAL / MOTILITY", title: "Intestinal motility", metric: "ARED activity · motility context", key: "ared", unit: "min/wk", decimals: 0, chart: "boneLoad", copy: "Microgravity, diet, hydration, and reduced movement can affect bowel motility. ARED minutes are an activity context only; bowel patterns are not directly measured by this dashboard.", care: "Keep meals, hydration, and movement regular. Record significant changes in bowel patterns for the medical team.", alert: "Alert Flight Surgeon for severe or persistent abdominal pain, blood in stool, or prolonged inability to pass stool.", good: v => v >= 150, warning: v => v >= 90 }
};

const protocols = [
  { id: "ared", title: "45m ARED Resistive Squat Protocol", detail: "BONE & MUSCLE · 45 MIN", icon: "dumbbell" },
  { id: "light", title: "10,000-Lux Circadian Light Therapy", detail: "SLEEP & MOOD · 20 MIN", icon: "sun" },
  { id: "hydrate", title: "Vitamin D3 + Hydration Check", detail: "NUTRITION · 500 ML WATER", icon: "droplets" }
];
const speSteps = [
  { title: "Relocate to water-wall shielded module", detail: "Move crew to the designated storm shelter and secure the hatch." },
  { title: "Log personal dosimeter readings", detail: "Record current dose for each crew member in the medical log." },
  { title: "Take anti-emetics if prescribed", detail: "Check individual medical plan before taking any medication." }
];

const state = {
  selectedCrew: "nair", selectedSystem: "bone", metric: "heartRate", chart: null,
  completedProtocols: new Set(), completedSpe: new Set(), speActive: false,
  baseMetSeconds: (((142 * 24 + 18) * 60 + 6) * 60 + 42), examLog: 0
};
crew.forEach(member => {
  member.initialReadiness = member.readiness;
  member.examLogged = false;
});
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const currentCrew = () => crew.find(member => member.id === state.selectedCrew);

function metricState(system, values) {
  const value = values[system.key];
  if (system.good(value)) return "optimal";
  if (system.warning(value)) return "drift";
  return "critical";
}
function overallReadiness(member = currentCrew()) {
  if (!member.examLogged) {
    return Math.max(0, Math.min(100, member.initialReadiness + state.completedProtocols.size * 2));
  }
  const readings = member.vitals;
  let score = 100;
  if (readings.heartRate < 50 || readings.heartRate > 85) score -= readings.heartRate > 100 ? 16 : 8;
  if (readings.bp > 130 || readings.bp < 90) score -= readings.bp > 150 ? 12 : 6;
  if (readings.glucose < 70 || readings.glucose > 140) score -= 8;
  if (readings.temperature < 36 || readings.temperature > 37.5) score -= 8;
  if (readings.sleep < 7) score -= Math.min(14, Math.round((7 - readings.sleep) * 5));
  if (readings.mood >= 7) score -= (readings.mood - 6) * 2;
  if (readings.ared < 150) score -= Math.min(12, Math.round((150 - readings.ared) / 10));
  if (readings.radiation >= 80) score -= readings.radiation >= 100 ? 15 : 8;
  return Math.max(0, Math.min(100, score + state.completedProtocols.size * 2));
}
function scoreColor(score) { return score >= 85 ? "#4ade80" : score >= 70 ? "#fbbf24" : "#fb6475"; }
function stateLabel(status) { return status === "optimal" ? "NOMINAL" : status === "drift" ? "DRIFT DETECTED" : "CRITICAL ALERT"; }

function renderCrew() {
  const root = $("#crew-grid");
  root.innerHTML = crew.map(member => {
    const score = member.id === state.selectedCrew ? overallReadiness(member) : member.readiness;
    return `<button class="crew-card ${member.id === state.selectedCrew ? "selected" : ""}" data-crew="${member.id}" aria-pressed="${member.id === state.selectedCrew}">
      <span class="crew-avatar">${member.initials}</span><span class="crew-copy"><strong>${member.name}</strong><small>${member.role}</small><small class="crew-role">ARTEMIS III</small></span>
      <span class="mini-ring" style="--score:${score};--ring-color:${scoreColor(score)}"><svg viewBox="0 0 36 36"><circle class="mini-track" cx="18" cy="18" r="15.9"/><circle class="mini-progress" cx="18" cy="18" r="15.9"/></svg><span>${score}</span></span>
    </button>`;
  }).join("");
  $$(".crew-card").forEach(card => card.addEventListener("click", () => {
    state.selectedCrew = card.dataset.crew;
    state.selectedSystem = "bone";
    state.completedProtocols.clear();
    renderAll();
  }));
}

function systemSummaries() {
  return Object.entries(systems).map(([id, system]) => ({ id, system, status: metricState(system, currentCrew().vitals) }));
}
function renderMap() {
  systemSummaries().forEach(({ id, status }) => {
    const control = $(`.system-pill[data-system="${id}"]`);
    if (control) {
      control.dataset.state = status;
      control.classList.toggle("active", state.selectedSystem === id);
      control.setAttribute("aria-pressed", String(state.selectedSystem === id));
    }
  });
  const system = systems[state.selectedSystem];
  const status = metricState(system, currentCrew().vitals);
  const raw = currentCrew().vitals[system.key];
  $("#diagnostic").dataset.state = status;
  $(".diagnostic-index").textContent = `SYSTEM 01 / ${system.label}`;
  $("#diagnostic-title").textContent = system.title;
  $("#measurement-value").innerHTML = `${system.metric} <b>${formatMetric(system, raw)}</b>`;
  $("#diagnostic-copy").textContent = system.copy;
  $("#care-guidance").textContent = system.care;
  $("#alert-guidance").textContent = system.alert;
  $("#system-status").className = `system-status ${status}-text`;
  $("#system-status").innerHTML = `<i class="live-dot"></i> ${stateLabel(status)}`;
}
function formatMetric(system, value) {
  if (system.key === "temperature") return `${Number(value).toFixed(1)} °C`;
  if (system.key === "sleep") return `${Number(value).toFixed(1)} h`;
  if (system.key === "radiation") return `${Number(value).toFixed(1)} mSv`;
  return `${Math.round(value)} ${system.unit}`;
}
function renderVitals() {
  const v = currentCrew().vitals;
  const info = [
    { label: "RESTING HR", value: `${v.heartRate}`, unit: "bpm", note: "BASELINE 50–80", state: v.heartRate >= 50 && v.heartRate <= 80 ? "optimal" : v.heartRate <= 100 ? "drift" : "critical" },
    { label: "BLOOD PRESSURE", value: `${v.bp}/`, unit: "mmHg", note: "TARGET < 130", state: v.bp < 130 ? "optimal" : v.bp <= 150 ? "drift" : "critical" },
    { label: "SLEEP / 24H", value: `${v.sleep.toFixed(1)}`, unit: "hrs", note: "TARGET ≥ 7 HRS", state: v.sleep >= 7 ? "optimal" : v.sleep >= 5 ? "drift" : "critical" },
    { label: "RADIATION DOSE", value: `${v.radiation.toFixed(1)}`, unit: "mSv", note: "CUMULATIVE DOSE", state: v.radiation < 60 ? "optimal" : v.radiation < 100 ? "drift" : "critical" }
  ];
  $("#vital-strip").innerHTML = info.map(item => `<div class="vital-item"><div class="vital-label"><i class="${item.state}"></i>${item.label}</div><div class="vital-value">${item.value}<small>${item.unit}</small></div><div class="vital-note">${item.note}</div></div>`).join("");
}
function renderReadiness() {
  const score = overallReadiness();
  $("#readiness-score").textContent = score;
  const ring = $("#readiness-ring-progress");
  ring.style.strokeDashoffset = `${427.26 * (1 - score / 100)}`;
  ring.style.stroke = scoreColor(score);
  ring.style.filter = `drop-shadow(0 0 6px ${scoreColor(score)}80)`;
  $("#readiness-state-title").textContent = score >= 85 ? "MISSION READY" : score >= 70 ? "MONITOR CLOSELY" : "FLIGHT SURGEON REVIEW";
  $("#readiness-state-subtitle").textContent = score >= 85 ? "All systems within operational parameters" : score >= 70 ? "One or more readings show a developing drift" : "Critical readings require immediate clinical review";
  $(".state-mark").style.background = scoreColor(score);
  $(".state-mark").style.boxShadow = `0 0 8px ${scoreColor(score)}`;
  const vitals = currentCrew().vitals;
  $("#vitals-score").textContent = `${Math.max(0, Math.min(100, 100 - (vitals.heartRate > 85 ? 10 : 0) - (vitals.bp > 130 ? 10 : 0) - (vitals.glucose > 140 ? 10 : 0) - (vitals.temperature > 37.5 ? 10 : 0)))}%`;
  $("#sleep-score").textContent = `${Math.max(0, Math.min(100, Math.round(vitals.sleep / 8 * 100)))}%`;
  $("#countermeasure-score").textContent = `${Math.round(state.completedProtocols.size / protocols.length * 100)}%`;
  const selectedCard = $(`.crew-card[data-crew="${state.selectedCrew}"] .mini-ring`);
  if (selectedCard) {
    selectedCard.style.setProperty("--score", score);
    selectedCard.style.setProperty("--ring-color", scoreColor(score));
    selectedCard.querySelector("span").textContent = score;
  }
}

const chartConfig = {
  heartRate: { label: "RESTING HR", unit: "bpm", color: "#38bdf8", limit: 100, current: c => c.vitals.heartRate, values: [66,65,68,64,63,65,62,67,64,63,65,61,64,63,62,66,64,62,61,63,60,64,62,61,63,62,60,64,62,62] },
  sleepDebt: { label: "SLEEP DURATION", unit: "hrs", color: "#a78bfa", limit: 5, current: c => c.vitals.sleep, values: [7.4,7.1,6.8,7.6,6.5,7.2,7.4,6.8,7.1,6.2,7.6,7.3,6.8,7.4,6.9,7.1,7.5,6.7,7.2,7.4,6.6,7.3,7.1,6.8,7.5,6.9,7.2,7.4,7.1,7.2] },
  radiation: { label: "CUMULATIVE DOSE", unit: "mSv", color: "#fb7185", limit: 100, current: c => c.vitals.radiation, values: [12,13,14,14.4,15,16.3,17,18.2,19,20.1,21,22.4,23,24.5,25,26.2,27,28,29.3,30,31.6,32,34,35.1,36,37.5,39,40,41.2,42.6] },
  boneLoad: { label: "ARED WEEKLY MINUTES", unit: "min", color: "#4ade80", limit: 90, current: c => c.vitals.ared, values: [165,156,170,160,152,145,160,170,158,150,165,155,148,170,160,142,150,165,156,154,168,145,150,170,162,155,140,165,156,150] }
};
function makeGradient(context, color) {
  const gradient = context.createLinearGradient(0, 0, 0, 260);
  gradient.addColorStop(0, `${color}42`);
  gradient.addColorStop(.8, `${color}04`);
  gradient.addColorStop(1, `${color}00`);
  return gradient;
}
function chartValues(def, member) {
  const values = [...def.values];
  values[values.length - 1] = def.current(member);
  return values;
}
function renderChart() {
  const def = chartConfig[state.metric];
  const member = currentCrew();
  const values = chartValues(def, member);
  const canvas = $("#trend-chart");
  $("#chart-summary-label").textContent = def.label;
  $("#chart-current").innerHTML = `${Number(def.current(member)).toFixed(state.metric === "sleepDebt" ? 1 : 0)} <small>${def.unit}</small>`;
  const slope = values[values.length - 1] - values[values.length - 7];
  const trend = $("#chart-trend");
  const goodDirection = state.metric === "radiation" ? false : state.metric === "heartRate" || state.metric === "sleepDebt" || state.metric === "boneLoad";
  trend.innerHTML = `<i data-lucide="${Math.abs(slope) < 1 ? "minus" : slope > 0 ? "trending-up" : "trending-down"}"></i> ${Math.abs(slope).toFixed(1)} ${def.unit} <span>vs. last 7d</span>`;
  trend.style.color = (slope >= 0) === goodDirection ? "#4ade80" : "#fbbf24";
  if (state.chart) state.chart.destroy();
  state.chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: Array.from({ length: 30 }, (_, index) => `D-${29 - index}`),
      datasets: [
        { label: def.label, data: values, borderColor: def.color, backgroundColor: makeGradient(canvas.getContext("2d"), def.color), fill: true, tension: .38, borderWidth: 2, pointRadius: values.map((_, i) => i === 29 ? 3 : 0), pointHoverRadius: 4, pointBackgroundColor: def.color, pointBorderColor: "#07101b", pointBorderWidth: 2 },
        { label: "Flight limit", data: Array(30).fill(def.limit), borderColor: "rgba(251,100,117,.65)", borderDash: [5,5], borderWidth: 1, pointRadius: 0, fill: false, tension: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: "rgba(5,12,25,.96)", borderColor: "rgba(56,189,248,.3)", borderWidth: 1, titleColor: "#a6b7c9", bodyColor: "#e5eef8", titleFont: { family: "JetBrains Mono", size: 9 }, bodyFont: { family: "JetBrains Mono", size: 10 }, padding: 10, displayColors: false, callbacks: { label: item => item.datasetIndex === 1 ? `Flight limit: ${def.limit} ${def.unit}` : ` ${item.formattedValue} ${def.unit}` } } },
      scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: "#607087", maxTicksLimit: 6, font: { family: "JetBrains Mono", size: 8 } } }, y: { border: { display: false }, grid: { color: "rgba(148,163,184,.08)" }, ticks: { color: "#607087", maxTicksLimit: 5, font: { family: "JetBrains Mono", size: 8 } } } }
    }
  });
  if (window.lucide) lucide.createIcons();
}

function renderProtocols() {
  $("#protocol-list").innerHTML = protocols.map(item => {
    const done = state.completedProtocols.has(item.id);
    return `<button class="protocol-card ${done ? "done" : ""}" data-protocol="${item.id}" aria-pressed="${done}"><span class="protocol-check"><i data-lucide="check"></i></span><span class="protocol-copy"><b>${item.title}</b><small>${done ? "COMPLETED ✓" : item.detail}</small></span></button>`;
  }).join("");
  $$(".protocol-card").forEach(card => card.addEventListener("click", () => {
    const id = card.dataset.protocol;
    if (state.completedProtocols.has(id)) state.completedProtocols.delete(id);
    else {
      state.completedProtocols.add(id);
      celebrate("Countermeasure logged — readiness boosted by 2 points.");
    }
    renderProtocols();
    updateProtocolProgress();
    renderReadiness();
    renderCrew();
    if (state.chart) renderChart();
  }));
  if (window.lucide) lucide.createIcons();
}
function updateProtocolProgress() {
  const count = state.completedProtocols.size;
  const pct = Math.round(count / protocols.length * 100);
  $("#protocol-progress-label").textContent = `${count} OF ${protocols.length} COMPLETED`;
  $("#protocol-progress-pct").textContent = `${pct}%`;
  $("#protocol-progress-bar").style.width = `${pct}%`;
}

function renderAll() {
  renderCrew();
  renderMap();
  renderVitals();
  renderProtocols();
  renderReadiness();
  updateProtocolProgress();
  renderChart();
  if (window.lucide) lucide.createIcons();
}

function setSystem(id) {
  if (!systems[id]) return;
  state.selectedSystem = id;
  renderMap();
}
function highlightMapSystem(id, active) {
  const control = $(`.system-pill[data-system="${id}"]`);
  if (control) control.classList.toggle("hovered", active);
}
function openExam() {
  $("#exam-drawer").classList.add("open");
  $("#exam-drawer").setAttribute("aria-hidden", "false");
  $("#drawer-backdrop").classList.add("open");
  document.body.style.overflow = "hidden";
  $("#exam-drawer input[name=heartRate]").focus({ preventScroll: true });
}
function closeExam() {
  $("#exam-drawer").classList.remove("open");
  $("#exam-drawer").setAttribute("aria-hidden", "true");
  $("#drawer-backdrop").classList.remove("open");
  if (!state.speActive) document.body.style.overflow = "";
}
function toast(message, error = false) {
  const node = document.createElement("div");
  node.className = `toast ${error ? "error" : ""}`;
  node.innerHTML = `<i data-lucide="${error ? "triangle-alert" : "circle-check"}"></i><span>${message}</span>`;
  $("#toast-container").appendChild(node);
  if (window.lucide) lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  setTimeout(() => node.remove(), 3500);
}
function celebrate(message) {
  const score = $("#readiness-score");
  score.classList.remove("score-pop");
  void score.offsetWidth;
  score.classList.add("score-pop");
  toast(message);
}

const outputFormatters = {
  heartRate: val => `${val} bpm`, bp: val => `${val} mmHg`, glucose: val => `${val} mg/dL`,
  temperature: val => `${(val / 10).toFixed(1)} °C`, sleep: val => `${Number(val).toFixed(1)} hrs`,
  mood: val => `${val} / 10`, ared: val => `${val} min`
};
function updateRangeOutput(input) {
  const output = $(`#${input.name === "heartRate" ? "heart-rate" : input.name}-output`);
  if (output) output.textContent = outputFormatters[input.name](input.value);
}
function submitExam(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const member = currentCrew();
  member.vitals.heartRate = Number(data.get("heartRate"));
  member.vitals.bp = Number(data.get("bp"));
  member.vitals.glucose = Number(data.get("glucose"));
  member.vitals.temperature = Number(data.get("temperature")) / 10;
  member.vitals.sleep = Number(data.get("sleep"));
  member.vitals.mood = Number(data.get("mood"));
  member.vitals.ared = Number(data.get("ared"));
  const score = overallReadiness(member);
  member.examLogged = true;
  state.examLog++;
  closeExam();
  renderAll();
  const critical = systemSummaries().filter(item => item.status === "critical");
  $("#readiness-score").classList.remove("score-pop");
  void $("#readiness-score").offsetWidth;
  $("#readiness-score").classList.add("score-pop");
  if (critical.length) toast(`Self-exam saved. ${critical.length} critical reading(s): contact Flight Surgeon.`, true);
  else toast("Self-exam saved. Crew health model and trend charts updated.");
}
function renderSpeSteps() {
  $("#spe-checklist").innerHTML = speSteps.map((step, index) => {
    const done = state.completedSpe.has(index);
    return `<button class="spe-step ${done ? "done" : ""}" data-step="${index}" aria-pressed="${done}"><span class="spe-step-check"><i data-lucide="check"></i></span><span><b>${step.title}</b><small>${step.detail}</small></span></button>`;
  }).join("");
  $$(".spe-step").forEach(button => button.addEventListener("click", () => {
    const step = Number(button.dataset.step);
    if (state.completedSpe.has(step)) state.completedSpe.delete(step);
    else state.completedSpe.add(step);
    renderSpeSteps();
    const count = state.completedSpe.size;
    $("#spe-progress-label").textContent = `${count} / ${speSteps.length} STEPS COMPLETE`;
    $("#spe-finish").disabled = count !== speSteps.length;
    $("#flux-reading").innerHTML = `${(0.38 + Math.max(0, 3 - count) * 0.19).toFixed(2)} <small>mSv/hr</small>`;
  }));
  if (window.lucide) lucide.createIcons();
}
function setSpeMode(active) {
  state.speActive = active;
  document.body.classList.toggle("spe-active", active);
  $("#spe-toggle").setAttribute("aria-pressed", String(active));
  $("#mission-status").textContent = active ? "SPE ALERT" : "NOMINAL";
  if (active) {
    state.completedSpe.clear();
    renderSpeSteps();
    $("#spe-progress-label").textContent = `0 / ${speSteps.length} STEPS COMPLETE`;
    $("#spe-finish").disabled = true;
    $("#flux-reading").innerHTML = "0.38 <small>mSv/hr</small>";
    $("#spe-modal-backdrop").classList.add("open");
    $("#spe-modal").classList.add("open");
    $("#spe-modal").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    toast("Solar particle event simulation active. Begin shelter protocol.", true);
  } else {
    $("#spe-modal-backdrop").classList.remove("open");
    $("#spe-modal").classList.remove("open");
    $("#spe-modal").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}
function finishSpe() {
  if (state.completedSpe.size !== speSteps.length) return;
  currentCrew().vitals.radiation += 0.4;
  setSpeMode(false);
  state.completedSpe.clear();
  renderAll();
  toast("Shelter protocol complete. Crew status stabilized; dosimeters logged.");
}
function tickClock() {
  state.baseMetSeconds++;
  const days = Math.floor(state.baseMetSeconds / 86400);
  const hours = Math.floor(state.baseMetSeconds % 86400 / 3600);
  const minutes = Math.floor(state.baseMetSeconds % 3600 / 60);
  const seconds = state.baseMetSeconds % 60;
  $("#met-clock").textContent = `${String(days).padStart(3,"0")}:${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
  const now = new Date();
  $("#local-time").textContent = `UTC ${now.toISOString().slice(11,19)}`;
}
function tickFlux() {
  if (!state.speActive) return;
  const count = state.completedSpe.size;
  const flux = .38 + (3 - count) * .19 + Math.sin(Date.now() / 1200) * .035;
  $("#flux-reading").innerHTML = `${Math.max(.15, flux).toFixed(2)} <small>mSv/hr</small>`;
}
function setupEvents() {
  $("#open-exam").addEventListener("click", openExam);
  $("#close-exam").addEventListener("click", closeExam);
  $("#drawer-backdrop").addEventListener("click", closeExam);
  $("#exam-form").addEventListener("input", event => { if (event.target.matches("input[type=range]")) updateRangeOutput(event.target); });
  $("#exam-form").addEventListener("submit", submitExam);
  $("#reset-system").addEventListener("click", () => setSystem("bone"));
  $("#view-system-trend").addEventListener("click", () => {
    setMetric(systems[state.selectedSystem].chart);
    $("#trend-chart").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  $$(".system-pill").forEach(pill => {
    const id = pill.dataset.system;
    pill.addEventListener("click", () => setSystem(id));
    pill.addEventListener("pointerenter", () => highlightMapSystem(id, true));
    pill.addEventListener("pointerleave", () => highlightMapSystem(id, false));
  });
  $$(".chart-tab").forEach(button => button.addEventListener("click", () => setMetric(button.dataset.metric)));
  $("#spe-toggle").addEventListener("click", () => setSpeMode(!state.speActive));
  $("#close-spe").addEventListener("click", () => setSpeMode(false));
  $("#spe-modal-backdrop").addEventListener("click", () => setSpeMode(false));
  $("#spe-finish").addEventListener("click", finishSpe);
  $("#readiness-info").addEventListener("click", () => toast("Readiness weights vitals, sleep, mood, ARED exercise, radiation, and completed countermeasures."));
  $("#readiness-details").addEventListener("click", () => {
    const score = overallReadiness();
    toast(`Current readiness: ${score}/100. Review the vitals, sleep, and countermeasure breakdown above.`);
  });
  $("#notification-button").addEventListener("click", () => {
    const alerts = systemSummaries().filter(item => item.status !== "optimal");
    toast(alerts.length ? `${alerts.length} system(s) show drift or alert for ${currentCrew().name}.` : "No new crew health notifications.");
  });
  $("#chart-range").addEventListener("click", () => toast("Showing the most recent 30 mission days."));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (state.speActive) setSpeMode(false);
      else closeExam();
    }
  });
}
function setMetric(metric) {
  state.metric = metric;
  $$(".chart-tab").forEach(button => button.classList.toggle("active", button.dataset.metric === metric));
  renderChart();
}

setupEvents();
renderAll();
tickClock();
setInterval(tickClock, 1000);
setInterval(tickFlux, 400);

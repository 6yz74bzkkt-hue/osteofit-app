// ===== Daten: 6 Kurseinheiten (aus dem Präventionsprogramm) =====
const units = [
  {
    title: "Einheit 1: Einführung & Grundlagen",
    goal: "Grundverständnis zur Erkrankung Osteoporose aufbauen.",
    exercises: [
      "Vortrag: Anatomie, Ursachen, Symptome, Therapie, Prognose",
      "Assessments: Chair-Stand-Test, Functional Reach, Einbeinstand, QUALEFFO-41",
      "Abschluss-Quiz zur Wissensüberprüfung"
    ]
  },
  {
    title: "Einheit 2: Verbesserung der Körperhaltung",
    goal: "Alltagsnahe Haltung bei Bewegung, Heben und Tragen schulen.",
    exercises: [
      "Kreuzheben mit Stab",
      "Mobilisation der Wirbelsäule (Extension im Sitz, Chin Tuck)",
      "Vierfüßlerstand: Arme/Beine im Wechsel strecken, Superman, Bridging"
    ]
  },
  {
    title: "Einheit 3: Verbesserung der Muskelfunktion",
    goal: "Ganzkörper-Kraftübungen mit ca. 70% der Maximalkraft.",
    exercises: [
      "Kniebeuge (3 Varianten je nach Trainingszustand)",
      "Theraband-Rudern",
      "Schulterdrücken",
      "Treppe steigen / Step-up",
      "Wadenheben (3 Varianten)"
    ]
  },
  {
    title: "Einheit 4: Verbesserung der Gelenkfunktion",
    goal: "Gelenkbeweglichkeit fördern, Ernährungstipps (Calcium, Vitamin D).",
    exercises: [
      "Mobilisationsübungen für Wirbelsäule, Schultergürtel, Becken",
      "Alltagsintegration der Übungen",
      "Ernährungsberatung: Calcium- und Vitamin-D-reiche Lebensmittel"
    ]
  },
  {
    title: "Einheit 5: Gleichgewicht & Transfer",
    goal: "Sturzrisiko senken durch dynamisches Gleichgewichtstraining.",
    exercises: [
      "Anlaufen und Anhalten, Richtungswechsel",
      "Übergang Sitz zu Einbeinstand",
      "Sturz- und Stolperstrategien einüben"
    ]
  },
  {
    title: "Einheit 6: Verbesserung des Gangbildes",
    goal: "Sicheres Gehen unter erschwerten Bedingungen trainieren.",
    exercises: [
      "Richtungswechsel beim Gehen",
      "Ausweichen und Übersteigen von Hindernissen",
      "Gehen auf unterschiedlichen Untergründen"
    ]
  }
];

// ===== Navigation =====
function showPage(page) {
  document.querySelectorAll('section.page').forEach(s => s.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('nav.tabbar button').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector(`nav.tabbar button[data-page="${page}"]`);
  if (navBtn) navBtn.classList.add('active');
  if (page === 'units') renderUnits();
  if (page === 'diary') renderDiary();
  if (page === 'assess') renderAssessments();
}

function renderUnits() {
  const list = document.getElementById('unitList');
  list.innerHTML = units.map(u => `
    <details class="unit">
      <summary>${u.title}</summary>
      <p style="margin:8px 0 0;font-size:0.85rem;color:#666;"><strong>Ziel:</strong> ${u.goal}</p>
      <ul>${u.exercises.map(e => `<li>${e}</li>`).join('')}</ul>
    </details>
  `).join('');
}

// ===== Dynamische Übungsfelder =====
function addExerciseField(exerciseValue = '', setsValue = '') {
  const container = document.getElementById('exerciseFields');
  const row = document.createElement('div');
  row.className = 'exercise-row';
  row.innerHTML = `
    <input type="text" class="exercise-input" placeholder="z.B. Kniebeuge" value="${exerciseValue.replace(/"/g, '&quot;')}">
    <input type="text" class="sets-input" placeholder="3x10" value="${setsValue.replace(/"/g, '&quot;')}">
    <button type="button" class="add-btn" onclick="removeExerciseField(this)">−</button>
  `;
  container.appendChild(row);
}

function removeExerciseField(button) {
  const container = document.getElementById('exerciseFields');
  if (container.querySelectorAll('.exercise-row').length > 1) {
    button.parentElement.remove();
  } else {
    button.parentElement.querySelector('.exercise-input').value = '';
    button.parentElement.querySelector('.sets-input').value = '';
  }
}

function resetExerciseFields() {
  const container = document.getElementById('exerciseFields');
  container.innerHTML = `
    <div class="exercise-row">
      <input type="text" class="exercise-input" placeholder="z.B. Kniebeuge" required>
      <input type="text" class="sets-input" placeholder="3x10">
      <button type="button" class="add-btn" onclick="addExerciseField()">+</button>
    </div>
  `;
}

// ===== Trainingstagebuch (localStorage) =====
function getDiary() {
  return JSON.parse(localStorage.getItem('osteofit_diary') || '[]');
}
function saveDiaryEntry(entry) {
  const entries = getDiary();
  entries.unshift(entry);
  localStorage.setItem('osteofit_diary', JSON.stringify(entries));
}
function renderDiary() {
  const container = document.getElementById('diaryEntries');
  const entries = getDiary();
  if (entries.length === 0) {
    container.innerHTML = '<p style="color:#888;font-size:0.85rem;">Noch keine Einträge vorhanden.</p>';
    return;
  }
  container.innerHTML = entries.map((e, index) => `
    <div class="entry">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <small>${e.date} &middot; ${e.feeling}</small>
        <button type="button" class="delete-btn" onclick="deleteDiaryEntry(${index})">🗑️</button>
      </div>
      <ul>${(e.exercises || []).map(ex => `<li>${ex.name}${ex.sets ? ' – ' + ex.sets : ''}</li>`).join('')}</ul>
      ${e.notes ? `<div>${e.notes}</div>` : ''}
    </div>
  `).join('');
}

function deleteDiaryEntry(index) {
  const entries = getDiary();
  entries.splice(index, 1);
  localStorage.setItem('osteofit_diary', JSON.stringify(entries));
  renderDiary();
  showToast('Eintrag gelöscht!');
}

document.getElementById('diaryForm').addEventListener('submit', function(ev) {
  ev.preventDefault();

  const rows = Array.from(document.querySelectorAll('#exerciseFields .exercise-row'));
  const selectedExercises = rows.map(row => ({
    name: row.querySelector('.exercise-input').value.trim(),
    sets: row.querySelector('.sets-input').value.trim()
  })).filter(ex => ex.name !== '');

  if (selectedExercises.length === 0) {
    showToast('Bitte mindestens eine Übung eingeben!');
    return;
  }

  const entry = {
    date: document.getElementById('d-date').value,
    exercises: selectedExercises,
    feeling: document.getElementById('d-feeling').value,
    notes: document.getElementById('d-notes').value
  };
  saveDiaryEntry(entry);

  ev.target.reset();
  resetExerciseFields();

  renderDiary();
  showToast('Eintrag gespeichert!');
});

// ===== Assessments (localStorage) =====
function getAssessments() {
  return JSON.parse(localStorage.getItem('osteofit_assess') || '[]');
}
function saveAssessment() {
  const result = {
    date: new Date().toLocaleDateString('de-DE'),
    chair: document.getElementById('a-chair').value,
    leg: document.getElementById('a-leg').value
  };
  const history = getAssessments();
  history.unshift(result);
  localStorage.setItem('osteofit_assess', JSON.stringify(history));
  ['a-chair', 'a-leg'].forEach(id => document.getElementById(id).value = '');
  renderAssessments();
  showToast('Ergebnis gespeichert!');
}
function renderAssessments() {
  const container = document.getElementById('assessHistory');
  const history = getAssessments();
  if (history.length === 0) {
    container.innerHTML = '<p style="color:#888;font-size:0.85rem;">Noch keine Ergebnisse vorhanden.</p>';
    return;
  }
  container.innerHTML = history.map((r, index) => `
    <div class="entry">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <small>${r.date}</small>
        <button type="button" class="delete-btn" onclick="deleteAssessment(${index})">🗑️</button>
      </div>
      Chair-Stand: <strong>${r.chair || '-'}</strong> Wdh. &middot;
      Einbeinstand: <strong>${r.leg || '-'}</strong> s
    </div>
  `).join('');
}

function deleteAssessment(index) {
  const history = getAssessments();
  history.splice(index, 1);
  localStorage.setItem('osteofit_assess', JSON.stringify(history));
  renderAssessments();
  showToast('Ergebnis gelöscht!');
}

// ===== Toast-Nachricht =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== Service Worker für Offline-Fähigkeit =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Fehler:', err));
  });
}

// Initial rendern
renderUnits();

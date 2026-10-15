// Throwaway UI study. All people, records, findings, and actions below are fictional.
const variants = [
  { key: "brief", name: "Brief first", number: "01" },
  { key: "timeline", name: "Timeline first", number: "02" },
  { key: "split", name: "Split screen", number: "03" },
];

const documents = {
  cbc: {
    title: "Complete blood count", date: "02 Oct 2026", type: "Lab report", icon: "⌁",
    pages: [
      [
        { text: "NORTH COAST DIAGNOSTICS", heading: true },
        { text: "Complete blood count · Sample report" },
        { text: "Collection date: 02 Oct 2026" },
        { text: "Haemoglobin     10.8 g/dL     L", fact: "hb" },
        { text: "Reference interval shown: 12.0–15.0 g/dL" },
        { text: "White cell count  7.1 × 10⁹/L" },
        { text: "Platelets         241 × 10⁹/L" },
        { text: "Flag L is printed by the reporting laboratory." },
      ],
      [
        { text: "NORTH COAST DIAGNOSTICS", heading: true },
        { text: "Complete blood count · continuation" },
        { text: "Report status: final" },
        { text: "This page contains laboratory formatting and notes." },
      ],
    ],
  },
  handwritten: {
    title: "Handwritten prescription", date: "18 Sep 2026", type: "Prescription", icon: "✎",
    pages: [[
      { text: "OUTPATIENT PRESCRIPTION", heading: true },
      { text: "Date: 18 Sep 2026" },
      { text: "Medicine line 1: handwriting unclear", fact: "handwriting", handwritten: true },
      { text: "Dose and schedule: cannot be read reliably", fact: "handwriting", handwritten: true },
      { text: "Original image should be checked with patient and doctor." },
    ]],
  },
  rx: {
    title: "Typed prescription", date: "09 Nov 2025", type: "Prescription", icon: "✎",
    pages: [[
      { text: "GENERAL MEDICINE OPD", heading: true },
      { text: "Date: 09 Nov 2025" },
      { text: "Metformin 500 mg — one tablet twice daily", fact: "medicine" },
      { text: "This is a past prescription, not proof of current use." },
    ]],
  },
  discharge: {
    title: "Discharge summary", date: "14 Jun 2025", type: "Discharge", icon: "▤",
    pages: [[
      { text: "DISCHARGE SUMMARY", heading: true },
      { text: "Admission: 12 Jun 2025 · Discharge: 14 Jun 2025" },
      { text: "Recorded reason: dehydration", fact: "admission" },
      { text: "Follow-up was advised in the source document." },
    ]],
  },
  xray: {
    title: "Chest X-ray and written report", date: "21 Apr 2024", type: "Radiology", icon: "▧",
    pages: [
      [{ image: true, text: "Demo image placeholder. The product would display the supplied X-ray without interpreting its pixels." }],
      [
        { text: "CHEST X-RAY · WRITTEN REPORT", heading: true },
        { text: "Date: 21 Apr 2024" },
        { text: "Impression in report: no acute findings", fact: "xray" },
        { text: "This text is from the written report only." },
      ],
    ],
  },
  allergy: {
    title: "Undated prior note", date: "Date unknown", type: "Clinical note", icon: "▤",
    pages: [[
      { text: "PRIOR CLINICAL NOTE", heading: true },
      { text: "Date on scan: unreadable" },
      { text: "Penicillin — rash recorded in prior note", fact: "allergy" },
      { text: "Current doctor has not yet confirmed this entry." },
    ]],
  },
  late: {
    title: "Newly processed thyroid report", date: "10 Oct 2026", type: "Lab report", icon: "⌁",
    pages: [[
      { text: "THYROID FUNCTION REPORT", heading: true },
      { text: "Report date: 10 Oct 2026" },
      { text: "TSH     6.1 mIU/L     H", fact: "late" },
      { text: "Flag H is printed by the reporting laboratory." },
    ]],
  },
};

const facts = [
  { id: "hb", title: "Haemoglobin flagged low", value: "10.8 g/dL", detail: "The laboratory marked this value low on 02 Oct 2026. No diagnosis is inferred.", doc: "cbc", page: 0, category: "Lab", provenance: "Document stated", priority: "high" },
  { id: "medicine", title: "Past metformin prescription", value: "Current use not reviewed", detail: "A typed prescription lists metformin 500 mg twice daily in Nov 2025. That page does not establish whether the patient takes it now.", doc: "rx", page: 0, category: "Medicine", provenance: "Past document; current use separate", priority: "high" },
  { id: "handwriting", title: "Handwritten medicine unclear", value: "Name and dose unreadable", detail: "The September prescription is retained as an image. A person needs to check the medicine and dose.", doc: "handwritten", page: 0, category: "Medicine", provenance: "Needs source review", priority: "high" },
  { id: "allergy", title: "Penicillin rash recorded", value: "Current status unconfirmed", detail: "An undated prior note records a rash with penicillin. The date and current allergy status need confirmation.", doc: "allergy", page: 0, category: "History", provenance: "Document stated", priority: "high" },
  { id: "admission", title: "Prior admission", value: "Dehydration · Jun 2025", detail: "The discharge summary records an admission for dehydration from 12–14 Jun 2025.", doc: "discharge", page: 0, category: "History", provenance: "Document stated", priority: "normal" },
  { id: "xray", title: "Written chest X-ray report", value: "No acute findings reported", detail: "This is the radiologist's written impression from Apr 2024. The image itself is not interpreted by the prototype.", doc: "xray", page: 1, category: "Radiology", provenance: "Written report", priority: "normal" },
  { id: "late", title: "New thyroid result", value: "TSH 6.1 mIU/L · lab flag H", detail: "A newly processed laboratory report marked this value high. It appears only after the late-upload simulation.", doc: "late", page: 0, category: "Lab", provenance: "Document stated", priority: "normal" },
];

const events = [
  { id: "cbc-event", date: "02 Oct 2026", order: 20261002, title: "Complete blood count", summary: "Haemoglobin 10.8 g/dL, flagged low by lab", type: "Lab", fact: "hb", doc: "cbc" },
  { id: "hand-event", date: "18 Sep 2026", order: 20260918, title: "Handwritten prescription", summary: "Medication name and dose need review", type: "Medicine", fact: "handwriting", doc: "handwritten" },
  { id: "rx-event", date: "09 Nov 2025", order: 20251109, title: "Typed prescription", summary: "Metformin listed; current use needs asking", type: "Medicine", fact: "medicine", doc: "rx" },
  { id: "discharge-event", date: "14 Jun 2025", order: 20250614, title: "Discharge summary", summary: "Admission for dehydration", type: "History", fact: "admission", doc: "discharge" },
  { id: "xray-event", date: "21 Apr 2024", order: 20240421, title: "Chest X-ray report", summary: "Written report: no acute findings", type: "Radiology", fact: "xray", doc: "xray" },
  { id: "allergy-event", date: "Date unknown", order: 0, title: "Undated prior note", summary: "Penicillin rash entry; date and status unconfirmed", type: "History", fact: "allergy", doc: "allergy" },
  { id: "late-event", date: "10 Oct 2026", order: 20261010, title: "New thyroid report", summary: "TSH 6.1 mIU/L, flagged high by lab", type: "Lab", fact: "late", doc: "late" },
];

const factById = Object.fromEntries(facts.map((fact) => [fact.id, fact]));
const eventById = Object.fromEntries(events.map((event) => [event.id, event]));
const variantKeys = variants.map((variant) => variant.key);
const scenarios = [
  { key: "happy", label: "Normal visit" },
  { key: "early", label: "Called in early" },
  { key: "trust", label: "Trust gate" },
  { key: "disagree", label: "Patient correction" },
  { key: "no-permission", label: "No permission" },
  { key: "wrong-patient", label: "Wrong patient" },
  { key: "next", label: "Next visit" },
];
const scenarioKeys = scenarios.map((scenario) => scenario.key);

function variantFromUrl() {
  const key = new URLSearchParams(location.search).get("variant");
  return variantKeys.includes(key) ? key : "timeline";
}

function scenarioFromUrl() {
  const key = new URLSearchParams(location.search).get("scenario");
  return scenarioKeys.includes(key) ? key : "happy";
}

function initialState(variant = variantFromUrl()) {
  return {
    variant, selectedFact: "hb", selectedEvent: "cbc-event", selectedDoc: "cbc",
    page: 0, zoom: 100, filter: "All", viewerOpen: false, splitPane: "brief",
    review: Object.fromEntries(facts.map((fact) => [fact.id, fact.id === "handwriting" ? "needs review" : "unreviewed"])),
    imported: [], version: 1, pendingPages: 0, pendingDocs: [], lateAdded: false, stateOpen: false,
    scenario: "happy", permission: true, identity: "matched", quarantinedPages: 0,
    visit: 1, sourceViewed: {}, medicationReport: null, medicationAsked: false,
    contradiction: null, priorVisit: null,
    lastAction: "Prototype ready",
  };
}

let state = initialState();
applyScenario(state, scenarioFromUrl());
let toastTimer;

function applyScenario(demo, key) {
  demo.scenario = key;
  if (key === "early") {
    demo.pendingDocs = ["handwritten", "xray"];
    demo.pendingPages = 3;
  }
  if (key === "trust") {
    demo.selectedFact = "medicine";
    demo.selectedEvent = "rx-event";
    demo.selectedDoc = "rx";
  }
  if (key === "disagree") {
    demo.selectedFact = "medicine";
    demo.selectedEvent = "rx-event";
    demo.selectedDoc = "rx";
    demo.sourceViewed.medicine = true;
    demo.medicationReport = "taking";
    demo.medicationAsked = true;
    demo.review.medicine = "confirmed";
    demo.imported = ["medicine"];
  }
  if (key === "no-permission" || key === "next") demo.permission = false;
  if (key === "wrong-patient") { demo.identity = "mismatch"; demo.quarantinedPages = 1; }
  if (key === "next") {
    demo.visit = 2;
    demo.priorVisit = { date: "12 Oct 2026", medicationReport: "taking", doctorReviewed: true };
  }
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function canViewRecords() { return state.permission && state.identity === "matched"; }
function availableDocuments() { return canViewRecords() ? Object.entries(documents).filter(([key]) => (key !== "late" || state.lateAdded) && !state.pendingDocs.includes(key)) : []; }
function availableFacts() { const ids = new Set(availableDocuments().map(([key]) => key)); return facts.filter((fact) => ids.has(fact.doc)); }
function availableEvents() { const ids = new Set(availableDocuments().map(([key]) => key)); return events.filter((event) => ids.has(event.doc)).sort((a, b) => b.order - a.order); }
function factValue(fact) { return fact.id === "medicine" ? (state.medicationAsked ? `Patient reports ${state.medicationReport}` : "Current use not reviewed") : fact.value; }
function eventSummary(event) { return event.fact === "medicine" ? `Metformin prescribed; ${factValue(factById.medicine).toLowerCase()}` : event.summary; }
function countConfirmed() { return availableFacts().filter((fact) => state.review[fact.id] === "confirmed").length; }
function countNeedsReview() { return availableFacts().filter((fact) => state.review[fact.id] === "needs review").length; }
function countOpenPriorityChecks() { return availableFacts().filter((fact) => fact.priority === "high" && state.review[fact.id] !== "confirmed").length; }
function getSelectedFact() { return factById[state.selectedFact] || facts[0]; }
function getSelectedDoc() { return documents[state.selectedDoc] || documents.cbc; }

function pill(status) {
  const tone = status === "confirmed" ? "green" : status === "needs review" ? "amber" : "slate";
  return `<span class="pill pill-${tone}">${esc(status === "confirmed" ? "doctor reviewed" : status)}</span>`;
}

function sourceButton(fact, label = "Open source") {
  return `<button class="text-button" data-action="source" data-fact="${fact.id}">${esc(label)} <span aria-hidden="true">↗</span></button>`;
}

function medicationReview() {
  return `<div class="medication-review"><div><strong>Is the patient taking this medicine now?</strong><small>Ask the patient. The 2025 prescription only shows what was prescribed then.</small></div>
    <div class="medication-options" role="group" aria-label="Patient reported metformin use">
      ${["taking", "stopped", "unsure"].map((status) => `<button class="${state.medicationAsked && state.medicationReport === status ? "active" : ""}" data-action="medication-status" data-status="${status}" aria-pressed="${state.medicationAsked && state.medicationReport === status}">${status[0].toUpperCase() + status.slice(1)}</button>`).join("")}
    </div><p>${state.medicationAsked ? `Patient reports <strong>${esc(state.medicationReport)}</strong> for this visit. Doctor review is ${state.review.medicine === "confirmed" ? "complete" : "still needed"}.` : "No answer recorded for this visit."}</p></div>`;
}

function factActions(fact, compact = false) {
  const confirmed = state.review[fact.id] === "confirmed";
  const imported = state.imported.includes(fact.id);
  return `<div class="fact-actions ${compact ? "compact" : ""}">
    <button class="small-button ${confirmed ? "is-confirmed" : ""}" data-action="confirm" data-fact="${fact.id}" aria-label="Review source for ${esc(fact.title)}">${confirmed ? "✓ Reviewed" : "Review"}</button>
    <button class="small-button" data-action="flag" data-fact="${fact.id}" aria-label="Flag ${esc(fact.title)} for review">Flag</button>
    <button class="small-button ${imported ? "is-imported" : ""}" data-action="import" data-fact="${fact.id}" aria-label="${imported ? "Remove" : "Add"} ${esc(fact.title)} ${imported ? "from" : "to"} note">${imported ? "✓ In note" : "+ To note"}</button>
  </div>`;
}

function topBar() {
  return `<header class="topbar">
    <div class="brand"><span class="brand-mark">R</span><div><strong>Record Brief</strong><small>General Medicine workspace</small></div></div>
    <div class="topbar-right"><span class="topbar-meta">${state.visit === 2 ? "Friday, 20 Nov 2026" : "Monday, 12 Oct 2026"}</span><span class="demo-chip">FICTIONAL DEMO</span></div>
  </header>`;
}

function scenarioSwitcher() {
  return `<div class="scenario-lab"><div><span class="eyebrow">WORKFLOW TEST</span><strong>Choose a visit situation</strong></div><div class="scenario-options">${scenarios.map((scenario) => `<button class="${state.scenario === scenario.key ? "active" : ""}" data-action="scenario" data-scenario="${scenario.key}" aria-pressed="${state.scenario === scenario.key}">${scenario.label}</button>`).join("")}</div></div>`;
}

function scenarioMessage() {
  if (state.scenario === "happy") return `<section class="scenario-message"><strong>Normal visit:</strong> six prior documents are ready. Open a source, ask about current medicine use, review the answer, then choose what enters today's note.</section>`;
  if (state.scenario === "early") return `<section class="scenario-message warning"><strong>Called in early:</strong> ${state.pendingDocs.length ? "the doctor sees only the ready documents. Two documents and three pages are still processing; more paper may be uncaptured." : "the remaining pages have arrived. New facts appear for review and never enter the note automatically."}</section>`;
  if (state.scenario === "trust") return `<section class="scenario-message warning"><strong>Trust gate:</strong> try adding the old metformin prescription to the note before viewing its source and asking the patient. The app will stop the action and explain the missing steps.</section>`;
  if (state.scenario === "disagree") return `<section class="scenario-message ${state.contradiction ? "warning" : ""}"><div><strong>Patient correction:</strong> ${state.contradiction ? `The patient changed their answer from ${esc(state.contradiction.before)} to ${esc(state.contradiction.after)}. The earlier review remains in the visit trail; the draft note item was removed. ${state.contradiction.resolved ? "Doctor reviewed the new report; add it to the note only if appropriate." : "Doctor must review the new report."}` : "The doctor previously reviewed ‘taking’ and added it to the draft note. Ask what happens when the patient changes that answer."}</div>${state.contradiction ? "" : `<button class="small-button dark" data-action="patient-disagrees">Patient now says stopped</button>`}</section>`;
  if (state.scenario === "next") return `<section class="scenario-message"><strong>Next visit:</strong> prior source documents and the dated review trail are available. Today's source checks, medicine-use answer, and note selections start again.</section>`;
  if (state.scenario === "wrong-patient") return `<section class="scenario-message warning"><strong>Identity check resolved:</strong> the mismatched page remains quarantined and does not appear among this patient's sources.</section>`;
  return `<section class="scenario-message"><strong>Permission recorded for this demo visit.</strong> The record brief is now visible.</section>`;
}

function gateScreen() {
  if (state.identity === "mismatch") return `<section class="access-gate"><span class="gate-mark">!</span><span class="eyebrow">RECORD ACCESS PAUSED</span><h1>Uploaded page does not match this patient</h1><p>No content from the mismatched page is shown or added to this visit. Staff must check the visit identity and set that page aside before the brief can open.</p><div class="gate-facts"><span>Visit ID: DEMO-1042</span><span>Quarantined: ${state.quarantinedPages} page</span></div><button class="small-button" data-action="resolve-identity">Simulate staff identity check</button><small>Demo action only. A real product needs a clinic-approved identity resolution process.</small></section>`;
  return `<section class="access-gate"><span class="gate-mark">×</span><span class="eyebrow">RECORD ACCESS PAUSED</span><h1>${state.visit === 2 ? "Permission for this visit is not recorded" : "Patient has not permitted record processing"}</h1><p>The consultation can proceed without this app. No prior-record brief or source page is displayed while permission is absent.</p>${state.visit === 2 ? `<div class="gate-facts"><span>May persist, subject to clinic policy: prior source documents and dated corrections</span><span>Reset for this visit: medicine-use answer, review checks, draft note</span></div>` : ""}<button class="small-button" data-action="grant-permission">Simulate patient permission</button><small>Demo action only. This page does not collect or store real consent.</small></section>`;
}

function patientStrip() {
  return `<section class="patient-strip" aria-label="Visit context">
    <div class="avatar">SP</div><div class="patient-main"><div class="patient-name">Sample Patient <span class="patient-id">DEMO-1042 · VISIT ${state.visit}</span></div><div class="patient-reason">Today: ${state.visit === 2 ? "follow-up and medicine review" : "fatigue and occasional dizziness for 3 weeks"} <span>· Patient reported</span></div></div>
    <div class="patient-status"><span class="status-dot"></span>${state.pendingPages ? `Partial brief · ${state.pendingPages} pages processing` : `Brief v${state.version} · ${availableDocuments().length} sources ready`}</div>
  </section>`;
}

function statusBanner() {
  return `<div class="status-banner ${state.pendingPages ? "status-partial" : "status-updated"}">
    <div><strong>${state.pendingPages ? "Partial record set" : state.lateAdded ? "New document available" : "Supplied records ready"}</strong><span>${state.pendingPages ? `${availableDocuments().length} documents ready; ${state.pendingDocs.length} documents / ${state.pendingPages} pages still processing. More paper may be uncaptured.` : state.lateAdded ? "A thyroid report was added. Review the updated brief before using new facts." : "Six supplied documents are ready. The patient may still have other records that were not supplied."}</span></div>
    ${state.pendingPages ? `<button class="small-button dark" data-action="complete-processing">Finish processing</button>` : `<button class="small-button dark" data-action="simulate-late" ${state.lateAdded ? "disabled" : ""}>${state.lateAdded ? "Late upload added" : "Simulate late upload"}</button>`}
  </div>`;
}

function pageIntro(number, heading, description) {
  return `<div class="page-intro"><div><span class="eyebrow">LAYOUT ${number} / UI STUDY</span><h1>${heading}</h1><p>${description}</p></div><div class="version-tag">Brief v${state.version} · ${availableDocuments().length} sources</div></div>`;
}

function noteBasket() {
  const items = state.imported.map((id) => factById[id]);
  return `<section class="note-basket"><div class="section-head"><div><span class="eyebrow">CURRENT CONSULTATION</span><h2>Selected for today's note</h2></div><span class="count-chip">${items.length} items</span></div>
    ${items.length ? `<ul>${items.map((fact) => `<li><span>✓</span><span>${esc(fact.id === "medicine" ? `Past metformin prescription; patient reports ${state.medicationReport} at this visit (doctor reviewed)` : `${fact.title}: ${factValue(fact)}`)}</span><button data-action="import" data-fact="${fact.id}" aria-label="Remove ${esc(fact.title)} from note">Remove</button></li>`).join("")}</ul>` : `<p class="muted empty-note">Open the source and complete doctor review before adding a fact. Nothing enters the note automatically.</p>`}
  </section>`;
}

function briefFactRow(fact) {
  return `<article class="fact-row ${state.selectedFact === fact.id ? "is-selected" : ""}">
    <div class="fact-symbol ${fact.category.toLowerCase()}">${documents[fact.doc].icon}</div>
    <div class="fact-copy"><div class="fact-meta">${esc(fact.category)} <span>·</span> ${esc(documents[fact.doc].date)} <span>·</span> ${esc(fact.provenance)}</div><h3>${esc(fact.title)}</h3><p>${esc(factValue(fact))}</p><div class="fact-bottom">${pill(state.review[fact.id])}${sourceButton(fact)}</div>${fact.id === "medicine" ? medicationReview() : ""}</div>
    <div class="fact-row-actions">${factActions(fact, true)}</div>
  </article>`;
}

function reviewQueue() {
  const queue = availableFacts().filter((fact) => state.review[fact.id] !== "confirmed" && fact.priority === "high");
  return `<section class="side-card"><div class="side-title"><span class="eyebrow">BEFORE IMPORT</span><h2>Review queue</h2><span class="count-chip amber">${queue.length}</span></div>
    <p class="side-help">These details need a human check against the source and patient.</p>
    <div class="queue-list">${queue.map((fact) => `<button class="queue-item" data-action="source" data-fact="${fact.id}"><span class="queue-dot"></span><span><strong>${esc(fact.title)}</strong><small>${esc(factValue(fact))}</small></span><span aria-hidden="true">↗</span></button>`).join("") || `<p class="muted">All priority facts confirmed.</p>`}</div>
  </section>`;
}

function reviewTrail() {
  if (!state.priorVisit && !state.contradiction && state.scenario !== "disagree") return "";
  const prior = state.priorVisit
    ? `<li><strong>12 Oct 2026 · Visit 1</strong><span>Patient reported ${esc(state.priorVisit.medicationReport)}; doctor reviewed that visit's report. Current use must be asked again today.</span></li>`
    : `<li><strong>12 Oct 2026 · Earlier this visit</strong><span>Patient reported taking metformin; doctor reviewed it and selected it for the draft note.</span></li>`;
  const correction = state.contradiction
    ? `<li><strong>12 Oct 2026 · Patient correction</strong><span>Patient now reports ${esc(state.contradiction.after)}. Earlier answer retained in this trail; draft note item removed. ${state.contradiction.resolved ? "Doctor reviewed the correction." : "Doctor review pending."}</span></li>` : "";
  return `<section class="review-trail"><span class="eyebrow">DATED REVIEW TRAIL</span><h2>Medicine-use history</h2><ul>${prior}${correction}</ul><p>Past answers are context. They do not establish what the patient takes today.</p></section>`;
}

function VariantA() {
  const visible = availableFacts();
  return `${pageIntro("01", "The case in 30 seconds", "Start with the essentials, then inspect the evidence and resolve uncertainties.")}
    <div class="brief-layout"><main class="brief-main">
      <section class="hero-brief"><div class="hero-head"><span class="eyebrow light">VISIT-FOCUSED BRIEF</span><span>${availableDocuments().length} prior documents · English</span></div>
        <h2>${state.visit === 2 ? "Follow-up and medicine review" : "Fatigue and occasional dizziness"}</h2><p>Patient-reported reason for today's visit. The items below come from supplied prior records and still need clinical review.${state.pendingPages ? " This brief is incomplete." : ""}</p>
        <div class="hero-points"><div><span class="point-label">Recent report</span><strong>Haemoglobin 10.8 g/dL</strong><small>Lab marked low · 02 Oct 2026</small></div><div><span class="point-label">Medication</span><strong>${esc(factValue(factById.medicine))}</strong><small>Past metformin prescription · ${state.review.medicine === "confirmed" ? "doctor reviewed" : "review pending"}</small></div><div><span class="point-label">Needs review</span><strong>${state.pendingDocs.includes("handwritten") ? "Prescription page processing" : "Handwritten prescription"}</strong><small>${state.pendingDocs.includes("handwritten") ? "Cannot review until ready" : "Name and dose unreadable"}</small></div></div>
      </section>
      <section class="content-card"><div class="section-head"><div><span class="eyebrow">TRACEABLE FINDINGS</span><h2>Relevant prior information</h2></div><span class="count-chip">${visible.length} facts</span></div><div class="fact-list">${visible.map(briefFactRow).join("")}</div></section>
      ${noteBasket()}${reviewTrail()}
    </main><aside class="brief-aside">${reviewQueue()}<section class="side-card source-summary"><span class="eyebrow">SOURCE COVERAGE</span><h2>What was processed</h2><div class="coverage-number">${availableDocuments().length}<span> documents</span></div><div class="coverage-row"><span>Available for review</span><strong>${availableDocuments().length}</strong></div><div class="coverage-row"><span>Documents processing</span><strong>${state.pendingDocs.length}</strong></div><div class="coverage-row"><span>Pages processing</span><strong>${state.pendingPages}</strong></div><div class="coverage-row"><span>Quarantined pages</span><strong>${state.quarantinedPages}</strong></div><div class="coverage-row"><span>Doctor-reviewed facts</span><strong>${countConfirmed()}</strong></div><p>Every visible finding opens its original page. Uncaptured paper may still exist.</p></section></aside></div>`;
}

function filterButtons() {
  return ["All", "Lab", "Medicine", "History", "Radiology"].map((category) => `<button class="filter-button ${state.filter === category ? "active" : ""}" data-action="filter" data-filter="${category}" aria-pressed="${state.filter === category}">${category}</button>`).join("");
}

function timelineItem(event) {
  const selected = state.selectedEvent === event.id;
  return `<button class="timeline-item ${selected ? "active" : ""}" data-action="event" data-event="${event.id}" aria-current="${selected}">
    <span class="timeline-marker"></span><span class="timeline-date">${esc(event.date)}</span><span class="timeline-body"><span class="type-tag">${esc(event.type)}</span><strong>${esc(event.title)}</strong><small>${esc(eventSummary(event))}</small></span><span class="timeline-arrow" aria-hidden="true">↗</span>
  </button>${selected ? `<div class="timeline-mobile-detail">${selectedEventDetail()}</div>` : ""}`;
}

function selectedEventDetail() {
  const event = eventById[state.selectedEvent] || events[0];
  const fact = factById[event.fact];
  return `<section class="event-detail"><span class="eyebrow">SELECTED EVENT · ${esc(event.date)}</span><h2>${esc(event.title)}</h2><div class="event-current-value">${esc(factValue(fact))}</div><p>${esc(fact.detail)}</p><div class="detail-divider"></div>
    <div class="detail-label">SOURCE DOCUMENT</div><button class="source-tile" data-action="source" data-fact="${fact.id}"><span class="tile-icon">${documents[fact.doc].icon}</span><span><strong>${esc(documents[fact.doc].title)}</strong><small>${esc(documents[fact.doc].type)} · ${esc(documents[fact.doc].date)} · page ${fact.page + 1}</small></span><span aria-hidden="true">↗</span></button>
    <div class="detail-label">REVIEW STATUS</div><div class="detail-status">${pill(state.review[fact.id])}<span>${esc(fact.provenance)}</span></div>${fact.id === "medicine" ? medicationReview() : ""}${factActions(fact)}
  </section>`;
}

function VariantB() {
  const filtered = availableEvents().filter((event) => state.filter === "All" || event.type === state.filter);
  const latestLab = availableEvents().find((event) => event.type === "Lab");
  return `${pageIntro("02", "Read the patient's story", "Follow the dated records, inspect a source page, and review each fact before adding it to today's note.")}
    <section class="visit-lens"><div><span class="eyebrow">TODAY'S LENS</span><strong>${state.visit === 2 ? "Follow-up and medicine review" : "Fatigue and occasional dizziness · 3 weeks"}</strong></div><div><span>Priority checks</span><strong>${countOpenPriorityChecks()} open</strong></div><button data-action="source" data-fact="${latestLab.fact}">View latest report ↗</button></section>
    <div class="timeline-toolbar"><div><span class="eyebrow">CHRONOLOGY</span><h2>Prior record timeline</h2></div><div class="filter-row" role="group" aria-label="Filter timeline">${filterButtons()}</div></div>
    <div class="timeline-layout"><main class="timeline-stream" aria-label="Prior record timeline">${filtered.length ? filtered.map(timelineItem).join("") : `<div class="empty-state">No events in this category.</div>`}<div class="timeline-end">Dates come from supplied sources. Undated items appear last.${state.pendingPages ? " Some pages are still processing." : ""}</div></main><aside class="timeline-aside">${selectedEventDetail()}${reviewQueue()}${noteBasket()}${reviewTrail()}</aside></div>`;
}

function compactFact(fact) {
  return `<article class="compact-fact ${state.selectedFact === fact.id ? "active" : ""}"><button class="compact-fact-main" data-action="source" data-fact="${fact.id}"><span class="compact-icon">${documents[fact.doc].icon}</span><span><small>${esc(fact.category)} · ${esc(documents[fact.doc].date)}</small><strong>${esc(fact.title)}</strong><em>${esc(factValue(fact))}</em></span><span aria-hidden="true">→</span></button><div class="compact-fact-status">${pill(state.review[fact.id])}${state.imported.includes(fact.id) ? `<span class="imported-label">In note</span>` : ""}</div></article>`;
}

function docList() {
  return `<div class="doc-list">${availableDocuments().map(([id, doc]) => `<button class="doc-list-item ${state.selectedDoc === id ? "active" : ""}" data-action="document" data-doc="${id}"><span class="doc-list-icon">${doc.icon}</span><span><strong>${esc(doc.title)}</strong><small>${esc(doc.date)} · ${doc.pages.length} ${doc.pages.length === 1 ? "page" : "pages"}</small></span></button>`).join("")}</div>`;
}

function documentPaper() {
  const doc = getSelectedDoc();
  const page = doc.pages[state.page] || doc.pages[0];
  return `<div class="paper-scroller"><div class="paper" style="--zoom:${state.zoom / 100}"><div class="paper-top"><span>DOCUMENT PREVIEW</span><span>DEMO COPY</span></div>${page.map((line) => line.image
    ? `<div class="image-placeholder"><div class="image-shape"></div><strong>X-ray image placeholder</strong><small>${esc(line.text)}</small></div>`
    : `<div class="paper-line ${line.heading ? "paper-heading" : ""} ${line.handwritten ? "paper-handwriting" : ""} ${line.fact && line.fact === state.selectedFact ? "highlight-line" : ""}">${esc(line.text)}</div>`).join("")}
    <div class="paper-footer">Fictional source for interface evaluation · page ${state.page + 1} of ${doc.pages.length}</div></div></div>`;
}

function documentViewer(inline = false) {
  const doc = getSelectedDoc();
  const fact = getSelectedFact();
  const matching = fact.doc === state.selectedDoc;
  return `<div class="document-viewer ${inline ? "inline" : ""}">
    <div class="viewer-head"><div><span class="eyebrow">ORIGINAL DOCUMENT</span><h2>${esc(doc.title)}</h2><p>${esc(doc.type)} · ${esc(doc.date)} · ${doc.pages.length} ${doc.pages.length === 1 ? "page" : "pages"}</p></div>${inline ? "" : `<button class="icon-button close-viewer" data-action="close-viewer" aria-label="Close source viewer">×</button>`}</div>
    ${matching ? `<div class="evidence-note"><span>↳</span><div><strong>Evidence for ${esc(fact.title)}</strong><small>${esc(fact.provenance)} · ${esc(state.review[fact.id] === "confirmed" ? "doctor reviewed" : state.review[fact.id])}</small></div></div>` : ""}
    <div class="viewer-controls"><div class="page-buttons"><button class="icon-button" data-action="prev-page" ${state.page === 0 ? "disabled" : ""} aria-label="Previous page">‹</button><span>Page ${state.page + 1} / ${doc.pages.length}</span><button class="icon-button" data-action="next-page" ${state.page >= doc.pages.length - 1 ? "disabled" : ""} aria-label="Next page">›</button></div><label class="zoom-control">Zoom <input type="range" min="80" max="120" step="10" value="${state.zoom}" data-action="zoom" aria-label="Document zoom" /><span>${state.zoom}%</span></label></div>
    ${documentPaper()}
    ${matching ? `${fact.id === "medicine" ? medicationReview() : ""}<div class="viewer-actions"><div><span class="eyebrow">DOCTOR REVIEW</span><strong>${esc(fact.title)}</strong></div>${factActions(fact)}</div>` : ""}
  </div>`;
}

function VariantC() {
  return `${pageIntro("03", "Brief beside the evidence", "Keep the summary and original pages in view together while confirming facts.")}
    <div class="split-tabs" role="group" aria-label="Split view panes"><button class="${state.splitPane === "brief" ? "active" : ""}" data-action="pane" data-pane="brief">Brief & facts</button><button class="${state.splitPane === "source" ? "active" : ""}" data-action="pane" data-pane="source">Original documents</button></div>
    <div class="split-layout" data-active-pane="${state.splitPane}"><main class="split-left"><section class="split-overview"><span class="eyebrow">TODAY'S CONSULTATION</span><h2>Fatigue and occasional dizziness</h2><p>3 weeks · patient reported</p><div class="overview-stats"><div><strong>${availableFacts().length}</strong><span>findings</span></div><div><strong>${countNeedsReview()}</strong><span>flagged</span></div><div><strong>${state.imported.length}</strong><span>in note</span></div></div></section>
      <div class="split-section-head"><span class="eyebrow">SOURCE-LINKED FACTS</span><span>Click to inspect →</span></div><div class="compact-facts">${availableFacts().map(compactFact).join("")}</div>
      <div class="split-section-head"><span class="eyebrow">CHRONOLOGY</span><span>Latest first</span></div><div class="mini-timeline">${availableEvents().slice(0, 5).map((event) => `<button data-action="event-source" data-event="${event.id}"><time>${esc(event.date)}</time><strong>${esc(event.title)}</strong><span>→</span></button>`).join("")}</div>${noteBasket()}</main>
      <aside class="split-right"><div class="document-explorer"><div class="explorer-head"><span class="eyebrow">RECORD LIBRARY</span><strong>${availableDocuments().length} files</strong></div>${docList()}</div>${documentViewer(true)}</aside></div>`;
}

function sourceDrawer() {
  if (!state.viewerOpen || state.variant === "split") return "";
  return `<div class="drawer-backdrop" data-action="close-viewer"></div><aside class="source-drawer" aria-label="Source document viewer">${documentViewer()}</aside>`;
}

function switcher() {
  const current = variants.find((variant) => variant.key === state.variant);
  return `<nav class="prototype-bar" aria-label="Prototype layout switcher"><span class="prototype-label">UI PROTOTYPE</span><button data-action="previous-variant" aria-label="Previous layout">←</button><div class="prototype-options">${variants.map((variant) => `<button class="variant-option ${state.variant === variant.key ? "active" : ""}" data-action="variant" data-variant="${variant.key}" aria-pressed="${state.variant === variant.key}"><span>${variant.number}</span>${variant.name}</button>`).join("")}</div><button data-action="next-variant" aria-label="Next layout">→</button><span class="current-variant">${current.number} / 03</span></nav>`;
}

function statePanel() {
  if (!canViewRecords()) return `<div class="state-toggle-wrap"><button class="state-toggle" data-action="toggle-state" aria-expanded="${state.stateOpen}">${state.stateOpen ? "Hide" : "Show"} prototype state <span>Record access paused</span></button>${state.stateOpen ? `<div class="state-content"><div><strong>Access state only</strong><button data-action="reset">Reset demo</button></div><pre>${esc(JSON.stringify({ scenario: state.scenario, visit: state.visit, permission: state.permission, identity: state.identity, quarantinedPages: state.quarantinedPages }, null, 2))}</pre></div>` : ""}</div>`;
  const debug = {
    scenario: state.scenario, visit: state.visit, permission: state.permission, identity: state.identity,
    quarantinedPages: state.quarantinedPages, pendingDocuments: state.pendingDocs,
    medicationPatientReport: state.medicationReport, medicationAsked: state.medicationAsked,
    sourceViewed: state.sourceViewed, contradiction: state.contradiction, priorVisit: state.priorVisit,
    variant: state.variant, selectedFact: state.selectedFact, selectedEvent: state.selectedEvent,
    selectedDocument: state.selectedDoc, page: state.page + 1, zoom: state.zoom,
    timelineFilter: state.filter, review: Object.fromEntries(availableFacts().map((fact) => [fact.id, state.review[fact.id]])),
    importedToNote: state.imported, briefVersion: state.version, processingPages: state.pendingPages,
    lateDocumentAdded: state.lateAdded, sourceDrawerOpen: state.viewerOpen,
    lastAction: state.lastAction,
  };
  return `<div class="state-toggle-wrap"><button class="state-toggle" data-action="toggle-state" aria-expanded="${state.stateOpen}">${state.stateOpen ? "Hide" : "Show"} prototype state <span>${countConfirmed()} confirmed · ${state.imported.length} in note</span></button>${state.stateOpen ? `<div class="state-content"><div><strong>In-memory state</strong><button data-action="reset">Reset demo</button></div><pre>${esc(JSON.stringify(debug, null, 2))}</pre></div>` : ""}</div>`;
}

function render() {
  if (!canViewRecords()) {
    document.title = "Record access paused · Record Brief prototype";
    document.getElementById("app").innerHTML = `${topBar()}<div class="workspace">${scenarioSwitcher()}${gateScreen()}</div>`;
    document.getElementById("prototype-switcher").innerHTML = switcher();
    document.getElementById("state-panel").innerHTML = statePanel();
    return;
  }
  document.title = `${variants.find((variant) => variant.key === state.variant).name} · Record Brief prototype`;
  document.getElementById("app").innerHTML = `${topBar()}<div class="workspace">${scenarioSwitcher()}${patientStrip()}${statusBanner()}${scenarioMessage()}${state.variant === "brief" ? VariantA() : state.variant === "timeline" ? VariantB() : VariantC()}</div>${sourceDrawer()}`;
  document.getElementById("prototype-switcher").innerHTML = switcher();
  document.getElementById("state-panel").innerHTML = statePanel();
}

function announce(message) {
  state.lastAction = message;
  const node = document.getElementById("toast");
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 2700);
}

function selectSource(factId) {
  const fact = factById[factId];
  if (!canViewRecords() || !availableFacts().some((item) => item.id === factId)) return;
  state.sourceViewed[factId] = true;
  state.selectedFact = fact.id;
  state.selectedDoc = fact.doc;
  state.page = fact.page;
  state.viewerOpen = state.variant !== "split";
  if (state.variant === "split") state.splitPane = "source";
  const event = availableEvents().find((candidate) => candidate.fact === fact.id);
  if (event) state.selectedEvent = event.id;
  announce(`Opened original source for ${fact.title}`);
  render();
}

function setVariant(key) {
  if (!variantKeys.includes(key)) return;
  state.variant = key;
  state.viewerOpen = false;
  const url = new URL(location.href);
  url.searchParams.set("variant", key);
  history.replaceState(null, "", url);
  announce(`Switched to ${variants.find((variant) => variant.key === key).name}`);
  render();
}

function cycleVariant(direction) {
  const index = variantKeys.indexOf(state.variant);
  setVariant(variantKeys[(index + direction + variantKeys.length) % variantKeys.length]);
}

function loadScenario(key) {
  if (!scenarioKeys.includes(key)) return;
  const variant = state.variant;
  state = initialState(variant);
  applyScenario(state, key);
  const url = new URL(location.href);
  url.searchParams.set("scenario", key);
  history.replaceState(null, "", url);
  announce(`Loaded ${scenarios.find((item) => item.key === key).label} scenario`);
  render();
}

function setMedicationReport(status) {
  if (!canViewRecords() || !["taking", "stopped", "unsure"].includes(status)) return;
  const previous = state.medicationReport;
  const wasReviewed = state.review.medicine === "confirmed";
  if (state.medicationAsked && previous === status) return;
  state.medicationReport = status;
  state.medicationAsked = true;
  state.review.medicine = "unreviewed";
  state.imported = state.imported.filter((id) => id !== "medicine");
  if (wasReviewed && previous) state.contradiction = { before: previous, after: status, resolved: false };
  else if (state.contradiction && !state.contradiction.resolved) state.contradiction.after = status;
  announce(wasReviewed ? "Patient answer changed; previous review retained, draft note item removed" : `Patient reports ${status}; doctor review needed`);
  render();
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const factId = target.dataset.fact;
  if (action === "scenario") return loadScenario(target.dataset.scenario);
  if (action === "grant-permission") { state.permission = true; announce("Permission simulated for this visit"); return render(); }
  if (action === "resolve-identity") { state.identity = "matched"; announce("Visit identity checked; mismatched page stays quarantined"); return render(); }
  if (action === "complete-processing" && canViewRecords()) {
    state.pendingDocs = []; state.pendingPages = 0; state.version++;
    announce("Remaining pages processed; new facts require review"); return render();
  }
  if (action === "medication-status") return setMedicationReport(target.dataset.status);
  if (action === "patient-disagrees") return setMedicationReport("stopped");
  if (action === "source") return selectSource(factId);
  if (action === "variant") return setVariant(target.dataset.variant);
  if (action === "previous-variant") return cycleVariant(-1);
  if (action === "next-variant") return cycleVariant(1);
  if (action === "confirm" && canViewRecords() && availableFacts().some((fact) => fact.id === factId)) {
    if (!state.sourceViewed[factId]) { announce("Open the original source before doctor review"); return render(); }
    if (factId === "medicine" && !state.medicationAsked) { announce("Ask the patient whether they are taking this medicine now"); return render(); }
    state.review[factId] = "confirmed";
    if (factId === "medicine" && state.contradiction) state.contradiction.resolved = true;
    announce(`Doctor reviewed ${factById[factId].title}`); return render();
  }
  if (action === "flag" && canViewRecords() && availableFacts().some((fact) => fact.id === factId)) { state.review[factId] = "needs review"; state.imported = state.imported.filter((id) => id !== factId); announce(`Flagged ${factById[factId].title} for review`); return render(); }
  if (action === "import" && canViewRecords() && availableFacts().some((fact) => fact.id === factId)) {
    if (state.imported.includes(factId)) { state.imported = state.imported.filter((id) => id !== factId); announce(`Removed ${factById[factId].title} from note`); return render(); }
    if (!state.sourceViewed[factId]) { announce("Open the original source before adding this to the note"); return render(); }
    if (factId === "medicine" && !state.medicationAsked) { announce("Ask the patient whether they are taking this medicine now"); return render(); }
    if (state.review[factId] !== "confirmed") { announce("Doctor review is required before adding this to the note"); return render(); }
    state.imported.push(factId); announce(`Added ${factById[factId].title} to the simulated note`); return render();
  }
  if (action === "event") {
    const selected = eventById[target.dataset.event];
    if (!canViewRecords() || !availableEvents().some((item) => item.id === selected?.id)) return;
    state.selectedEvent = selected.id; state.selectedFact = selected.fact; state.selectedDoc = selected.doc; state.page = factById[selected.fact].page;
    announce(`Selected ${selected.title}`); return render();
  }
  if (action === "event-source") { const selected = eventById[target.dataset.event]; if (selected) selectSource(selected.fact); return; }
  if (action === "filter") {
    state.filter = target.dataset.filter;
    const visible = availableEvents().filter((item) => state.filter === "All" || item.type === state.filter);
    if (visible.length && !visible.some((item) => item.id === state.selectedEvent)) {
      state.selectedEvent = visible[0].id;
      state.selectedFact = visible[0].fact;
      state.selectedDoc = visible[0].doc;
      state.page = factById[visible[0].fact].page;
    }
    announce(`Timeline filter: ${state.filter}`); return render();
  }
  if (action === "document") { if (!canViewRecords() || !availableDocuments().some(([id]) => id === target.dataset.doc)) return; state.selectedDoc = target.dataset.doc; state.page = 0; announce(`Opened ${documents[state.selectedDoc].title}`); return render(); }
  if (action === "prev-page" || action === "next-page") { state.page = Math.max(0, Math.min(getSelectedDoc().pages.length - 1, state.page + (action === "next-page" ? 1 : -1))); announce(`Document page ${state.page + 1}`); return render(); }
  if (action === "pane") { state.splitPane = target.dataset.pane; announce(`Showing ${state.splitPane} pane`); return render(); }
  if (action === "close-viewer") { state.viewerOpen = false; announce("Closed source viewer"); return render(); }
  if (action === "simulate-late" && canViewRecords() && !state.lateAdded) { state.lateAdded = true; state.version++; announce("Late thyroid report processed; updated brief ready"); return render(); }
  if (action === "toggle-state") { state.stateOpen = !state.stateOpen; return render(); }
  if (action === "reset") return loadScenario(state.scenario);
});

document.addEventListener("input", (event) => {
  if (event.target.dataset.action === "zoom") {
    state.zoom = Number(event.target.value);
    state.lastAction = `Document zoom set to ${state.zoom}%`;
    const paper = document.querySelector(".paper");
    if (paper) paper.style.setProperty("--zoom", state.zoom / 100);
    document.querySelectorAll(".zoom-control span").forEach((node) => { node.textContent = `${state.zoom}%`; });
    document.getElementById("state-panel").innerHTML = statePanel();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  const element = document.activeElement;
  if (element && (element.matches("input, textarea, select, [contenteditable]") || element.closest("[contenteditable]"))) return;
  event.preventDefault();
  cycleVariant(event.key === "ArrowRight" ? 1 : -1);
});

window.addEventListener("popstate", () => { state.variant = variantFromUrl(); state.viewerOpen = false; render(); });
render();

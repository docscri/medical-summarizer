const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");

function prototype(scenario = "happy", variant = null) {
  const listeners = {};
  const nodes = Object.fromEntries(["app", "prototype-switcher", "state-panel", "toast"].map((id) => [id, {
    innerHTML: "", textContent: "", classList: { add() {}, remove() {} },
  }]));
  const search = `?${variant ? `variant=${variant}&` : ""}scenario=${scenario}`;
  const location = { href: `http://localhost/${search}`, search };
  const context = vm.createContext({
    URL, URLSearchParams, location,
    history: { replaceState(_state, _title, url) { location.href = String(url); location.search = new URL(location.href).search; } },
    document: { title: "", getElementById(id) { return nodes[id]; }, addEventListener(type, handler) { listeners[type] = handler; } },
    window: { addEventListener() {} },
    setTimeout() { return 1; }, clearTimeout() {},
  });
  vm.runInContext(appSource, context);
  return {
    state: () => vm.runInContext("state", context),
    html: () => nodes.app.innerHTML,
    click(action, data = {}) {
      listeners.click({ target: { closest() { return { dataset: { action, ...data } }; } } });
    },
  };
}

test("timeline is the default and scenario focus opens the relevant event", () => {
  const normal = prototype();
  assert.equal(normal.state().variant, "timeline");
  assert.match(normal.html(), /Prior record timeline/);
  assert.match(normal.html(), /timeline-mobile-detail/);

  const trust = prototype("trust");
  assert.equal(trust.state().selectedEvent, "rx-event");
  assert.match(trust.html(), /Is the patient taking this medicine now/);

  const correction = prototype("disagree");
  assert.equal(correction.state().selectedEvent, "rx-event");

  normal.click("simulate-late");
  assert.match(normal.html(), /data-fact="late">View latest report/);
});

test("past prescription requires source, patient answer, and doctor review before note import", () => {
  const p = prototype();
  p.click("import", { fact: "medicine" });
  assert.equal(p.state().imported.length, 0);
  p.click("source", { fact: "medicine" });
  p.click("confirm", { fact: "medicine" });
  assert.equal(p.state().review.medicine, "unreviewed");
  p.click("medication-status", { status: "unsure" });
  p.click("import", { fact: "medicine" });
  assert.equal(p.state().imported.length, 0);
  p.click("confirm", { fact: "medicine" });
  p.click("import", { fact: "medicine" });
  assert.deepEqual(Array.from(p.state().imported), ["medicine"]);
  assert.match(p.html(), /patient reports unsure at this visit/i);
});

test("called in early shows only ready documents and never imports newly processed facts", () => {
  const p = prototype("early");
  assert.equal(p.state().pendingPages, 3);
  assert.doesNotMatch(p.html(), /Handwritten medicine unclear/);
  p.click("source", { fact: "handwriting" });
  assert.equal(p.state().sourceViewed.handwriting, undefined);
  p.click("complete-processing");
  assert.equal(p.state().pendingPages, 0);
  assert.match(p.html(), /Handwritten medicine unclear/);
  assert.equal(p.state().imported.length, 0);
});

test("later patient correction invalidates doctor review and removes the draft note item", () => {
  const p = prototype("disagree");
  assert.deepEqual(Array.from(p.state().imported), ["medicine"]);
  p.click("patient-disagrees");
  assert.equal(p.state().medicationReport, "stopped");
  assert.equal(p.state().review.medicine, "unreviewed");
  assert.equal(p.state().imported.length, 0);
  assert.equal(p.state().contradiction.before, "taking");
  assert.match(p.html(), /Earlier this visit/);
  p.click("medication-status", { status: "unsure" });
  assert.equal(p.state().contradiction.after, "unsure");
  p.click("import", { fact: "medicine" });
  assert.equal(p.state().imported.length, 0);
  p.click("confirm", { fact: "medicine" });
  assert.equal(p.state().contradiction.resolved, true);
});

test("no permission and wrong-patient gates hide records until resolved", () => {
  const noPermission = prototype("no-permission");
  assert.doesNotMatch(noPermission.html(), /Haemoglobin flagged low|10\.8 g\/dL/);
  noPermission.click("variant", { variant: "split" });
  assert.doesNotMatch(noPermission.html(), /Haemoglobin flagged low|10\.8 g\/dL/);
  noPermission.click("source", { fact: "hb" });
  assert.equal(noPermission.state().sourceViewed.hb, undefined);
  noPermission.click("grant-permission");
  assert.match(noPermission.html(), /Haemoglobin flagged low/);

  const wrongPatient = prototype("wrong-patient");
  assert.doesNotMatch(wrongPatient.html(), /Haemoglobin flagged low|10\.8 g\/dL/);
  wrongPatient.click("variant", { variant: "timeline" });
  assert.doesNotMatch(wrongPatient.html(), /Haemoglobin flagged low|10\.8 g\/dL/);
  wrongPatient.click("resolve-identity");
  assert.equal(wrongPatient.state().quarantinedPages, 1);
  assert.match(wrongPatient.html(), /quarantined/i);
});

test("next visit retains dated context but resets current answer, review, and note", () => {
  const p = prototype("next");
  assert.doesNotMatch(p.html(), /Haemoglobin 10\.8/);
  p.click("grant-permission");
  assert.equal(p.state().visit, 2);
  assert.equal(p.state().medicationAsked, false);
  assert.equal(p.state().review.medicine, "unreviewed");
  assert.equal(p.state().imported.length, 0);
  assert.match(p.html(), /Visit 1/);
  assert.match(p.html(), /Current use must be asked again today/);
});

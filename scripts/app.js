import { i18n, areaLabel, languageLabel, levelLabel, detectLang, setLang, getLang } from "./i18n.js";
import { registerServiceWorker, updateSwVersionFromSource } from "./sw-manager.js";
import { initOfflineBanner, readFiltersFromUrl, syncFiltersToUrl } from "./url-state.js";
import { state } from "./state.js";
import {
  uniqueValues, uniqueLevelValues, uniqueLanguageValues,
  computeFilteredGames, buildReportIndex,
} from "./filters.js";
import { clearSelect, fillSelect, updateSelectLabels, buildCard } from "./render.js";
import {
  initPreferenceBackend, loadSubmissions,
  toggleFavoritePreference, setRatingPreference, reportBroken,
  hideResource, isAdmin, submitActivity, loadSources, authMe,
  studentLogin, studentLogout,
} from "./api.js";

const dataUrl = "./data/games.json";
const homeDataUrl = "./data/games-home.json";
const reportUrl = "./reports/link-report.json";
const PAGE_SIZE = 48;

// DOM refs
const searchInput = document.querySelector("#searchInput");
const levelFilter = document.querySelector("#levelFilter");
const languageFilter = document.querySelector("#languageFilter");
const areaFilter = document.querySelector("#areaFilter");
const formatFilter = document.querySelector("#formatFilter");
const favoritesOnly = document.querySelector("#favoritesOnly");
const submissionsOnly = document.querySelector("#submissionsOnly");
const brokenOnly = document.querySelector("#brokenOnly");
const brokenOnlyLabel = document.querySelector("#brokenOnlyLabel");
const reportedOnly = document.querySelector("#reportedOnly");
const reportedOnlyLabel = document.querySelector("#reportedOnlyLabel");
const ratingFilter = document.querySelector("#ratingFilter");
const grid = document.querySelector("#grid");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const offlineBanner = document.querySelector("#offlineBanner");
const personalPrefsNote = document.querySelector("#personalPrefsNote");
const authPanel = document.querySelector("#authPanel");
const loginBtn = document.querySelector("#loginBtn");
const studentLoginBtn = document.querySelector("#studentLoginBtn");
const studentLogoutBtn = document.querySelector("#studentLogoutBtn");
const studentDialog = document.querySelector("#studentDialog");
const studentForm = document.querySelector("#studentForm");
const studentCodeInput = document.querySelector("#studentCode");
const studentPinInput = document.querySelector("#studentPin");
const studentCancelBtn = document.querySelector("#studentCancelBtn");
const studentFeedback = document.querySelector("#studentFeedback");
const studentSendBtn = document.querySelector("#studentSendBtn");
const sourcesPanel = document.querySelector("#sourcesPanel");
const sourcesList = document.querySelector("#sourcesList");
const submitActivityBtn = document.querySelector("#submitActivityBtn");
const submitDialog = document.querySelector("#submitDialog");
const submitForm = document.querySelector("#submitForm");
const submitTitleInput = document.querySelector("#submitTitle");
const submitUrlInput = document.querySelector("#submitUrl");
const submitNotesInput = document.querySelector("#submitNotes");
const submitNameInput = document.querySelector("#submitName");
const submitAreaSelect = document.querySelector("#submitArea");
const submitLanguageSelect = document.querySelector("#submitLanguage");
const submitCancelBtn = document.querySelector("#submitCancelBtn");
const submitFeedback = document.querySelector("#submitFeedback");
const submitSendBtn = document.querySelector("#submitSendBtn");

const cardDeps = {
  onFavoriteToggle: toggleFavoritePreference,
  onRatingSet: setRatingPreference,
  onReport: reportBroken,
  onHide: hideResource,
  onRender: () => render(),
  favoritesOnlyEl: favoritesOnly,
};

setLang(detectLang());
registerServiceWorker();
updateSwVersionFromSource();
initOfflineBanner(offlineBanner, i18n);

// Let api.js notify app.js when auth state changes.
state._onAuthChange = () => {
  updateAuthUi();
  updatePreferencesNote();
};

boot().catch((error) => {
  console.error("No se pudo iniciar la aplicacion", error);
});

async function boot() {
  const homeGames = await fetchJson(homeDataUrl);
  state.games = Array.isArray(homeGames) ? homeGames : [];
  state.isPartialLoad = true;

  await initPreferenceBackend();
  updateAuthUi();
  updateLoginBtn();
  hydrateFilterOptions();
  applyStaticTranslations();
  updatePreferencesNote();
  updateLangButtons();
  wireEvents();
  readFiltersFromUrl({ searchInput, levelFilter, languageFilter, areaFilter, ratingFilter, favoritesOnly });
  render();

  if (state.backendMode === "remote") {
    loadSubmissions()
      .then(() => { hydrateFilterOptions(); render(); })
      .catch((err) => console.warn("Error en carregar propostes", err));
  }

  Promise.all([
    fetchJson(dataUrl),
    fetchJson(reportUrl, true),
  ]).then(([games, report]) => {
    state.games = Array.isArray(games) ? games : state.games;
    state.isPartialLoad = false;

    if (report && Array.isArray(report.results)) {
      state.reportByUrl = buildReportIndex(report.results);
      state.reportSummary = report.summary || null;
    }

    hydrateFilterOptions();
    render();
  }).catch((error) => {
    console.warn("Error en càrrega completa de dades", error);
  });
}

async function fetchJson(url, optional = false) {
  const response = await fetch(url, { cache: "default" });
  if (!response.ok) {
    if (optional) return null;
    throw new Error(`Fallo al cargar ${url}: ${response.status}`);
  }
  return response.json();
}

function allGames() {
  return state.submissions.length > 0 ? [...state.games, ...state.submissions] : state.games;
}

function hydrateFilterOptions() {
  const games = allGames();
  const saved = { level: levelFilter.value, language: languageFilter.value, area: areaFilter.value, format: formatFilter.value };
  clearSelect(levelFilter);
  clearSelect(languageFilter);
  clearSelect(areaFilter);
  clearSelect(formatFilter);
  fillSelect(levelFilter, uniqueLevelValues(games), levelLabel);
  fillSelect(languageFilter, uniqueLanguageValues(games), languageLabel);
  fillSelect(areaFilter, uniqueValues(games, "area"), areaLabel);
  fillSelect(formatFilter, uniqueValues(games, "format"));
  levelFilter.value = saved.level;
  languageFilter.value = saved.language;
  areaFilter.value = saved.area;
  formatFilter.value = saved.format;
}

function updateDynamicFilterLabels() {
  updateSelectLabels(levelFilter, levelLabel);
  updateSelectLabels(languageFilter, languageLabel);
  updateSelectLabels(areaFilter, areaLabel);
}

function render() {
  const criteria = {
    term: searchInput.value.trim(),
    selectedLevel: levelFilter.value,
    selectedLanguage: languageFilter.value,
    selectedArea: areaFilter.value,
    selectedFormat: formatFilter.value,
    onlyFavorites: favoritesOnly.checked,
    onlySubmissions: submissionsOnly?.checked,
    onlyBroken: brokenOnly?.checked,
    onlyReported: reportedOnly?.checked,
    minRating: Number(ratingFilter.value || 0),
  };
  const games = allGames();
  state.filtered = computeFilteredGames(games, criteria);
  state.visibleCount = 0;
  grid.innerHTML = "";
  showMore();
  resultCount.textContent = i18n("result_count", state.filtered.length, games.length);
  emptyState.classList.toggle("hidden", state.filtered.length > 0);
  syncFiltersToUrl({ searchInput, levelFilter, languageFilter, areaFilter, ratingFilter, favoritesOnly });
}

function showMore() {
  const batch = state.filtered.slice(state.visibleCount, state.visibleCount + PAGE_SIZE);
  for (const game of batch) {
    grid.append(buildCard(game, cardDeps));
  }
  state.visibleCount += batch.length;
  const remaining = state.filtered.length - state.visibleCount;
  loadMoreBtn.classList.toggle("hidden", remaining <= 0);
  if (remaining > 0) loadMoreBtn.textContent = i18n("load_more", remaining);
}

function updateAuthUi() {
  if (!authPanel) return;

  if (state.backendMode !== "remote") {
    authPanel.classList.add("hidden");
    if (submitActivityBtn) submitActivityBtn.classList.add("hidden");
    return;
  }

  authPanel.classList.remove("hidden");
  if (submitActivityBtn) submitActivityBtn.classList.remove("hidden");
  if (brokenOnlyLabel) brokenOnlyLabel.classList.toggle("hidden", !isAdmin());
  if (reportedOnlyLabel) reportedOnlyLabel.classList.toggle("hidden", !isAdmin());

  if (sourcesPanel) {
    sourcesPanel.classList.toggle("hidden", !isAdmin());
    if (isAdmin()) renderSources();
  }
}

async function renderSources() {
  if (!sourcesList || !isAdmin()) return;
  const providers = await loadSources();
  if (!providers) return;
  sourcesList.innerHTML = "";
  for (const p of providers) {
    const last = p.last_sync || {};
    const row = document.createElement("div");
    row.className = "source-row";
    const title = document.createElement("strong");
    title.textContent = p.provider;
    const info = document.createElement("span");
    const status = last.status || "—";
    const fetched = last.fetched ?? "—";
    const created = last.created ?? "—";
    const updated = last.updated ?? "—";
    const errors = last.errors ?? "—";
    const finished = last.finished_at ? new Date(last.finished_at).toLocaleString() : "nunca";
    info.textContent = `Recursos: ${p.resources} · Estado: ${status} · Última sync: ${finished} · fetched ${fetched}, nuevos ${created}, actualizados ${updated}, errores ${errors}`;
    row.append(title, info);
    sourcesList.append(row);
  }
}

async function updateLoginBtn() {
  if (!loginBtn) return;
  const me = await authMe();
  if (me.logged_in) {
    loginBtn.href = "/api/auth/logout";
    loginBtn.textContent = i18n("logout_btn");
  } else {
    loginBtn.href = "/api/auth/login";
    loginBtn.textContent = i18n("login_btn");
  }
  if (studentLoginBtn) studentLoginBtn.classList.toggle("hidden", Boolean(me.student_logged_in));
  if (studentLogoutBtn) {
    studentLogoutBtn.classList.toggle("hidden", !me.student_logged_in);
    studentLogoutBtn.textContent = me.student_logged_in
      ? i18n("student_logout_btn", me.student_code || "")
      : i18n("student_logout_default");
  }
}

function updateLangButtons() {
  const lang = getLang();
  document.querySelectorAll(".btn-lang").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = i18n(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = i18n(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", i18n(el.dataset.i18nAriaLabel));
  });
}

function updatePreferencesNote() {
  if (!personalPrefsNote) return;
  const isRemote = state.backendMode === "remote";
  const key = isRemote ? "personal_prefs_note_remote" : "personal_prefs_note_local";
  personalPrefsNote.textContent = i18n(key);
  personalPrefsNote.classList.toggle("remote", isRemote);
}

function wireEvents() {
  searchInput.addEventListener("input", render);
  levelFilter.addEventListener("change", render);
  languageFilter.addEventListener("change", render);
  areaFilter.addEventListener("change", render);
  formatFilter.addEventListener("change", render);
  favoritesOnly.addEventListener("change", render);
  if (submissionsOnly) submissionsOnly.addEventListener("change", render);
  if (brokenOnly) brokenOnly.addEventListener("change", render);
  if (reportedOnly) reportedOnly.addEventListener("change", render);
  ratingFilter.addEventListener("change", render);
  loadMoreBtn.addEventListener("click", showMore);

  if (submitActivityBtn) submitActivityBtn.addEventListener("click", openSubmitDialog);
  if (submitCancelBtn) submitCancelBtn.addEventListener("click", () => submitDialog?.close());
  if (submitDialog) {
    submitDialog.addEventListener("click", (e) => {
      if (e.target === submitDialog) submitDialog.close();
    });
  }
  if (submitForm) submitForm.addEventListener("submit", handleSubmitForm);
  if (studentLoginBtn) studentLoginBtn.addEventListener("click", openStudentDialog);
  if (studentLogoutBtn) studentLogoutBtn.addEventListener("click", handleStudentLogout);
  if (studentCancelBtn) studentCancelBtn.addEventListener("click", () => studentDialog?.close());
  if (studentDialog) {
    studentDialog.addEventListener("click", (e) => {
      if (e.target === studentDialog) studentDialog.close();
    });
  }
  if (studentForm) studentForm.addEventListener("submit", handleStudentLogin);

  document.querySelectorAll(".btn-lang").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
      updateLangButtons();
      applyStaticTranslations();
      updateDynamicFilterLabels();
      updatePreferencesNote();
      updateAuthUi();
      updateLoginBtn();
      render();
    });
  });
}

// --- Submit dialog ---

function openSubmitDialog() {
  if (!submitDialog) return;
  const games = allGames();
  clearSelect(submitAreaSelect);
  fillSelect(submitAreaSelect, uniqueValues(games, "area"), areaLabel);
  clearSelect(submitLanguageSelect);
  fillSelect(submitLanguageSelect, uniqueLanguageValues(games), languageLabel);
  submitForm?.reset();
  if (submitFeedback) {
    submitFeedback.className = "submit-feedback hidden";
    submitFeedback.textContent = "";
  }
  submitDialog.showModal();
}

async function handleSubmitForm(e) {
  e.preventDefault();
  if (state.backendMode !== "remote") return;

  const title = submitTitleInput?.value.trim() || "";
  const url = submitUrlInput?.value.trim() || "";
  const notes = submitNotesInput?.value.trim() || "";
  const area = submitAreaSelect?.value || "General";
  const language = submitLanguageSelect?.value || "";
  const name = submitNameInput?.value.trim() || "";

  if (!title || !url) return;

  if (submitSendBtn) submitSendBtn.disabled = true;
  showSubmitFeedback(i18n("submit_loading"), "");

  try {
    await submitActivity({ title, url, notes, area, language, name });
    showSubmitFeedback(i18n("submit_success"), "ok");
    submitForm?.reset();
    await loadSubmissions();
    hydrateFilterOptions();
    render();
    setTimeout(() => submitDialog?.close(), 1800);
  } catch (error) {
    console.error("Error en enviar proposta", error);
    showSubmitFeedback(i18n("submit_error"), "error");
  } finally {
    if (submitSendBtn) submitSendBtn.disabled = false;
  }
}

function showSubmitFeedback(text, type) {
  if (!submitFeedback) return;
  submitFeedback.textContent = text;
  submitFeedback.className = `submit-feedback${type ? ` ${type}` : ""}`;
}

// --- Student identity dialog ---

function openStudentDialog() {
  if (!studentDialog) return;
  studentForm?.reset();
  showStudentFeedback("", "");
  studentDialog.showModal();
  studentCodeInput?.focus();
}

async function handleStudentLogin(e) {
  e.preventDefault();
  const publicCode = studentCodeInput?.value.trim() || "";
  const pin = studentPinInput?.value.trim() || "";
  if (!publicCode || !pin) {
    showStudentFeedback(i18n("student_login_missing"), "error");
    return;
  }
  if (studentSendBtn) studentSendBtn.disabled = true;
  showStudentFeedback(i18n("student_login_loading"), "");
  try {
    await studentLogin({ publicCode, pin });
    await initPreferenceBackend();
    await updateLoginBtn();
    render();
    showStudentFeedback(i18n("student_login_success"), "ok");
    setTimeout(() => studentDialog?.close(), 900);
  } catch (error) {
    console.error("Error en iniciar sessio d'alumnat", error);
    showStudentFeedback(i18n("student_login_error"), "error");
  } finally {
    if (studentSendBtn) studentSendBtn.disabled = false;
  }
}

async function handleStudentLogout() {
  if (studentLogoutBtn) studentLogoutBtn.disabled = true;
  try {
    await studentLogout();
    await initPreferenceBackend();
    await updateLoginBtn();
    render();
  } finally {
    if (studentLogoutBtn) studentLogoutBtn.disabled = false;
  }
}

function showStudentFeedback(text, type) {
  if (!studentFeedback) return;
  studentFeedback.textContent = text;
  studentFeedback.className = `submit-feedback${type ? ` ${type}` : ""}${text ? "" : " hidden"}`;
}

import { i18n } from "./i18n.js";
import {
  state, FAVORITES_STORAGE_KEY, RATINGS_STORAGE_KEY,
} from "./state.js";

const API_BASE = (typeof window !== "undefined" && window.EDUBIBLIOJOCS_API_BASE) || "/api";

export function isAdmin() {
  return Boolean(state.isAdmin);
}

export function currentUserDisplayName(_user) {
  return "";
}

function loadLocalPreferences() {
  try {
    const favoritesRaw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (favoritesRaw) {
      const parsed = JSON.parse(favoritesRaw);
      if (Array.isArray(parsed)) state.favorites = new Set(parsed.filter(Boolean));
    }
  } catch {
    state.favorites = new Set();
  }

  try {
    const ratingsRaw = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (ratingsRaw) {
      const parsed = JSON.parse(ratingsRaw);
      if (parsed && typeof parsed === "object") {
        const entries = Object.entries(parsed)
          .filter(([key, v]) => key && Number.isFinite(Number(v)) && Number(v) >= 1 && Number(v) <= 5)
          .map(([key, v]) => [key, Number(v)]);
        state.userRatings = new Map(entries);
      }
    }
  } catch {
    state.userRatings = new Map();
  }
}

function persistLocalFavorites() {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...state.favorites]));
}

function persistLocalRatings() {
  localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(Object.fromEntries(state.userRatings)));
}

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`API ${path} -> ${res.status}`);
  }
  return res.json();
}

export async function initPreferenceBackend() {
  loadLocalPreferences();

  try {
    const prefs = await api("/preferences");
    state.isAdmin = Boolean(prefs.admin);
    state.favorites = new Set(Array.isArray(prefs.favorites) ? prefs.favorites : []);
    state.userRatings = new Map(
      Object.entries(prefs.ratings || {})
        .filter(([, v]) => Number.isFinite(Number(v)) && Number(v) >= 1 && Number(v) <= 5)
        .map(([k, v]) => [k, Number(v)]),
    );
    state.userReports = new Set(Array.isArray(prefs.reports) ? prefs.reports : []);
    state.ratingSummary = new Map(
      Object.entries(prefs.rating_summary || {}).map(([k, s]) => [
        k,
        { avg: Number(s?.avg || 0), count: Number(s?.count || 0) },
      ]),
    );
    state.brokenSummary = new Map(
      Object.entries(prefs.broken_reports || {}).map(([k, s]) => [
        k,
        { count: Number(s?.count || 0), adminReported: Boolean(s?.admin_reported) },
      ]),
    );
    state.backendMode = "remote";
    state.authReady = true;
  } catch (error) {
    console.warn("No se pudo conectar con la API, se mantiene modo local.", error);
    state.backendMode = "local";
    state.authReady = false;
  }
}

export async function loadSubmissions() {
  if (state.backendMode !== "remote") return;
  const data = await api("/submissions");
  state.submissions = (Array.isArray(data) ? data : []).map((d) => ({
    title: String(d.title || "").trim(),
    url: String(d.url || "").trim(),
    notes: String(d.notes || "").trim(),
    area: String(d.area || "General").trim(),
    language: String(d.language || "").trim(),
    _isSubmission: true,
    _submittedBy: String(d.submitted_by || "").trim(),
    _id: d.id,
  })).filter((g) => g.title && g.url);
}

export async function toggleFavoritePreference(gameKeyValue) {
  if (state.backendMode !== "remote") {
    if (state.favorites.has(gameKeyValue)) state.favorites.delete(gameKeyValue);
    else state.favorites.add(gameKeyValue);
    persistLocalFavorites();
    return state.favorites.has(gameKeyValue);
  }
  const res = await api("/favorites/toggle", { method: "POST", body: { game_key: gameKeyValue } });
  if (res.favorite) state.favorites.add(gameKeyValue);
  else state.favorites.delete(gameKeyValue);
  return state.favorites.has(gameKeyValue);
}

export async function setRatingPreference(gameKeyValue, requestedRating) {
  const clamped = Math.max(0, Math.min(5, Number(requestedRating) || 0));
  const current = state.userRatings.get(gameKeyValue) || 0;

  if (state.backendMode !== "remote") {
    const next = current === clamped ? 0 : clamped;
    if (next > 0) state.userRatings.set(gameKeyValue, next);
    else state.userRatings.delete(gameKeyValue);
    persistLocalRatings();
    return next;
  }

  const res = await api("/ratings", { method: "POST", body: { game_key: gameKeyValue, value: clamped } });
  const next = Number(res.value) || 0;
  if (next > 0) state.userRatings.set(gameKeyValue, next);
  else state.userRatings.delete(gameKeyValue);

  const avg = Number(res.avg) || 0;
  const count = Number(res.count) || 0;
  if (count <= 0) state.ratingSummary.delete(gameKeyValue);
  else state.ratingSummary.set(gameKeyValue, { avg, count });

  return next;
}

export async function reportBroken(gameKeyValue) {
  if (state.backendMode !== "remote") return;
  const res = await api("/reports", { method: "POST", body: { game_key: gameKeyValue } });
  state.userReports.add(gameKeyValue);
  state.brokenSummary.set(gameKeyValue, {
    count: Number(res.count) || 1,
    adminReported: Boolean(res.admin_reported),
  });
}

export async function hideResource(gameKeyValue) {
  if (state.backendMode !== "remote" || !isAdmin()) return;
  const res = await api("/admin/resources/hide", { method: "POST", body: { game_key: gameKeyValue } });
  state.brokenSummary.set(gameKeyValue, {
    count: Number(res.count) || 0,
    adminReported: Boolean(res.admin_reported),
  });
}

export async function submitActivity({ title, url, notes, area, language, name }) {
  if (state.backendMode !== "remote") return;
  return api("/submissions", {
    method: "POST",
    body: { title, url, notes, area, language, name },
  });
}

export async function loadSources() {
  if (!isAdmin()) return null;
  const data = await api("/admin/sources");
  return Array.isArray(data?.providers) ? data.providers : [];
}

export async function authMe() {
  if (state.backendMode !== "remote") return { logged_in: false, admin: false, sub: "" };
  try {
    return await api("/auth/me");
  } catch {
    return { logged_in: false, admin: false, sub: "" };
  }
}

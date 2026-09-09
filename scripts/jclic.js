const JCLIC_SRC = "./assets/jclic/jclic.min.js";

const jclicDialog = document.querySelector("#jclicDialog");
const jclicClose = document.querySelector("#jclicClose");
const jclicFullscreen = document.querySelector("#jclicFullscreen");
const jclicContainer = document.querySelector("#jclicContainer");
const jclicTitle = document.querySelector("#jclicTitle");

jclicClose.addEventListener("click", closeJClicDialog);
jclicDialog.addEventListener("click", (e) => {
  if (e.target === jclicDialog) closeJClicDialog();
});
document.addEventListener("keydown", handleJClicShortcuts);
if (jclicFullscreen) {
  jclicFullscreen.addEventListener("click", toggleJClicFullscreen);
}

export async function openJClicDialog(url, fallbackTitle) {
  const { project, title } = parseJClicUrl(url);
  if (!project) return;

  jclicTitle.textContent = title || fallbackTitle || "JClic";
  jclicContainer.innerHTML = "";
  jclicDialog.showModal();

  try {
    const JClicObject = await loadJClic();
    JClicObject.loadProject(jclicContainer, project);
  } catch (error) {
    console.error("No se pudo cargar la actividad JClic", error);
    jclicContainer.innerHTML = "";
    jclicContainer.appendChild(createJClicError());
  }
}

export function closeJClicDialog() {
  if (document.fullscreenElement === jclicContainer) {
    document.exitFullscreen().catch(() => {
      // Ignoramos errores al salir de fullscreen para no bloquear el cierre.
    });
  }
  jclicDialog.close();
  jclicContainer.innerHTML = "";
}

function parseJClicUrl(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    return {
      project: parsed.searchParams.get("project") || "",
      title: parsed.searchParams.get("title") || "",
    };
  } catch {
    return { project: "", title: "" };
  }
}

function handleJClicShortcuts(event) {
  if (!jclicDialog.open) return;
  if (event.key.toLowerCase() === "f" && !event.ctrlKey && !event.altKey && !event.metaKey) {
    event.preventDefault();
    toggleJClicFullscreen();
  }
}

async function toggleJClicFullscreen() {
  if (!jclicContainer || !document.fullscreenEnabled) return;
  if (document.fullscreenElement === jclicContainer) {
    await document.exitFullscreen();
    return;
  }
  await jclicContainer.requestFullscreen();
}

async function loadJClic() {
  if (window.JClicObject) return window.JClicObject;
  window.JClicDataOptions = { noInit: true };
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = JCLIC_SRC;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return window.JClicObject;
}

function createJClicError() {
  const message = document.createElement("p");
  message.className = "flash-error";
  message.textContent = "No se pudo cargar esta actividad JClic.";
  return message;
}

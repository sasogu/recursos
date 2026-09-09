const iframeDialog = document.querySelector("#iframeDialog");
const iframeClose = document.querySelector("#iframeClose");
const iframeFullscreen = document.querySelector("#iframeFullscreen");
const iframeContainer = document.querySelector("#iframeContainer");
const iframeTitle = document.querySelector("#iframeTitle");
let activeIframe = null;

iframeClose.addEventListener("click", closeIframeDialog);
iframeDialog.addEventListener("click", (e) => {
  if (e.target === iframeDialog) closeIframeDialog();
});
document.addEventListener("keydown", handleIframeShortcuts);
if (iframeFullscreen) {
  iframeFullscreen.addEventListener("click", toggleIframeFullscreen);
}

export function openIframeDialog(url, title) {
  if (!url) return;

  iframeTitle.textContent = title || "";
  iframeContainer.innerHTML = "";
  iframeDialog.showModal();

  const frame = document.createElement("iframe");
  frame.src = url;
  frame.title = title || "";
  frame.setAttribute("allowfullscreen", "");
  iframeContainer.appendChild(frame);
  activeIframe = frame;
}

export function closeIframeDialog() {
  if (document.fullscreenElement === iframeContainer) {
    document.exitFullscreen().catch(() => {
      // Ignoramos errores al salir de fullscreen para no bloquear el cierre.
    });
  }
  iframeDialog.close();
  iframeContainer.innerHTML = "";
  activeIframe = null;
}

function handleIframeShortcuts(event) {
  if (!iframeDialog.open) return;
  if (event.key.toLowerCase() === "f" && !event.ctrlKey && !event.altKey && !event.metaKey) {
    event.preventDefault();
    toggleIframeFullscreen();
  }
}

async function toggleIframeFullscreen() {
  if (!iframeContainer || !document.fullscreenEnabled) return;
  if (document.fullscreenElement === iframeContainer) {
    await document.exitFullscreen();
    return;
  }
  await iframeContainer.requestFullscreen();
}

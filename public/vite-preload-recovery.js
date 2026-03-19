const VITE_PRELOAD_RECOVERY_KEY = "vite-preload-recovery";
const RECOVERY_KEY_TIMEOUT_MS = 10_000;

window.addEventListener("vite:preloadError", (event) => {
  try {
    const currentUrl = window.location.href;

    if (window.sessionStorage.getItem(VITE_PRELOAD_RECOVERY_KEY) === currentUrl) {
      window.sessionStorage.removeItem(VITE_PRELOAD_RECOVERY_KEY);
      return;
    }

    event.preventDefault();
    window.sessionStorage.setItem(VITE_PRELOAD_RECOVERY_KEY, currentUrl);
    window.location.reload();
  } catch {
    event.preventDefault();
    return;
  }
});

window.addEventListener("pageshow", () => {
  window.setTimeout(() => {
    try {
      window.sessionStorage.removeItem(VITE_PRELOAD_RECOVERY_KEY);
    } catch {}
  }, RECOVERY_KEY_TIMEOUT_MS);
});

const reloadKey = "__vite_preload_recovery__";

window.addEventListener("vite:preloadError", (event) => {
  try {
    const currentUrl = window.location.href;

    if (window.sessionStorage.getItem(reloadKey) === currentUrl) {
      window.sessionStorage.removeItem(reloadKey);
      return;
    }

    event.preventDefault();
    window.sessionStorage.setItem(reloadKey, currentUrl);
  } catch {
    event.preventDefault();
  }

  window.location.reload();
});

window.addEventListener("pageshow", () => {
  window.setTimeout(() => {
    try {
      window.sessionStorage.removeItem(reloadKey);
    } catch {}
  }, 10_000);
});

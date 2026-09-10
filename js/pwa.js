if ("serviceWorker" in navigator) {
  const sw = location.pathname.includes("/pages/") ? "../../sw.js" : "./sw.js";
  navigator.serviceWorker.register(sw).catch(() => {});
}

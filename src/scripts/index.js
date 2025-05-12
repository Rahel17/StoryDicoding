import "../styles/styles.css";
import "leaflet/dist/leaflet.css";
import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  async function guardedRender() {
    const path = location.hash.replace("#", "") || "/";
    const isPublicPage = path === "/login" || path === "/register";
    const token = localStorage.getItem("authToken");

    if (!token && !isPublicPage) {
      window.location.hash = "/register";
      return;
    }

    await app.renderPage();
  }

  await guardedRender();
  window.addEventListener("hashchange", guardedRender);

  const logoutLink = document.getElementById("logout-link");
  const token = localStorage.getItem("authToken");

  if (logoutLink && token) {
    logoutLink.style.display = "inline-block";

    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUserId");
      localStorage.removeItem("authUserName");
      window.location.hash = "/login";
    });
  }
});

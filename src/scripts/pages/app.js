import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { subscribeNotification } from "../data/api.js";
import { openDB } from "../data/indexeddb.js";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._registerServiceWorker();
    this._initIndexedDB();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });

    // Add bookmark link to navigation drawer
    const nav = this.#navigationDrawer.querySelector("nav");
    if (nav) {
      const bookmarkLink = document.createElement("a");
      bookmarkLink.href = "#/bookmark";
      bookmarkLink.textContent = "Laporan Tersimpan";
      bookmarkLink.classList.add("nav-link");
      nav.appendChild(bookmarkLink);
    }
  }

  async _registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        console.log("Service Worker registered with scope:", registration.scope);
        // Wait until the service worker is ready before subscribing
        const readyRegistration = await navigator.serviceWorker.ready;
        this._subscribeUserToPush(readyRegistration);
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  async _subscribeUserToPush(registration) {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const vapidPublicKey = "REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY";
    const convertedVapidKey = this._urlBase64ToUint8Array(vapidPublicKey);

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      await subscribeNotification(token, subscription);
      console.log("User subscribed to push notifications.");
    } catch (error) {
      console.error("Failed to subscribe user to push notifications:", error);
    }
  }

  _urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async _initIndexedDB() {
    try {
      await openDB();
      console.log("IndexedDB initialized.");
    } catch (error) {
      console.error("Failed to initialize IndexedDB:", error);
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    let page = routes[url];

    if (!page) {
      page = routes['*']; // NotFoundPage
    }

    const renderContent = async () => {
      this.#content.classList.add("fade-out");
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      this.#content.classList.remove("fade-out");
      this.#content.classList.add("fade-in");
      setTimeout(() => this.#content.classList.remove("fade-in"), 300);

      // Update navigasi setelah halaman selesai dirender
      const token = localStorage.getItem("authToken");
      const navLogin = document.getElementById("nav-login");
      const navRegister = document.getElementById("nav-register");
      const footerLogoutBtn = document.getElementById("footer-logout-btn");

      if (token) {
        if (navLogin) navLogin.style.display = "none";
        if (navRegister) navRegister.style.display = "none";
        if (footerLogoutBtn) footerLogoutBtn.style.display = "inline-block";
      } else {
        if (navLogin) navLogin.style.display = "inline-block";
        if (navRegister) navRegister.style.display = "inline-block";
        if (footerLogoutBtn) footerLogoutBtn.style.display = "none";
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(renderContent);
    } else {
      await renderContent();
    }
  }
}

export default App;

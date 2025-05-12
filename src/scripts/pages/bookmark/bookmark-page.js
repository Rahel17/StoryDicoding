import BookmarkPresenter from "../../presenters/bookmark-presenter.js";
import { showFormattedDate } from "../../utils/index.js";

export default class BookmarkPage {
  #presenter = null;

  constructor() {
    this.#presenter = new BookmarkPresenter(this);
  }

  async render() {
    return `
      <section class="container" id="main-content" tabindex="-1" aria-label="Laporan Tersimpan">
        <h2>Daftar Cerita Tersimpan</h2>
        <div id="bookmark-list" class="bookmark-list"></div>
      </section>
    `;
  }

  async afterRender() {
    await this.#presenter.loadSavedReports();
  }

  renderReports(reports) {
  const container = document.getElementById("bookmark-list");
  if (!reports.length) {
    container.innerHTML = "<p>Belum ada laporan tersimpan.</p>";
    return;
  }

  container.innerHTML = reports
    .map((report) => `
      <article class="card shadow" style="max-width: 350px; border-radius: 10px; overflow: hidden; margin: 1rem;">
        <img src="${report.photoUrl}" alt="Foto oleh ${report.name}" class="card-image" style="width: 100%; height: 200px; object-fit: cover;" />
        <div class="card-content" style="padding: 1rem;">
          <h3 style="margin-bottom: 0.5rem;">${report.name}</h3>
          <time style="display: block; color: #555;">${showFormattedDate(report.createdAt, "id-ID")}</time>
          ${report.address ? `<p class="location" style="margin: 0.5rem 0; color: #666;">📍 ${report.address}</p>` : ""}
          <p style="margin-bottom: 0.5rem;">${report.description}</p>
          <p class="reporter" style="font-size: 0.9rem; color: #777;">Dilaporkan oleh: ${report.reporter || "Anonim"}</p>
          <div class="actions" style="margin-top: 0.5rem;">
            <!-- Tombol Buang laporan -->
<button
  class="btn btn-remove"
  style="display: inline-block; margin-top: 0.5rem; background-color: white; color: black; padding: 0.5rem 1rem; text-decoration: none; border-radius: 5px; border: 1px solid #dc3545; cursor: pointer;"
  data-id="${report.id}"
  aria-label="Buang laporan ${report.name}"
>
  <i class="fas fa-trash-alt"></i> Buang Laporan
</button>

<!-- Tombol Try Notify Me -->
<button
  class="btn btn-notify"
  style="display: inline-block; margin-top: 0.5rem; background-color: white; color: black; border: 1px solid #504e76; padding: 0.5rem 1rem; text-decoration: none; border-radius: 5px;  cursor: pointer;"
  data-id="${report.id}"
  aria-label="Try Notify Me for ${report.name}"
>
  <i class="fas fa-bell"></i> Try Notify Me
</button>

          </div>
          <a href="#/story/${report.id}" class="btn btn-primary" style="display: inline-block; margin-top: 0.5rem; background-color: #504e76; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 5px;" aria-label="Selengkapnya tentang ${report.name}">Selengkapnya &rarr;</a>
        </div>
      </article>
    `)
    .join("");

  // Optional: tambahkan flexbox layout
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.justifyContent = "center";

  // Add event listeners for buttons
  container.querySelectorAll(".btn-remove").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const id = event.target.dataset.id;
      await this.#presenter.removeReport(id);
      await this.#presenter.loadSavedReports();
    });
  });

  container.querySelectorAll(".btn-notify").forEach((button) => {
    button.addEventListener("click", () => {
      if (Notification.permission === "granted") {
        new Notification("Test Notification", {
          body: "This is a test notification from your saved report.",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Test Notification", {
              body: "This is a test notification from your saved report.",
            });
          }
        });
      }
    });
  });
}
}
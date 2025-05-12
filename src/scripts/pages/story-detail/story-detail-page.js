import StoryDetailPresenter from "../../presenters/story-detail-presenter";
import { showFormattedDate } from "../../utils/index";
import L from "leaflet";
import Database from "../../data/database";
import * as Api from "../../data/api";

export default class StoryDetailPage {
  #presenter = null;

  constructor() {
    this.#presenter = new StoryDetailPresenter(this, { apiModel: Api, dbModel: Database });
  }

  async render() {
    return `
      <a class="skip-link" id="skip-link" href="#main-content" role="link" tabindex="0">Lewati ke konten utama</a>
      <section class="container" id="main-content" tabindex="-1" aria-label="Detail Cerita">
        <h2>Detail Cerita</h2>
        <div id="story-detail">Loading...</div>
        <div id="save-actions-container"></div>
        <button id="back-button" class="btn-primary" style="margin-top: 1rem;">
          <i class="fa-solid fa-backward" style="margin-right: 6px;"></i> Kembali
        </button>
      </section>
    `;
  }

  async afterRender() {
    const storyId = location.hash.slice(2).split("/")[1];
    await this.#presenter.getStoryDetail(storyId);

    const backButton = document.getElementById("back-button");
    backButton.addEventListener("click", () => {
      window.location.hash = "/";
    });

    // Skip to content
    const skipLink = document.getElementById("skip-link");
    const mainContent = document.getElementById("main-content");

    function skipToMain(event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    }

    skipLink.addEventListener("click", skipToMain);
    skipLink.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        skipToMain(event);
      }
    });
  }

  renderStoryDetail(story) {
    const container = document.getElementById("story-detail");
    container.innerHTML = `
      <div class="story-detail-layout">
        <div class="story-image-wrapper">
          <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" class="story-image" />
        </div>
        <div class="story-map"></div>
      </div>
      <div class="story-info">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <time>${showFormattedDate(story.createdAt, "id-ID")}</time>
      </div>
    `;

    if (story.lat && story.lon) {
      const mapContainer = container.querySelector(".story-map");
      const map = L.map(mapContainer).setView([story.lat, story.lon], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const customIcon = L.divIcon({
        html: '<i class="fa-solid fa-location-dot" style="font-size: 24px; color: red;"></i>',
        iconSize: [24, 24],
        className: "",
      });

      L.marker([story.lat, story.lon], { icon: customIcon }).addTo(map).bindPopup(`<strong>${story.name}</strong><br>${story.description}`).openPopup();
    }
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML = `
      <button id="report-detail-save" class="btn-primary">Simpan Laporan</button>
    `;
    document.getElementById('report-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveReport();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML = `
      <button id="report-detail-remove" class="btn-danger">Buang Laporan</button>
    `;
    document.getElementById('report-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeReport();
      await this.#presenter.showSaveButton();
    });
  }

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }

  removeFromBookmarkFailed(message) {
    alert(message);
  }

  renderFailedMessage(message) {
    const container = document.getElementById("story-detail");
    container.innerHTML = `<p>${message}</p>`;
  }
}

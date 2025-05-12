import HomePresenter from "../../presenters/home-presenter";
import L from "leaflet";

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter(this);
  }

  async render() {
    return `
      <section class="container" id="main-content" tabindex="-1">
        <h2>Beranda - Cerita Terbaru</h2>
        <div id="story-list" class="story-list"></div>
        <div id="map" style="height: 400px; margin-top: 2rem;"></div>

        <div class="coordinate-display-row">
          <div class="coordinate-box">
            <label for="lat-display">Latitude</label>
            <input type="text" id="lat-display" class="coord-input" readonly />
          </div>
          <div class="coordinate-box">
            <label for="lon-display">Longitude</label>
            <input type="text" id="lon-display" class="coord-input" readonly />
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.showLoading();
    await this.presenter.loadStories();
  }

  showLoading() {
    const storyListEl = document.getElementById("story-list");
    storyListEl.innerHTML = "<p>Loading stories...</p>";
  }

  renderStories(stories) {
    const storyListEl = document.getElementById("story-list");
    storyListEl.innerHTML = "";

    if (!stories || stories.length === 0) {
      storyListEl.innerHTML = "<p>Tidak ada cerita untuk ditampilkan.</p>";
      return;
    }

    const mapEl = document.getElementById("map");
    const latEl = document.getElementById("lat-display");
    const lonEl = document.getElementById("lon-display");

    const map = L.map(mapEl).setView([-2.5489, 118.0149], 4);

    const openStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    });
    const topoMap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenTopoMap contributors",
    });
    const watercolorMap = L.tileLayer("https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg", {
      attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.",
      maxZoom: 16,
    });

    openStreetMap.addTo(map);
    const baseMaps = {
      OpenStreetMap: openStreetMap,
      Topographic: topoMap,
      Watercolor: watercolorMap,
    };
    L.control.layers(baseMaps).addTo(map);

    map.on("click", function (e) {
      const { lat, lng } = e.latlng;
      if (latEl && lonEl) {
        latEl.value = lat.toFixed(5);
        lonEl.value = lng.toFixed(5);
      }
    });

    const customIcon = L.divIcon({
      html: '<i class="fa-solid fa-location-dot" style="font-size: 24px; color: red;"></i>',
      iconSize: [24, 24],
      className: "",
    });

    stories.forEach((story) => {
      const storyEl = document.createElement("article");
      storyEl.className = "story-item";
      storyEl.innerHTML = 
        '<img src="' + story.photoUrl + '" alt="Foto oleh ' + story.name + '" />' +
        '<h3>' + story.name + '</h3>' +
        '<p>' + story.description + '</p>' +
        '<time>' + new Date(story.createdAt).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }) + '</time>';

      const detailButton = document.createElement("button");
      detailButton.innerHTML = '<i class="fa-solid fa-magnifying-glass" style="margin-right: 6px;"></i> Lihat Detail';
      detailButton.className = "btn-primary story-detail-button";
      detailButton.style.marginTop = "10px";
      detailButton.addEventListener("click", () => {
        window.location.hash = '#/story/' + story.id;
      });

      storyEl.appendChild(detailButton);
      storyListEl.appendChild(storyEl);

      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon], { icon: customIcon }).addTo(map);

        marker.bindPopup('<strong>' + story.name + '</strong><br>' + story.description);

        marker.on("click", () => {
          if (latEl && lonEl) {
            latEl.value = Number(story.lat).toFixed(5);
            lonEl.value = Number(story.lon).toFixed(5);
          }
        });
      }
    });
  }

  renderFailedMessage(message) {
    const storyListEl = document.getElementById("story-list");
    storyListEl.innerHTML = '<p>' + message + '</p>';
  }
}

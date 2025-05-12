import AddStoryPresenter from "../../presenters/add-story-presenter";
import L from "leaflet";

export default class AddStoryPage {
  constructor() {
    this._stream = null;
    this._selectedFile = null;
    this._marker = null;
    this.presenter = new AddStoryPresenter(this);
  }

  _stopStream() {
    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
    }
  }

  async render() {
    return `
      <a class="skip-link" id="skip-link" role="link" tabindex="0">Lewati ke konten utama</a>
      <section class="container add-story-container" id="main-content" tabindex="-1">
        <h2 class="add-story-title">Tambah Cerita Baru</h2>
        <form id="storyForm" class="story-form">
          <div class="form-row">
            <div class="form-column">
              <label for="description">Deskripsi</label>
              <textarea id="description" rows="8" required></textarea>
            </div>
            <div class="form-column">
              <label for="photo">Foto</label>
              <button type="button" id="toggleCameraBtn" class="toggle-camera-btn">Nyalakan Kamera</button>
              <video id="camera" autoplay playsinline style="display: none;"></video>
              <canvas id="canvas" style="display: none;"></canvas>
              <button type="button" id="captureButton" class="capture-button" style="display: none;">Ambil Foto</button>
              <input type="file" id="fileInput" accept="image/*" />
              <img id="previewImage" alt="Preview Gambar" style="max-width: 100%; display: none;" />
            </div>
          </div>

          <div class="form-group">
            <label>Lokasi</label>
            <div id="map" style="height: 300px; margin-block: 1rem;"></div>
            <input type="hidden" id="lat" />
            <input type="hidden" id="lon" />
          </div>

          <div class="form-group coordinate-display-row">
            <div class="coordinate-box">
              <label for="lat-display">Latitude</label>
              <input type="text" id="lat-display" class="coord-input" readonly />
            </div>
            <div class="coordinate-box">
              <label for="lon-display">Longitude</label>
              <input type="text" id="lon-display" class="coord-input" readonly />
            </div>
          </div>

          <button type="submit" class="toggle-camera-btn">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      window.location.hash = "/login";
      return;
    }

    this._video = document.getElementById("camera");
    this._canvas = document.getElementById("canvas");
    this._toggleCameraBtn = document.getElementById("toggleCameraBtn");
    this._captureButton = document.getElementById("captureButton");
    this._fileInput = document.getElementById("fileInput");
    this._previewImage = document.getElementById("previewImage");
    this._latInput = document.getElementById("lat");
    this._lonInput = document.getElementById("lon");
    this._latDisplay = document.getElementById("lat-display");
    this._lonDisplay = document.getElementById("lon-display");
    this._form = document.getElementById("storyForm");

    this._toggleCameraBtn.addEventListener("click", async () => {
      if (this._stream) {
        this._stopStream();
        this._video.srcObject = null;
        this._video.style.display = "none";
        this._captureButton.style.display = "none";
        this._toggleCameraBtn.textContent = "Nyalakan Kamera";
      } else {
        try {
          this._stream = await navigator.mediaDevices.getUserMedia({ video: true });
          this._video.srcObject = this._stream;
          this._video.style.display = "block";
          this._captureButton.style.display = "inline-block";
          this._toggleCameraBtn.textContent = "Matikan Kamera";
        } catch (error) {
          alert("Tidak dapat mengakses kamera: " + error.message);
        }
      }
    });

    this._captureButton.addEventListener("click", () => {
      this._canvas.width = this._video.videoWidth;
      this._canvas.height = this._video.videoHeight;
      this._canvas.getContext("2d").drawImage(this._video, 0, 0);
      this._canvas.style.display = "block";
      this._previewImage.style.display = "none";
      this._video.style.display = "none";

      if (this._stream) {
        this._stopStream();
        this._toggleCameraBtn.textContent = "Nyalakan Kamera";
      }
    });

    this._fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this._selectedFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          this._previewImage.src = event.target.result;
          this._previewImage.style.display = "block";
          this._canvas.style.display = "none";
          this._video.style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    });

    const map = L.map("map").setView([-2.5489, 118.0149], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const customIcon = L.divIcon({
      html: '<i class="fa-solid fa-location-dot" style="font-size: 24px; color: red;"></i>',
      iconSize: [24, 24],
      className: "",
    });

    let marker = null;
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this._latInput.value = lat;
      this._lonInput.value = lng;
      this._latDisplay.value = lat.toFixed(5);
      this._lonDisplay.value = lng.toFixed(5);

      if (this._marker) map.removeLayer(this._marker);
      this._marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    });

    this._form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = document.getElementById("description").value;
      const lat = this._latInput.value;
      const lon = this._lonInput.value;
      let photoBlob;

      if (this._selectedFile) {
        photoBlob = this._selectedFile;
      } else if (this._canvas.style.display !== "none") {
        photoBlob = await new Promise((resolve) =>
          this._canvas.toBlob(resolve, "image/jpeg", (blob) => resolve(blob))
        );
      } else {
        alert("Silakan unggah atau ambil foto terlebih dahulu.");
        return;
      }

      try {
        await this.presenter.sendStory({
          description,
          lat,
          lon,
          photo: photoBlob,
          token,
        });
        alert("Cerita berhasil ditambahkan!");
        window.location.hash = "/";
        location.reload();
      } catch (error) {
        alert(error.message);
      }
    });

    this._setupSkipToContent();
    this._destroyStreamOnLeave();
  }

  _setupSkipToContent() {
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

  _destroyStreamOnLeave() {
    window.addEventListener("hashchange", () => {
      if (this._stream) {
        this._stream.getTracks().forEach((track) => track.stop());
        this._stream = null;
      }
    });
  }
}

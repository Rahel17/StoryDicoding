import { getAllStories } from "../data/api.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
  }

  async loadStories() {
    this.view.showLoading();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        this.view.renderFailedMessage("Silakan login terlebih dahulu.");
        return;
      }
      const response = await getAllStories(token);
      if (!response || response.error) {
        this.view.renderFailedMessage(response?.message || "Gagal memuat cerita.");
        return;
      }
      this.view.renderStories(response.listStory ?? []);
    } catch (error) {
      this.view.renderFailedMessage(`Gagal memuat cerita: ${error.message}`);
    }
  }
}

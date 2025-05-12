import { getStoryDetail } from "../data/api.js";

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #apiModel;
  #dbModel;

  constructor(view, { apiModel = null, dbModel = null } = {}) {
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
  }

  async getStoryDetail(storyId) {
    this.#storyId = storyId;
    if (typeof this.#view.showLoading === "function") {
      this.#view.showLoading();
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        this.#view.renderFailedMessage("Anda belum login.");
        return;
      }
      const response = await getStoryDetail(token, storyId);
      if (response.error) {
        this.#view.renderFailedMessage(response.message);
        return;
      }
      this.#view.renderStoryDetail(response.story);
      await this.showSaveButton();
    } catch (error) {
      this.#view.renderFailedMessage(`Gagal mengambil detail cerita: ${error.message}`);
    }
  }

  async saveReport() {
    try {
      const report = await this.#apiModel.getStoryDetail(localStorage.getItem("authToken"), this.#storyId);
      await this.#dbModel.putReport(report.story);
      this.#view.saveToBookmarkSuccessfully('Berhasil menyimpan laporan.');
    } catch (error) {
      console.error('saveReport: error:', error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async removeReport() {
    try {
      await this.#dbModel.removeReport(this.#storyId);
      this.#view.removeFromBookmarkSuccessfully('Berhasil menghapus laporan.');
    } catch (error) {
      console.error('removeReport: error:', error);
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isReportSaved()) {
      this.#view.renderRemoveButton();
      return;
    }
    this.#view.renderSaveButton();
  }

  async #isReportSaved() {
    return !!(await this.#dbModel.getReportById(this.#storyId));
  }
}

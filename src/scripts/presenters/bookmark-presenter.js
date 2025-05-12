import Database from "../data/database.js";

export default class BookmarkPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async loadSavedReports() {
    try {
      const reports = await Database.getAllReports();
      this.#view.renderReports(reports);
    } catch (error) {
      console.error("Failed to load saved reports:", error);
      this.#view.renderReports([]);
    }
  }

  async removeReport(id) {
    try {
      await Database.removeReport(id);
      await this.loadSavedReports();
    } catch (error) {
      console.error("Failed to remove report:", error);
    }
  }
}

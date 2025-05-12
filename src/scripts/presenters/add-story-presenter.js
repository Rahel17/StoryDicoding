import { addNewStory } from "../data/api.js";
import { addOfflineStory, getAllOfflineStories, deleteOfflineStory } from "../data/indexeddb.js";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;

    window.addEventListener("online", () => {
      this.syncOfflineStories();
    });
  }

  async sendStory({ description, lat, lon, photo, token }) {
    try {
      const result = await addNewStory(token, description, photo, lat, lon);
      return result;
    } catch (error) {
      // Save story offline if network or API fails
      await addOfflineStory({ description, lat, lon, photo, token, createdAt: new Date().toISOString() });
      return { offline: true };
    }
  }

  async syncOfflineStories() {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const offlineStories = await getAllOfflineStories();
    for (const story of offlineStories) {
      try {
        await addNewStory(token, story.description, story.photo, story.lat, story.lon);
        await deleteOfflineStory(story.id);
        console.log(`Offline story with id ${story.id} synced.`);
      } catch (error) {
        console.error(`Failed to sync offline story with id ${story.id}:`, error);
      }
    }
  }
}

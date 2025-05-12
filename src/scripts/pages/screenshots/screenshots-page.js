class ScreenshotsPage {
  async render() {
    return `
      <section class="screenshots-page">
        <h2>Screenshot Aplikasi</h2>
        <div class="screenshots-container">
          <div class="screenshot-item">
            <h3>Desktop</h3>
            <img src="/images/screenshot-desktop.png" alt="Screenshot Desktop" />
          </div>
          <div class="screenshot-item">
            <h3>Mobile</h3>
            <img src="/images/screenshot-mobile.png" alt="Screenshot Mobile" />
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Any post-render actions if needed
  }
}

export default ScreenshotsPage;

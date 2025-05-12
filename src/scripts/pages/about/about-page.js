export default class AboutPage {
  async render() {
    return `
      <<section class="container about-section" tabindex="0" aria-label="About Page">
        <h1 class="about-title">About This App</h1>
        <p class="about-desc">
          <strong>Dicoding Stories</strong> adalah aplikasi berbagi cerita berbasis web yang memungkinkan pengguna untuk membagikan pengalaman mereka melalui foto dan deskripsi singkat.
          Aplikasi ini dibangun dengan teknologi <em>Single Page Application (SPA)</em>, menggunakan arsitektur <strong>MVP</strong>, dan terintegrasi langsung dengan API dari Dicoding Story API</a>.
        </p>
        <p class="about-desc">
          Setiap cerita dapat disertai dengan lokasi di peta, sehingga pengguna dapat melihat dari mana cerita tersebut berasal. Aplikasi ini juga mendukung pengambilan gambar dari kamera dan penandaan lokasi interaktif melalui peta digital.
        </p>
        <p class="about-desc">
          Dimodifikasi dengan ❤️ oleh <strong>Siswa FEBE Dicoding Tercinta</strong> sebagai bagian dari submission kelas.
        </p>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}

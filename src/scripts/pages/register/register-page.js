import RegisterPresenter from '../../presenters/register-presenter.js';

export default class RegisterPage {
  constructor() {
    this.presenter = new RegisterPresenter(this);
  }

  async render() {
    return `
      <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
      <main id="main-content">
        <section class="auth-section auth-layout" tabindex="0" aria-label="Register Page" style="min-height: calc(100vh - 90px); display: flex;">
          <div class="auth-right" style="flex: 1; display: flex; justify-content: center; align-items: center;">
            <form id="registerForm" class="auth-form-card" aria-labelledby="register-title" style="width: 100%; max-width: 400px; padding: 2rem; background-color: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
              <h1 id="register-title" style="font-size: 1.5rem; font-weight: 700; color: #504e76; margin-bottom: 1rem;">Register</h1>

              <label for="name" style="font-weight: bold; margin-bottom: 4px;">Name</label>
              <input id="name" type="text" name="name" placeholder="Full Name" required style="padding: 10px; font-size: 1rem; width: 100%; border-radius: 6px; border: 1px solid #ccc; background-color: #f0f4ff; margin-bottom: 1rem;" />

              <label for="email" style="font-weight: bold; margin-bottom: 4px;">Email</label>
              <input id="email" type="email" name="email" placeholder="Email Address" required style="padding: 10px; font-size: 1rem; width: 100%; border-radius: 6px; border: 1px solid #ccc; background-color: #f0f4ff; margin-bottom: 1rem;" />

              <label for="password" style="font-weight: bold; margin-bottom: 4px;">Password</label>
              <input id="password" type="password" name="password" placeholder="Password" required style="padding: 10px; font-size: 1rem; width: 100%; border-radius: 6px; border: 1px solid #ccc; background-color: #f0f4ff; margin-bottom: 1.5rem;" />

              <button type="submit" class="btn-primary" style="width: 100%; padding: 12px; background-color: #504e76; color: white; font-weight: bold; font-size: 1rem; border: none; border-radius: 6px; cursor: pointer;">Sign Up</button>
              <p class="alt-link" style="margin-top: 1rem; font-size: 0.9rem; text-align: center;">Already have an account? <a href="#/login" style="color: #504e76; font-weight: 600;">Login</a></p>
              <div id="register-message" role="alert" aria-live="polite" style="margin-top: 10px; color: red;"></div>
            </form>
          </div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", (event) => this.presenter.handleRegister(event));
  }

  setMessage(text, isError = true) {
    const message = document.getElementById("register-message");
    if (!message) return;
    message.style.color = isError ? "red" : "green";
    message.textContent = text;
  }
}

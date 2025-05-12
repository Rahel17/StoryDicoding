import { registerUser } from "../data/api.js";

export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleRegister(event) {
    event.preventDefault();
    this.view.setMessage("");

    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!name || !email || !password) {
      this.view.setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await registerUser(name, email, password);
      if (response.error) {
        this.view.setMessage(response.message || "Registration failed.");
      } else {
        this.view.setMessage("Registration successful! Redirecting to login...", false);
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
      }
    } catch (error) {
      this.view.setMessage(error.message || "Registration failed.");
    }
  }
}

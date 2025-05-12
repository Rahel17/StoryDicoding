import { loginUser } from "../data/api.js";

export default class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async login(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      this.view.showError("Please fill in all fields.");
      return;
    }
    try {
      const result = await loginUser(email, password);
      if (result.error) {
        this.view.showError(result.message || "Login failed.");
        return;
      }
      localStorage.setItem("authToken", result.loginResult.token);
      localStorage.setItem("authUserId", result.loginResult.userId);
      localStorage.setItem("authUserName", result.loginResult.name);
      this.view.loginSuccess();
    } catch (error) {
      this.view.showError(error.message || "Login failed.");
    }
  }
}

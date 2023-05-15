import { makeAutoObservable } from "mobx";
import { LoginRequest, RegisterRequest } from "../dto/request/auth-request.dto";
import { AuthService } from "../services/auth.service";
import { redirect } from "react-router-dom";

export class AuthStore {
  private authenticated = false;
  private loginState = true;
  private registerState = true;

  constructor(private readonly authService: AuthService) {
    makeAutoObservable(this);
    this.authenticated = !!this.getAccessToken();
  }

  async login(loginRequest: LoginRequest) {
    try {
      const tokenPayloadDto = await this.authService.login(loginRequest);
      const current = new Date();
      const date_expires = new Date(current.getTime() + tokenPayloadDto.expires_in*1000);
      localStorage.setItem("user_info", JSON.stringify({ ...tokenPayloadDto, date_expires }));
      this.authenticated = true;
      this.loginState = true;
      return redirect("/guest");
    } catch (err) {
      this.authenticated = false;
      this.loginState = false;
    }
  }

  async register(registerRequest: RegisterRequest) {
    try {
      await this.authService.register(registerRequest);
      const tokenPayloadDto = await this.authService.login(registerRequest);
      const current = new Date();
      const date_expires = new Date(current.getTime() + tokenPayloadDto.expires_in*1000);
      localStorage.setItem("user_info", JSON.stringify({ ...tokenPayloadDto, date_expires }));
      this.authenticated = true;
      this.loginState = true;
      this.registerState = true;
      return redirect("/guest");
    } catch (err) {
      this.authenticated = false;
      this.loginState = false;
      this.registerState = false;
    }
  }

  async logout(accessToken: string) {
    await this.authService.logout(accessToken);
    localStorage.removeItem("user_info");
    this.authenticated = false;
    this.loginState = false;
    this.registerState = true;
    return redirect("/");
  }

  getAccessToken(): string {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");

    if(user) {
      const dateExpires = new Date(user.date_expires);
      const dateNow = new Date();
      console.log(dateExpires)
      console.log(dateNow)
      if(dateExpires > dateNow) {
        console.log("vào vào")
        return user.access_token || "";
      }
    }
    console.log("vào vào2")
    this.authenticated = false;
    this.loginState = false;
    return "";
  }

  isAuthenticated() {
    return this.authenticated;
  }

  getLoginState() {
    return this.loginState;
  }

  getRegisterState() {
    return this.registerState;
  }

  setLoginState(state: boolean) {
    this.loginState = state;
  }

  setRegisterState(state: boolean) {
    this.registerState = state;
  }
}

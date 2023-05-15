import { LoginRequest, RegisterRequest } from "../dto/request/auth-request.dto";
import { API_URL } from "../utils/url";

export class AuthService {
  async login(loginRequest: LoginRequest) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    });

    const parsedResponse = await response.json();

    if (!response.ok) {
      throw new Error(parsedResponse);
    }

    return parsedResponse;
  }

  async register(registerRequest: RegisterRequest) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    });

    const parsedResponse = await response.json();

    if (!response.ok) {
      throw new Error(parsedResponse);
    }

    return parsedResponse;
  }

  async logout(accessToken: string) {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
    });

    const parsedResponse = await response.json();

    if (!response.ok) {
      throw new Error(parsedResponse);
    }

    return parsedResponse;
  }
}

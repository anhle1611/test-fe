export interface LoginRequest {
  readonly name: string;
  readonly password: string;
}

export interface RegisterRequest {
  readonly name: string;
  readonly password: string;
  readonly password_confirmation: string;
}

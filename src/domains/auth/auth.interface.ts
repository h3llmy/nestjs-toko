export interface ILoginTokenPayload {
  id: string;
  username: string;
  email: string;
}

export interface IRegisterTokenPayload {
  id: string;
}

export interface IForgetPasswordPayload {
  id: string;
}

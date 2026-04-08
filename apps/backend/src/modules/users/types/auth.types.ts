export interface LoginDTO {
  name: string;
  password: string;
}

export interface UserProfileDTO {
  id: number;
  name: string;
  role: string;
}

export interface AuthResponseDTO {
  user: UserProfileDTO;
  token: string;
}

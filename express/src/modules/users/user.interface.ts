export interface IUser {
  name: string;
  email: string;
  password: string;
  age?: number | null;
  is_Active?: boolean | null;
  role?: string;
}

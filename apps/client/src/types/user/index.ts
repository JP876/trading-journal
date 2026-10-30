type TUserVariety = 'GUEST' | 'EXTERNAL';

export type User = {
  id: number | string;
  name: string;
  email: string;
  image: string | null;
  variety: TUserVariety;
};

export type UserDB = Omit<User, 'email'> & { isLoggedIn: boolean };

export interface IUser {
    email: string;
    password: string;
}

export interface IUserRegister extends IUser {
    name: string;
    surname: string;
    admin?: boolean;
}

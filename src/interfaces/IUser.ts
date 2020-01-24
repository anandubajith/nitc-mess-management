export interface IUser {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  password: string;
  salt: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  rollNumber: string;
  password: string;
}

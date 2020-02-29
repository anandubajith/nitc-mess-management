export interface IUser {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  password: string;
  salt: string;
  mess: string;
  hostelName: string;
  roomNumber: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  rollNumber: string;
  password: string;
  hostelName: string;
  roomNumber: string;
}

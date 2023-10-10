import { Address } from "./Address";

export interface UserProfile {
  id: number;
  email: string;
  userName: string;
  dateOfBirth: Date;
  gender: string;
  photo: string;
  addressDto?: Address; 
  mobileNumber: number;
  isActive: boolean;
  roles?: string[];
}

export interface UserProfileParams {
    search?: string;
    pageNumber: number;
    pageSize: number;
}
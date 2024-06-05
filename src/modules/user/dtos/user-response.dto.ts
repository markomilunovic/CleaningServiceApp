import { User } from '../user.model';

export class UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  buildingNumber: number;
  floor: number;
  apartmentNumber: string;
  city: string;
  contactPhone: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.address = user.address;
    this.buildingNumber = user.buildingNumber;
    this.floor = user.floor;
    this.apartmentNumber = user.apartmentNumber;
    this.city = user.city;
    this.contactPhone = user.contactPhone;
    this.role = user.role;
    this.emailVerified = user.emailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

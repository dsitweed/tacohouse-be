import { $Enums } from '@prisma/client';

export class GetOwnerInfoResDto {
  id: number;
  email: string;
  role: $Enums.UserRole;
  isActive: boolean;
  firstName: string;
  lastName: string;
  address: string;
  citizenNumber: string;
  phoneNumber: string;
  avatarUrl: string;
  citizenImageUrls: string[];
  dob: Date;
  roomId: number;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
}

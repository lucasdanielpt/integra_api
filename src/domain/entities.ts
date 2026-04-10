export type UserRole = "CLIENTE" | "ADMIN" | "PROFISSIONAL";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "NOT_INFORMED";

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfileEntity {
  id: string;
  userId: string;
  fullName: string;
  cpf: string;
  birthDate: Date;
  phone: string | null;
  gender: Gender;
  address: Record<string, unknown> | null;
  emergencyContact: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfessionalProfileEntity {
  id: string;
  userId: string;
  fullName: string;
  councilType: string;
  councilNumber: string;
  specialty: string;
  phone: string | null;
  bio: string | null;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionEntity {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  deviceInfo: Record<string, unknown> | null;
  ip: string | null;
  createdAt: Date;
}

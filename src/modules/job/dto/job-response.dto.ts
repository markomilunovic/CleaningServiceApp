import { Job } from '../job.model';

export class JobResponseDto {
  id: number;
  description: string;
  userId: number;
  workerId: number;
  squareMeters: number;
  rooms: object;
  tasks: object;
  hourlyRate: number;
  totalValue: number;
  address: string;
  contactPerson: string;
  contactPhone: string;
  city: string;
  municipality: string;
  status: string;

  constructor(job: Job) {
    this.id = job.id;
    this.description = job.description;
    this.userId = job.userId;
    this.workerId = job.workerId;
    this.squareMeters = job.squareMeters;
    this.rooms = job.rooms;
    this.tasks = job.tasks;
    this.hourlyRate = job.hourlyRate;
    this.totalValue = job.totalValue;
    this.address = job.address;
    this.contactPerson = job.contactPerson;
    this.contactPhone = job.contactPhone;
    this.city = job.city;
    this.municipality = job.municipality;
    this.status = job.status;
  }
}

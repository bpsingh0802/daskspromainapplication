export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  clientName: string;
  providerName: string;
  date: string;
  timeSlot: string;
  location: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
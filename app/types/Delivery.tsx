import { WorkflowStep } from "./WorkflowStep";

export enum DeliveryStatus {
    pending = 'Pending',
    inProgress = 'In progress',
    completed = 'Completed',
    canceled = 'Canceled'
}

export type Delivery = {
    id: string; 
    title: string;
    clientName: string;
    productId: string;
    originSite: string; 
    destinationSite: string;
    status: DeliveryStatus;
    steps: WorkflowStep[];
    createdBy: string;
    createdAt: Date;
    updatedAt?: Date;
  };
  
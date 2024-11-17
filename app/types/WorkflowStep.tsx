export enum WorkflowStatus {
    pending = 'Pending',
    completed = 'Completed',
    skipped = 'Skipped'
}

export type WorkflowStep = {
    id: string;
    deliveryId: string;
    stepNumber: number;
    name: string;
    assignedTo: string;
    status: WorkflowStatus;
    comments?: string;
    createdAt: Date;
    updatedAt?: Date;
  };
  
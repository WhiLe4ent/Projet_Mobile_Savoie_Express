import { WorkflowStep } from "./WorkflowStep";

export enum DeliveryStatus {
    pending = 'Pending',
    inProgress = 'In progress',
    completed = 'Completed',
    canceled = 'Canceled'
}

export type Delivery = {
    id: string;
    title: string; // Nom du client (titre de la livraison)
    type: string; // Type (A ou B)
    model: string;
    reference: string;
    numberId: string;
    color: string;
    physicalSite: string; // Site présence physique
    destinationSite: string; // Site destination
    notes: string; // Divers (nombre d'exemplaires ou autres commentaires)
    createdAt: Date;
};
  

// export type Delivery = {
//     id: string; 
//     title: string;
//     clientName: string;
//     productId: string;
//     originSite: string; 
//     destinationSite: string;
//     status: DeliveryStatus;
//     // steps: WorkflowStep[];
//     createdBy: string;
//     createdAt: Date;
//     updatedAt?: Date;
//   };
  
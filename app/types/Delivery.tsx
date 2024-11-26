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
    
    // Workflow-specific fields
    status: string; // Étape actuelle du workflow (e.g., "Etape 3", "Etape 4", ...)
    presence: string; // "OUI" ou "NON" pour indiquer la présence sur le site
    availability: string; // Disponibilité : "Immédiate" ou une date précise
    preparationFees: string; // "NON" ou description si "OUI"
    productConfiguration: string[]; // Liste des labels cochés (e.g., ["assemblé", "protégé"])
    documentation: string; // "Présente" ou "Absente"
    alerts: string[]; // Liste des alertes envoyées (e.g., ["Produit introuvable"])
    assignedRCO: string; // Email du RCO actuellement responsable
};

export enum Steps {
    Presence = "presence",
    Availability = "availability",
    PreparationFees = "preparationFees",
    Configuration = "productConfiguration",
    Documentation = "documentation",
}
  
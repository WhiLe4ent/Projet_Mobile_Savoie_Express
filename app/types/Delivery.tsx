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
    type: string;
    model: string;
    reference: string;
    numberId: string;
    color: string;
    physicalSite: string;
    destinationSite: string;
    notes: string;
    createdAt: Date;
    
    status: string; // Étape actuelle du workflow (e.g., "Etape 3", "Etape 4", ...)
    presence: boolean; // "OUI" ou "NON" pour indiquer la présence sur le site
    availability: string; // Disponibilité : "Immédiate" ou une date précise
    preparationFees: string; // "NON" ou description si "OUI"
    productConfiguration: string[]; // Liste des labels cochés (e.g., ["assemblé", "protégé"])
    documentation: string; // "Présente" ou "Absente"
    convoyageDate: string;
    qualityControlDate: string;
    packagingRequired: string;
    financingStatus: string;
    paymentReceived: boolean;
    deliveryDate: string;
    packagingReady: string;
    
    alerts: string[]; // Liste des alertes envoyées (e.g., ["Produit introuvable"])
    assignedRCO: string; // Email du RCO actuellement responsable
};

export enum Steps {
    Presence = "presence", // Étape 3
    Availability = "availability", // Étape 4
    PreparationFees = "preparationFees", // Étape 5
    Configuration = "productConfiguration", // Étape 6
    Documentation = "documentation", // Étape 7
    ConvoyageDate = "convoyageDate", // Étape 8
    QualityControlDate = "qualityControlDate", // Étape 10
    PackagingRequired = "packagingRequired", // Étape 11
    FinancingStatus = "financingStatus", // Étape 12
    PaymentReceived = "paymentReceived", // Étape 13
    DeliveryDate = "deliveryDate", // Étape 14
    PackagingReady = "packagingReady", // Étape 15
  }
  
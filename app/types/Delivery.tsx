
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
    
    status: string; 
    presence: boolean;
    availability: string; 
    preparationFees: string; 
    productConfiguration: string[];
    documentation: string;
    convoyageDate: string;
    qualityControlDate: string;
    packagingRequired: string;
    financingStatus: string;
    paymentReceived: boolean;
    deliveryDate: string;
    packagingReady: string;
    
    alerts: string[]; 
    assignedRCO: string; 
};

export enum Steps {
    Presence = "presence",
    Availability = "availability",
    PreparationFees = "preparationFees",
    Configuration = "productConfiguration",
    Documentation = "documentation",
    ConvoyageDate = "convoyageDate",
    QualityControlDate = "qualityControlDate",
    PackagingRequired = "packagingRequired",
    FinancingStatus = "financingStatus",
    PaymentReceived = "paymentReceived",
    DeliveryDate = "deliveryDate",
    PackagingReady = "packagingReady",
  }
  
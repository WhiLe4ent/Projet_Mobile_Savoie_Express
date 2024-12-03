export type DeliveryForm = {
    title: string;
    type: string;
    model: string;
    reference: string;
    numberId: string;
    color: string;
    physicalSite: string;
    destinationSite: string;
    notes?: string;
};
  

export type DeliveryKeys = "title" | "type" | "model" | "reference" | "numberId" | "color" | "physicalSite" | "destinationSite" | "notes";

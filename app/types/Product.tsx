export enum ProductStatus{
    available = 'Available',
    inTransit = 'In transit',
    reserved = 'Reserved',
    unavailable = 'Unavailable'
}

export type Product = {
    id: string;
    model: string;
    reference: string;
    color: string;
    size: string; //cm
    quantity: number;
    currentSite: string;
    destinationSite?: string;
    status: ProductStatus;
    createdAt: Date;
    updatedAt?: Date;
    photo: string;
};
  
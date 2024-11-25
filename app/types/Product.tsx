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
  
export const getStatusColor = (status: string) => {
    let res : string = ''

    switch (status) {
        case ProductStatus.available:
            res = '#17f213'
            break
        case ProductStatus.inTransit:
            res = '#1353f2';
            break;
        case ProductStatus.reserved:
            res = '#696969';
            break;
        case ProductStatus.unavailable:
            res = '#e00000';
            break;
        default:
            res = '#17f213'
    }

    return res;
}

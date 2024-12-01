export enum Role {
    vendeur = 'Vendeur',
    rco = 'RCO',
    financialManager = 'Financial manager',
    convoyage = 'Convoyage',
    secretariat = 'Secretariat',
    accessoiriste = 'Accessoiriste',
    expertProduit = 'Expert produit'
}

export type User = {
    id: number
    email: string 
    firstName: string 
    lastName: string
    pseudo: string
    role: Role
}

export interface RegisterForm 
{
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    pseudo: string,
    role: Role
}

export interface LoginForm 
{
    email: string,
    password: string,
}
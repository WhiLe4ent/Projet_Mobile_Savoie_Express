export enum Role {
    vendeur = 'vendeur',
    rco = 'rco',
    fiancialManahger = 'financial manager',
    secretariat = 'secretariat',
    expertProduit = 'expert produit'
}

export type User = {
    id: number
    email: string 
    firstName: string 
    lastName: string
    username: string
    role: Role
}

export interface RegisterForm 
{
    email: string 
    firstName: string 
    lastName: string
    username: string
    role: Role
}

export interface LoginForm 
{
    email: string,
    password: string,
}
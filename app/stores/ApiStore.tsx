import { action, makeObservable } from "mobx";
import { RootStore } from ".";
import { FIREBASE_DB } from "../../FirebaseConfig";
import { Product } from "../types/Product";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Delivery } from "../types/Delivery";
import { deleteDoc } from "firebase/firestore";

export default class ApiStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this);
    this.rootStore = rootStore;
  }

  @action
  public async getProducts(): Promise<Product[]> {
    try {
      const productsCollectionRef = collection(FIREBASE_DB, "Products");
      const snapshot = await getDocs(productsCollectionRef);
      const products: Product[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as Product;
      });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  @action 
  public getProductById = async (productId: string)=> {
    try {
      const productRef = doc(FIREBASE_DB, 'Products', productId);
      const productSnapshot = await getDoc(productRef);
  
      if (productSnapshot.exists()) {
        return productSnapshot.data() as Product;
      } 
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  @action
  public async getDeliveries(): Promise<Delivery[]> {
    try {
      const deliveriesCollectionRef = collection(FIREBASE_DB, "deliveries");
      const snapshot = await getDocs(deliveriesCollectionRef);
      const deliveries: Delivery[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as Delivery;
      });
      return deliveries;
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      throw new Error("Failed to fetch deliveries");
    }
  }

  @action
  public async deleteDelivery(deliveryId: string): Promise<void> {
    try {
      const deliveryRef = doc(FIREBASE_DB, "deliveries", deliveryId);
      await deleteDoc(deliveryRef); 
    } catch (error) {
      console.error("Error deleting delivery:", error);
      throw new Error("Failed to delete delivery");
    }
  }

  @action
  public async getUsersByRole(role: string): Promise<{ email: string; name: string }[]> {
    try {
      const usersCollectionRef = collection(FIREBASE_DB, "Users");
      const snapshot = await getDocs(usersCollectionRef);
      const users = snapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.role.toLowerCase() === role.toLowerCase());

      return users.map((user) => ({
        email: user.email,
        name: user.name,
      }));
    } catch (error) {
      console.error("Error fetching users by role:", error);
      throw new Error("Failed to fetch users by role");
    }
  }
  
  @action
  public async checkDeliveryName(name: string): Promise<boolean> {
    try {
      const deliveriesCollectionRef = collection(FIREBASE_DB, "deliveries");
      const deliveryQuery = query(deliveriesCollectionRef, where("title", "==", name));
      const snapshot = await getDocs(deliveryQuery);
  
      if (!snapshot.empty) {
        console.error("Delivery with this name already exists.");
        return false;
      }
  
      return true;
    } catch (error) {
      console.error("Error checking delivery name:", error);
      throw new Error("Failed to check delivery name");
    }
  }
  
}

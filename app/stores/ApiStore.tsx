import { action, makeObservable } from "mobx";
import { RootStore } from ".";
import { FIREBASE_DB } from "../../FirebaseConfig";
import { Product } from "../types/Product";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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
      console.log(`Delivery with ID ${deliveryId} successfully deleted`);
    } catch (error) {
      console.error("Error deleting delivery:", error);
      throw new Error("Failed to delete delivery");
    }
  }
  

}

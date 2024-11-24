import { action, makeObservable } from "mobx";
import { RootStore } from ".";
import { FIREBASE_DB } from "../../FirebaseConfig";
import { Product } from "../types/Product";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Delivery } from "../types/Delivery";


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

}

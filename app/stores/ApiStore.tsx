import { action, makeObservable } from "mobx";
import { RootStore } from ".";
import { FIREBASE_DB } from "../../FirebaseConfig";
import { Product } from "../types/Product";
import { collection, getDocs } from "firebase/firestore";


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
}
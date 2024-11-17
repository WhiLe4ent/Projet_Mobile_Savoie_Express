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
      const products: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID if needed
        ...doc.data(), // Spread the document data
      })) as Product[]; // Typecast to Product[] if the data structure matches your Product type
      console.log(products);
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
}
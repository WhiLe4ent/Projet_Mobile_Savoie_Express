import { action, makeObservable } from "mobx";
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";
import { RootStore } from ".";
import { API_URL } from "../settings/Variables";

export default class EmailStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @action
    public async sendEmail(to: string, title: string, delivery: string, deliveryId: string): Promise<void> {
      try {
        const emailsCollectionRef = collection(FIREBASE_DB, "emails");
    
        const subject = `SavoieExpress: Mise à jour de la livraison ${title}`;
    
        // Save email details in Firestore
        await addDoc(emailsCollectionRef, {
          to,
          subject,
          delivery,
          deliveryId,
          sentAt: new Date().toISOString(),
        });
    
        // Build the API URL
        const url = `${API_URL}/send-email`;
    
        // Make the fetch request
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to,
            subject,
            delivery,
            title,
            deliveryId,
          }),
        });
    
        // Handle non-200 responses
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error during email operation:", error);
        throw new Error("Failed to send email.");
      }
    }
    
}

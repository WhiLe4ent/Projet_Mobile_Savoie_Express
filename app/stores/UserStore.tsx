import { action, computed, makeObservable, observable } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStore } from ".";
import { User } from "../types/FirebaseUser";
import { UserCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";

export default class UserStore {
  @observable user: User | null = null;
  @observable token: string = "";
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this);
    this.rootStore = rootStore;
    this.getStoredUser();
  }

  @action
  async setToken(token: string) {
    this.token = token;

    try {
      await AsyncStorage.setItem("token", token);
    } catch (e) {
      console.warn("Failed to save token:", e);
    }
  }

  @action
  async setUser(uid: string) {
    if (uid) {
      try {
        
        const userDocRef = doc(FIREBASE_DB, "Users", uid); // Reference to the user document
        const userDoc = await getDoc(userDocRef); // Fetch the document

        if (userDoc.exists()) {
          const userData = userDoc.data() as User; // Cast Firestore document data to User type
          this.user = userData;

          // Optionally, save the user data to AsyncStorage
          await AsyncStorage.setItem("user", JSON.stringify(userData));
        } else {
          console.warn("No user document found for UID:", uid);
        }
      } catch (e) {
        console.warn("Failed to fetch user:", e);
      }
    }
  }

  @action
  async loginUser(data: { user: UserCredential["user"]; token: string }) {
    const user: User = {
      ...data.user,
      role: "",
    }; 
    await this.setUser(user.uid);   
    await this.setToken(data.token);
  }

  @computed
  get getToken() {
    return this.token;
  }

  private async getStoredUser() {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        this.user = JSON.parse(userData) as User;
      }
    } catch (e) {
      console.warn("Failed to load user:", e);
    }
  }

  async removeStoredUser() 
  {
      try 
      {
          await AsyncStorage.removeItem('user')
          await AsyncStorage.removeItem('token')
      } 
      catch (e) 
      {
          console.warn(e)
      }
  }

  @action
  async disconnect() {
    try {
      await this.removeStoredUser();
      
      this.user = null;
      this.token = '';
  
      await FIREBASE_AUTH.signOut();
    } catch (e) {
      console.warn('Error during disconnect:', e);
    }
  }
  
}

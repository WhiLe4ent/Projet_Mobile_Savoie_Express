import { createContext, useContext } from 'react'
import UserStore from './UserStore'

export class RootStore {
  
  public userStore: UserStore

  constructor() {
    this.userStore = new UserStore(this)
  }

  getStores(){
    return {
      userStore: this.userStore,
    }
  }
}

export const rootStore = new RootStore()
export const StoreContext = createContext(rootStore)
export const useStores = () => useContext(StoreContext)
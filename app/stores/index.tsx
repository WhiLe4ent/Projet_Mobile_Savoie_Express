import { createContext, useContext } from 'react'
import UserStore from './UserStore'
import ApiStore from './ApiStore'

export class RootStore {
  
  public userStore: UserStore
  public apiStore: ApiStore

  constructor() {
    this.userStore = new UserStore(this)
    this.apiStore = new ApiStore(this)
  }

  getStores(){
    return {
      userStore: this.userStore,
      apiStore: this.apiStore
    }
  }
}

export const rootStore = new RootStore()
export const StoreContext = createContext(rootStore)
export const useStores = () => useContext(StoreContext)
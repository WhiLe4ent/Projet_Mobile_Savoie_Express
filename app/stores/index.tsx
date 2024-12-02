import { createContext, useContext } from 'react'
import UserStore from './UserStore'
import ApiStore from './ApiStore'
import EmailStore from './EmailStore'

export class RootStore {
  
  public userStore: UserStore
  public apiStore: ApiStore
  public emailStore: EmailStore

  constructor() {
    this.userStore = new UserStore(this)
    this.apiStore = new ApiStore(this)
    this.emailStore = new EmailStore(this)
  }

  getStores(){
    return {
      userStore: this.userStore,
      apiStore: this.apiStore,
      emailStore: this.emailStore
    }
  }
}

export const rootStore = new RootStore()
export const StoreContext = createContext(rootStore)
export const useStores = () => useContext(StoreContext)
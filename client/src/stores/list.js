import {defineStore} from 'pinia'
import { getAuth } from 'firebase/auth';


const STORAGE_KEY = 'to-do-list'

export const useStructure = defineStore("structure", {
  state: () => ({
    count: 0,
    items: [],
    uid: getAuth().currentUser?.uid,
    info: null,    
  }),
  actions: {
    setItems(newItems) {
      this.items = newItems;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    },
    getUid() {
      const user = getAuth().currentUser;
      return user ? user.uid : null;
    },
    testM() {
      console.log('test method work');
    }
  },
});

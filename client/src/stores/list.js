import {defineStore} from 'pinia'
import { getAuth } from 'firebase/auth';


const STORAGE_KEY = 'to-do-list'

export const useStructure = defineStore("structure", {
  state: () => ({
    count: 0,
    items: [],
    uid: getAuth().currentUser?.uid,
    info: null,
    // itmsFetch: fetchDataFromFirebase() || []
    
  }),
  // getters: {
  //   UId() {
  //     let uid = getAuth().currentUser.uid;
  //     return uid;
  //   }
  // },
  actions: {
    setItems(newItems) {
      this.items = newItems;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    },
    // sI(Itm) {
    //   this.itmsFetch=Itm;
    // },
    getUid() {
      const user = getAuth().currentUser;
      return user ? user.uid : null;
    },
    async onAuthStateChanged(user) {
      if (user) {
        this.uid = (user.uid);
      } else {
        this.uid = (null);
      }
    },
    testM() {
      console.log('test method work');
    }
  },
});

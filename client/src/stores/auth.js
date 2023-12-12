import { defineStore } from "pinia";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, get, child } from "firebase/database";
import { useStructure } from "./list";
import axios from "axios";

export const useAuth = defineStore('auth', {
  actions: {
    async login({email, password}) {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user; console.log(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage)
          });    
      } catch (e) {
        throw e
      }

    },

    async logout() {
      const auth = getAuth();
      await signOut(auth).then(() => { console.log("Sign-out successful")
        }).catch((error) => {
          console.error("error sign-out", error)
        });
    },

    async fetchDataFromFirebase(userId) {
      const dbRef = ref(getDatabase());
      try {
        const response = await get(child(dbRef, `users/${userId}/Tasks`));
        const data = response.val();
        // console.log( 'itmsFetch before ', useStructure().itmsFetch )
        if (data) {
          useStructure().setItems(data);
        } else {
          useStructure().setItems(JSON.parse(localStorage.getItem('to-do-list') || '[]'));
        }
        // console.log( 'itmsFetch after ', useStructure().itmsFetch )
      } catch (error) {
        useStructure().setItems(JSON.parse(localStorage.getItem('to-do-list') || '[]'));
        console.error(error);
      }
    },

    async fetchDataFromMongo(documentId) {
      try {
        const response = await axios.get(`http://localhost:3000/todos/${documentId}`);
        console.log(`Responsed data ${getCustomDate()}:`, response.data);
        if (response.data) {
          useStructure().setItems(response.data);
        } else {
          useStructure().setItems(JSON.parse(localStorage.getItem('to-do-list') || '[]'));
        }
      } catch (error) {
        useStructure().setItems(JSON.parse(localStorage.getItem('to-do-list') || '[]'));
        console.error('Error fetching data:', error);
      }
    }
  },
});



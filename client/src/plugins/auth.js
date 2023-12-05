import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, get, child } from "firebase/database";
import { useStructure } from "/src/stores/list";
import axios from "axios";

// let store 
// try {
//   if (useStructure()) {
//     store = useStructure().count;
//   }
// } catch (error) {
//   console.error("Err in auth, store", error)
// }

export async function login({email, password}) {
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

}

export async function logout() {
  const auth = getAuth();
  await signOut(auth).then(() => { console.log("Sign-out successful")
    }).catch((error) => {
      console.error("error sign-out", error)
    });
}


export async function fetchDataFromFirebase(userId) {
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
}

export async function fetchDataFromMongo(documentId) {
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

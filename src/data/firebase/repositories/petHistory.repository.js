import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "../../../firebase-config"

const petHistoryCollection = collection(db, "petHistory")

export const updatePetHistoryByID = (id, data) => {
    console.log(data)
    return setDoc(doc(db, "petHistory", id), data)
}
import { updatePetHistoryByID } from "../repositories/petHistory.repository";


export const updatePetHistoryService = async (id, data) => {
    await updatePetHistoryByID(id, data)
    alert('Pet history updated.')
}
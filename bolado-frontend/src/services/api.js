//const BASE_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "http://localhost:8081";

export const API_ENDPOINTS = {
    LOGIN: `${BASE_URL}/User/Login`,
    REGISTER: `${BASE_URL}/User/Register`,
    GET_MATCHES: `${BASE_URL}/Maches/GetAllMaches`,
    UPDATE_RESULT: `${BASE_URL}/Admin/ResultUpdate`,
    CREATE_PREDICTION: `${BASE_URL}/Maches/CreatePrediction`,
    CREATE_A_PREDICTION: `${BASE_URL}/Maches/CreateAPrediction`,
    UPDATE_PREDICTION: `${BASE_URL}/Maches/UpdatePreditions`,
    FINISH_PREDICTIONS: `${BASE_URL}/Maches/FinishPredictions`,
    GET_MATCHES_BY_USER: `${BASE_URL}/Maches/GetMachesByUserId`,
    GET_GROUPS: `${BASE_URL}/Maches/GetMachesGups`,
    GET_RANKING: `${BASE_URL}/Maches/GetAllRankUser`,
    UPDATE_PAYMENT: `${BASE_URL}/Admin/PaymentUpdate`,
};
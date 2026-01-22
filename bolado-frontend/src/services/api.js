const BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
    LOGIN: `${BASE_URL}/User/Login`,
    REGISTER: `${BASE_URL}/User/Register`,
    GET_MATCHES: `${BASE_URL}/Maches/GetAllMaches`,
    UPDATE_RESULT: `${BASE_URL}/Admin/ResultUpdate`,
    CREATE_PREDICTION: `${BASE_URL}/Maches/CreatePrediction`,
    GET_MATCHES_BY_USER: `${BASE_URL}/Maches/GetMachesByUserId`,
    GET_GROUPS: `${BASE_URL}/Maches/GetMachesGups`,
    GET_RANKING: `${BASE_URL}/Maches/GetAllRankUser`,
};
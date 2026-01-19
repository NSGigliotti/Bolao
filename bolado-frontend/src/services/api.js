const BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
    LOGIN: `${BASE_URL}/User/Login`,
    REGISTER: `${BASE_URL}/User/Register`,
    GET_MATCHES: `${BASE_URL}/Maches/GetAllMaches`,
    UPDATE_RESULT: `${BASE_URL}/Admin/ResultUpdate`,
    CREATE_PREDICTION: `${BASE_URL}/Maches/CreatePrediction`,
};
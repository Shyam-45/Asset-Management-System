import api from './axios';

export const login = async(credentials) => {
    const response = await api.post(
        "/auth/login",
        credentials
    );

    // console.log(response);
    return response.data;
};
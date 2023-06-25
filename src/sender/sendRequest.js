import axios from "axios";

export const sendRequest = async (url, method, data) => {
    return axios({ method, url, data })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error.response.data);
        });
};

const axios = require("axios");

const sendRequest = async (url, method, data) => {
    return axios({ method, url, data })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error.response.data.error);
        });
};

module.exports.sendRequest = sendRequest;

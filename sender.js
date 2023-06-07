//import axios from "axios";
const axios = require("axios");

const sendRequest = async (url, method, data) => {
    return axios({ method, url, data })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
};

module.exports.sendRequest = sendRequest;

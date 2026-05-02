import axios from "axios";
import { configs } from "../config/configs";
import { store } from "@/store/store";

export const request = async (url = "", method = "get", data = {}) => {
    const token = store.getState().token;

    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json", // FIX 1: Capital 'C' and 'T'
    };

    // FIX 2: Let Axios handle FormData automatically
    if (data instanceof FormData) {
        // If we hardcode "multipart/form-data", Axios won't add the required "boundary" tag, 
        // and Laravel won't be able to read the files or data properly!
        delete headers["Content-Type"]; 
    }

    try {
        const res = await axios({
            url: configs.base_url + url,
            method: method,
            data: data,
            headers: {
                ...headers,
                Authorization: "Bearer " + token,
            },
        });
        
        console.log("Response Data :", res);
        return res.data;

    } catch (error) {
        console.log("Response error :", error);
        
        // FIX 3: Actually throw the error so your React components know it failed!
        const responseError = error?.response;
        
        if (responseError) {
            if (responseError.status === 500) {
                console.log("External Server Error.");
            }
            if (responseError.status === 422) {
                console.log("Validation Errors: ", responseError.data.errors);
            }
            
            // We MUST reject the promise here. 
            // If we just 'return', the CheckoutCard thinks the request was successful!
            throw responseError.data; 
        }
        
        throw error;
    }
};
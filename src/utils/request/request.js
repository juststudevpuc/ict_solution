import axios from "axios";
import { configs } from "../config/configs";
// You can remove the Redux store import if you only used it for the token!

export const request = async (url = "", method = "get", data = {}) => {
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json", 
    };

    if (data instanceof FormData) {
        delete headers["Content-Type"]; 
    }

    try {
        const res = await axios({
            // Let Vercel proxy handle the base URL if needed, 
            // or keep your configs.base_url if it points to '/api'
            url: configs.base_url + url,
            method: method,
            data: data,
            
            // FIX 1: Add this magic command for HttpOnly cookies
            withCredentials: true, 
            
            // FIX 2: We removed Authorization: "Bearer " + token. 
            // The browser handles the secure cookie automatically now!
            headers: headers, 
        });
        
        console.log("Response Data :", res);
        return res.data;

    } catch (error) {
        console.log("Response error :", error);
        
        const responseError = error?.response;
        
        if (responseError) {
            if (responseError.status === 500) {
                console.log("External Server Error.");
            }
            if (responseError.status === 422) {
                console.log("Validation Errors: ", responseError.data.errors);
            }
            
            throw responseError.data; 
        }
        
        throw error;
    }
};
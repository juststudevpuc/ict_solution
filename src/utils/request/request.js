import axios from "axios";
import { configs } from "../config/configs";

// 1. THIS IS THE MAGIC HELPER: It digs into the browser to find the CSRF ticket
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return (match ? decodeURIComponent(match[3]) : null);
}

export const request = async (url = "", method = "get", data = {}) => {
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json", 
    };

    // 2. TAPE THE TICKET TO THE REQUEST: Grab the token Laravel just gave us
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) {
        headers["X-XSRF-TOKEN"] = xsrfToken;
    }

    if (data instanceof FormData) {
        delete headers["Content-Type"]; 
    }

    try {
        const res = await axios({
            url: configs.base_url + url,
            method: method,
            data: data,
            
            // 3. THESE TWO LINES PREVENT THE 419 ERROR
            withCredentials: true, 
            withXSRFToken: true, 
            
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
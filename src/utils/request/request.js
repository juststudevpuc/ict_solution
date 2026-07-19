// import axios from "axios";
// import { configs } from "../config/configs";

// // 1. THIS IS THE MAGIC HELPER: It digs into the browser to find the CSRF ticket
// function getCookie(name) {
//     const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
//     return (match ? decodeURIComponent(match[3]) : null);
// }

// export const request = async (url = "", method = "get", data = {}) => {
//     let headers = {
//         "Accept": "application/json",
//         "Content-Type": "application/json",
//     };

//     // 2. TAPE THE TICKET TO THE REQUEST: Grab the token Laravel just gave us
//     const xsrfToken = getCookie("XSRF-TOKEN");
//     if (xsrfToken) {
//         headers["X-XSRF-TOKEN"] = xsrfToken;
//     }

//     if (data instanceof FormData) {
//         delete headers["Content-Type"];
//     }

//     try {
//         // 🔥 NEW: This instantly fixes any accidental double slashes!
//         const sanitizedUrl = (configs.base_url + url).replace(/\/+/g, '/');

//         const res = await axios({
//             url: sanitizedUrl, // 👈 Use the clean URL here
//             method: method,
//             data: data,

//             // 3. THESE TWO LINES PREVENT THE 419 ERROR
//             withCredentials: true,
//             withXSRFToken: true,

//             headers: headers,
//         });

//         console.log("Response Data :", res);
//         return res.data;

//     } catch (error) {
//         console.log("Response error :", error);

//         const responseError = error?.response;

//         if (responseError) {
//             if (responseError.status === 500) {
//                 console.log("External Server Error.");
//             }
//             if (responseError.status === 422) {
//                 console.log("Validation Errors: ", responseError.data.errors);
//             }

//             throw responseError.data;
//         }

//         throw error;
//     }
// };

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

    // 2. SPA AUTH: Grab the cookie token Laravel just gave us
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) {
        headers["X-XSRF-TOKEN"] = xsrfToken;
    }

    // 🔥 NEW: TOKEN AUTH FALLBACK
    // If you log in and save a token to localStorage, this ensures it actually gets sent!
    const token = localStorage.getItem("token"); // (Change "token" if you named it something else)
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (data instanceof FormData) {
        delete headers["Content-Type"];
    }

    try {
        // 🔥 FIX 1: Safely combine URLs WITHOUT destroying "http://"
        const baseUrl = configs.base_url.replace(/\/+$/, ''); // Removes trailing slash
        const endpoint = url.replace(/^\/+/, ''); // Removes leading slash
        const sanitizedUrl = `${baseUrl}/${endpoint}`;

        // 🔥 FIX 2: Separate GET queries from POST data
        const axiosConfig = {
            url: sanitizedUrl,
            method: method,
            withCredentials: true,
            withXSRFToken: true,
            headers: headers,
        };

        if (method.toLowerCase() === "get") {
            axiosConfig.params = data; // GET requests need 'params'
        } else {
            axiosConfig.data = data; // POST/PUT need 'data'
        }

        const res = await axios(axiosConfig);

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
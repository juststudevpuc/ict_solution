import axios from "axios";
import { configs } from "../config/configs";

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return (match ? decodeURIComponent(match[3]) : null);
}

export const request = async (url = "", method = "get", data = {}) => {
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    };

    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) {
        headers["X-XSRF-TOKEN"] = xsrfToken;
    }

    const token = localStorage.getItem("token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (data instanceof FormData) {
        delete headers["Content-Type"];
    }

    try {
        
        const baseUrl = configs.base_url.replace(/\/+$/, '');
        const endpoint = url.replace(/^\/+/, '');
        const sanitizedUrl = `${baseUrl}/${endpoint}`;

        const axiosConfig = {
            url: sanitizedUrl,
            method: method,
            withCredentials: true,
            withXSRFToken: true,
            headers: headers,
        };

        if (method.toLowerCase() === "get") {
            axiosConfig.params = data;
        } else {
            axiosConfig.data = data;
        }

        const res = await axios(axiosConfig);
        return res.data;

    } catch (error) {
        console.log("Response error :", error);
        const responseError = error?.response;

        if (responseError) {
            // 🔥 NEW: Check if the token or session is expired (401 Unauthorized)
            if (responseError.status === 401) {
                console.log("Token expired or unauthorized. Logging out...");
                
                // Clear the local state so the app doesn't think they're still logged in
                localStorage.removeItem("token");
                
                // Securely force-kick the user back to the login page
                window.location.href = "/auth/login";
                return;
            }
            
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
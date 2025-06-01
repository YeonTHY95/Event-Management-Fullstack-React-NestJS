import axios, { isAxiosError } from 'axios';

//const baseURL = '/mongobe';
const axiosWithLocalStorage =  axios.create({
    // baseURL : "http://localhost:8000/api/"
});

export const requestInterceptor = axiosWithLocalStorage.interceptors.request.use( request => {
    console.log("Inside Request Interception True");
    const token = localStorage.getItem("accessToken");
    if (token) {
        request.headers["Authorization"] = `Bearer ${token}`;
    } else {
        console.log("No access token found in localStorage");
    }
    return request ;
}, error => {
    console.log("Inside Request Interception Error");
    return Promise.reject(error);
})


export const responseInterceptor = axiosWithLocalStorage.interceptors.response.use( response => {
    console.log("Inside Response Interception True");
    return response ;
}, async error => {
    console.log("Inside Response Interception Error");
    console.log("Error is ", JSON.stringify(error));
    const prevRequest = error.config ;
    console.log("Error Config is ", JSON.stringify(error.config));
    const previousURL = error.config.url;
    console.log(`PreviousURL is ${previousURL}`);
    // console.log(`Axios Interceptor Response error.response status is ${error.response.status}`);
    // console.log(`PreviousRequest retry is ${prevRequest.retry}`);
    // if ( error.response.status === 403 && !prevRequest.retry ){
    if ( !prevRequest.retry ){
        // Request again to get accessToken
        prevRequest.retry = true ;
        console.log(`Inside Response Interception Second Request`);

        try {
            const secondResponse = await axios.post("http://localhost:8000/user/refresh/",
                {accessToken: localStorage.getItem("accessToken"),
                refreshToken: localStorage.getItem("refreshToken")},
                
            );
    
            console.log(`After second Response : ${JSON.stringify(secondResponse)}`);
    
            if (secondResponse.status === 201){
                console.log(`Access Token Renewed successfully from BackEnd`);
                // console.log('Previous Request method is ', error.config.method);
                // console.log('Previous Request data is ', error.config.data);
                // console.log('Previous Request headers is ', error.config.headers);

                // Update localStorage with new accessToken
                console.log(`New Access Token is ${secondResponse.data.accessToken}`);
                localStorage.setItem("accessToken", secondResponse.data.accessToken);
                
                const previousHTTPMethod = error.config.method;
                const previousHTTPData = error.config.data;
                const previousHTTPContentType = error.config.headers["Content-Type"];
                //console.log('previousHTTPContentType is ', previousHTTPContentType);

                const sendAgainPreviousRequest = await axios(
                    {
                        url : previousURL,
                        // withCredentials: true,
                        method: previousHTTPMethod,
                        data : previousHTTPData,
                        headers: {
                            "Content-Type": previousHTTPContentType,
                            "Authorization": `Bearer ${secondResponse.data.accessToken}`,
                        }
                    }
                );
    
                return sendAgainPreviousRequest;
    
            }
        }

        catch(error) {
            console.log("In the catch block of Axios Retry, Error : ", error);

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    //console.log("Error Response Status is 400, mean it may return the error message from Express Validator.")
                    return Promise.reject(error);
                }
                else if (error.response?.status === 401) {
                    //console.log("Error Response Status is 401, mean it may return the error message from Express Validator.")
                    return Promise.reject(error);
                }
            }

            
        }
        
        return Promise.reject(error);
        

        

    }
    

    return Promise.reject(error);
});


export default axiosWithLocalStorage;
import axios, { isAxiosError } from 'axios';

//const baseURL = '/mongobe';
const axiosWithCredentials =  axios.create({
    withCredentials: true
    // baseURL : "http://localhost:8000/api/"
});

export const requestInterceptor = axiosWithCredentials.interceptors.request.use( request => {
    console.log("Inside Request Interception True");
    request.withCredentials = true;
    //console.log(`Request is ${JSON.stringify(request)}`);
    // console.log(`Request's URL is ${request.url}`);
    //request.withXSRFToken = true;
    return request ;
}, error => {
    console.log("Inside Request Interception Error");
    return Promise.reject(error);
})


export const responseInterceptor = axiosWithCredentials.interceptors.response.use( response => {
    console.log("Inside Response Interception True");
    return response ;
}, async error => {
    console.log("Inside Response Interception Error");
    console.log("Error Config is ", JSON.stringify(error));
    const prevRequest = error.config ;
    console.log("Error Config is ", JSON.stringify(error.config));
    const previousURL = error.config.url;
    console.log(`PreviousURL is ${previousURL}`);
    // console.log(`Axios Interceptor Response error.response status is ${error.response.status}`);
    // console.log(`PreviousRequest retry is ${prevRequest.retry}`);
    if ( error.response.status === 403 && !prevRequest.retry ){
        // Request again to get accessToken
        prevRequest.retry = true ;
        console.log(`Inside Response Interception Second Request`);

        try {
            const secondResponse = await axios.post("http://localhost:8000/user/refresh/",
                {},
                {
                    withCredentials: true
                }
            );
    
            console.log(`After second Response : ${JSON.stringify(secondResponse)}`);
    
            if (secondResponse.status === 200){
                console.log(`Access Token Renewed successfully from BackEnd`);
                // console.log('Previous Request method is ', error.config.method);
                // console.log('Previous Request data is ', error.config.data);
                // console.log('Previous Request headers is ', error.config.headers);
                
                const previousHTTPMethod = error.config.method;
                const previousHTTPData = error.config.data;
                const previousHTTPContentType = error.config.headers["Content-Type"];
                //console.log('previousHTTPContentType is ', previousHTTPContentType);

                const sendAgainPreviousRequest = await axios(
                    {
                        url : previousURL,
                        withCredentials: true,
                        method: previousHTTPMethod,
                        data : previousHTTPData,
                        headers: {
                            "Content-Type": previousHTTPContentType
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
            }

            
        }
        
        return Promise.reject(error);
        

        

    }
    

    return Promise.reject(error);
});


export default axiosWithCredentials;
import axios from 'axios';
import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

export function upload(params) {
    return requestFile(API_BASE_URL+ "/upload", params);
} 


const requestFile = (options) => {
    const headers = new Headers({
        'Content-Type': 'multipart/form-data',
    })
    
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return axios.post(options.url, options)
};

// export default new ApiService();
import axios from 'axios';
import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

class Service {

  constructor() {
    console.log("Service is constructed");
  }

  getRestClient() {

    let headers = {
        'Content-Type': 'application/json',
    };
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers =  {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
        };
      
    }

    if (!this.serviceInstance) {
      this.serviceInstance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: headers
        // {
        //     'Content-Type': 'application/json',
        //     'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
        // }
            // headers,
      });
    }
    return this.serviceInstance;
  }
}

export default (new Service());
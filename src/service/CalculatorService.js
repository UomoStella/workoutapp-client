import service from './Service';

const api_url = "/calc";
export class CalculatorService {    

    getCalculete(data){
        return service.getRestClient().post(api_url+"/details", data);
    }
    

}
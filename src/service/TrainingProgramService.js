import service from './Service';

const api_url = "/trainingprogram";
export class TrainingProgramService {

    
    getTrainingProgramEditById(id){
        return service.getRestClient().get(api_url+"/edit", { params: { id : id}});
    }

    postTrainingProgramEditById(data){
        return service.getRestClient().post(api_url+"/edit", data);
    }

    getTrainingProgramEditDetailsById(id){
        return service.getRestClient().get(api_url+"/edit/details", { params: { id : id}});
    }

    getTrainingprogramEditDetailsPrivate(id){
        return service.getRestClient().get(api_url+"/edit/details/privatelist", { params: { id : id}});
    }


    postEditDetailsPrivate(data){
        return service.getRestClient().post(api_url+"/edit/details/private", data);
    }
    
    postEditdetailsPrivateDelete(data){
        return service.getRestClient().post(api_url+"/edit/details/private/delete", data);
    }

}
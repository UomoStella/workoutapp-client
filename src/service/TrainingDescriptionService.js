import service from './Service';

const api_url = "/trainingdescription";
export class TrainingDescriptionService {
        
    getTrainingDescriptionList(id, dailyid){
        return service.getRestClient().get(api_url+"/edit", { params: { id : id, dailyid : dailyid}});
    }

    postTrainingDescriptionList(data){
        return service.getRestClient().post(api_url+"/edit", data);
    }
    

    getExercisesAllList(){
        return service.getRestClient().get(api_url+"/exercises/all/list");
    }


    getExercisesAllBydailyid(dailyid){
        return service.getRestClient().get(api_url+"/exercises/all/dailyid", { params: { dailyid : dailyid}});
    }

    postTrainingDescriptionDelete(data){
        return service.getRestClient().post(api_url+"/delete", data);
    }
    

    getTrainingDescriptionView(dailyid){
        return service.getRestClientNoToken().get(api_url+"/view", { params: { dailyid : dailyid}});
    }
    

}
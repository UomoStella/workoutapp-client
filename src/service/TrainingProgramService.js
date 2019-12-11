import service from './Service';

const api_url = "/trainingprogram";
export class TrainingProgramService {

    getTrainingProgramAll(pageNum){
        return service.getRestClient().get(api_url+"/all", { params: { paginationpage : pageNum}});
    }
    
    getTrainingProgramVIEW(pageNum){
        return service.getRestClient().get(api_url+"/view", { params: { paginationpage : pageNum, 
            size: 18}});
    }

    postTrainingProgramDelete(data){
        return service.getRestClient().post(api_url+"/delete", data);
    }
    


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


        
    getExercisesAllList(){
        return service.getRestClient().get("/training/exercises/all/list");
    }

    postAddTPtoUser(data){
        return service.getRestClient().post(api_url+"/addtptouser", data);
    }

    

}
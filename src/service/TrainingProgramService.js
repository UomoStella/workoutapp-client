import service from './Service';

const api_url = "/trainingprogram";
export class TrainingProgramService {

    getTrainingProgramAll(pageNum){
        return service.getRestClient().get(api_url+"/all", { params: { paginationpage : pageNum}});
    }
    
    getTrainingProgramVIEW(typeTrainingId, subtypeTrainingId, mgId, page){
        return service.getRestClient().get(api_url+"/view", { params: { 
            typeTrainingId : typeTrainingId,
            subtypeTrainingId : subtypeTrainingId,
            mgId : mgId,
            page : page,
            size : 18
        }});       
    }

    getTPfirstPage(){
        return service.getRestClient().get(api_url+"/viewfirstpage");       
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

    getTPComments(tpid){
        return service.getRestClient().get(api_url+"/comments", { params: { tpid : tpid}});
    }

    postTPComments(data){
        return service.getRestClient().post(api_url+"/comments", data);
    }    

    postTPCommentsDelete(data){
        return service.getRestClient().post(api_url+"/commentsdelete", data);
    }    
    
}
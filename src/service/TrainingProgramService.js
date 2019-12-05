import service from './Service';

export class TrainingProgramService {

    getTrainingProgramEditById(id){
        return service.getRestClient().get("/trainingprogram/edit", { params: { id : id}});
    }

    postTrainingProgramEditById(data){
        return service.getRestClient().post("/trainingprogram/edit", data);
    }

    getTrainingProgramEditDetailsById(id){
        return service.getRestClient().get("/trainingprogram/edit/details", { params: { id : id}});
    }

    postEditDetailsPrivate(data){
        return service.getRestClient().post("/edit/details/private", data);
    }
    
    getEditdetailsPrivateDelete(data){
        return service.getRestClient().post("/edit/details/private/delete", data);
    }

}
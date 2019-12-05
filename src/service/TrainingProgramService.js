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

    getTrainingprogramEditDetailsPrivate(id){
        return service.getRestClient().get("/trainingprogram/edit/details/privatelist", { params: { id : id}});
    }


    postEditDetailsPrivate(data){
        return service.getRestClient().post("/trainingprogram/edit/details/private", data);
    }
    
    postEditdetailsPrivateDelete(data){
        return service.getRestClient().post("/trainingprogram/edit/details/private/delete", data);
    }

}
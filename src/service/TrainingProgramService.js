import service from './Service';

export class TrainingProgramService {

    getTrainingProgramEditById(id){
        return service.getRestClient().get("/trainingprogram/edit", { params: { id : id}});
    }

    postTrainingProgramEditById(data){
        return service.getRestClient().post("/trainingprogram/edit", data);
    }

}
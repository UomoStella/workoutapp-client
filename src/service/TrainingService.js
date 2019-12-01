import service from './Service';

export class TrainingService {
    createExercisesCreate(id){
        if(id != null && id != undefined)
            return service.getRestClient().get("/training/exercises/edit", { params: { id: id}} );
        else
            return service.getRestClient().get("/training/exercises/edit" );
    }

    getSubtypeTraining(id){
        return service.getRestClient().get("/training/subtypetraining/all", { params: { typeid: id}});
    }
    getSubtypeTraining(){
        return service.getRestClient().get("/training/subtypetraining/all");
    }

    
}
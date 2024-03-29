import service from './Service';

export class TrainingService {
    getCreateExercisesCreate(id){
        if(id != null && id != undefined)
            return service.getRestClient().get("/training/exercises/edit", { params: { id: id}} );
        else
            return service.getRestClient().get("/training/exercises/edit" );
    }

    postCreateExercisesCreate(data){
        return service.getRestClient().post("/training/exercises/edit", JSON.stringify(data) );
    }

    getSubtypeTrainingById(id){
        return service.getRestClient().get("/training/subtypetraining/all", { params: { typeid : id}});
    }

    getMuscleGroupsALL(){
        return service.getRestClient().get("/training/musclegroups/all");
    }
    
    getTypeTrainingALL(){
        return service.getRestClient().get("/training/typetraining/all");
    }
    

    getSubtypeTraining(){
        return service.getRestClient().get("/training/subtypetraining/all");
    }

    getExercisesMediaById(id){
        return service.getRestClient().get("/training/exercises/media", { params: { id : id}});
    }

    getExercisesListByPage(paginationpage){
        return service.getRestClient().get("/training/exercises/list", { params: { paginationpage : paginationpage,
        size: 8}});
    }

    postExercisesDelete(data){
        return service.getRestClient().post("/training/exercises/delete", data);
    }
    

}
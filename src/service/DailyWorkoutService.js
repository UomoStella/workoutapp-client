import service from './Service';

const api_url = "/dailyworkout";
export class DailyWorkoutService {    

    getDailyWorkoutByIdAndTrainingProgramIdAndDay(id, trainingProgramId, day){
        return service.getRestClient().get(api_url+"/edit", { params: 
            { 
                id : id,
                trainingProgramId : trainingProgramId,
                day : day
            }
        });
    }    

    postDailyWorkout(data){
        return service.getRestClient().post(api_url+"/edit", data);
    }


    getDailyWorkoutDetailsByTrainingProgramIdAndDay(trainingProgramId, day){
        return service.getRestClient().get(api_url+"/details/edit", { 
            params: { 
                trainingProgramId : trainingProgramId,
                day : day
            }
        });
    }


    getDailyWorkoutVIEW(tpID, pageNum){
        return service.getRestClient().get(api_url+"/viewall", { params: { paginationpage : pageNum,
            tpid: tpID,
            size: 24}});
    }
    
    getHasTrainingProgram(tpID){
        return service.getRestClient().get(api_url+"/has/tp", { params: {tpid: tpID}});
    }
    
    postDeleteDailyWorkout(data){
        return service.getRestClient().post(api_url+"/delete", data);
    }
    

}
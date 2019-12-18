import service from './Service';

export class FileService {
    uploadFileToServer(data){
        return service.getRestClient().post('/files', data);
    }


    uploadExercisesImage(data){
        return service.getRestClient().post('/training/exercises/media/image', data);
    }
    deleteExercisesImage(data){    
        return service.getRestClient().post('/training/exercises/media/delete/image', data);
    }

    uploadExercisesFileVideo(data){
        return service.getRestClient().post('/training/exercises/media/filevideo', data);
    }

    deleteExercisesFileVideo(data){    
        return service.getRestClient().post('/training/exercises/media/delete/filevideo', data);
    }

    updateVideoLink(data){    
        return service.getRestClient().post('/training/exercises/media/linkvideo', data);
    }


    uploadUserDetailsToServer(data){
    
        return service.getRestClient().post('/user/details', JSON.stringify(data));
    }



    uploadTrainingProgramImage(data){
        return service.getRestClient().post('/trainingprogram/edit/image', data);
    }
    deleteTrainingProgramImage(data){    
        return service.getRestClient().post('/trainingprogram/delete/image', data);
    }


//////////////RECIPE

    updateRecipeVideoLink(data){    
        return service.getRestClient().post('/recipe/media/linkvideo', data);
    }
    deleteRecipeFileVideo(data){    
        return service.getRestClient().post('/recipe/media/delete/filevideo', data);
    }
    uploadRecipeFileVideo(data){
        return service.getRestClient().post('/recipe/media/filevideo', data);
    }

    deleteRecipeImage(data){    
        return service.getRestClient().post('/recipe/media/delete/image', data);
    }
    uploadRecipeImage(data){
        return service.getRestClient().post('/recipe/media/image', data);
    }

}
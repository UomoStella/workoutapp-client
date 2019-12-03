import service from './Service';

export class FileService {
    uploadFileToServer(data){
        return service.getRestClient().post('/files', data);
    }


    uploadExercisesImage(data){
        return service.getRestClient().post('/training/exercises/media/image', data);
    }

    uploadExercisesFileVideo(data){
        return service.getRestClient().post('/training/exercises/media/filevideo', data);
    }

    deleteExercisesImage(data){    
        return service.getRestClient().post('/training/exercises/media/delete/image', data);
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
}
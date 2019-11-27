import service from './Service';

export class FileService {
    uploadFileToServer(data){
        return service.getRestClient().post('/files', data);
    }

    uploadUserDetailsToServer(data){
    
        return service.getRestClient().post('/user/details', JSON.stringify(data));
    }
}
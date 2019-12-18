import service from './Service';

export class UserService {
    postChangePassword(data){
        return service.getRestClient().post("/auth/user/changepassword", data);
    }
}
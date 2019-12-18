import service from './Service';

const api_url = "/performance";
export class PerformanceService {
    getAllTPP(pageNum, isOpen){ 
        return service.getRestClient().get(api_url+"/tp", { params: { paginationpage : pageNum,
            isopen: isOpen}});
    }
    getAllByUserNameTPP(pageNum, username){
        return service.getRestClient().get(api_url+"/tp/username", { params: { paginationpage : pageNum,
            username: username}});
    }
    

    getAllDWUbyID(dwuID){
        return service.getRestClient().get(api_url+"/dwu", { params: { dwuid : dwuID}});
    }

    postDWUdone(data){
        return service.getRestClient().post(api_url+"/dwudone", data);
    }

    postDWUdoneAndSave(data){
        return service.getRestClient().post(api_url+"/dwudoneandsave", data);
    }

}
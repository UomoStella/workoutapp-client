import service from './Service';

const api_url = "/performance";
export class PerformanceService {
    getAllTPP(pageNum){
        return service.getRestClient().get(api_url+"/tp", { params: { paginationpage : pageNum}});
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
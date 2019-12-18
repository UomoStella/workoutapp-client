import service from './Service';

const api_url = "/recipe";
export class RecipeService {

    getRecipeDetailsByRID(rid){
        return service.getRestClient().get(api_url+"/details", { params: { rid : rid}});
    }

    postRecipeDetailsByRID(data){
        return service.getRestClient().post(api_url+"/details", data);
    }

    getRecipeMediaPage(pageNum){
        return service.getRestClient().get(api_url+"/mediapage", { params: { paginationpage : pageNum}});
    }
    postRecipeDelete(data){
        return service.getRestClient().post(api_url+"/media/delete", data);
    }
    



    getRationDayDetailsByRID(rid){
        return service.getRestClient().get(api_url+"/ration/details", { params: { rid : rid}});
    }
    postRationDayDetailsByRID(data){
        return service.getRestClient().post(api_url+"/ration/details", data);
    }

    getRationMediaByRID(rid){
        return service.getRestClient().get(api_url+"/ration/media", { params: { rid : rid}});
    }

    getRationShortListByRID(rid){
        return service.getRestClient().get(api_url+"/ration/shortlist", { params: { rid : rid}});
    }
    getRecipeShortList(){
        return service.getRestClient().get(api_url+"/recipe/shortlist");
    }

    getRationElement(id){
        return service.getRestClient().get(api_url+"/ration/element", { params: { id : id}});
    }

    postRationElement(data){
        return service.getRestClient().post(api_url+"/ration/element", data);
    }

    postRationDelete(data){
        return service.getRestClient().post(api_url+"/ration/delete", data);
    }
    
    
    
    getRationDayList(pageNum){
        return service.getRestClient().get(api_url+"/rationday/list", { params: { paginationpage : pageNum}});
    }
    postRationDayDelete(data){
        return service.getRestClient().post(api_url+"/rationday/delete", data);
    }
    
    getRationDayVIEW(rdId, rid){
        return service.getRestClient().get(api_url+"/rationday/view", { params: { rdId : rdId,
            rid : rid}});
    }
    

    getRationDayListByUser(){
        return service.getRestClient().get(api_url+"/rationday/listbyuser");
    }
    


}
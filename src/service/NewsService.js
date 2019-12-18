import service from './Service';

const api_url = "/news";
export class NewsService {    

    getNewsFirstPage(data){
        return service.getRestClient().get(api_url+"/firstpage");
    }


    getNewsById(id){
        return service.getRestClient().get(api_url+"/element", { params: { newsId : id}});
    }
    
    getNewsCommentsById(id){
        return service.getRestClient().get(api_url+"/comments", { params: { newsId : id}});
    }
    
    postNewsCommentDelete(data){
        return service.getRestClient().post(api_url+"/commentsdelete", data);
    }
    

    postNewsCommentSave(data){
        return service.getRestClient().post(api_url+"/comments", data);
    }
}
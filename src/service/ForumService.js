import service from './Service';

const api_url = "/forum";
export class ForumService {    

    getTheamById(id){
        return service.getRestClient().get(api_url+"/theam/one", { params: { id : id}});
    }
    
    postTheamEditSave(data){
        return service.getRestClient().post(api_url+"/theam/edit", data);
    }


    
    getAllThemeForum(page, nametheme){
        return service.getRestClient().get(api_url+"/theam/all", { params: { paginationpage : page, nametheme:nametheme}});
    }
    
    
    postForumTheamDelete(data){
        return service.getRestClient().post(api_url+"/theam/delete", data);
    }

    getAllThemeComments(forumthemeid, page){
        return service.getRestClient().get(api_url+"/comments/all", { params: { paginationpage : page, forumthemeid:forumthemeid}});
    }

    postCommentsEdit(data){
        return service.getRestClient().post(api_url+"/comments/edit", data);
    }

    postCommentsDelete(data){
        return service.getRestClient().post(api_url+"/comments/delete", data);
    }
    
}
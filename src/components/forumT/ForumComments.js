import React, { Component } from 'react';
import { ForumService } from '../../service/ForumService';
import { Button, List, Col, Input, Breadcrumb, Row, Pagination, notification, Modal } from 'antd';
import { ACCESS_TOKEN } from '../../constants';
import {withRouter, Link } from 'react-router-dom';
import { getCurrentUser } from '../../until/APIUtils';
import Comments from '../Comments';

import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import AlertTable from '../../error/AlertTable';
import './ForumThemes.css';

// const {confirm} = Modal;

class ForumComments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            themeId: '',
            listForumComments: [],
            page: 0,
            totalPages: '',
            nametheme: '',
            size: '',
            totalElements: '',
            last: '',

            name: '',
            description: '',
            userName: '',
            dateCreate: '',
            dateUpdate: '',
            user: '',

            currentUser: null,

            isLoadingListComments: false,
            isLoading: false,
            serverError: false,
            notFound: false,
        }

        this.loadForumComments = this.loadForumComments.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.getForumThemeValue = this.getForumThemeValue.bind(this);
        


        this.deleteComments = this.deleteComments.bind(this);
        this.saveComments = this.saveComments.bind(this);  
        this.loadCurrentUser = this.loadCurrentUser.bind(this);  
              
        
        this.forumService = new ForumService();
    }

    deleteComments(id){
        const data = new FormData();
        data.append('id', id);

        this.forumService.postCommentsDelete(data)
        .then(response => {
            notification.success({
                message: 'Сообщение',
                description: 'Комментарий успешно удален!'
            });
            this.loadForumComments(this.state.themeId);
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: 'Извините! Произошла ошибка удаления!'
            });
        });
    }

    saveComments(comments){    
        const dataJSON = {
            forumThemeId :this.state.themeId,
            comments: comments
        };

        this.forumService.postCommentsEdit(JSON.stringify(dataJSON))
        .then(response => {
            notification.success({
                message: 'Сообщение',
                description: 'Комментарий успешно добавлен!'
            });
            this.loadForumComments(this.state.themeId);
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
        });
    }


    loadForumComments(themeId, pageNum) {
        this.setState({
            isLoadingListComments: true,
        });
        
        this.forumService.getAllThemeComments(themeId, pageNum)
        .then(response => {
            this.setState({
                listForumComments: response.data.content,
                page: pageNum,
                size: response.data.size,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                last: response.data.last,

                isLoadingListComments : false
            });
        }).catch(error => {
            this.setState({
                isLoadingListComments: false,
            });
        });  
    }

    loadCurrentUser() {
        this.setState({
          isLoading: true
        });
        getCurrentUser().then(response => {
          this.setState({
            currentUser: response,
            isLoading: false
          });
        }).catch(error => {
          this.setState({
            isLoading: false
          });  
        });
      }


    getForumThemeValue(themeId){
        this.setState({
            isLoading: true,
        });

        this.forumService.getTheamById(themeId)
        .then(response => {
            this.setState({
                themeId : themeId,
                name: response.data.name,
                description: response.data.description,
                userName: response.data.userName,
                dateCreate: response.data.dateCreate,
                dateUpdate: response.data.dateUpdate,
                user: response.data.user,

                isLoading : false
            });
        }).catch(error => {
            notification.error({
                message: 'Polling App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false,
                    serverError: false
                });
            } else {
                this.setState({
                    serverError: true,
                    notFound: false,
                    isLoading: false
                });        
            }
        });    
    }

    paginationChange = (page, pageSize) => {
        const pageNum = page - 1;
        this.loadForumComments(this.state.themeId, pageNum);
    }

    componentDidMount() {
        const themeId = this.props.match.params.themeId; 
        this.getForumThemeValue(themeId);
        this.loadForumComments(themeId, 0);
        this.loadCurrentUser();
    }

    
    render() {
        if(this.state.isLoading) {
            return <div className="content-div"><LoadingIndicator/></div>
        }
        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return (<ServerError />);
        }

        const page = this.state.page + 1;
        const totalPages = 10 * this.state.totalPages;
        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/forum/themes'}>Форум</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={'/forum/theme/'+this.state.themeId}>Обсуждение</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <Row  gutter={[16, 16]}>
                        <Row className="btn-row-div">
                            <Col md={20}>
                                <p className="title-page">{this.state.name}</p>
                                <p className="subtitle">{this.state.description}</p>
                            </Col>
                            <Col md={4} className="textRight">
                                {this.state.currentUser != null && this.state.currentUser.username == this.state.user ?
                                <Link to={"/forum/theme/edit/"+this.state.themeId}><Button type="primary" icon="edit">Изменить тему</Button></Link>
                                : null}
                            </Col>
                        </Row>
                        
                        <Col span={24}>
                            {this.state.isLoadingListComments ?
                            <LoadingIndicator/>
                            :
                            <Comments username={this.state.currentUser != null ? this.state.currentUser.username : null} 
                                commentsList={this.state.listForumComments} 
                                deleteComments={this.deleteComments} 
                                saveComments={this.saveComments} />
                            }
                        </Col>  
                        <Col span={24}>
                            <Pagination onChange={this.paginationChange} defaultCurrent={page} total={totalPages} />
                        </Col>                        
                    </Row>
                </div>
            </div>
        );
    }
}


export default ForumComments;


import React, { Component } from 'react';
import { Row, Col, notification, Pagination, Button, Breadcrumb} from 'antd';
import {withRouter, Link } from 'react-router-dom';
import { NewsService } from '../../service/NewsService';
import Comments from '../Comments';

import LoadingIndicator from '../LoadingIndicator';
import ServerError  from '../../error/ServerError';
import NotFound from '../../error/NotFound';

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            base64image: '',

            commentsList: [],
            isLoadComments: false,

            isLoading: true,
            serverError: false,
            notFound: false,
        };

        this.newsService = new NewsService();

        
        this.getContentVIEW = this.getContentVIEW.bind(this);
        this.loadComments = this.loadComments.bind(this);
        this.saveComments = this.saveComments.bind(this);
        this.deleteComments = this.deleteComments.bind(this);
        
    }

    
    deleteComments(id){
        const data = new FormData();
        data.append('id', id);

        this.newsService.postNewsCommentDelete(data).then(response => {
            notification.success({
                message: 'Сообщение',
                description: 'Комментарий успешно удален!'
            });
            this.loadComments(this.state.id);
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: 'Извините! Произошла ошибка удаления!'
            });
        });
    }



    saveComments(comments){    
        const dataJSON = {
            id :this.state.id,
            comments: comments
        };

        this.newsService.postNewsCommentSave(JSON.stringify(dataJSON))
        .then(response => {
            notification.success({
                message: 'Сообщение',
                description: 'Комментарий успешно добавлен!'
            });
            this.loadComments(this.state.id);
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
        });
    }

    loadComments(newsId){
        this.setState({
            isLoadComments: true,
        });

        this.newsService.getNewsCommentsById(newsId)
        .then(response => {
            this.setState({
                commentsList: response.data.containerList,
                isLoadComments: false,
            });
        }).catch(error => {
            this.setState({
                isLoadComments: false,
            });
        });
    }

    getContentVIEW(newsId){
        this.setState({
            isLoading: true,
        });

        this.newsService.getNewsById(newsId)
        .then(response => {
            this.setState({
                id: newsId,
                name: response.data.name,
                description: response.data.description,
                base64image: response.data.base64image,
                username: response.data.username,

                isLoading: false,
            });
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
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

    componentDidMount() {
        const newsId = this.props.match.params.newsid;

        this.getContentVIEW(newsId);
        this.loadComments(newsId);
    }


    render() {   
        if(this.state.notFound) {
            return <NotFound />;
        }
        if(this.state.serverError) {
            return (<ServerError />);
        }

        
        const imageBase64 = "data:image/png;base64, "+ this.state.base64image;

        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        {this.state.id ?
                        <Breadcrumb.Item><Link to={'/news/'+this.state.id}>Список программ тренировок</Link></Breadcrumb.Item>
                        : null}
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    {this.state.isLoading ?
                        <LoadingIndicator/>
                    :
                    <Row  gutter={[16, 16]}>
                        <Col span={24} className="borderBottomDotted">
                            <h2>{this.state.name}</h2>
                        </Col>
                        <Col span={24} className="borderBottomDotted">
                            <img src={imageBase64} height={400} alt="Red dot" />
                        </Col>
                        <Col span={24}>
                            <p className="whiteSpace">{this.state.description}</p>
                        </Col>

                        <Col span={24}>
                            {this.state.isLoadComments ?
                            <LoadingIndicator/>
                            :
                            <Comments username={this.state.username} 
                                commentsList={this.state.commentsList} 
                                deleteComments={this.deleteComments} 
                                saveComments={this.saveComments} />
                            }
                        </Col>
                        
                    </Row>
                    }
                </div>
            </div>
    );
    }
}

export default News;
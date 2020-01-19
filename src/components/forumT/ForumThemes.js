import React, { Component } from 'react';
import { ForumService } from '../../service/ForumService';
import { Button, List, Col, Input, Breadcrumb, Row, Pagination, notification, Modal } from 'antd';
import { ACCESS_TOKEN } from '../../constants';
import {withRouter, Link } from 'react-router-dom';
import { getCurrentUser } from '../../until/APIUtils';

import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import AlertTable from '../../error/AlertTable';
import './ForumThemes.css';

const {confirm} = Modal;

class ForumThemes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listForumThemes: [],
            page: 0,
            totalPages: '',
            nametheme: '',
            size: '',
            totalElements: '',
            last: '',
            currentUser: null,

            isLoadingListTheam: false,
            isLoading: false,
            serverError: false,
            notFound: false,
        }

        this.loadForumTheme = this.loadForumTheme.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.deleteForumTheam = this.deleteForumTheam.bind(this);  
        this.loadCurrentUser = this.loadCurrentUser.bind(this);  
              
        
        this.forumService = new ForumService();
    }

    loadForumTheme(pageNum) {
        this.setState({
            isLoadingListTheam: true,
        });
        
        this.forumService.getAllThemeForum(pageNum, this.state.nametheme)
        .then(response => {
            this.setState({
                listForumThemes: response.data.content,
                page: pageNum,
                size: response.data.size,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                last: response.data.last,

                isLoadingListTheam : false
            });
        }).catch(error => {
            this.setState({
                isLoadingListTheam: false,
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

    deleteForumTheam(id){
        
        const thisPrev = this;

        confirm({
            title: 'Вы уверены что хотите тему с форума?',
            content: 'Данные невозможно будет восстановить.',
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                const data = new FormData();
                data.append('id', id);
                thisPrev.forumService.postForumTheamDelete(data).then(response => {
                    notification.success({
                        message: 'Сообщение',
                        description: 'Тема успешно удален!'
                    });
                    thisPrev.loadForumTheme(thisPrev.state.page);
                }).catch(error => {
                    notification.error({
                        message: 'Ошибка',
                        description: 'Извините! Произошла ошибка удаления!'
                    });
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });    
        
    
    }

    paginationChange = (page, pageSize) => {
        const pageNum = page - 1;
        this.loadForumTheme(pageNum);
    }

    componentDidMount() {
        this.loadForumTheme();
        this.loadCurrentUser();
    }

    
    onChangeInput = (e) => {
        this.setState({nametheme: e.target.value})
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
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <Row  gutter={[16, 16]}>
                        <Row className="btn-row-div">
                            <Col md={20}>
                                <span className="searchInputTitle">Тема: </span>
                                <Input className="searchInput" value={this.state.nametheme} onChange={this.onChangeInput} />
                                <Button onClick={this.loadForumTheme.bind(this, 0)} icon="search">Поиск</Button>
                            </Col>
                            <Col md={4} className="textRight">
                                {this.state.currentUser != null ?
                                <Link to={"/forum/theme/edit/"}><Button type="primary" icon="plus">Добавить тему</Button></Link>
                                : null}
                            </Col>
                        </Row>
                        
                        <Col md={24}>
                            {this.state.isLoadingListTheam ? 
                            <LoadingIndicator/>
                            :
                            <div>
                                {this.state.listForumThemes.length == 0 ?
                                    <AlertTable/>
                                :
                                <List
                                    itemLayout="horizontal"
                                    dataSource={this.state.listForumThemes}
                                    renderItem={item => (
                                    <List.Item actions={[
                                        <div>
                                        {this.state.currentUser != null && this.state.currentUser.username == item.user ?
                                            [
                                                <Link className="actionList" to={'/forum/theme/'+item.id}>Перейти</Link>, 
                                                <Link className="actionList" to={'/forum/theme/edit/'+item.id}>Изменить</Link>, 
                                                <a className="actionList" onClick={this.deleteForumTheam.bind(this, item.id)} key="list-loadmore-more">Удалить</a>,
                                            ]
                                            :
                                            [
                                                <Link to={'/forum/theme/'+item.id}>Перейти</Link>
                                            ]
                                            }
                                        </div>
                                    ]}>
                                        <List.Item.Meta
                                        title={<span>{item.name}</span>}
                                        description={<span>{item.description}</span>}
                                        />
                                    </List.Item>
                                    )}
                                />
                                }
                            </div>
                            
                            }
                        </Col>
                        <Col span={24}>
                            <Pagination  onChange={this.paginationChange} defaultCurrent={page} total={totalPages} />
                        </Col>                        
                    </Row>
                </div>
            </div>
        );
    }
}


export default ForumThemes;


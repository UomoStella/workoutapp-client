import React, { Component } from 'react';
import { RecipeService } from '../../service/RecipeService';
import { notification, Pagination, Button, Row, Col, Comment} from 'antd';
import {withRouter, Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';

import List from '../../components/templats/List';
import ListElement from '../../components/templats/ListElement';

import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import AlertTable from '../../error/AlertTable';

class RationAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content : [],
            page: 0,
            size: '',
            totalElements: '',
            totalPages: 0,
            last: '',
            commentsList: [],

            isLoadingTable: false,
            isLoading: false
        };

        this.handleRationAll = this.handleRationAll.bind(this);

        this.paginationChange = this.paginationChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        

        this.recipeService = new RecipeService();
    }

    handleRationAll(pageNum){
        this.setState({
            isLoading: true,
            page: pageNum
        });
        
        this.recipeService.getRationDayList(pageNum).then(response => {
            const rationRespons  = response.data;

            this.setState({
                content : rationRespons.content,
                page: pageNum,
                size: rationRespons.size,
                totalElements: rationRespons.totalElements,
                totalPages: rationRespons.totalPages,
                last: rationRespons.last,
                
                isLoading: false,
            });       
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: 'Извините! Что-то пошло не так. Попытайтесь снова!'
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

    handleDelete = (id) =>{
        this.setState({
            isLoading: true,
        });

        const data = new FormData();
            data.append('id', id);

        this.recipeService.postRationDayDelete(data).then(response => {
            this.setState({
                isLoading: false,
            });
            this.handleRationAll(this.state.page)
            notification.success({
                message: 'Сообщение',
                description: 'Упражнение успешно удалено.'
            });
        }).catch(error => {
            this.setState({
                isLoading: false,
            });
            notification.error({
                message: 'Ошибка',
                description: 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
        });
    }


    handleEdit = (id) =>{
        if(id == null){
            notification.error({
                message: 'Ошибка',
                description: 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
        }else{
            this.props.handleMessage('/ration/media/'+id, '')
        }
    }



    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        const pageNum = this.props.pageNum != null ? this.props.pageNum : 0; 
        
        this.handleRationAll(pageNum);
    }

    paginationChange = (page, pageSize) => {
        const pageInx = page - 1;
        this.handleRationAll(pageInx);
    }

    render() {   
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return (<ServerError />);
        }


        const page = this.state.page + 1;
        const totalPages = 10 * this.state.totalPages;


        const valueList = [];
        this.state.content.forEach((value) => { 
            valueList.push(
                <Col md={6} style={{minWidth: '290px'}} gutter={[16, 16]} >
                    <ListElement id={value.id}
                        imageBase64={value.base64image}
                        handleEdit={this.handleEdit}
                        ifFood={true}
                        handleDelete={this.handleDelete}
                        additionInfo={<div>
                                        <p className="p-name">{value.name}</p>
                                        <p className="p-description">{value.description}</p>
                                    </div>}
                        />
                </Col>
            );
        });

        
        return (
                <Row  gutter={[16, 16]}>
                    <Col span={24}>
                        <Row  gutter={[16, 16]}>
                            <Col span={20}>
                                <h2>Дневной рацион</h2>
                            </Col>
                            <Col span={4}>
                                <div style={{textAlign: 'right'}}>
                                    <Button type="primary"><Link to={'/ration/details/'}>Добавить рацион</Link></Button> 
                                </div>
                            </Col>
                        </Row>
                    </Col>
            
                    <Col md={24}>
                        {!this.state.isLoading ?
                        <div>
                            {this.state.content.length != 0 ?
                            <Row gutter={16} className="exercises-list">
                                <List handleDelete={this.handleDelete} Content={valueList} handleEdit={this.handleEdit} />
                                <Col span={24}>
                                    <Pagination  onChange={this.paginationChange} defaultCurrent={page} total={totalPages} />
                                </Col>
                            </Row>
                            :
                            <AlertTable/>
                            }
                        </div>
                        :
                        <LoadingIndicator/>
                    }
                    </Col>
                </Row>
        );
    }
}

export default RationAll;
import React, { Component } from 'react';
import { RecipeService } from '../../service/RecipeService';
import { notification, Pagination, Button, Row, Col, Breadcrumb} from 'antd';
import {withRouter, Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';

import List from '../../components/templats/List';
import ListElement from '../../components/templats/ListElement';

import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import AlertTable from '../../error/AlertTable';

class RecipeAll extends Component {
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

        this.handleRecipeAll = this.handleRecipeAll.bind(this);

        this.paginationChange = this.paginationChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        
        this.recipeService = new RecipeService();
    }

    handleRecipeAll(pageNum){
        this.setState({
            isLoading: true,
            page: pageNum
        });
        
        this.recipeService.getRecipeMediaPage(pageNum).then(response => {
            const recipeRespons  = response.data;
            this.setState({
                content : recipeRespons.content,
                page: pageNum,
                size: recipeRespons.size,
                totalElements: recipeRespons.totalElements,
                totalPages: recipeRespons.totalPages,
                last: recipeRespons.last,
                
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

    handleDelete = (id) =>{
        this.setState({
            isLoading: true,
        });

        const data = new FormData();
            data.append('id', id);

        this.recipeService.postRecipeDelete(data).then(response => {
            this.setState({
                isLoading: false,
            });
            this.handleRecipeAll(this.state.page)
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
            this.props.handleMessage('/recipe/media/'+id, '')
        }
    }



    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        const pageNum = this.props.pageNum != null ? this.props.pageNum : 0; 
        
        this.handleRecipeAll(pageNum);
    }

    paginationChange = (page, pageSize) => {
        const pageInx = page - 1;
        this.handleRecipeAll(pageInx);
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
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/recipe/all'}>Список рецептов</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <Row  gutter={[16, 16]} className="borderBottomDotted">
                        <Col md={20}>
                            <p className="title-page">Список рецептов</p>
                        </Col>
                        <Col md={4}>
                            <div style={{textAlign: 'right'}}>
                            <Link to={'/recipe/details/'}><Button icon="plus" type="primary">Добавить рецепт</Button></Link> 
                            </div>
                        </Col>
                    </Row>
                    <Row  gutter={[16, 16]}>                
                        <Col md={24}>
                            {!this.state.isLoading ?
                            <div>
                                {this.state.content.length != 0 ?
                                <Row gutter={16} className="exercises-list">
                                    <List handleDelete={this.handleDelete} Content={valueList} handleEdit={this.handleEdit} />
                                    <Col span={24}>
                                        <div className="ant-pagination-div">
                                            <Pagination  onChange={this.paginationChange} defaultCurrent={page} total={totalPages} />
                                        </div>
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
                </div>
            </div>
        );
    }
}

export default RecipeAll;
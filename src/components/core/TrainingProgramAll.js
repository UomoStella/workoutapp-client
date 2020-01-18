import React, { Component } from 'react';
import { TrainingProgramService } from '../../service/TrainingProgramService';
import { notification, Pagination, Button, Row, Col, Breadcrumb} from 'antd';
import {withRouter, Link } from 'react-router-dom';
import ServerError  from '../../error/ServerError';
import AlertTable  from '../../error/AlertTable';

import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import { ACCESS_TOKEN } from '../../constants';

import List from '../../components/templats/List';
import ListElement from '../../components/templats/ListElement';



class TrainingProgramAll extends Component {
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

        this.handleTrainingProgramAll = this.handleTrainingProgramAll.bind(this);

        this.paginationChange = this.paginationChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);        

        this.trainingProgramService = new TrainingProgramService();
    }

    handleTrainingProgramAll(pageNum){
        this.setState({
            isLoading: true,
            page: pageNum
        });

        this.trainingProgramService.getTrainingProgramAll(pageNum).then(response => {
            const exercisesRespons  = response.data;
            console.log(exercisesRespons);
            this.setState({
                content : exercisesRespons.content,
                page: pageNum,
                size: exercisesRespons.size,
                totalElements: exercisesRespons.totalElements,
                totalPages: exercisesRespons.totalPages,
                last: exercisesRespons.last,
                
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

        this.trainingProgramService.postTrainingProgramDelete(data)
        .then(response => {
            this.setState({
                isLoading: false,
            });
            this.handleTrainingProgramAll(this.state.page)
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
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
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
            this.props.handleMessage('/trainingprogram/details/'+id, '')
        }
    }

    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        const pageNum = this.props.pageNum != null ? this.props.pageNum : 0; 
        
        this.handleTrainingProgramAll(pageNum);
    }

    paginationChange = (page, pageSize) => {
        const pageInx = page - 1;
        this.handleTrainingProgramAll(pageInx);
    }

    render() {   
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
                <Col md={6} style={{minWidth: '310px'}} gutter={[16, 16]} >
                    <ListElement id={value.id}
                        imageBase64={value.base64Image}
                        handleEdit={this.handleEdit}
                        handleDelete={this.handleDelete}
                        additionInfo={<div>
                                        <p className="p-name">{value.name}</p>
                                        <p className="p-addition">Продолжжительность: {value.durationDays} дн.</p>
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
                        <Breadcrumb.Item><Link to={'/trainingprogram/all'}>Список программ</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <Row  gutter={[16, 16]} className="borderBottomDotted">
                        <Col md={20}>
                            <p className="title-page">Список программ тренировок</p>
                        </Col>
                        <Col md={4}>
                            <div style={{textAlign: 'right'}}>
                                <Link to={'/trainingprogram/edit'}>
                                    <Button type="primary" icon="plus"> Добавить программу</Button>
                                </Link> 
                            </div>
                        </Col>
                    </Row>
                    {this.state.isLoading ?
                        <LoadingIndicator/>
                    :
                        <Row  gutter={[16, 16]}>
                            <Col span={24}>
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
                    }
                </div>
            </div>
        );
    }
}

export default TrainingProgramAll;
import React, { Component } from 'react';
import { TrainingProgramService } from '../../service/TrainingProgramService';
import { notification, Pagination, Button, Row, Col} from 'antd';
import {withRouter, Link } from 'react-router-dom';
import ServerError  from '../../error/ServerError';
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

        console.log(pageNum);
        
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
                <Col md={6} gutter={[16, 16]} >
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
                <Row  gutter={[16, 16]}>
                    <Col span={24}>
                        <div style={{textAlign: 'right'}}>
                            <Button type="primary"><Link to={'/trainingprogram/edit'}>Добавить программу</Link></Button> 
                        </div>
                    </Col>
            
                    <Col span={24}>
                        {!this.state.isLoading ?
                        <div>
                            {this.state.content.length != 0 ?
                            <Row gutter={16} className="exercises-list">
                                <List handleDelete={this.handleDelete} Content={valueList} handleEdit={this.handleEdit} />
                            </Row>
                            :
                            <p>Нет данных!!</p>
                            }
                        </div>
                        :
                        <LoadingIndicator/>
                    }
                    </Col>

                    <Col span={24}>
                        <Pagination  onChange={this.paginationChange} defaultCurrent={page} total={totalPages} />
                    </Col>
                </Row>
        );
    }
}

export default TrainingProgramAll;

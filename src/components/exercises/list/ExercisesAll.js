import React, { Component } from 'react';
import { TrainingService } from '../../../service/TrainingService';
import { notification, Pagination, Button, Row, Col, Breadcrumb } from 'antd';
import {withRouter, Link } from 'react-router-dom';
import './ExercisesAll.css';
import { ACCESS_TOKEN } from '../../../constants';
import ExercisesList from './ExercisesList';

import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import AlertTable from '../../../error/AlertTable';



class ExercisesAll extends Component {
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

        this.getExercisesMedia = this.getExercisesMedia.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.exercisesDelete = this.exercisesDelete.bind(this);

        this.trainingService = new TrainingService();
    }

    getExercisesMedia(pageNum){
        this.setState({
            isLoading: true,
            page: pageNum
        });

        this.trainingService.getExercisesListByPage(pageNum).then(response => {

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

    exercisesDelete = (id) =>{
        this.setState({
            isLoading: true,
        });

        const data = new FormData();
            data.append('id', id);

        this.trainingService.postExercisesDelete(data).then(response => {
            this.setState({
                isLoading: false,
            });
            this.getExercisesMedia(this.state.page)
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

    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        const pageNum = this.props.pageNum != null ? this.props.pageNum : 0; 
        
        this.getExercisesMedia(pageNum);
    }

    paginationChange = (page, pageSize) => {
        const pageInx = page - 1;
        this.getExercisesMedia(pageInx);
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
        
        return (
            <div>
            <div className="breadcrumb-div">
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={'/exercises/all'}>Список упражнений</Link></Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="content-div">
                <Row gutter={[16, 16]} className="borderBottomDotted">
                    <Col md={20}>
                        <p className="title-page">Список упражнений</p>
                    </Col>
                    <Col nd={4}>
                        <div className="textRight">
                        <Link to={'/exercises/edit'}><Button type="primary" icon="plus"> Добавить упражнение</Button></Link> 
                        </div>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        {!this.state.isLoading ?
                        <div>
                            {this.state.content.length != 0 ?
                                <Row gutter={16} className="exercises-list">
                                    <ExercisesList exercisesDelete={this.exercisesDelete} excersicesContent={this.state.content}/>
                                    <Col span={24}>
                                        <div className="ant-pagination-div">
                                            <Pagination  onChange={this.paginationChange} defaultCurrent={page} total={totalPages} />
                                        </div>
                                    </Col>
                                </Row>
                            : <AlertTable/> }
                        </div>
                        : <LoadingIndicator/> }
                    </Col>
                    
                </Row>
            </div>
            </div>
        );
    }
}

export default ExercisesAll;

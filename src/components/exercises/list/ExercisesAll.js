import React, { Component } from 'react';
import { TrainingService } from '../../../service/TrainingService';
import { notification, Pagination, Button, Row, Col, Tabs, Icon } from 'antd';
import {withRouter, Link } from 'react-router-dom';
import './ExercisesAll.css';
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import { ACCESS_TOKEN } from '../../../constants';
// import ExcersicesLogo from '../../../resources/excersices.png';
import ExercisesList from './ExercisesList';

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

        console.log(pageNum);
        
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

        this.trainingService.postExercisesDelete(data)
        .then(response => {
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

        console.log(totalPages);
        
        return (
                <Row  gutter={[16, 16]}>
                    <Col span={24}>
                        <div style={{textAlign: 'right'}}>
                            <Button type="primary"><Link to={'/exercises/edit'}>Добавить тренировку</Link></Button> 
                        </div>
                    </Col>
            
                    <Col span={24}>
                        {!this.state.isLoading ?
                        <div>
                            {this.state.content.length != 0 ?
                            <Row gutter={16} className="exercises-list">
                                <ExercisesList exercisesDelete={this.exercisesDelete} excersicesContent={this.state.content}/>
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

export default ExercisesAll;

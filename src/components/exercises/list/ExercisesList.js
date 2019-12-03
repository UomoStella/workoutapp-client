import React, { Component } from 'react';
import { TrainingService } from '../../../service/TrainingService';
import { FileService } from '../../../service/FileService';
import {withRouter, Link } from 'react-router-dom';
import { notification, Pagination, Button, Row, Col, Tabs, Icon } from 'antd';
import './ExercisesList.css';
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import { ACCESS_TOKEN } from '../../../constants';
// import ExcersicesLogo from '../../../resources/excersices.png';
import ExercisesElement from './ExercisesElement'

class ExercisesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content : [],
            page: 0,
            size: '',
            totalElements: '',
            totalPages: 0,
            last: '',

            isLoading: false
        };

        this.getExercisesMedia = this.getExercisesMedia.bind(this);
        this.trainingService = new TrainingService();
    }



    getExercisesMedia(pageNum){
        this.setState({
            isLoading: true,
        });

        const data = new FormData();
            data.append('page', pageNum);
    
        
        this.trainingService.getExercisesListByPage(data)
        .then(response => {
            const exercisesRespons  = response.data;
            console.log(exercisesRespons);
            this.setState({
                content : exercisesRespons.content,
                page: exercisesRespons.page,
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


    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        const pageNum = this.props.pageNum != null ? this.props.pageNum : 0; 
        
        this.getExercisesMedia(pageNum);
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


        const excersicesList = [];
        this.state.content.forEach((excersice, index) => { 
            excersicesList.push(
                <Col gutter={[16, 16]} span={8}>
                    <ExercisesElement id={excersice.id}
                        name={excersice.name}
                        subtypeTrainingName={excersice.subtypeTrainingName}
                        muscleGroupsValue={excersice.muscleGroupsValue}
                        imageBase64={excersice.imageBase64}/>
                </Col>
            );
        });

        const page = this.state.page + 1;
        const totalPages = 10 * this.state.totalPages;

        console.log(totalPages);
        
        return (
                <div>
                    {excersicesList.length != 0 ?
                    <Row gutter={16}>
                        {excersicesList}
                    </Row>
                    :
                    <p>Нет данных!!</p>
                    }
                    <Pagination simple defaultCurrent={page} total={totalPages} />
                </div>
        );
    }
}

export default ExercisesList;

import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { notification, Button, Row, Col, Tabs, Icon, Typography, Input, List, Skeleton } from 'antd';

import { DailyWorkoutService } from '../../../service/DailyWorkoutService';

import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';

import { ACCESS_TOKEN } from '../../../constants';



const { TabPane } = Tabs;
const { Title } = Typography;

class DailyWorkoutDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            day: '',
            trainingProgramId: '',
            trainingProgramName: '',
            rationDayId: '',
            rationDayName: '',
            trainingDescriptions: [],

            serverError: false,
            notFound: false,
            isPrivateLoading: false,
            isLoading: false
        };
    
        this.getDailyWorkoutDetails = this.getDailyWorkoutDetails.bind(this);
        this.dailyWorkoutService = new DailyWorkoutService();
    }

    getDailyWorkoutDetails(trainingProgramId, day){
        this.setState({
            isLoading: true,
        });

        this.dailyWorkoutService.getDailyWorkoutDetailsByTrainingProgramIdAndDay(trainingProgramId, day).then(response => {
            const dailyWorkout  = response.data.dailyWorkoutResponse;
            const trainingDescriptions  = response.data.trainingDescriptionResponse;

            this.setState({
                id: dailyWorkout.id,
                name: dailyWorkout.name,
                description: dailyWorkout.description,
                day: dailyWorkout.day,
                trainingProgramId: dailyWorkout.trainingProgramId,
                trainingProgramName: dailyWorkout.trainingProgramName,
                rationDayId: dailyWorkout.rationDayId,
                rationDayName: dailyWorkout.rationDayName,

                trainingDescriptions: trainingDescriptions,
                
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
        
        const trainingProgramId = this.props.match.params.trainingProgramId;
        const day = this.props.match.params.day;
    
        this.getDailyWorkoutDetails(trainingProgramId, day);
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

        console.log(this.state.IsPrivate);
        return (
            <div>
                    <Row  gutter={[16, 16]}>
                        <Col md={18}>
                            <Title level={2}>Программа тренировок: {this.state.trainingProgramName} (дунь {this.state.day})</Title>
                            <p>Наименование: <span>{this.state.name}</span></p>
                            <p>Описание: <span>{this.state.description}</span></p>
                        </Col>
                        <Col md={6}>
                            <div style={{textAlign: 'right'}}>
                                <Link to={'/workout/edit/'+ this.state.trainingProgramId+'/'+this.state.day+'/'+this.state.id}>
                                    <Button type="primary"><Icon type="edit" /> Редактировать</Button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[0, 40]}>
                        <Col span={24}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={<span><Icon type="schedule"/>Список упражнеений</span>} key="1">
                                    <div style={{textAlign: 'right'}}>
                                        <Button type="primary"><Icon type="plus" /> Добавить</Button>
                                    </div>
                                    
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                    
            </div>
        
        );
    }
}

export default withRouter(DailyWorkoutDetails);
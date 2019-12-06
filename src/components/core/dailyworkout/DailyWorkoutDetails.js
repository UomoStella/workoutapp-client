import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { Drawer, notification, Button, Row, Col, Tabs, Icon, Typography, Input, List, Skeleton } from 'antd';

import { DailyWorkoutService } from '../../../service/DailyWorkoutService';
import { TrainingDescriptionService } from '../../../service/TrainingDescriptionService';


import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import TrainingDescriptionEdit from '../../../components/core/trainingdescription/TrainingDescriptionEdit';

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
            visible: false,
            selectedTDId: '',

            serverError: false,
            notFound: false,
            isPrivateLoading: false,
            isLoadingTable: false,
            isLoading: false
        };
    
        this.getDailyWorkoutDetails = this.getDailyWorkoutDetails.bind(this);
        this.showDrawerVal = this.showDrawerVal.bind(this);
        this.getExercisesAllBydailyid = this.getExercisesAllBydailyid.bind(this);
        this.deleteTrainingDescription = this.deleteTrainingDescription.bind(this);

        
        this.dailyWorkoutService = new DailyWorkoutService();
        this.trainingDescriptionService = new TrainingDescriptionService();
    }


    showDrawer = () => {
        this.setState({
          visible: true,
        });
      };

    showDrawerVal = (value) => {
        this.setState({
            selectedTDId: value,
            visible: true,
        });
       };
    
      onClose = () => {
        this.setState({
          visible: false,
        });
      };

      deleteTrainingDescription(id){
        const data = new FormData();
            data.append('id', id);
        this.trainingDescriptionService.postTrainingDescriptionDelete(data).then(response => {
            notification.success({
                message: 'Собщение',
                description: 'Упражнение успешно удалено!'
            });
            this.getExercisesAllBydailyid();
            
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
        });    
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

    getExercisesAllBydailyid(){
        this.setState({
            isLoadingTable: true,
        });

        this.trainingDescriptionService.getExercisesAllBydailyid(this.state.id).then(response => {
            const trainingDescriptions  = response.data;

            this.setState({
                trainingDescriptions: trainingDescriptions.containerList,
                isLoadingTable: false,
                visible: false
            });   

            
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
            this.setState({
                isLoadingTable: false
            });
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
                            <Title level={2}>Программа тренировок: {this.state.trainingProgramName} (день {this.state.day})</Title>
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
                                        <Button type="primary" onClick={this.showDrawer}><Icon type="plus" /> Добавить</Button>
                                    </div>
                                    {this.state.isLoadingTable ?
                                        <LoadingIndicator/>
                                    :
                                        <div>
                                        {this.state.trainingDescriptions.length != 0 ?
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={this.state.trainingDescriptions}
                                                renderItem={item => (
                                                <List.Item actions={[<a key="list-loadmore-more">Вверх</a>,
                                                <a key="list-loadmore-more">Вниз</a>, 
                                                <a onClick={this.showDrawerVal.bind(this, item.id)} key="list-loadmore-more">Изменить</a>,
                                                <a onClick={this.deleteTrainingDescription.bind(this, item.id)} key="list-loadmore-more">Удалить</a>]}>
                                                    <List.Item.Meta
                                                    title={<span>Упражнение: {item.exercises.name}</span>}
                                                    description={<span>Время выполнения: {item.leadTime}</span>}
                                                    />
                                                </List.Item>
                                                )}
                                            />
                                            : 
                                            <p>Не данных по дням.</p>
                                        }
                                        </div>
                                    }
                                    
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                    
                    <Drawer title="Редактирование упражнения"
                        width={720}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        bodyStyle={{ paddingBottom: 80 }}>
                        {this.state.visible ?
                            <TrainingDescriptionEdit getExercisesAllBydailyid={this.getExercisesAllBydailyid} TDId={this.state.selectedTDId} dailyid={this.state.id}/>
                            :  null}
                    </Drawer>
            </div>
        
        );
    }
}

export default withRouter(DailyWorkoutDetails);
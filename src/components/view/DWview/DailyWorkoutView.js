import React, { Component } from 'react';
import { Row, Col, notification, Pagination, Button} from 'antd';
import { DailyWorkoutService } from '../../../service/DailyWorkoutService';
import { TrainingProgramService } from '../../../service/TrainingProgramService';
import DWElement from './DWElement';
import List from '../../templats/List';
import LoadingIndicator from '../../LoadingIndicator';
import ServerError  from '../../../error/ServerError';
import NotFound from '../../../error/NotFound';

class DailyWorkoutView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dailyWorkoutList : [],
            page: '',
            size: '',
            totalElements: '',
            totalPages: '',
            last: '',
            tpID: '',
            hasUser: false,
            hasTrainingProgram: false,

            isLoading: true,
            serverError: false,
            notFound: false,
        };

        this.dailyWorkoutService = new DailyWorkoutService();
        this.trainingProgramService = new TrainingProgramService();

        
        this.getContentVIEW = this.getContentVIEW.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.hasTrainingProgram = this.hasTrainingProgram.bind(this);
        this.addTPtoUser = this.addTPtoUser.bind(this);
        
    }

    hasTrainingProgram(tpID) {
        this.dailyWorkoutService.getHasTrainingProgram(tpID)
        .then(response => {
            this.setState({
                hasUser: response.data.hasUser,
                hasTrainingProgram: response.data.hasTrainingProgram,
            });
        }).catch(error => {
            this.setState({
                hasUser: false,
                hasTrainingProgram: false,
            });
        });
    }

    addTPtoUser(){
        const tpID =  this.state.tpID;
        const data = new FormData();
        data.append('tpid', tpID);

        this.trainingProgramService.postAddTPtoUser(data)
        .then(response => {
            this.hasTrainingProgram(tpID);
            notification.success({
                message: 'Сообщение',
                description: 'Программа тренировок успешно добавлена!'
            });
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
        });
    }

    paginationChange = (page, pageSize) => {
        const tpID = this.state.tpID;
        const pageInx = page - 1;
        this.getContentVIEW(tpID, pageInx);
    }

    getContentVIEW(tpID, pageNum){
        this.setState({
            isLoading: true,
        });

        this.dailyWorkoutService.getDailyWorkoutVIEW(tpID, pageNum)
        .then(response => {
            this.setState({
                tpID: tpID,
                dailyWorkoutList: response.data.content,
                page: pageNum,
                size: response.data.size,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                last: response.data.last,

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
        const tpID = this.props.match.params.tpid;
        this.getContentVIEW(tpID);
        this.hasTrainingProgram(tpID);
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
        this.state.dailyWorkoutList.forEach((value) => { 
            valueList.push(
                <Col md={6} gutter={[16, 16]} >
                    <DWElement id={value.id}
                        name={value.name}
                        tpID={value.trainingProgramId}
                        rationDayId={value.rationDayId}
                        day={value.day}
                        rationDayName={value.rationDayName}
                        description={value.description}/>
                </Col>
            );
        });
        
        return (
            <Row  gutter={[16, 16]}>
                {this.state.hasUser ?
                    <div>
                    {!this.state.hasTrainingProgram  ?
                    <Col span={24}>
                        <div style={{textAlign: 'right'}}>
                            <Button type="primary" onClick={this.addTPtoUser}>Добавить программу тренировк</Button>
                        </div>
                    </Col>
                    : 
                    <Col span={24}>
                        <div style={{textAlign: 'right'}}>
                            <Button  disabled="true">Программа уже добавлена</Button>
                        </div>
                    </Col>
                    }
                    </div>
                :null}

                <Col span={24}>
                    {!this.state.isLoading ?
                    <div>
                        {this.state.dailyWorkoutList.length != 0 ?
                        <Row gutter={16} className="tpview-list">
                            <List  Content={valueList} />
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

export default DailyWorkoutView;
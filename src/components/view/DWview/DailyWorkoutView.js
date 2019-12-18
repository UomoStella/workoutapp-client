import React, { Component } from 'react';
import { Row, Col, notification, Pagination, Button, Breadcrumb} from 'antd';
import {withRouter, Link } from 'react-router-dom';
import { DailyWorkoutService } from '../../../service/DailyWorkoutService';
import { TrainingProgramService } from '../../../service/TrainingProgramService';
import DWElement from './DWElement';
import List from '../../templats/List';
import Comments from '../../Comments';

import LoadingIndicator from '../../LoadingIndicator';
import ServerError  from '../../../error/ServerError';
import NotFound from '../../../error/NotFound';
import AlertTable from '../../../error/AlertTable';

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

            commentsList: [],
            isLoadComments: false,

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
        this.loadComments = this.loadComments.bind(this);

        this.saveComments = this.saveComments.bind(this);
        this.deleteComments = this.deleteComments.bind(this);        
    }

    deleteComments(id){
        const data = new FormData();
        data.append('id', id);

        this.trainingProgramService.postTPCommentsDelete(data)
        .then(response => {
            notification.success({
                message: 'Сообщение',
                description: 'Комментарий успешно удален!'
            });
            this.loadComments(this.state.tpID);
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: 'Извините! Произошла ошибка удаления!'
            });
        });
    }

    saveComments(comments){    
        const dataJSON = {
            id :this.state.tpID,
            comments: comments
        };

        this.trainingProgramService.postTPComments(JSON.stringify(dataJSON))
        .then(response => {
            notification.success({
                message: 'Сообщение',
                description: 'Комментарий успешно добавлен!'
            });
            this.loadComments(this.state.tpID);
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
        });
    }

    loadComments(tpID){
        this.setState({
            isLoadComments: true,
        });

        this.trainingProgramService.getTPComments(tpID)
        .then(response => {
            this.setState({
                commentsList: response.data.containerList,
                isLoadComments: false,
            });
        }).catch(error => {
            this.setState({
                isLoadComments: false,
            });
        });
    }

    hasTrainingProgram(tpID) {
        this.dailyWorkoutService.getHasTrainingProgram(tpID)
        .then(response => {
            this.setState({
                hasUser: response.data.hasUser,
                username: response.data.username,
                hasTrainingProgram: response.data.hasTrainingProgram,
            });
        }).catch(error => {
            this.setState({
                hasUser: false,
                username: null,
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
        this.loadComments(tpID);
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
        this.state.dailyWorkoutList.forEach((value) => { 
            valueList.push(
                <Col style={{minWidth: 280}} md={6} gutter={[16, 16]} >
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
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/trainingprogram/viewall'}>Список программ тренировок</Link></Breadcrumb.Item>
                        {this.state.tpID ?
                            <Breadcrumb.Item><Link to={'/dailyworkout/viewall/'+this.state.tpID}>Программа тренировок</Link></Breadcrumb.Item>
                        : null}
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    {this.state.isLoading ?
                        <LoadingIndicator/>
                    :
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
                                : <AlertTable /> }
                            </div>
                            :
                            <LoadingIndicator/>
                        }
                        </Col>

                        <Col span={24}>
                            <Pagination  onChange={this.paginationChange} defaultCurrent={page} total={totalPages} />
                        </Col>

                        <Col span={24}>
                            {this.state.isLoadComments ?
                            <LoadingIndicator/>
                            :
                            <Comments username={this.state.username} 
                                commentsList={this.state.commentsList} 
                                deleteComments={this.deleteComments} 
                                saveComments={this.saveComments} />
                            }
                        </Col>
                        
                    </Row>
                    }
                </div>
            </div>
    );
    }
}

export default DailyWorkoutView;
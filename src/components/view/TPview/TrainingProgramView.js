import React, { Component } from 'react';
import { Row, Col, notification, Pagination, Button, Drawer, Breadcrumb, Alert } from 'antd';
import {withRouter, Link } from 'react-router-dom';

import { TrainingProgramService } from '../../../service/TrainingProgramService';
import TPViewElement from './TPViewElement';
import TPVFilter from './TPVFilter';
import List from '../../templats/List';
import LoadingIndicator from '../../LoadingIndicator';
import ServerError  from '../../../error/ServerError';
import NotFound from '../../../error/NotFound';
import AlertTable from '../../../error/AlertTable';


class TrainingProgramView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainingProgramList : [],
            page: '',
            size: '',
            totalElements: '',
            totalPages: '',
            last: '',

            typeTrainingId: null,
            subtypeTrainingId: null,
            mgId: null,

            isLoading: true,
            serverError: false,
            notFound: false,
        };

        this.trainingProgramService = new TrainingProgramService();

        this.getContentVIEW = this.getContentVIEW.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.showDrawer = this.showDrawer.bind(this);
        
    }

    setFilter = (typeTrainingId, subtypeTrainingId, mgId) => {
        this.setState({
            typeTrainingId: typeTrainingId,
            subtypeTrainingId: subtypeTrainingId,
            mgId: mgId,
        })
        this.getContentVIEW(0, typeTrainingId, subtypeTrainingId, mgId);
        this.onClose();
    }

    paginationChange = (page, pageSize) => {
        const pageInx = page - 1;
        this.getContentVIEW(pageInx);
    }

    getContentVIEW(pageNum, typeTrainingId, subtypeTrainingId, mgId){
        this.setState({
            isLoading: true,
        });

        this.trainingProgramService.getTrainingProgramVIEW(typeTrainingId, subtypeTrainingId, mgId, pageNum).then(response => {
            this.setState({
                trainingProgramList: response.data.content,
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

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    componentDidMount() {
        this.getContentVIEW();
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
        this.state.trainingProgramList.forEach((value) => { 
            valueList.push(
                <Col md={6} style={{minWidth: 300}} gutter={[16, 16]} >
                    <TPViewElement id={value.id}
                        name={value.name}
                        base64Image={value.base64Image}
                        durationDays={value.durationDays}
                        username={value.username}
                        genderName={value.genderName}/>
                </Col>
            );
        });
        
        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/trainingprogram/viewall'}>Список программ тренировок</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <Row gutter={[16, 16]} className="borderBottomDotted">
                        <Col md={20}>
                            <p className="title-page">Список программ тренировок</p>
                        </Col>
                        <Col nd={4}>
                            <div className="textRight">
                                <Button icon="menu-unfold" onClick={this.showDrawer}>Фильтр</Button> 
                            </div>
                        </Col>
                    </Row>
                    <Row  gutter={[8, 2]}>
                        <Col span={24}>
                            {!this.state.isLoading ?
                                <div>
                                    {this.state.trainingProgramList.length != 0 ?
                                        <Row gutter={16} className="tpview-list">
                                            <List  Content={valueList} />
                                            <Col span={24}>
                                                <div className="ant-pagination-div">
                                                    <Pagination  onChange={this.paginationChange} defaultCurrent={page} total={totalPages} />
                                                </div>
                                            </Col>
                                        </Row>
                                    : <AlertTable />}
                                </div>
                            : <LoadingIndicator/>}
                        </Col>
                        
                        <Drawer title="Фильтр" placement="left" onClose={this.onClose} visible={this.state.visible}>
                            <TPVFilter setFilter={this.setFilter}/>
                        </Drawer>
                    </Row>
                </div>
            </div>
        );
    }
}

export default TrainingProgramView;
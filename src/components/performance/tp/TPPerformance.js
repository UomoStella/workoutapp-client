import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';

import { Row, Col, notification, Pagination, Breadcrumb, Switch} from 'antd';
import { PerformanceService } from '../../../service/PerformanceService';
import TPPElement from './TPPElement';
import { ACCESS_TOKEN } from '../../../constants';
import List from '../../templats/List';
import LoadingIndicator from '../../LoadingIndicator';
import ServerError  from '../../../error/ServerError';
import NotFound from '../../../error/NotFound';
import AlertTable from '../../../error/AlertTable';


class TPPerformance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content : [],
            page: '',
            size: '',
            totalElements: '',
            totalPages: '',
            last: '',
            isOpen: false,


            isLoadingTable: true,
            isLoading: false,
            serverError: false,
            notFound: false,
        };

        this.performanceService = new PerformanceService();

        this.paginationChange = this.paginationChange.bind(this);
        this.getContentVIEW = this.getContentVIEW.bind(this);
    }

    paginationChange = (page, pageSize) => {
        const tpID = this.state.tpID;
        const pageInx = page - 1;
        this.getContentVIEW(pageInx);
    }

    getContentVIEW(pageNum, isOpen){
        this.setState({
            isLoadingTable: true,
        });

        this.performanceService.getAllTPP(pageNum, isOpen)
        .then(response => {
            this.setState({
                content: response.data.content,
                page: pageNum,
                size: response.data.size,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                last: response.data.last,

                isLoadingTable: false,
            });
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
            });
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoadingTable: false,
                    serverError: false
                });
            } else {
                this.setState({
                    serverError: true,
                    notFound: false,
                    isLoadingTable: false
                });        
            }
        });
    }

    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }

        this.getContentVIEW();
    }

    changeIsOpen = () => {
        this.getContentVIEW(0, this.state.isOpen);

        this.setState(previousState => {
          return { 
              isOpen: !previousState.isOpen 
            };
        });
      };


    render() {   
        if(this.state.isLoading) {
            return <div className="content-div"><LoadingIndicator/></div>
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
                <Col md={6} style={{minWidth: 300}} gutter={[16, 16]} >
                    <TPPElement id={value.id}
                        viewid={1}
                        tpId={value.tpId}
                        dwuId={value.dwuId}
                        tpName={value.tpName}
                        tpBase64Image={value.tpBase64Image}
                        isDone={value.isDone}
                        dateUpdate={value.dateUpdate}
                        isEdit={true}
                        dwResponse={value.dwResponse}/>
                </Col>
            );
        });
        
        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/performance/tp'}>Дневное задание</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <Row gutter={[16, 16]} className="borderBottomDotted">
                        <Col md={20}>
                            <p className="title-page">Дневное задание</p>
                        </Col>
                        <Col nd={4}>
                            <div className="textRight">
                                <Switch  checkedChildren="Архив" unCheckedChildren="Live"
                                    onChange={this.changeIsOpen} checked={this.state.isOpen}/>
                            </div>
                        </Col>
                    </Row>
                    <Row  gutter={[16, 16]}>
                        {!this.state.isLoadingTable ?
                        <Col span={24}>
                            {!this.state.isLoading ?
                            <div>
                                {this.state.content.length != 0 ?
                                <Row gutter={16} className="tpview-list">
                                    <List  Content={valueList} />
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
                        : <LoadingIndicator/>}
                    </Row>
                </div>
            </div>
    );
    }
}

export default TPPerformance;
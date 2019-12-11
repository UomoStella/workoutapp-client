import React, { Component } from 'react';
import { Row, Col, notification, Pagination, Button} from 'antd';
import { PerformanceService } from '../../../service/PerformanceService';
import TPPElement from './TPPElement';
import { ACCESS_TOKEN } from '../../../constants';
import List from '../../templats/List';
import LoadingIndicator from '../../LoadingIndicator';
import ServerError  from '../../../error/ServerError';
import NotFound from '../../../error/NotFound';

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

            isLoading: true,
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

    getContentVIEW(pageNum){
        this.setState({
            isLoading: true,
        });

        this.performanceService.getAllTPP(pageNum)
        .then(response => {
            this.setState({
                content: response.data.content,
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
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }

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
        this.state.content.forEach((value) => { 
            valueList.push(
                <Col md={8} gutter={[16, 16]} >
                    <TPPElement id={value.id}
                        tpId={value.tpId}
                        dwuId={value.dwuId}
                        tpName={value.tpName}
                        tpBase64Image={value.tpBase64Image}
                        dwResponse={value.dwResponse}/>
                </Col>
            );
        });
        
        return (
            <Row  gutter={[16, 16]}>
                <Col span={24}>
                    {!this.state.isLoading ?
                    <div>
                        {this.state.content.length != 0 ?
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

export default TPPerformance;
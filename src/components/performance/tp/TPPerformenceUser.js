import React, { Component } from 'react';
import { Row, Col, notification, Pagination, Button} from 'antd';
import { PerformanceService } from '../../../service/PerformanceService';
import TPPElement from './TPPElement';
import { ACCESS_TOKEN } from '../../../constants';
import List from '../../templats/List';
import LoadingIndicator from '../../LoadingIndicator';
import ServerError  from '../../../error/ServerError';
import NotFound from '../../../error/NotFound';
import AlertTable from '../../../error/AlertTable';

class TPPerformenceUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content : [],
            page: '',
            size: '',
            totalElements: '',
            totalPages: '',
            last: '',
            username: '',
            isCurrentUser: false,

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

    getContentVIEW(pageNum, username){
        this.setState({
            isLoading: true,
        });

        username = username != null ? username : this.state.username;

        this.performanceService.getAllByUserNameTPP(pageNum, username)
        .then(response => {
            this.setState({
                username: username,
                content: response.data.content,
                page: pageNum,
                size: response.data.size,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                last: response.data.last,

                isLoading: false,
            });
        }).catch(error => {
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

        this.getContentVIEW(0, this.props.username);
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
                <Col md={6} style={{minWidth: 300}} gutter={[16, 16]} >
                    <TPPElement id={value.id}
                        tpId={value.tpId}
                        viewid={2}
                        dwuId={value.dwuId}
                        tpName={value.tpName}
                        tpBase64Image={value.tpBase64Image}
                        isEdit={this.props.isCurrentUser}
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
            </Row>
    );
    }
}

export default TPPerformenceUser;
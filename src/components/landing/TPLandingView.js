import React, { Component } from 'react';
import { Row, Col, notification, Pagination, Button, Drawer } from 'antd';
import { TrainingProgramService } from '../../service/TrainingProgramService';
import TPViewElement from '../view/TPview/TPViewElement';
import List from '../templats/List';
import LoadingIndicator from '../LoadingIndicator';
import ServerError  from '../../error/ServerError';
import NotFound from '../../error/NotFound';
import AlertTable from '../../error/AlertTable';


class TPLandingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainingProgramList : [],

            isLoading: true,
            serverError: false,
            notFound: false,
        };

        this.trainingProgramService = new TrainingProgramService();

        
        this.getContentVIEW = this.getContentVIEW.bind(this);
        
    }

    getContentVIEW(){
        this.setState({
            isLoading: true,
        });

        this.trainingProgramService.getTPfirstPage()
        .then(response => {
            this.setState({
                trainingProgramList: response.data.containerList,

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
                <Col md={6} style={{minWidth: 300}} gutter={[8, 8]} >
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
            <Row  gutter={[8, 2]}>
                <Col span={24}>
                    {!this.state.isLoading ?
                    <div>
                        {this.state.trainingProgramList.length != 0 ?
                        <Row gutter={8} className="tpview-list">
                            <List  Content={valueList} />
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

export default TPLandingView;
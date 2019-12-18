import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { notification, Row, Col } from 'antd';
import { Container } from 'react-bootstrap';

import { TrainingDescriptionService } from '../../../service/TrainingDescriptionService';

// import './TrainingDescriptionView.css';
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import TrainingDescriptionElement from './TrainingDescriptionElement';


class TrainingDescriptionView extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            dailyid: '',
            trainingDescriptionid: '',
            workoutResponse: {},
            trainingDescriptions: [],
            
            isLoading: true,
            serverError: false,
            notFound: false,
        }
        this.handleTrainingDescriptionView = this.handleTrainingDescriptionView.bind(this);

        this.trainingDescriptionService = new TrainingDescriptionService();
    }

    componentDidMount() {
        const dailyid = this.props.match.params.dailyid;

        const trainingDescriptionid = this.props.match.params.trainingDescriptionid;
        // console.log(dailyid);
        this.handleTrainingDescriptionView(dailyid, trainingDescriptionid);
    }

    handleTrainingDescriptionView(dailyid, trainingDescriptionid){
        this.setState({
            isLoading: true,
        });
    
        this.trainingDescriptionService.getTrainingDescriptionView(dailyid, trainingDescriptionid)
        .then(response => {
            const workoutResponse = response.data.workoutResponse;
            const trainingDescriptions = response.data.trainingDescriptions;
            this.setState({
                dailyid: dailyid,
                workoutResponse: workoutResponse,
                trainingDescriptions: trainingDescriptions,

                isLoading : false
            });    
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Пожалуйста попробуйте снова!'
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



        const valueList = [];
        this.state.trainingDescriptions.forEach((value) => { 
            valueList.push(
                <div className="dayliExcersise">
                    <TrainingDescriptionElement trainingDescriptions={value} />
                </div>
            );
        });

        return (
            <div className="content-div">
                <Row>
                    <div>
                        <h2>Программа тренировок: {this.state.workoutResponse.trainingProgramName}</h2>
                        {this.state.workoutResponse && this.state.workoutResponse.rationDayId ?
                            <h4>Рацион: <Link to={'/ration/view/'+ this.state.workoutResponse.rationDayId}>
                                <span>{this.state.workoutResponse.rationDayName}</span></Link>
                            </h4>
                        : null}
                        <h4>{this.state.workoutResponse.name}</h4>
                    </div>
                    {this.state.trainingDescriptions.length != 0 ?
                    <div>
                        <Container>
                            <Col className="borderLeftRight" lg={24} md={3}>
                                {valueList}
                            </Col>
                        </Container>
                    </div>
                    :
                    <div>
                        <p className="whiteSpace">{this.state.workoutResponse.description}</p>
                    </div>
                    }  
                </Row>
            </div>

        );
    }
}


export default withRouter(TrainingDescriptionView);

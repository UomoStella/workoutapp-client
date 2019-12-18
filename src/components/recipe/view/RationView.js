import React, { Component } from 'react';
import { notification, Row, Col } from 'antd';
import { RecipeService } from '../../../service/RecipeService';
import RationViewElement from './RationViewElement';
import './RationViewElement.css';
import { Container } from 'react-bootstrap';

import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';


class RationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rdId: '',
            rdName: '',
            rdDescription: '',

            rid: '',
            rationResponses: [],

            isLoading: false,
            serverError: false,
            notFound: false,
        }
        this.handleRecipeDayView = this.handleRecipeDayView.bind(this);

        this.recipeService = new RecipeService();
    }

    componentDidMount() {
        const rdId = this.props.match.params.rdId;
        const rId = this.props.match.params.rId;

        this.handleRecipeDayView(rdId, rId);
    }

    handleRecipeDayView(rdId, rId){
        this.setState({
            isLoading: true,
        });
    
        this.recipeService.getRationDayVIEW(rdId, rId).then(response => {
            const rationDayResponse = response.data.rationDayResponse;
            this.setState({
                rdId: rdId,
                rId: rId,

                rdName: rationDayResponse.name,
                rdDescription: rationDayResponse.description,

                rationResponses: response.data.rationResponses,

                isLoading : false
            });    
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description:  'Извините! Что-то пошло не так. Пожалуйста попробуйте снова!'
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
        this.state.rationResponses.forEach((value) => { 
            valueList.push(
                <div className="dayliExcersise">
                    <RationViewElement rationResponses={value} />
                </div>
            );
        });

        return (
            <div className="content-div">
                <Row>
                    <div>
                        <h2>Дневной рацион: {this.state.rdName}</h2>
                        <p className="whiteSpace">{this.state.rdDescription}</p>
                    </div>
                    {this.state.rationResponses.length != 0 ?
                        <Container>
                            <Col className="borderLeftRight" lg={24} md={3}>
                                {valueList}
                            </Col>
                        </Container>
                    :
                    null }  
                </Row>
            </div>

        );
    }
}



export default RationView;


import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { Button, Row, Col, Icon } from 'antd';
import ExcersicesLogo from '../../../resources/excersices.jpg';
import './DWElement.css';

class DWElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : '',
            name: '', 
            description: '', 
            tpID: '',
            day: '',
            rationDayId: '',
            rationDayName: '',

            isLoading: false
        }

        this.mapElement = this.mapElement.bind(this);
    }

    mapElement(){
        this.setState({
            id : this.props.id,
            name: this.props.name, 
            day: this.props.day, 
            description: this.props.description,
            tpID: this.props.tpID,
            rationDayId: this.props.rationDayId,
            rationDayName: this.props.rationDayName,

            isLoading: false
        });
    }


    componentDidMount() {
        this.mapElement();
    }

    render() {   
        var textAlignEnd = {
            textAlign: 'right'
        };
       

        return (
            <div className="col-tp_element">
                <Row>
                    <Col span={24}>
                        <div class="holder">
                            <span className="dayspan">день</span>
                            <p className="dayname">{this.state.day}</p>
                            <div class="block">  
                                <Row>
                                    <Col span={20}>
                                        <h2>{this.state.name}</h2>
                                    </Col>
                                    <Col span={4}>
                                        <div style={textAlignEnd}>
                                            <Link to={'/trainingprogram/view/'+this.state.id}><Button><Icon type="info" /></Button></Link>
                                        </div>
                                    </Col>
                                </Row>                            
                                <p className="clip">{this.state.description}</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}


export default withRouter(DWElement);

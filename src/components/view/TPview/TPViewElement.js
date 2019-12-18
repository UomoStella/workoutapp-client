import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { Button, Row, Col, Icon } from 'antd';
import ExcersicesLogo from '../../../resources/excersices.jpg';
import './TPViewElement.css';

class TPViewElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : '',
            name: '', 
            durationDays: '', 
            base64Image: '',
            username: '', 
            genderName: '', 

            isLoading: false
        }

        this.mapElement = this.mapElement.bind(this);
    }

    mapElement(){
        this.setState({
            id : this.props.id,
            name: this.props.name, 
            durationDays: this.props.durationDays, 
            base64Image: this.props.base64Image,
            username: this.props.username, 
            genderName: this.props.genderName, 

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

        const imageBase64 = "data:image/png;base64, "+ this.state.base64Image;

        const valueGender = [];
        let gender = 'GENDER';
        if(this.state.genderName == 'MALE')
            valueGender.push(<Icon type="man" />);
        else if(this.state.genderName == 'FEMALE')
            valueGender.push(<Icon type="woman" />);
        else
            valueGender.push(<Icon type="key" />);
        

        return (
            <div className="col-tp_element">
                <Row>
                    <Col className="col-img-tp_element" span={24}>
                    <Link to={"/dailyworkout/viewall/"+this.state.id}>
                            <div className="div-image">
                                {this.state.base64Image.length != 0 ?
                                    <img src={imageBase64} height="280" alt="Red dot" />
                                    :
                                    <img src={ExcersicesLogo} height="280" alt="Red dot" />
                                }
                                <span>{this.state.name}</span>
                            </div>
                        </Link>
                    </Col>
                    <Col className="col-info-tp_element" span={24}>
                        <table>
                            <thead>
                                <tr>
                                    <th>пол</th>
                                    <th>дней</th>
                                    <th>составил</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{valueGender}</td>
                                    <td>{this.state.durationDays}</td>
                                    <td>{this.state.username}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </div>
        );
    }
}


export default withRouter(TPViewElement);

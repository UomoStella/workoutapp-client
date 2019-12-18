import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { Button, Row, Col, Icon } from 'antd';
import ExcersicesLogo from '../../../resources/excersices.jpg';
import './TPPElement.css';

class TPPElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            tpId: '',
            tpName: '',
            tpBase64Image: '',
            dwId: '', 
            dwuId: '',
            dwName: '',
            dwDescription: '',
            dwDay: '',
            isEdit: true,
            
            isLoading: false
        }

        this.mapElement = this.mapElement.bind(this);
    }

    mapElement(){
        let isEdit = true;
        if(this.props.isEdit)
            isEdit = this.props.isEdit;

        this.setState({
            id: this.props.id, 
            dwuId: this.props.dwuId, 
            tpId: this.props.tpId,
            tpName: this.props.tpName,
            tpBase64Image: this.props.tpBase64Image,
            dwId: this.props.dwResponse.id,
            dwName: this.props.dwResponse.name,
            dwDescription: this.props.dwResponse.description,
            dwDay: this.props.dwResponse.day,
            isEdit: isEdit,
            isDone: this.props.isDone,
            dateUpdate: this.props.dateUpdate,
            viewid: this.props.viewid,


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
       
        const imageBase64 = "data:image/png;base64, "+ this.state.tpBase64Image;

        return (
            <div className="col-tp_element">
                <Row>
                    <Col span={24}>
                        <div class="holder">
                            <div className="div-image">
                                {this.state.tpBase64Image.length != 0 ?
                                    <img src={imageBase64} alt="Red dot" />
                                    :
                                    <img src={ExcersicesLogo}  alt="Red dot" />
                                }
                                <span>{this.state.tpName}</span>
                            </div>
                            <div class="block">  
                                {this.state.isDone ?
                                <Row>
                                    <Col span={18}>
                                        <h3>Последнее обновление: {this.state.dateUpdate} </h3>
                                    </Col>
                                    <Col span={6}>
                                        {this.state.dwId != null ?
                                        <div style={textAlignEnd}>
                                            <Link to={'/performance/dwu/'+this.state.dwuId + (this.state.viewid != null ? '/'+this.state.viewid : '')}><Button><Icon type="info" /></Button></Link>
                                        </div>
                                        : null}
                                    </Col>
                                </Row>
                                :
                                <div>
                                    <Row>
                                        <Col span={16}>
                                            <h2>{this.state.dwName}</h2>
                                        </Col>
                                        {this.state.isEdit ?
                                        <Col span={8}>
                                            <div style={textAlignEnd}>
                                                {this.state.dwuId != null ?
                                                <Link to={'/performance/dwu/'+this.state.dwuId + (this.state.viewid != null ? '/'+this.state.viewid : '')}><Button><Icon type="fire" /></Button></Link>
                                                : null}
                                                {this.state.dwId != null ?
                                                <Link to={'/trainingprogram/view/'+this.state.dwId}><Button><Icon type="info" /></Button></Link>
                                                : null}
                                                
                                            </div>
                                        </Col>
                                        : null}
                                    </Row>         
                                    <span className="dayName">{this.state.dwDay} день</span>
                                    <p className="clip">{this.state.dwDescription}</p>
                                </div>
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}


export default withRouter(TPPElement);

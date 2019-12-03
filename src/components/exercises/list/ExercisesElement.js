import React, { Component } from 'react';
import { TrainingService } from '../../../service/TrainingService';
import { FileService } from '../../../service/FileService';
import {withRouter, Link } from 'react-router-dom';
import { notification,  Button, Row, Col, Tabs, Icon } from 'antd';
import LoadingIndicator from '../../LoadingIndicator';
import ExcersicesLogo from '../../../resources/excersices.png';

class ExercisesElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
            name: this.props.name,
            subtypeTrainingName: this.props.subtypeTrainingName,
            muscleGroupsValue: this.props.muscleGroupsValue,
            imageBase64: this.props.imageBase64,

            isLoading: false
        }
    }

    render() {   
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }

        var textAlignEnd = {
            textAlign: 'right'
        };

        var myStyle = {
            maxHeight: '200px',
            width: '100%'
        };

        const imageBase64 = "data:image/png;base64, "+ this.state.imageBase64;
        const linkButton = "/exercises/media/" + this.state.id;
        return (
                <Row style={{border: '1px solid #000'}}>
                    <Col span={24}>
                    <Row>
                        <Col span={24}>
                            {!this.state.imageBase64.length == 0 ?
                                <img src={imageBase64} style={myStyle} alt="Red dot" />
                                :
                                <img src={ExcersicesLogo} style={myStyle} alt="Red dot" />
                            }
                        </Col>
                    
                    </Row>

                    <Row>
                        <Col span={24}>
                            <p>{this.state.name}</p>
                            <p>{this.state.subtypeTrainingName}</p>
                            <p>{this.state.muscleGroupsValue}</p>
                        </Col>
                        <Col span={24}>
                            {this.state.id != null ?
                                <div style={textAlignEnd}>
                                    <Button><Link to={linkButton}><Icon type="edit" /></Link></Button> 
                                    <Button><Link to={linkButton}><Icon type="delete" /></Link></Button> 
                                </div>
                            : null
                            }
                        </Col>
                        
                    </Row>
                    </Col>
                </Row>
        );
    }
}

// function showDeleteConfirm() {
//     confirm({
//       title: 'Вы уверены что хотите удалить упражнение?',
//       content: 'Данное упражнение невозможно будет восстановить.',
//       okText: 'Да',
//       okType: 'danger',
//       cancelText: 'Нет',
//       onOk() {
//         console.log('OK');
//       },
//       onCancel() {
//         console.log('Cancel');
//       },
//     });
//   }


export default withRouter(ExercisesElement);

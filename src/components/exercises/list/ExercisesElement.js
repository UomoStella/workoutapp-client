import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { Button, Row, Col, Modal, Icon } from 'antd';
import LoadingIndicator from '../../LoadingIndicator';
import ExcersicesLogo from '../../../resources/excersices.jpg';

const {confirm} = Modal;

class ExercisesElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
            name: this.props.name,
            subtypeTrainingName: this.props.subtypeTrainingName,
            muscleGroupsNameSet: this.props.muscleGroupsNameSet,
            imageBase64: this.props.imageBase64,

            isLoading: false
        }
        
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }
    
    showDeleteConfirm() {
        const id = this.state.id;
    
        const thisPrev = this;

        confirm({
            title: 'Вы уверены что хотите удалить упражнение?',
            content: 'Данное упражнение невозможно будет восстановить.',
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                thisPrev.props.exercisesDelete(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });

      };


    render() {   
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }

        var textAlignEnd = {
            textAlign: 'right'
        };


        const imageBase64 = "data:image/png;base64, "+ this.state.imageBase64;
        const linkButton = "/exercises/media/" + this.state.id;

        const muscleGroupsNameList = [];
        this.state.muscleGroupsNameSet.forEach((muscleGroup, index) => { 
            muscleGroupsNameList.push(<li> {muscleGroup} </li>);
        });


        return (
            <div className="col-exercises_element">
                <Row>
                    <Col span={24}>
                    <Row>
                        <Col className="col-img-exercises_element" span={24}>
                            {!this.state.imageBase64.length == 0 ?
                                <img src={imageBase64}  alt="Red dot" />
                                :
                                <img src={ExcersicesLogo} alt="Red dot" />
                            }
                        </Col>
                    
                    </Row>

                    <Row className="col-value-exercises_element">
                        <Col span={24}>
                            <p className="p-name">{this.state.name}</p>
                            <p>{this.state.subtypeTrainingName}</p>
                            <ul>{muscleGroupsNameList}</ul>
                        </Col>
                    </Row>
                    </Col>
                </Row>
                <Row className="col-btn-exercises_element">
                    <Col span={24}>
                        {this.state.id != null ?
                            <div style={textAlignEnd}>
                                <Link to={linkButton}>
                                    <Button title="Редактировать" className="btn-edit" type="primary" icon="edit">Изменить</Button> 
                                </Link>
                                <Button title="Удалить" className="btn-delete"  onClick={this.showDeleteConfirm} icon="delete">Удалить</Button> 
                            </div>
                        : null
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}


export default withRouter(ExercisesElement);

import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';
import { Button, Row, Col, Modal } from 'antd';
import LoadingIndicator from '../LoadingIndicator';
import ExcersicesLogo from '../../resources/excersices.png';

const {confirm} = Modal;

class ListElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
            imageBase64: this.props.imageBase64,

            isLoading: false
        }
        
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
        this.redirectElement = this.redirectElement.bind(this);
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
                thisPrev.props.handleDelete(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });

      };

    redirectElement(){
        this.props.handleEdit(this.state.id);
    }

    render() {   
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }

        var textAlignEnd = {
            textAlign: 'right'
        };

        const imageBase64 = "data:image/png;base64, "+ this.state.imageBase64;
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
                    {this.props.additionInfo.length != 0 ?
                        <Row className="col-value-exercises_element">
                            <Col span={24}>
                                {this.props.additionInfo}
                            </Col>
                        </Row>
                        :
                        null
                    }
                    </Col>
                </Row>
                <Row className="col-btn-exercises_element">
                    <Col span={24}>
                        {this.state.id != null ?
                            <div style={textAlignEnd}>
                                <Button title="Редактировать" className="btn-edit" type="primary" icon="edit" onClick={this.redirectElement}>Изменить</Button> 
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


export default withRouter(ListElement);

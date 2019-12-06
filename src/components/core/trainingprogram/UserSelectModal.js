import React, { Component } from 'react';
import { Button, Select , notification,Modal, Row, Col } from 'antd';
import { getAllUserByUsername } from '../../../until/APIUtils';
import { TrainingProgramService } from '../../../service/TrainingProgramService';


const { Option } = Select;

let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {

    if(value == undefined || value.lenght == 0)
        return;

    getAllUserByUsername(value)
    .then(response => {
        const data = [];
        response.containerList.forEach(r => {
          data.push({
            value: r.username,
            text: r.username,
          });
        });
        callback(data);
    }).catch(error => {
        if(error.status === 401) {
            notification.error({
                message: 'Ошибка',
                description: 'Ошибка поиска!'
            });                    
        } else {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините произошла ошибка. Пожалуйста, попробуйте еще раз!'
            });                                            
        }
    });
  }

  timeout = setTimeout(fake, 500);
}


class UserSelectModal extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            data: [],
            trainingProgramId: this.props.trainingProgramId,
            value: undefined,
        }
        this.trainingProgramService = new TrainingProgramService();
        this.saveUser = this.saveUser.bind(this);
    }

    handleSearch = value => {
        if (value) {
          fetch(value, data => this.setState({ data }));
        } else {
          this.setState({ data: [] });
        }
      };
    
      handleChange = value => {
        this.setState({ value });
      };


      saveUser(){
        this.props.saveUser(this.state.value);
      }

    render() {   
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
        return (
                <Row>
                    <Col span={20}>
                        <Select  showSearch style={{width: '100%'}}
                            value={this.state.value}
                            placeholder={this.props.placeholder}
                            style={this.props.style}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onSearch={this.handleSearch}
                            onChange={this.handleChange}
                            notFoundContent={null}>
                            {options}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Button style={{width: '100%'}} type="primary" onClick={this.saveUser}>Сохранить</Button>
                    </Col>
                </Row>

        );
    }
}



export default UserSelectModal;

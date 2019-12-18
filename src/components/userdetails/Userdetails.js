import React, { Component } from 'react';
import { FileService } from '../../service/FileService';
import { getUserDetails } from '../../until/APIUtils';
import {UserService} from '../../service/UserService';
import { Button, Radio, Form, Input, Row, Col, Breadcrumb, notification, Drawer  } from 'antd';
import './Userdetails.css';
import { Link } from 'react-router-dom';

import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import { ACCESS_TOKEN } from '../../constants';

const FormItem = Form.Item;

class Userdetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            currentUser: this.props.currentUser
        }

        this.showDrawer = this.showDrawer.bind(this);
    }

    showDrawer = () => {
        console.log(this.props.currentUser);
        this.setState({
          visible: true,
        });
      };
    
    onCloseDrawer = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const AntPasswordForm =  Form.create()(PasswordForm);
        const AntWrappedLoginForm = Form.create()(UserdetailsForm);
        
        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        {this.state.currentUser ?
                        <Breadcrumb.Item><Link to={'/users/'+this.state.currentUser.username}>Профиль</Link></Breadcrumb.Item>
                        : null}
                        <Breadcrumb.Item><Link to={'/user/details'}>Редактирование</Link></Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <Row gutter={[16, 16]}>
                        <Col span={20}>
                            {this.state.currentUser ?
                            <h2>@{this.state.currentUser.username}</h2>
                            : null}
                        </Col>
                        <Col span={4}>
                            <div style={{textAlign: 'right'}}>
                                <Button onClick={this.showDrawer}>Сменить пароль</Button>
                            </div>
                        </Col>
                    </Row>
                    <AntWrappedLoginForm handleMessage={this.props.handleMessage} handleLogout={this.props.handleLogout}/>
                    <Drawer title="Смена пароля"
                        placement="left" onClose={this.onCloseDrawer} visible={this.state.visible}>
                            <AntPasswordForm />
                    </Drawer>
                </div>
            </div>
        );
    }
}

class UserdetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            middleName: '',
            gender: '',
            height: '',
            weight: '',
            base64image: '',
            image: [],
            name: '',
            username: '',
            email: '',
            selectedFile: null, 
            isAuthorization: false,

            isLoading: false,
            serverError: false,
            notFound: false,
        }
    
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.fileService = new FileService();
    }


    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(this.state.selectedFile);
                const userDetails = Object.assign({}, values);
                const userDetailsRequest = {
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    middleName: userDetails.middleName,
                    gender: userDetails.gender,
                    height: userDetails.height,
                    weight: userDetails.weight,
                    name: userDetails.name
                };
            
                this.fileService.uploadUserDetailsToServer(userDetailsRequest).then(response => {
                
                    this.props.handleMessage(
                        '/users/'+ this.state.username, 
                        'success', 
                        'Данные успешно сохранены'
                    );
                }).catch(error => {
                    notification.error({
                        message: 'Polling App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                });    
            }
        });
    }

    loadUserProfile() {
        this.setState({
            isLoading: true

        });
        getUserDetails().then(response => {
            this.setState({
                firstName: response.firstName,
                lastName: response.lastName,
                middleName: response.middleName,
                gender: response.gender,
                height: response.height,
                weight: response.weight,
                base64image: response.base64image,
                name: response.name,
                username: response.username,
                email: response.email, 

                isLoading: false,
                notFound: false, 
                serverError: false
            })
        }).catch(error => {               
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
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        this.loadUserProfile();
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

        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('name', {
                        initialValue: this.state.name
                    })(
                        <Input size="large" placeholder="Наименование"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('lastName', {
                        initialValue: this.state.lastName
                    })(
                        <Input size="large" placeholder="Фамилия"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('firstName', {
                        initialValue: this.state.firstName
                    })(
                        <Input size="large" placeholder="Имя"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('middleName', {
                        initialValue: this.state.middleName
                    })(
                        <Input size="large" placeholder="Отчество"/>
                    )}
                </FormItem>

                <Form.Item label="Пол:">
                    {getFieldDecorator('gender', {
                        initialValue: this.state.gender
                    })(
                        <Radio.Group>
                            <Radio value="MALE">Мужской</Radio>
                            <Radio value="FEMALE">Женский</Radio>
                        </Radio.Group>,
                    )}
                </Form.Item>

                <FormItem>
                    {getFieldDecorator('height', {
                        initialValue: this.state.height
                    })(
                        <Input size="large" placeholder="Рост"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('weight', {
                        initialValue: this.state.weight
                    })(
                        <Input size="large" placeholder="Вес"/>
                    )}
                </FormItem>
        
                <FormItem>
                    <Button icon="save" type="primary" htmlType="submit" size="large">Сохранить</Button>
                </FormItem>
            </Form>
        );

    }
}


class PasswordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordOld: '',
            passwordNew: '',
            passwordNew2: '',
        }
    
        this.handleSubmit = this.handleSubmit.bind(this);

        this.userService = new UserService();
    }


    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const passwordRequest = Object.assign({}, values);
                if(passwordRequest.passwordNew == passwordRequest.passwordNew2){
                    this.userService.postChangePassword(JSON.stringify(passwordRequest)).then(response => {
                        notification.success({
                            message: 'Сообщение',
                            description: 'Пароль успешно изменен!'
                        });
                    }).catch(error => {
                        notification.error({
                            message: 'Ошибка',
                            description: 'Извините произошла ошибка изменения пароля!!'
                        });
                    });    
                }else{
                    notification.error({
                        message: 'Ошибка',
                        description: 'Пароли не совпадают!!'
                    });
                }
            }
        });
    }


    componentDidMount() {}

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('passwordOld', {
                        initialValue: this.state.passwordOld,
                        rules: [{ required: true,  message: 'Введите старый пароль' }],
                    })(
                        <Input.Password placeholder="Старый пароль"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('passwordNew', {
                        initialValue: this.state.passwordNew,
                        rules: [{ required: true,  message: 'Введите новый пароль' }],
                    })(
                        <Input.Password placeholder="Новый пароль"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('passwordNew2', {
                        initialValue: this.state.passwordNew2,
                        rules: [{ required: true,  message: 'Введите новый пароль повторно' }],
                    })(
                        <Input.Password placeholder="Повторите пароль"/>
                    )}
                </FormItem>

                <FormItem>
                    <Button htmlType="submit">Изменить</Button>
                </FormItem>
            </Form>
        );

    }
}


export default Userdetails;

import React, { Component } from 'react';
import { login } from '../../until/APIUtils';
import './Login.css';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';

import { Form, Input, Button, Icon, notification } from 'antd';
const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="content-div">
                <div className="login-container">
                    <h1 className="page-title">Вход в систему</h1>
                    <div className="login-content">
                        <AntWrappedLoginForm handleMessage={this.props.handleMessage} onLogin={this.props.onLogin} />
                    </div>
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log(localStorage.getItem(ACCESS_TOKEN));
        if(localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleMessage('/', 'error', 'Пользователь уже авторизован.'); 
        }
    }

    handleSubmit(event) {
        event.preventDefault();   

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                .then(response => {
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    this.props.onLogin();
                }).catch(error => {
                    if(error.status === 401) {
                        notification.error({
                            message: 'Polling App',
                            description: 'Лоигн или пароль введены неверно. Пожалуйста, попробуйте еще раз!'
                        });                    
                    } else {
                        notification.error({
                            message: 'Polling App',
                            description: error.message || 'Извините произошла ошибка. Пожалуйста, попробуйте еще раз!'
                        });                                            
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('usernameOrEmail', {
                        rules: [{ required: true, message: 'Вожалуйста введите логин или email!' }],
                    })(
                    <Input 
                        prefix={<Icon type="user" />}
                        size="large"
                        name="usernameOrEmail" 
                        placeholder="Логин или Email" />    
                    )}
                </FormItem>
                <FormItem>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Пожалуйста введите пароль!' }],
                })(
                    <Input 
                        prefix={<Icon type="lock" />}
                        size="large"
                        name="password" 
                        type="password" 
                        placeholder="Пароль"  />                        
                )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Войти</Button>
                    Или <Link to="/signup">зарегестрироваться!</Link>
                </FormItem>
            </Form>
        );
    }
}


export default Login;
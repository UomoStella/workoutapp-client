import React, { Component } from 'react';
import { ForumService } from '../../service/ForumService';
import { Button, Select, Form, Input, Breadcrumb, notification , Switch } from 'antd';
import { ACCESS_TOKEN } from '../../constants';
import {withRouter, Link } from 'react-router-dom';

import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';


const FormItem = Form.Item;
const { TextArea } = Input;

class ForumThemeEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const themeId = this.props.match.params.themeId; 
        const AntWrappedLoginForm = Form.create()(ForumThemeEditForm)

        const breadcrumb = [];

        breadcrumb.push(<Breadcrumb.Item><Link to={'/forum/themes'}>Форум</Link></Breadcrumb.Item>);
        if(themeId == null){
            breadcrumb.push(<Breadcrumb.Item><Link to={'/forum/theme/edit/'}>Добавление темы</Link></Breadcrumb.Item>);
        }else{
            breadcrumb.push(<Breadcrumb.Item><Link to={'/forum/theme/edit/'+themeId}>Редактирование темы</Link></Breadcrumb.Item>);
        }
        
        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        {breadcrumb}
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <AntWrappedLoginForm handleLogout={this.props.handleLogout} handleMessage={this.props.handleMessage} themeId={themeId}  />
                </div>
            </div>
        );
    }
}

class ForumThemeEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            userName: '',
            dateCreate: '',
            dateUpdate: '',
            user: '',

            isLoading: true,
            serverError: false,
            notFound: false,
        }

        this.funcForumThemeCreate = this.funcForumThemeCreate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.forumService = new ForumService();
    }



    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const theams = Object.assign({}, values);

                const theamsRequest = {
                    id : this.state.id,
                    name: theams.name,
                    description: theams.description,
                };
            
                this.forumService.postTheamEditSave(theamsRequest)
                .then(response => {
                    const theamsid = response.data;
                    this.props.handleMessage('/forum/theme/'+ theamsid, 'success', 'Данные успешно сохранены');
                }).catch(error => {
                    notification.error({
                        message: 'Polling App',
                        description: error.message || 'Извините. Произошла ошибка сохранения!'
                    });
                });    
            }
        });
    }
      

    funcForumThemeCreate(themeId){
        this.setState({
            isLoading: true,
        });

        this.forumService.getTheamById(themeId)
        .then(response => {
            this.setState({
                id : themeId,
                name: response.data.name,
                description: response.data.description,
                userName: response.data.userName,
                dateCreate: response.data.dateCreate,
                dateUpdate: response.data.dateUpdate,
                user: response.data.user,

                isLoading : false
            });
        }).catch(error => {
            notification.error({
                message: 'Polling App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
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


    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        const themeId = this.props.themeId;
        this.funcForumThemeCreate(themeId);
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
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator('name', {
                            initialValue: this.state.name,
                            rules: [{ required: true,  message: 'Введите наименование темы' }],
                        })(
                        <Input
                            size="large"
                            placeholder="Наименование темы"/>
                        )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator('description', {
                            initialValue: this.state.description
                        })(
                        <TextArea
                            rows={4}
                            size="large"
                            placeholder="Описание темы"/>
                        )}
                    </FormItem>
                    
                    <FormItem>
                        <Button icon="save" type="primary" htmlType="submit" size="large">Сохранить</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}


export default ForumThemeEdit;

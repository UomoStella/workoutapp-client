import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';

import { RecipeService } from '../../../service/RecipeService';
import { Button, Select, Form, Input,  Breadcrumb, notification } from 'antd';
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import { ACCESS_TOKEN } from '../../../constants';

const FormItem = Form.Item;
const { TextArea } = Input;

class RationDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const rationDayId = this.props.match.params.rationDayId; 

        const AntWrappedLoginForm = Form.create()(RationDetailsForm)
        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/ration/all'}>Список дневных рационов</Link></Breadcrumb.Item>
                        {rationDayId == null ?
                            <Breadcrumb.Item><Link to={'/ration/details/'}>Добавление дневного рациона</Link></Breadcrumb.Item>
                        :
                            [
                                <Breadcrumb.Item><Link to={'/ration/media/'+rationDayId}>Дневной рацион</Link></Breadcrumb.Item>,
                                <Breadcrumb.Item><Link to={'/ration/details/'+rationDayId}>Редактирование дневного рациона</Link></Breadcrumb.Item>
                            ]
                        }
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <AntWrappedLoginForm handleLogout={this.props.handleLogout} handleMessage={this.props.handleMessage} rationDayId={rationDayId}  />
                </div>
            </div>
        );
    }
}

class RationDetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : '',
            name: '',
            description: '',
         
            isLoading: true,
            serverError: false,
            notFound: false,
        }

    
        this.getContentView = this.getContentView.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.recipeService = new RecipeService();
    }



    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const rationDayObj = Object.assign({}, values);

                const rationDayRequest = {
                    id : this.state.id,
                    name: rationDayObj.name,
                    description: rationDayObj.description,
                };
            
                this.recipeService.postRationDayDetailsByRID(JSON.stringify(rationDayRequest))
                .then(response => {
                    const recipeId = response.data;
                    this.props.handleMessage('/ration/media/'+ recipeId, 'success', 'Данные успешно сохранены');
                }).catch(error => {
                    notification.error({
                        message: 'Polling App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                });    
            }
        });
    }
      

    getContentView(rationDayId){
        this.setState({
            isLoading: true,
        });

        this.recipeService.getRationDayDetailsByRID(rationDayId)
        .then(response => {
            this.setState({
                id : rationDayId,
                name: response.data.name,
                description: response.data.description,

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
        const rationDayId = this.props.rationDayId;
        this.getContentView(rationDayId);
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

                <FormItem hasFeedback>
                    {getFieldDecorator('name', {
                        initialValue: this.state.name,
                        rules: [{ required: true,  message: 'Заполните наименование' }],
                    })(
                    <Input
                        size="large"
                        placeholder="Наименование"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('description', {
                        initialValue: this.state.description
                    })(
                    <TextArea
                        rows={8}
                        size="large"
                        placeholder="Описание"/>
                    )}
                </FormItem>
                

                <FormItem>
                    <Button icon="save" type="primary" htmlType="submit" size="large">Сохранить</Button>
                </FormItem>
            </Form>
        );
    }
}



export default RationDetails;

import React, { Component } from 'react';
import {withRouter, Link } from 'react-router-dom';

import { RecipeService } from '../../../service/RecipeService';
import { Button, Select, Form, Input,  notification , Breadcrumb } from 'antd';
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';
import { ACCESS_TOKEN } from '../../../constants';

const FormItem = Form.Item;
const { TextArea } = Input;

class Recipe extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const recipeId = this.props.match.params.recipeId; 

        const AntWrappedLoginForm = Form.create()(RecipeForm)
        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to={'/recipe/all'}>Список рецептов</Link></Breadcrumb.Item>
                        {recipeId == null ?
                            <Breadcrumb.Item><Link to={'/recipe/details/'}>Добавление рецепта</Link></Breadcrumb.Item>
                        : 
                            [
                            <Breadcrumb.Item><Link to={'/recipe/media/'+recipeId}>Рецепт</Link></Breadcrumb.Item>,
                            <Breadcrumb.Item><Link to={'/recipe/details/'+recipeId}>Редактирование рецепта</Link></Breadcrumb.Item>
                            ]
                        }
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <AntWrappedLoginForm handleLogout={this.props.handleLogout} handleMessage={this.props.handleMessage} recipeId={recipeId}  />
                </div>
            </div>
        );
    }
}

class RecipeForm extends Component {
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
                const recipeObj = Object.assign({}, values);

                const exercisesRequest = {
                    id : this.state.id,
                    name: recipeObj.name,
                    description: recipeObj.description,
                };
            
                this.recipeService.postRecipeDetailsByRID(JSON.stringify(exercisesRequest))
                .then(response => {
                    const recipeId = response.data;
                    this.props.handleMessage('/recipe/media/'+ recipeId, 'success', 'Данные успешно сохранены');
                }).catch(error => {
                    notification.error({
                        message: 'Polling App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                });    
            }
        });
    }
      

    getContentView(recipeId){
        this.setState({
            isLoading: true,
        });

        this.recipeService.getRecipeDetailsByRID(recipeId)
        .then(response => {
            this.setState({
                id : recipeId,
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
        const recipeId = this.props.recipeId;
        this.getContentView(recipeId);
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
                        rows={12}
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



export default Recipe;

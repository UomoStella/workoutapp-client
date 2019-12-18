import React, { Component } from 'react';
import { Button, Select, Form, Input,  InputNumber  , message, notification , Switch } from 'antd';
import {RecipeService} from '../../../service/RecipeService'
//ERRORS
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';

const { Option } = Select;
const FormItem = Form.Item;


class RationEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const AntWrappedLoginForm = Form.create()(RationEditForm)
        return (
            <AntWrappedLoginForm getShortListView={this.props.getShortListView} 
                rationId={this.props.rationId} rationDayId={this.props.rationDayId}/>
        );
    }
}

class RationEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipesList: [],

            id: '',
            mealNumber: '',
            recipesId: '',
            rationDayId: '',
        }

        this.getRecipeShortList = this.getRecipeShortList.bind(this);
        this.getRationElement = this.getRationElement.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        
        this.recipeService = new RecipeService();
    }


    getRecipeShortList(){
        this.recipeService.getRecipeShortList().then(response => {
            this.setState({
                recipesList: response.data.containerList
            }); 
        }).catch(error => {
            this.setState({
                recipesList: []
            });
        });    
    }

    getRationElement(rationId, rationDayId){
        this.setState({
            isLoading: true,
        });

        this.recipeService.getRationElement(rationId).then(response => {
            this.setState({
                id: response.data.id,
                mealNumber: response.data.mealNumber,
                recipesId: (response.data.recipeResponse != null ? response.data.recipeResponse.id.toString() : null),
                rationDayId: rationDayId,

                isLoading : false
            }); 
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Пожалуйста попробуйте снова!'
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
    


    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const rationObj = Object.assign({}, values);

                const rationRequest = {
                    id: this.state.id,
                    mealNumber: rationObj.mealNumber,
                    recipesId: rationObj.recipesId,
                    rationDayId: this.state.rationDayId,
                };
            
                this.recipeService.postRationElement(JSON.stringify(rationRequest))
                .then(response => {
                    const id = response.data;
                    this.setState({
                        id: id
                    })
                    notification.success({
                        message: 'Сообщение',
                        description: 'Данные сохранены успешно!'
                    });
                    this.props.getShortListView();

                }).catch(error => {
                    notification.error({
                        message: 'Ошибка',
                        description: error.message || 'Извините! Что-то пошло не так. Пожалуйста попробуйте снова!'
                    });
                });    
            }
        });
    }


    componentDidMount() {
        const rationId = this.props.rationId;
        const rationDayId = this.props.rationDayId;
        
        this.getRationElement(rationId, rationDayId);
        this.getRecipeShortList();
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

                    {!this.state.recipesList.length == 0 ? 
                        <FormItem label="Рецепты" hasFeedback>
                            {getFieldDecorator('recipesId', {
                                initialValue: this.state.recipesId,
                                rules: [{ required: true,  message: 'Выберите рецепт' }],
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Выберите рецепт"
                                    optionFilterProp="children"
                                >
                                    {this.state.recipesList.map(recipe => (
                                        <Option key={recipe.id}>{recipe.name}</Option>
                                        ))} 
                                </Select>
                            )}
                        </FormItem>
                        : 
                        null
                    }

                    <FormItem label="Номер приема пищи" hasFeedback>
                        {getFieldDecorator('mealNumber', {
                            initialValue: this.state.mealNumber,
                        })(
                            <InputNumber placeholder="Номер по порядку" style={{width: '100%'}} min={0} />
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



export default RationEdit;

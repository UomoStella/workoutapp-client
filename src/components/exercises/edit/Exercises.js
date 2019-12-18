import React, { Component } from 'react';
import { TrainingService } from '../../../service/TrainingService';
import { Button, Select, Form, Input, Breadcrumb, notification , Switch } from 'antd';
import './Exercises.css';
import { ACCESS_TOKEN } from '../../../constants';
import {withRouter, Link } from 'react-router-dom';

import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

class Exercises extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const exercisesid = this.props.match.params.exercisesid; 
        const AntWrappedLoginForm = Form.create()(ExercisesForm)

        const breadcrumb = [];
        breadcrumb.push(<Breadcrumb.Item><Link to={'/exercises/all'}>Список упражнений</Link></Breadcrumb.Item>);

        if(exercisesid == null){
            breadcrumb.push(<Breadcrumb.Item><Link to={'/exercises/edit'}>Добавление упражнения</Link></Breadcrumb.Item>);
        }else{
            breadcrumb.push(<Breadcrumb.Item><Link to={'/exercises/media/'+exercisesid}>Упражнение</Link></Breadcrumb.Item>);
            breadcrumb.push(<Breadcrumb.Item><Link to={'/exercises/edit/'+exercisesid}>Редактирование упражнения</Link></Breadcrumb.Item>);
        }
        
        return (
            <div>
                <div className="breadcrumb-div">
                    <Breadcrumb>
                        {breadcrumb}
                    </Breadcrumb>
                </div>
                <div className="content-div">
                    <AntWrappedLoginForm handleLogout={this.props.handleLogout} handleMessage={this.props.handleMessage} exercisesId={exercisesid}  />
                </div>
            </div>
        );
    }
}

class ExercisesForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            muscleGroupsResponseList : [],
            typeTrainingResponseList : [],
            subtypeTrainingList: [],

            id : '',
            name: '',
            description: '',
            isPrivate: false,
            typeTrainingId: '',
            subtypeTrainingId: '',
            muscleGroups: [],
         
            isLoading: true,
            serverError: false,
            notFound: false,
        }

        this.funcCreateExercisesCreate = this.funcCreateExercisesCreate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeIsPrivate = this.changeIsPrivate.bind(this);
        this.handleProvinceChange = this.handleProvinceChange.bind(this);

        this.trainingService = new TrainingService();
    }

    changeIsPrivate = () => {
        this.setState(previousState => {
          return { 
              isPrivate: !previousState.isPrivate 
            };
        });
      };

    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const exercises = Object.assign({}, values);

                const exercisesRequest = {
                    id : this.state.id,
                    isPrivate: this.state.isPrivate,
                    name: exercises.name,
                    description: exercises.description,
                    typeTrainingId: exercises.typeTrainingId,
                    subtypeTrainingId: exercises.subtypeTrainingId,
                    muscleGroups: exercises.muscleGroups
                };
            
                this.trainingService.postCreateExercisesCreate(exercisesRequest)
                .then(response => {
                    const exercisesid = response.data;
                    this.props.handleMessage('/exercises/media/'+ exercisesid, 'success', 'Данные успешно сохранены');
                }).catch(error => {
                    notification.error({
                        message: 'Polling App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                });    
            }
        });
    }
      

    funcCreateExercisesCreate(exercisesId){
        this.setState({
            isLoading: true,
        });

        this.trainingService.getCreateExercisesCreate(exercisesId)
        .then(response => {
            if(response.data.exercisesResponse){
                this.setState({
                    id : exercisesId,
                    name: response.data.exercisesResponse.name,
                    description: response.data.exercisesResponse.description,
                    isPrivate: response.data.exercisesResponse.isPrivate,
                    typeTrainingId: response.data.exercisesResponse.typeTrainingId,
                    subtypeTrainingId: response.data.exercisesResponse.subtypeTrainingId,
                    muscleGroups: response.data.exercisesResponse.muscleGroups,
                    typeTrainingResponseList : response.data.typeTrainingResponseList, 
                    muscleGroupsResponseList : response.data.muscleGroupsResponseList, 
                    isLoading : false
                })        

                this.handleProvinceChange(response.data.exercisesResponse.typeTrainingId);
            }else{
                this.setState({
                    typeTrainingResponseList : response.data.typeTrainingResponseList, 
                    muscleGroupsResponseList : response.data.muscleGroupsResponseList, 
                    isLoading : false
                })  
            }
            
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

    handleProvinceChange = value => {
        if(value == undefined || value == null)
            return;

        this.trainingService.getSubtypeTrainingById(value)
        .then(response => {
            if(response.data.containerList)
                this.setState({
                    subtypeTrainingList : response.data.containerList
                })  
            else
                this.setState({
                    subtypeTrainingList :[]
                })
        }).catch(error => {
            this.setState({
                subtypeTrainingList : []
            })  
        });    
      };

    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        const exercisesId=  this.props.exercisesId;
        this.funcCreateExercisesCreate(exercisesId);
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

        const typeTrainingResponseViews = [];
        this.state.typeTrainingResponseList.forEach((type, typeIndex) => {
            typeTrainingResponseViews.push(<Option  key={type.id}>{type.name}</Option>);
          });

        const muscleGroupsResponseViews = [];
        this.state.muscleGroupsResponseList.forEach((type, typeIndex) => {
            muscleGroupsResponseViews.push(<Option key={type.id}>{type.name}</Option>);
        });
        

        return (
            <Form onSubmit={this.handleSubmit}>

                <FormItem>
                    {getFieldDecorator('name', {
                        initialValue: this.state.name
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
                        rows={4}
                        size="large"
                        placeholder="Описание"/>
                    )}
                </FormItem>
                <FormItem label="Приватность">
                        <Switch 
                            onChange={this.changeIsPrivate}
                            checked={this.state.isPrivate}
                            />
                </FormItem>

                <Form.Item label="Тип тренировки" hasFeedback>
                {getFieldDecorator('typeTrainingId', {
                    initialValue: this.state.typeTrainingId,
                    // rules: [{ required: true, whitespace: true, message: 'Выберите тип тренировки' }],
                })(
                    <Select placeholder="Выберите тип тренировки"
                        onChange={this.handleProvinceChange}>
                       {
                        !this.state.typeTrainingResponseList.length == 0 ? 
                            typeTrainingResponseViews 
                            : 
                            null
                        }
                        
                    </Select>,
                )}
                </Form.Item>
                <Form.Item label="Подтип тренировки" hasFeedback>
                {getFieldDecorator('subtypeTrainingId', {
                    initialValue: this.state.subtypeTrainingId,
                    // rules: [{ required: true,  message: 'Выберите подтип тренировки' }],
                })(
                    <Select placeholder="Выберите подтип тренировки">
                       {!this.state.subtypeTrainingList.length == 0 ? 
                            this.state.subtypeTrainingList.map(st => (
                                (this.state.subtypeTrainingId == st.id ?
                                    <Option defaultValue key={st.id}>{st.name}</Option>
                                    :
                                    <Option key={st.id}>{st.name}</Option>
                                ))
                                
                            ): null
                        }     
                    </Select>,
                )}
                </Form.Item>
                <Form.Item label="Воздействие на группу мышц" hasFeedback>
                {getFieldDecorator('muscleGroups', {
                    initialValue: this.state.muscleGroups
                })(
                <Select
                    mode="multiple"
                    placeholder="Выберите группу мышц">
                       {
                        !this.state.muscleGroupsResponseList.length == 0 ? 
                            muscleGroupsResponseViews 
                            : 
                            null
                        }
                </Select>
                )}
                </Form.Item>

                <FormItem>
                    <Button icon="save" type="primary" htmlType="submit" size="large">Сохранить</Button>
                </FormItem>
            </Form>
        );
    }
}



export default Exercises;

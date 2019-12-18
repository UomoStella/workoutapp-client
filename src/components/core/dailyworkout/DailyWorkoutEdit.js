import React, { Component } from 'react';
import { Button, Select, Form, Input,  Typography , message, notification , Switch } from 'antd';
import {DailyWorkoutService} from '../../../service/DailyWorkoutService';
import {RecipeService} from '../../../service/RecipeService';
import { ACCESS_TOKEN } from '../../../constants';
//ERRORS
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Title } = Typography;

class DailyWorkoutEdit extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const trainingProgramId = this.props.match.params.trainingProgramId; 
        const id = this.props.match.params.id; 
        const day = this.props.match.params.day; 

        const AntWrappedLoginForm = Form.create()(DailyWorkoutEditForm)
        return (
            <AntWrappedLoginForm handleLogout={this.props.handleLogout} 
                handleMessage={this.props.handleMessage} 
                trainingProgramId={trainingProgramId} id={id} day={day}  />
        );
    }
}

class DailyWorkoutEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            day: '',
            trainingProgramId: '',
            trainingProgramName: '',
            rationDayId: '',

            rationDayList: [],

            isLoading: true,
            serverError: false,
            notFound: false,
        }

    
        this.getDailyWorkout = this.getDailyWorkout.bind(this);
        this.getRationDayList = this.getRationDayList.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.recipeService = new RecipeService();

        this.dailyWorkoutService = new DailyWorkoutService();
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const dailyWorkout = Object.assign({}, values);

                const dailyWorkoutRequest = {
                    id : this.state.id,
                    name: dailyWorkout.name,
                    description: dailyWorkout.description,
                    day: this.state.day,
                    trainingProgramId: this.state.trainingProgramId,
                    rationDayId: dailyWorkout.rationDayId
                };
            
                this.dailyWorkoutService.postDailyWorkout(JSON.stringify(dailyWorkoutRequest))
                .then(response => {
                    const id = response.data;
                    this.props.handleMessage('/workout/details/edit/'+ this.state.trainingProgramId +'/'+this.state.day, 'success', 'Данные успешно сохранены');
                }).catch(error => {
                    notification.error({
                        message: 'Ошибка',
                        description: error.message || 'Извините! Что-то пошло не так. Пожалуйста попробуйте снова!'
                    });
                });    
            }
        });
    }

    getDailyWorkout(id, trainingProgramId, day){
        this.setState({
            isLoading: true,
        });

        this.dailyWorkoutService.getDailyWorkoutByIdAndTrainingProgramIdAndDay(id, trainingProgramId, day)
        .then(response => {
            const dailyWorkout = response.data;
    
            this.setState({
                id: dailyWorkout.id,
                name: dailyWorkout.name,
                description: dailyWorkout.description,
                day: dailyWorkout.day,
                trainingProgramId: dailyWorkout.trainingProgramId,
                trainingProgramName: dailyWorkout.trainingProgramName,
                rationDayId: dailyWorkout.rationDayId != null ? dailyWorkout.rationDayId.toString() : '',

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

    getRationDayList(id, trainingProgramId, day){
        this.recipeService.getRationDayListByUser()
        .then(response => {
            this.setState({
                rationDayList: response.data.containerList
            });    
        }).catch(error => {});    
    }
    

    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }

        const trainingProgramId = this.props.trainingProgramId;
        const id = this.props.id;
        const day = this.props.day;


        this.getDailyWorkout(id, trainingProgramId, day);
        this.getRationDayList();
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
                    <Title level={2}>Программа тренировок: {this.state.trainingProgramName} (дунь {this.state.day})</Title>
                    <FormItem label="Наименование" hasFeedback>
                        {getFieldDecorator('name', {
                            initialValue: this.state.name,
                            rules: [{ required: true,  message: 'Введите наименование' }],
                        })(
                        <Input
                            size="large"
                            placeholder="Наименование"/>
                        )}
                    </FormItem>

                    {!this.state.rationDayList.length == 0 ? 
                        <FormItem label="Рацион">
                            {getFieldDecorator('rationDayId', {
                                initialValue: this.state.rationDayId
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Выберите дневной рацион"
                                    optionFilterProp="children"
                                >
                                    {this.state.rationDayList.map(rationDay => (
                                        <Option key={rationDay.id}>{rationDay.name}</Option>
                                        ))} 
                                </Select>
                            )}
                        </FormItem>
                        : 
                        null
                    }

                    <FormItem label="Описание">
                        {getFieldDecorator('description', {
                            initialValue: this.state.description
                        })(
                        <TextArea
                            rows={4}
                            size="large"
                            placeholder="Описание"/>
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



export default DailyWorkoutEdit;

import React, { Component } from 'react';
import { Button, Select, Form, Input,  InputNumber  , message, notification , Switch } from 'antd';
import {TrainingDescriptionService} from '../../../service/TrainingDescriptionService'
import { ACCESS_TOKEN } from '../../../constants';
//ERRORS
import ServerError  from '../../../error/ServerError';
import LoadingIndicator from '../../LoadingIndicator';
import NotFound from '../../../error/NotFound';

const { Option } = Select;
const FormItem = Form.Item;


class TrainingDescriptionEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const TDId = this.props.TDId; 
        const dailyid = this.props.dailyid; 

        const AntWrappedLoginForm = Form.create()(TrainingDescriptionEditForm)
        return (
            <AntWrappedLoginForm getExercisesAllBydailyid={this.props.getExercisesAllBydailyid} 
                TDId={TDId} dailyid={dailyid} />
        );
    }
}

class TrainingDescriptionEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            leadTime: 0,
            extraWeight: 0,
            numberRepetitions: '',
            dailyWorkoutId: '',
            exerciseId: '',
            exercises: [],

            // private Long id;
            // private Integer numberRepetitions;
            // private Float leadTime;
            // private Float extraWeight;
            // private Long orderExercises;
            // private Long dailyWorkoutId;
            // private Long exerciseId;


            isLoading: true,
            serverError: false,
            notFound: false,
        }

    
        this.getTrainingDescriptionList = this.getTrainingDescriptionList.bind(this);
        this.getExercisesAllList = this.getExercisesAllList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


        this.trainingDescriptionService = new TrainingDescriptionService();
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const trainingDescription = Object.assign({}, values);

                const trainingDescriptionRequest = {
                    id: this.state.id,
                    leadTime: trainingDescription.leadTime,
                    extraWeight: trainingDescription.extraWeight,
                    numberRepetitions: trainingDescription.numberRepetitions,
                    dailyWorkoutId: this.state.dailyWorkoutId,
                    exerciseId: trainingDescription.exerciseId,
                };
            
                this.trainingDescriptionService.postTrainingDescriptionList(JSON.stringify(trainingDescriptionRequest))
                .then(response => {
                    const id = response.data;
                    this.setState({
                        id: id
                    })
                    notification.success({
                        message: 'Сообщение',
                        description: 'Данные сохранены успешно!'
                    });
                    this.props.getExercisesAllBydailyid();

                }).catch(error => {
                    notification.error({
                        message: 'Ошибка',
                        description: error.message || 'Извините! Что-то пошло не так. Пожалуйста попробуйте снова!'
                    });
                });    
            }
        });
    }


    getExercisesAllList() {
        this.trainingDescriptionService.getExercisesAllList()
        .then(response => {
            const exercises = response.data;
    
            this.setState({
                exercises: exercises.containerList 
            });    
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Пожалуйста попробуйте снова!'
            });
        });    
    }

    getTrainingDescriptionList(TDId, dailyid) {
        this.setState({
            isLoading: true,
        });

        this.trainingDescriptionService.getTrainingDescriptionList(TDId, dailyid)
        .then(response => {
            const trainingDescription = response.data;
            
            this.setState({
                id: TDId,
                leadTime: trainingDescription.leadTime,
                extraWeight: trainingDescription.extraWeight,
                numberRepetitions: trainingDescription.numberRepetitions,
                dailyWorkoutId: dailyid,
                exerciseId: trainingDescription.exerciseId,

                isLoading : false
            });    
            
            this.getExercisesAllList();
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

    componentDidMount() {
        const dailyid = this.props.dailyid;
        const TDId = this.props.TDId;

        this.getTrainingDescriptionList(TDId, dailyid);
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
                    <FormItem label="Время выполнения, секунды" hasFeedback>
                        {getFieldDecorator('leadTime', {
                            initialValue: this.state.leadTime,
                        })(
                            <InputNumber placeholder="Время выполнения, секунды" style={{width: '100%'}} min={0} />
                        )}
                    </FormItem>

                    <FormItem label="Дополнительный вес, кг">
                        {getFieldDecorator('extraWeight', {
                            initialValue: this.state.extraWeight,
                        })(
                            <InputNumber placeholder="Дополнительный вес, кг" style={{width: '100%'}} min={0} />
                        )}
                    </FormItem>

                    <FormItem label="Количество повторений">
                        {getFieldDecorator('numberRepetitions', {
                            initialValue: this.state.numberRepetitions,
                        })(
                            <InputNumber placeholder="Количество повторений" style={{width: '100%'}} min={0} />
                        )}
                    </FormItem>

                    {!this.state.exercises.length == 0 ? 
                        <FormItem label="Упражнение" hasFeedback>
                            {getFieldDecorator('exerciseId', {
                                initialValue: this.state.exerciseId,
                                rules: [{ required: true,  message: 'Выберите упражнение' }],
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Выберите упражнение"
                                    optionFilterProp="children"
                                >
                                    {this.state.exercises.map(exercise => (
                                        <Option key={exercise.id}>{exercise.name} ({exercise.username})</Option>
                                        ))} 
                                </Select>
                            )}
                        </FormItem>
                        : 
                        null
                    }

                
                    

                    <FormItem>
                        <Button icon="save" type="primary" htmlType="submit" size="large">Сохранить</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}



export default TrainingDescriptionEdit;

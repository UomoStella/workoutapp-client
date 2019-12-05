import React, { Component } from 'react';
import { TrainingProgramService } from '../../service/TrainingProgramService';
import { Button, Select, Form, Input,  InputNumber , message, notification , Switch } from 'antd';
import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import { ACCESS_TOKEN } from '../../constants';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

class TrainingProgramEdit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const treningId = this.props.match.params.treningId; 

        const AntWrappedLoginForm = Form.create()(TrainingProgramEditForm)
        return (
            <AntWrappedLoginForm handleLogout={this.props.handleLogout} handleMessage={this.props.handleMessage} treningId={treningId}  />
        );
    }
}

class TrainingProgramEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

            id: '',
            name: '',
            description: '',
            durationDays: 0,
            genderName: '',
            isPrivate: false, 

            isLoading: true,
            serverError: false,
            notFound: false,
        }

    
        this.funcTrainingProgramEditForm = this.funcTrainingProgramEditForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeIsPrivate = this.changeIsPrivate.bind(this);

        this.trainingProgramService = new TrainingProgramService();
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
                const trainingProgram = Object.assign({}, values);


                const trainingProgramRequest = {
                    id : this.state.id,
                    isPrivate: this.state.isPrivate,
                    name: trainingProgram.name,
                    description: trainingProgram.description,
                    durationDays: trainingProgram.durationDays,
                    genderName: trainingProgram.genderName,       
                };
            
                this.trainingProgramService.postTrainingProgramEditById(JSON.stringify(trainingProgramRequest))
                .then(response => {
                    const trainingProgramId = response.data;
                    this.props.handleMessage('/trainingprogram/details/'+ trainingProgramId, 'success', 'Данные успешно сохранены');
                }).catch(error => {
                    notification.error({
                        message: 'Ошибка',
                        description: error.message || 'Извините! Что-то пошло не так. Пожалуйста попробуйте снова!'
                    });
                });    
            }
        });
    }
      

    funcTrainingProgramEditForm(treningId){
        this.setState({
            isLoading: true,
        });

        this.trainingProgramService.getTrainingProgramEditById(treningId)
        .then(response => {
            const trainingProgram = response.data;
    
            this.setState({
                id: trainingProgram.id,
                name: trainingProgram.name,
                description: trainingProgram.description,
                durationDays: trainingProgram.durationDays,
                genderName: trainingProgram.genderName,       
                isPrivate:  (trainingProgram.isPrivate != null ? trainingProgram.isPrivate : false),

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

    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }

        const treningId =  this.props.treningId;
        this.funcTrainingProgramEditForm(treningId);
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
                <h2>Форма программы тренировок</h2>
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

                <FormItem label="Количество дней программы" hasFeedback>
                    {getFieldDecorator('durationDays', {
                        initialValue: this.state.durationDays,
                        rules: [{ required: true,  message: 'Введите количество дней программы' }],
                    })(
                    <InputNumber 
                        style={{width: '100%'}}
                        min={0}
                        size="large"
                        placeholder="Количество дней программы"/>
                    )}
                </FormItem>
                
                <Form.Item label="Пол" hasFeedback>
                    {getFieldDecorator('genderName', {
                        initialValue: this.state.genderName
                    })(
                        <Select placeholder="Пожалуйста выберите пол">
                            <Option value="GENDER">Не имеет значения</Option>
                            <Option value="MALE">Мужской</Option>
                            <Option value="FEMALE">Женский</Option>
                        </Select>,
                    )}
                </Form.Item>

                <FormItem label="Приватность">
                        <Switch 
                            onChange={this.changeIsPrivate}
                            checked={this.state.isPrivate}
                            />
                </FormItem>

                <FormItem>
                    <Button icon="save" type="primary" htmlType="submit" size="large">Сохранить</Button>
                </FormItem>
            </Form>
        );
    }
}



export default TrainingProgramEdit;

import React, { Component } from 'react';
import { Button, Row, Col, Radio, Form, InputNumber,  message, notification } from 'antd';
import { CalculatorService } from '../../service/CalculatorService';

import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';

const FormItem = Form.Item;


class Calculator extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const AntWrappedLoginForm = Form.create()(CalculatorForm)
        return (
            <AntWrappedLoginForm />
        );
    }
}

class CalculatorForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caloryWeight: 0,
            caloryHeight: 0,
            neckVolume: 0,
            waist: 0,
            hips: 0,
            genderValue: 0,
            message: '',

            bodyFatPercentage: 0,
            fatMass: 0,
            leanBodyWeight: 0,

            calcVisible: false,
            isFamile: false,
            
            serverError: false,
            notFound: false,
            isLoading: false
        };

        this.handleSubmitCalory = this.handleSubmitCalory.bind(this);

        this.calculatorService = new CalculatorService();
    }
    

    handleSubmitCalory(event) {
        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const calcObj = Object.assign({}, values);

                this.calculatorService.getCalculete(JSON.stringify(calcObj))
                .then(response => {
                    this.setState({
                        bodyFatPercentage: response.data.bodyFatPercentage,
                        fatMass: response.data.fatMass,
                        leanBodyWeight: response.data.leanBodyWeight,
                        message: response.data.message,
                        calcVisible: true
                    });
                }).catch(error => {
                    notification.error({
                        message: 'Ошибка',
                        description: error.message || 'Извините! Что-то пошло не так. Пожалуйста попробуйте снова!'
                    });
                });    
            }
        });
    }

    onChange = e => {
        const genderValue = e.target.value;
        if(genderValue == 0)
            this.setState({
                genderValue: genderValue,
                isFamile: false,
                hips: 0,
            });
        else
            this.setState({
                genderValue: genderValue,
                isFamile: true,
            });
      };

    componentDidMount() {}
    
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
                <Row>
                    <Col span={3}></Col>
                    <Col span={18}>
                        <Form onSubmit={this.handleSubmitCalory}>
                            <h3>Расчет процента жира</h3>
                            <FormItem>
                                {getFieldDecorator('genderValue', {
                                    initialValue: this.state.genderValue,
                                    rules: [{ required: true,  message: 'Введите значение' }],
                                })(
                                <Radio.Group onChange={this.onChange} value={this.state.genderValue}>
                                    <Radio value={0}>Мужчина</Radio>
                                    <Radio value={1}>Женщина</Radio>
                                </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem label="Вес (кг):">
                                {getFieldDecorator('caloryWeight', {
                                    initialValue: this.state.caloryWeight,
                                    rules: [{ required: true,  message: 'Введите значение' }],
                                })(
                                <InputNumber style={{width: '100%'}} min="1" placeholder="Вес (кг)"/>
                                )}
                            </FormItem>
                            <FormItem label="Рост (см):">
                                {getFieldDecorator('caloryHeight', {
                                    initialValue: this.state.caloryHeight,
                                    rules: [{ required: true,  message: 'Введите значение' }],
                                })(
                                <InputNumber style={{width: '100%'}} min="1" placeholder="Рост (см)"/>
                                )}
                            </FormItem>
                            <FormItem label="Объем шеи (см):">
                                {getFieldDecorator('neckVolume', {
                                    initialValue: this.state.neckVolume,
                                    rules: [{ required: true,  message: 'Введите значение' }],
                                })(
                                <InputNumber style={{width: '100%'}} min="1" placeholder="Объем шеи (см)"/>
                                )}
                            </FormItem>
                            <FormItem label="Объем талии (см):">
                                {getFieldDecorator('waist', {
                                    initialValue: this.state.waist,
                                    rules: [{ required: true,  message: 'Введите значение' }],
                                })(
                                <InputNumber style={{width: '100%'}} min="1" placeholder="Объем талии (см)"/>
                                )}
                            </FormItem>
                            {this.state.isFamile ?
                            <FormItem label="Объем бедер (см):">
                                {getFieldDecorator('hips', {
                                    initialValue: this.state.hips,
                                    rules: [{ required: true,  message: 'Введите значение' }],
                                })(
                                <InputNumber style={{width: '100%'}} min="1" placeholder="Объем бедер (см)"/>
                                )}
                            </FormItem>
                            : null}


                            {this.state.calcVisible ?
                            <Row getter={16}>
                                <Col span={24}>
                                {this.state.message != null &&
                                    this.state.message.length !=0 ?
                                    <p><span className="text-exercises_media">{this.state.message}</span></p>
                                :
                                <div>
                                    <p>Процент жира в организме: <span className="text-exercises_media">{this.state.bodyFatPercentage}%</span></p>
                                    <p>Масса жира: <span className="text-exercises_media">{this.state.fatMass} кг</span></p>
                                    <p>Скудная масса тела: <span className="text-exercises_media">{this.state.leanBodyWeight} кг</span></p>
                                </div>
                                }
                                </Col>
                            </Row>
                            : null}
                            <FormItem>
                                <Button icon="colc" type="primary" htmlType="submit">Рассчитать</Button>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={3}></Col>
                </Row>
            </div>
        );
    }
}

export default Calculator;
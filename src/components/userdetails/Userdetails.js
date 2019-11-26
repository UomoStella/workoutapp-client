import React, { Component } from 'react';
import { getUserDetails, userDetailsPOST } from '../../until/APIUtils';
import { Tabs, Button, Radio, Form, Input, Upload, Icon, message, notification  } from 'antd';
import './Userdetails.css';
import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class Userdetails extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(UserdetailsForm)
        return (
            <AntWrappedLoginForm isAuthenticated={this.props.isAuthenticated} />
        );
    }
}


class UserdetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: {
                value: ''
            },
            lastName: {
                value: ''
            },
            middleName: {
                value: ''
            },
            gender: {
                value:''
            },
            height: {
                value: null
            },
            weight: {
                value: null
            },
            image: {
                value: null
            },
            name: {
                value: ''
            },
            username: {
                value: ''
            },
            email: {
                value: ''
            },
            file: null,
            isLoading: false,
            serverError: false,
            notFound: false,
            loadingFile: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const objectValues = Object.assign({}, values);

                const userDetailsRequest = {
                  firstName: objectValues.firstName,
                  lastName: objectValues.lastName,
                  middleName: objectValues.middleName,
                  gender: objectValues.gender,
                  height: objectValues.height,
                  weight: objectValues.weight,
                  image: objectValues.image,
                  file: this.state.file
                }


                

                userDetailsPOST(userDetailsRequest)
                .then(response => {
                    this.props.history.push("/");
                }).catch(error => {
                    if(error.status === 401) {
                        this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');    
                    } else {
                        notification.error({
                            message: 'Polling App',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });              
                    }
                });
            
            }
        });
    }

    loadUserProfile() {
        this.setState({
            isLoading: true
        });

        if(!this.props.isAuthenticated){
            this.setState({
                notFound: true
            });
        }else {
            getUserDetails()
            .then(response => {
                this.setState({
                    firstName: {
                        value: response.firstName
                    },
                    lastName: {
                        value: response.lastName
                    },
                    middleName: {
                        value: response.middleName
                    },
                    gender: {
                        value: response.gender
                    },
                    height: {
                        value: response.height
                    },
                    weight: {
                        value: response.weight
                    },
                    image: {
                        value: response.image
                    },
                    name: {
                        value: response.name
                    },
                    username: {
                        value: response.username
                    },
                    email: {
                        value: response.email
                    },
                    isLoading: false,
                    notFound: false,
                    serverError: false
                })
            }).catch(error => {
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
    }

    componentDidMount() {
        this.loadUserProfile();
    }

    fileChange = e => {
        this.setState({
          file: e.target.files[0]
        })

      };


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
            // enctype="multipart/form-data"
            <Form onSubmit={this.handleSubmit}>

                <FormItem>
                    {getFieldDecorator('lastName', {
                        initialValue: this.state.lastName.value
                    })(
                    <Input
                        // prefix={<Icon type="user" />}
                        size="large"
                        placeholder="Фамилия"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('firstName', {
                        initialValue: this.state.firstName.value
                    })(
                    <Input
                        // prefix={<Icon type="user" />}
                        size="large"
                        placeholder="Имя"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('middleName', {
                        initialValue: this.state.middleName.value
                    })(
                    <Input
                        // prefix={<Icon type="user" />}
                        size="large"
                        placeholder="Отчество"/>
                    )}
                </FormItem>

                <Form.Item label="Пол:">
                {getFieldDecorator('gender', {
                    initialValue: this.state.gender.value
                })(
                    <Radio.Group>
                        <Radio value="MALE">Мужской</Radio>
                        <Radio value="FEMALE">Женский</Radio>
                    </Radio.Group>,
                )}
                </Form.Item>

                <FormItem>
                    {getFieldDecorator('height', {
                        initialValue: this.state.height.value
                    })(
                    <Input
                        // prefix={<Icon type="user" />}
                        size="large"
                        placeholder="Рост"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('weight', {
                        initialValue: this.state.weight.value
                    })(
                    <Input
                        // prefix={<Icon type="user" />}
                        size="large"
                        placeholder="Вес"/>
                    )}
                </FormItem>


                <input
                    type="file"
                    name="image"
                    onChange={this.fileChange}
                />

                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Сохранить</Button>
                </FormItem>
            </Form>
        );

    }
}


// function getBase64(img, callback) {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result));
//     reader.readAsDataURL(img);
//   }

//   function beforeUpload(file) {
//     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isJpgOrPng) {
//       message.error('You can only upload JPG/PNG file!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       message.error('Image must smaller than 2MB!');
//     }
//     return isJpgOrPng && isLt2M;
//   }


export default Userdetails;

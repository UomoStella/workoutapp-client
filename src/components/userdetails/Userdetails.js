import React, { Component } from 'react';
import { FileService } from '../../service/FileService';
import { getUserDetails, userDetailsPOST } from '../../until/APIUtils';
import { Button, Radio, Form, Input, Upload, Icon, message, notification  } from 'antd';
import './Userdetails.css';
import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import { ACCESS_TOKEN } from '../../constants';


const FormItem = Form.Item;

class Userdetails extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(UserdetailsForm)
        return (
            <AntWrappedLoginForm handleLogout={this.props.handleLogout}/>
        );
    }
}

class UserdetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            middleName: '',
            gender: '',
            height: '',
            weight: '',
            image: null,
            name: '',
            username: '',
            email: '',
            selectedFile: null, 
            isLoading: false,
            isAuthorization: false,
            serverError: false,
            notFound: false,
        }
    
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.fileService = new FileService();
    }


    handleSubmit(event) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(this.state.selectedFile);
                const userDetails = Object.assign({}, values);
                const userDetailsRequest = {
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    middleName: userDetails.middleName,
                    gender: userDetails.gender,
                    height: userDetails.height,
                    weight: userDetails.weight,
                };
            
                this.fileService.uploadUserDetailsToServer(userDetailsRequest)
                .then(response => {
                    notification.success({
                        message: 'Polling App',
                        description: "Данные успешно сохранены",
                    });          
                    this.props.history.push("/");
                }).catch(error => {
                    notification.error({
                        message: 'Polling App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                });    
            }
        });
    }

    loadUserProfile() {
        this.setState({
            isLoading: true

        });
        getUserDetails().then(response => {
            this.setState({
                firstName: response.firstName,
                lastName: response.lastName,
                middleName: response.middleName,
                gender: response.gender,
                height: response.height,
                weight: response.weight,
                image: response.image,
                name: response.name,
                username: response.username,
                email: response.email, 
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

    componentDidMount() {
        if(!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.handleLogout('/login', 'error', 'Необходима авторизация.'); 
        }
        this.loadUserProfile();
    }
    
    handleUploadFile = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });

        const data = new FormData();
        //using File API to get chosen file
        let file = event.target.files[0];
        console.log("Uploading file", event.target.files[0]);
        data.append('file', event.target.files[0]);
        data.append('name', 'my_file');
        data.append('description', 'this file is uploaded by young padawan');
        let self = this;
        //calling async Promise and handling response or error situation
        this.fileService.uploadFileToServer(data).then((response) => {
            console.log("File " + file.name + " is uploaded");
        }).catch(function (error) {
            console.log(error);
            if (error.response) {
                //HTTP error happened
                console.log("Upload error. HTTP error/status code=",error.response.status);
            } else {
                //some other error happened
               console.log("Upload error. HTTP error/status code=",error.message);
            }
        });
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
                {/* <Form.Item>{getFieldDecorator('file')(<Input />)}</Form.Item> */}

                <input
                    type="file"
                    name="image"
                    onChange={this.handleUploadFile}
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

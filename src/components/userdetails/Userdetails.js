import React, { Component } from 'react';
import { getUserDetails } from '../../until/APIUtils';
import { Tabs, Button, Radio, Form, Input, Upload, Icon, message  } from 'antd';
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
                // const loginRequest = Object.assign({}, values);
                // login(loginRequest)
                // .then(response => {
                //     localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                //     this.props.onLogin();
                // }).catch(error => {
                //     if(error.status === 401) {
                //         notification.error({
                //             message: 'Polling App',
                //             description: 'Лоигн или пароль введены неверно. Пожалуйста, попробуйте еще раз!'
                //         });                    
                //     } else {
                //         notification.error({
                //             message: 'Polling App',
                //             description: error.message || 'Извините произошла ошибка. Пожалуйста, попробуйте еще раз!'
                //         });                                            
                //     }
                // });
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


    handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );
        }
      };
    
      normFile = e => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
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


        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const { imageUrl } = this.state;

          const { uploading, fileList } = this.state;
          const props = {
            onRemove: file => {
                this.props.form.setFieldsValue({
                    image: null,
                });
              return false;
            },
            beforeUpload: file => {
                this.props.form.setFieldsValue({
                    image: file,
                });
              return false;
            },
            fileList,
          };

          const { getFieldDecorator } = this.props.form;

        return (
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

                <Form.Item>
                    {getFieldDecorator('image', {
                    valuePropName: 'file',
                    initialValue: this.state.image.value
                })(
                    <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> Select File
                    </Button>
                    </Upload>


                    // <Upload
                    //     name="avatar"
                    //     listType="picture-card"
                    //     className="avatar-uploader"
                    //     showUploadList={false}
                    //     action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    //     beforeUpload={beforeUpload}
                    //     onChange={this.handleChange}
                    // >
                    //     {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    // </Upload>
                )}
                </Form.Item>

                
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Сохранить</Button>
                </FormItem>
            </Form>
        );
    
    }
}


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }


export default Userdetails;
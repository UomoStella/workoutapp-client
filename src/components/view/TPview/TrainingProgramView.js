import React, { Component } from 'react';
import { Row, Col, notification, Pagination} from 'antd';
// import './ExercisesList.css';
import { TrainingProgramService } from '../../../service/TrainingProgramService';
import TPViewElement from './TPViewElement';
import List from '../../templats/List';
import LoadingIndicator from '../../LoadingIndicator';
import ServerError  from '../../../error/ServerError';
import NotFound from '../../../error/NotFound';

class TrainingProgramView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainingProgramList : [],
            page: '',
            size: '',
            totalElements: '',
            totalPages: '',
            last: '',

            isLoading: true,
            serverError: false,
            notFound: false,
        };

        this.trainingProgramService = new TrainingProgramService();

        
        this.getContentVIEW = this.getContentVIEW.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
    }

    paginationChange = (page, pageSize) => {
        const pageInx = page - 1;
        this.getContentVIEW(pageInx);
    }

    getContentVIEW(pageNum){
        this.setState({
            isLoading: true,
        });

        this.trainingProgramService.getTrainingProgramVIEW(pageNum)
        .then(response => {
            this.setState({
                trainingProgramList: response.data.content,
                page: pageNum,
                size: response.data.size,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                last: response.data.last,

                isLoading: false,
            });
        }).catch(error => {
            notification.error({
                message: 'Ошибка',
                description: error.message || 'Извините! Что-то пошло не так. Попытайтесь снова!'
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
        this.getContentVIEW();
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

        const page = this.state.page + 1;
        const totalPages = 10 * this.state.totalPages;

        const valueList = [];
        this.state.trainingProgramList.forEach((value) => { 
            valueList.push(
                <Col md={8} gutter={[16, 16]} >
                    <TPViewElement id={value.id}
                        name={value.name}
                        base64Image={value.base64Image}
                        durationDays={value.durationDays}
                        username={value.username}
                        genderName={value.genderName}/>
                </Col>
            );
        });
        
        return (
            <Row  gutter={[16, 16]}>
                {/* <Col span={24}>
                    <div style={{textAlign: 'right'}}>
                        <Button type="primary"><Link to={'/trainingprogram/edit'}>Добавить программу</Link></Button> 
                    </div>
                </Col> */}
        
                <Col span={24}>
                    {!this.state.isLoading ?
                    <div>
                        {this.state.trainingProgramList.length != 0 ?
                        <Row gutter={16} className="tpview-list">
                            <List  Content={valueList} />
                        </Row>
                        :
                        <p>Нет данных!!</p>
                        }
                    </div>
                    :
                    <LoadingIndicator/>
                }
                </Col>

                <Col span={24}>
                    <Pagination  onChange={this.paginationChange} defaultCurrent={page} total={totalPages} />
                </Col>
            </Row>
    );
    }
}

export default TrainingProgramView;
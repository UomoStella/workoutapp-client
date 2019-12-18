import React, { Component } from 'react';
import { NewsService } from '../../service/NewsService';
import { Row, Col, Container } from 'react-bootstrap';
import {withRouter, Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import  './Carusel.css';
import './Landing.css';
import TPLandingView from './TPLandingView';
import Logo from '../../resources/logo.jpg';


import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import { Button, Icon, Collapse } from 'antd';


const { Panel } = Collapse;

class Landing extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            newsList: [],

            isLoading: true,
            serverError: false,
            notFound: false,
            autoplay: true
        };

        this.getNewsFirstPage = this.getNewsFirstPage.bind(this);

        this.newsService = new NewsService();
    }



    getNewsFirstPage(){
        this.setState({
            isLoading: true,
        });

        this.newsService.getNewsFirstPage().then(response => {
            this.setState({
                newsList: response.data.containerList,

                isLoading : false
            });    
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
        this.getNewsFirstPage();
    }

    render() {        
        if(this.state.notFound) {
            return <NotFound />;
        }
        if(this.state.serverError) {
            return (<ServerError />);
        }

        const valueList = [];
        this.state.newsList.forEach((value) => { 

            const imageBase64 = 'data:image/png;base64, '+ value.base64image;
            const styleL = {backgroundImage: "url('data:image/png;base64, "+ value.base64image+"')"};

            valueList.push(
                <Carousel.Item>
                    <div class="first-page-carousel" style={styleL}>
                        <h3>{value.name}</h3>
                    </div>
                    <Carousel.Caption className="first-page-text">
                        <Link to={'/news/'+value.id}><Button>Перейти</Button></Link>
                    </Carousel.Caption>
                </Carousel.Item>
            );
        });


        return (
            <div>
                <Carousel wrap={false} slide={false}>
                    {valueList}
                </Carousel>
                <div class="service-area bg2 sp">
                    <Container>
                        <div class="section-title">
                            <h2>Сервис</h2>
                            <p>Наш сайт предоставляею возможность хранения и распространения:</p>
                        </div>
                        <Row>
                            <Col lg={4} md={6} className="single-service">
                                <div class="inner">
                                    <Link to={'/exercises/all'}>
                                        <div class="title">
                                            <div class="icon">
                                                <Icon type="heart"  /> 
                                            </div>
                                            <h4>Упражнения</h4>
                                        </div>
                                    </Link>
                                    <div class="content">
                                        <p>Физическая активность, приводящая к возникновению напряжения, целью которого является поддержание хорошей физической формы и нормального состояния тела или исправление какого-либо физического недостатка.</p>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} md={6} className="single-service">
                                <div class="inner">
                                    <Link to={'/trainingprogram/all'}>
                                        <div class="title">
                                            <div class="icon">
                                                <Icon type="skin" /> 
                                            </div>
                                            <h4>Программы тренировок</h4>
                                        </div>
                                    </Link>
                                    <div class="content">
                                        <p>Программа тренировок — это набор методов и средств, которые направлены на решение конкретных спортивных задач. Такая программа нужна, чтобы помочь человеку достичь поставленных целей. Программа тренировок может решить любую проблему.</p>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} md={6} className="single-service">
                                <div class="inner">
                                    <Link to={'/ration/all'}>
                                        <div class="title">
                                            <div class="icon">
                                                <Icon type="coffee" /> 
                                            </div>                                        
                                        <h4>Дневной рацион</h4>
                                        </div>
                                    </Link>
                                    <div class="content">
                                        <p>Чтобы увеличить качество жизни необходимо разработать суточный рацион питания с таблицей продуктов для взрослого человека, изучить, как составить меню на завтрак, обед, ужин, исходя из потребностей организма в необходимых нутриентах.</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div class="portfolio-area sp">
                    <Container>
                        <div class="section-title">
                            <h2>Программы тренировок</h2>
                            <p>Ниже представлены доступные программы тренировок</p>
                        </div>
                        <Row>
                            <Col>
                                <TPLandingView/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="tp-mode-btn-div">
                                    <Link to={'/trainingprogram/viewall'}><Button type="primary">Больше программ</Button></Link>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div class="faq-area sp bg2">
                    <Container>
                        <div class="section-title">
                            <h2>Часто Задаваемые Вопросы</h2>
                            <p>Ниже приведены часто задваемые вопросы.</p>
                        </div>
                        <Row>
                            <Col md={6}>
                                <Collapse bordered={false} >
                                    <Panel header="Возможно ли заниматься без тренера?" key="1">
                                        Да, но в любом случае, необходимо поставить технику выполнения упражнений.
                                    </Panel>
                                    <Panel header="Какая организация занималась созданием сайта?" key="2">
                                        Сайт является дипломным проектом, сойт создавался ожним человеком. Email (vvstouba@gmail.com)
                                    </Panel>
                                    <Panel header="Как можно поддержать проект?" key="3">
                                        Свяжитесь с создателем Email (vvstouba@gmail.com). И предложите вариант поддержки.
                                    </Panel>
                                </Collapse>
                            </Col>
                            <Col md={6}>
                                <div class="faq-img text-center">
                                    <img src={Logo} height="300px" alt="faq"/>
                                </div>
                            </Col>
                        </Row>                
                    </Container>
                </div>
            </div> 
        );
    }
}

export default withRouter(Landing);

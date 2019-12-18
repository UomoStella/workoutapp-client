import React, { Component } from 'react';
import { getUserProfile } from '../../until/APIUtils';
import { Tabs, Button, Row, Col, Breadcrumb } from 'antd';
import {withRouter, Link} from 'react-router-dom';
import { formatDate } from '../../until/Helpers';
import './Profile.css';
import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
import TPPerformenceUser from '../../components/performance/tp/TPPerformenceUser';

const TabPane = Tabs.TabPane;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            username: null,
            visible: false,
            
            isLoading: false,
            isCurrentUser: null

        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }


    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        if(this.props.currentUser && username == null){
            username = this.props.currentUser.username;
        }
    
        getUserProfile(username).then(response => {
            const isCurrentUser = false;
            if(this.props.currentUser && this.props.currentUser.id == response.id){
                this.setState({
                    username: username,
                    user: response,
                    isLoading: false,
                    isCurrentUser: true
                });
            
            }else{
                this.setState({
                    user: response,
                    isLoading: false,
                    isCurrentUser: false
                });
            }            
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }
      
    componentDidMount() {   
        const username = this.props.match.params.username;
        
        this.loadUserProfile(username);
    }
    

    render() {
        if(this.state.notFound) {
            return <NotFound />;
        }
        if(this.state.serverError) {
            return (<ServerError />);
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
        <div>
            <div className="breadcrumb-div">
                <Breadcrumb>
                    {this.state.username ?
                    <Breadcrumb.Item><Link to={'/users/'+this.state.username}>Профиль</Link></Breadcrumb.Item>
                    : null}
                </Breadcrumb>
            </div>
            <div className="content-div">
                {this.state.isLoading ?
                <LoadingIndicator />
                :
                <div>
                    <div className="profile borderBottomDotted">
                        <Row>
                            <Col span={20}>
                            {this.state.user ? (
                                <div className="user-profile">
                                    <div className="user-details">
                                        <div className="user-summary">
                                            <div className="full-name">{this.state.user.name}</div>
                                            <div className="username">@{this.state.user.username}</div>
                                            <div className="user-joined">
                                                Присоеденился: {formatDate(this.state.user.joinedAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                            ): null}
                            </Col>
                            <Col span={4}>
                            {this.state.isCurrentUser ? (
                                <div style={{textAlign: 'right'}}>
                                    <Button><Link to="/user/details">Редактировать</Link></Button>
                                </div>
                            ): null}
                            </Col>
                        </Row>
                    </div>
                    <div>
                        {this.state.user && this.state.isCurrentUser ?
                        <TPPerformenceUser isCurrentUser={this.state.isCurrentUser} username={this.state.user.username}
                            handleMessage={this.props.handleMessage} handleLogout={this.props.handleLogout} />
                        : null}
                    </div>
                </div>}
            </div>
        </div>
        );
    }
}

export default withRouter(Profile);
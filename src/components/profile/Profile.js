import React, { Component } from 'react';
import { getUserProfile, getCurrentUser } from '../../until/APIUtils';
import { Tabs, Button } from 'antd';
import {withRouter, Link} from 'react-router-dom';
import { formatDate } from '../../until/Helpers';
import './Profile.css';
import ServerError  from '../../error/ServerError';
import LoadingIndicator from '../LoadingIndicator';
import NotFound from '../../error/NotFound';
// import NotFound from '../../common/NotFound';

const TabPane = Tabs.TabPane;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            isCurrentUser: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }


    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });
    
        getUserProfile(username)
        .then(response => {
            const isCurrentUser = false;
            if(this.props.currentUser && this.props.currentUser.id == response.id){
                this.setState({
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
        // this.props.onLoadCurrentUser();
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />
          }
        
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
            <div className="profile">
                { 
                    this.state.user ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    {/* <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                        {this.state.user.name[0].toUpperCase()}
                                    </Avatar> */}
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.user.name}</div>
                                    <div className="username">@{this.state.user.username}</div>
                                    <div className="user-joined">
                                        Joined {formatDate(this.state.user.joinedAt)}
                                    </div>
                                </div>
                            </div>
                        </div>  
                    ): null               
                }
                { 
                    this.state.isCurrentUser ? (
                        <div className="user-profile">
                            <Button><Link to="/user/details">Войти</Link></Button>
                        </div>  
                    ): null               
                }
            </div>
        );
    }
}

export default withRouter(Profile);
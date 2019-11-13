import React, { Component } from 'react';
import {Route, withRouter, Switch} from 'react-router-dom';
import './App.css';
import AppHeader from './components/AppHeader';
import Login from './components/login/Login';
import Profile from './components/profile/Profile';
import NotFound from './error/NotFound';
import LoadingIndicator from './components/LoadingIndicator';
import { getCurrentUser } from './until/APIUtils';
import Signup from './components/signup/Signup';
import { Layout, notification } from 'antd';
import { ACCESS_TOKEN } from './constants';


const Footer = Layout.Footer;
const { Content } = Layout;



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }

    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });    
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogin() {
    notification.success({
      message: 'Сообщение',
      description: "Вы успешно вошли в учетную запись.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  handleLogout(redirectTo="/", notificationType="success", description="Вы успешно вышли с учетной записи.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'Сообщение',
      description: description,
    });
  }
  

  render(){
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
      <Layout>
        <AppHeader isAuthenticated={this.state.isAuthenticated} 
            currentUser={this.state.currentUser} 
            onLogout={this.handleLogout} />
        <Content>
            <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
              <Switch>      
                <Route exact path="/"/>
                <Route path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/users/:username" 
                  render={(props) => <Profile onLoadCurrentUser={this.loadCurrentUser} isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}/>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    );
  }

}

export default withRouter(App);

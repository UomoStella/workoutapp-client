import React, { Component } from 'react';
import {Route, withRouter, Switch} from 'react-router-dom';
import './App.css';
import AppHeader from './components/AppHeader';
import Login from './components/login/Login';
import Profile from './components/profile/Profile';
import Exercises from './components/exercises/edit/Exercises';
import NotFound from './error/NotFound';
import LoadingIndicator from './components/LoadingIndicator';
import { getCurrentUser } from './until/APIUtils';
import Signup from './components/signup/Signup';
import { Layout, notification } from 'antd';
import { ACCESS_TOKEN } from './constants';
import Userdetails from './components/userdetails/Userdetails';
import ExercisesMedia from './components/exercises/media/ExercisesMedia';
import ExercisesAll from './components/exercises/list/ExercisesAll';
import TrainingProgramEdit from './components/core/trainingprogram/TrainingProgramEdit';
import TrainingProgramDetails from './components/core/trainingprogram/TrainingProgramDetails';
import DailyWorkoutEdit from './components/core/dailyworkout/DailyWorkoutEdit';
import DailyWorkoutDetails from './components/core/dailyworkout/DailyWorkoutDetails';
import TrainingProgramAll from './components/core/TrainingProgramAll';

import TrainingDescriptionView from './components/core/trainingprogram/TrainingDescriptionView';
import TrainingProgramView from './components/view/TPview/TrainingProgramView';
import DailyWorkoutView from './components/view/DWview/DailyWorkoutView';
import TPPerformance from './components/performance/tp/TPPerformance';
import DWUPerformance from './components/performance/dw/DWUPerformance';

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
    this.handleMessage = this.handleMessage.bind(this);

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
      localStorage.removeItem(ACCESS_TOKEN);
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }


  
   handleLogin = () => {
    notification.success({
      message: 'Сообщение',
      description: "Вы успешно вошли в учетную запись.",
    });
    this.loadCurrentUser();
  
    // this.props.history.push("/");
    window.location.assign("/");
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


  handleMessage(redirectTo="/", notificationType="success", description="Ошибка.") {
    this.props.history.push(redirectTo);
    if(notificationType != ""){  
      notification[notificationType]({
        message: 'Сообщение',
        description: description,
      });
    }
  }
  

  render(){
    if(this.state.isLoading) {
      return <LoadingIndicator />;
    }else{

      return (
        <Layout>
          <AppHeader isAuthenticated={this.state.isAuthenticated} 
              currentUser={this.state.currentUser} 
              onLogout={this.handleLogout} />
      { 
      this.state.isLoading ? (
          <LoadingIndicator />    
        ): 
        <Content className="main-div" style={{ padding: '0 90px', marginTop: 20 }}>
              <div style={{ background: '#fff', padding: 24, minHeight: 1000 }}>
                <Switch>      
                  <Route exact path="/"/>
                  <Route path="/login" render={(props) => <Login handleMessage={this.handleMessage} onLogin={this.handleLogin} {...props} />}></Route>
                  <Route path="/signup" component={Signup}></Route>
                  <Route path="/users/:username" 
                    render={(props) => <Profile onLoadCurrentUser={this.loadCurrentUser} isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}/>
                  {/* <Route path="/user/details"  render={(props) => }/> */}
                  <Route path="/user/details" render={(props) => <Userdetails handleLogout={this.handleLogout} {...props} />}></Route>

              {/* exercises */}
                  <Route path="/exercises/edit/:exercisesid?" render={(props) => 
                    <Exercises handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>
                  <Route path="/exercises/media/:exercisesid?" render={(props) => 
                    <ExercisesMedia handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>
                  <Route path="/exercises/all" render={(props) => 
                    <ExercisesAll handleMessage={this.handleMessage} handleLogout={this.handleLogout} />}></Route>

              {/* TrainingProgramEdit */}
                <Route path="/trainingprogram/edit/:treningId?" render={(props) => 
                    <TrainingProgramEdit handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>
                  
                  <Route path="/trainingprogram/details/:trainingprogramId?" render={(props) => 
                    <TrainingProgramDetails handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>

                <Route path="/workout/edit/:trainingProgramId/:day/:id?" render={(props) => 
                    <DailyWorkoutEdit handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>


                <Route path="/workout/details/edit/:trainingProgramId/:day" render={(props) => 
                    <DailyWorkoutDetails handleMessage={this.handleMessage} handleLogout={this.handleLogout} {...props} />}></Route>

                <Route path="/trainingprogram/all" render={(props) => 
                    <TrainingProgramAll handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>
                <Route path="/trainingprogram/view/:dailyid/:trainingDescriptionid?" render={(props) => 
                    <TrainingDescriptionView handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>
                <Route path="/trainingprogram/viewall" render={(props) => 
                    <TrainingProgramView handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>
                <Route path="/dailyworkout/viewall/:tpid" render={(props) => 
                    <DailyWorkoutView handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>
                <Route path="/performance/tp" render={(props) => 
                    <TPPerformance handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>
                <Route path="/performance/dwu/:dwuid" render={(props) => 
                    <DWUPerformance handleMessage={this.handleMessage} handleLogout={this.handleLogout}  {...props}/>}></Route>
            
                


                  {/* <Route path="/exercises/create/:exercisesid?" render={(props) => <Exercises {...props}  />}> */}
                {/* </Route> */}

                  <Route component={NotFound}></Route>
                </Switch>
              </div>
          </Content>
        }

          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      );
  }
  }

}

export default withRouter(App);

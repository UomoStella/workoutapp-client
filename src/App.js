import React, { Component } from 'react';
import {Route, withRouter, Switch} from 'react-router-dom';
import { Row, Col } from 'antd';
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
import Recipe from './components/recipe/edit/Recipe';
import RecipeMedia from './components/recipe/edit/RecipeMedia';
import RationDetails from './components/recipe/ration/RationDetails';
import RationMedia from './components/recipe/ration/RationMedia';
import RecipeAll from './components/recipe/RecipeAll';
import RationAll from './components/recipe/RationAll';
import RationView from './components/recipe/view/RationView';
import Calculator from './components/calc/Calculator';
import Landing from './components/landing/Landing';
import News from './components/news/News';




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
    getCurrentUser().then(response => {
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
      this.props.history.push("/");

      this.loadCurrentUser();
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
          <AppHeader isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} onLogout={this.handleLogout} />
      {this.state.isLoading ? 
        <LoadingIndicator />    
        : 
        <div>
        <Content className="main-div" style={{ padding: '0 2em', marginTop: 10 }}>
          <Row style={{minWidth: 300}}>   
            <Col md={24}>
              <Switch>
                  {/* <Route exact path="/"/> */}

                  <Route exact path="/" component={Landing}/>
                  

                  <Route path="/login" render={(props) => 
                    <Login handleMessage={this.handleMessage} onLogin={this.handleLogin} {...props} />}/>
                  
                  <Route path="/signup" component={Signup}></Route>

                  <Route path="/users/:username?" render={(props) => 
                    <Profile handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout} 
                          currentUser={this.state.currentUser} {...props}/>}/>
                  
                  <Route path="/user/details" render={(props) => 
                    <Userdetails currentUser={this.state.currentUser} 
                          handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout} {...props} />}/>

{/* Exercises */}
                  <Route path="/exercises/all" render={(props) => 
                    <ExercisesAll handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout} />}/>

                  <Route path="/exercises/edit/:exercisesid?" render={(props) => 
                    <Exercises handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}/>

                  <Route path="/exercises/media/:exercisesid?" render={(props) => 
                    <ExercisesMedia handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>
                  

{/* TrainingProgram */}
                <Route path="/trainingprogram/all" render={(props) => 
                    <TrainingProgramAll handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

                <Route path="/trainingprogram/edit/:treningId?" render={(props) => 
                    <TrainingProgramEdit handleMessage={this.handleMessage}
                          handleLogout={this.handleLogout}  {...props}/>}></Route>
                  
                <Route path="/trainingprogram/details/:trainingprogramId?" render={(props) => 
                    <TrainingProgramDetails handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

                <Route path="/workout/details/edit/:trainingProgramId/:day" render={(props) => 
                    <DailyWorkoutDetails handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout} {...props} />}></Route>

                <Route path="/workout/edit/:trainingProgramId/:day/:id?" render={(props) => 
                    <DailyWorkoutEdit handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>


{/* TrainingProgramView */}
                <Route path="/trainingprogram/viewall" render={(props) => 
                    <TrainingProgramView handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

                <Route path="/dailyworkout/viewall/:tpid" render={(props) => 
                    <DailyWorkoutView handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

                <Route path="/trainingprogram/view/:dailyid/:trainingDescriptionid?/:trainingDescriptionid?" render={(props) => 
                    <TrainingDescriptionView handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

{/* ДНЕВНОЕ ЗАДАНИЕ */}
                <Route path="/performance/tp" render={(props) => 
                    <TPPerformance handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

                <Route path="/performance/dwu/:dwuid/:viewid?" render={(props) => 
                    <DWUPerformance handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>  
                
{/* РЕЦЕПТЫ */}
                <Route path="/recipe/all" render={(props) => 
                    <RecipeAll handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

                <Route path="/recipe/details/:recipeId?" render={(props) => 
                    <Recipe handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

                <Route path="/recipe/media/:recipeId" render={(props) => 
                    <RecipeMedia handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>     

{/* РАЦИОН */}           
                <Route path="/ration/all" render={(props) => 
                    <RationAll handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

               <Route path="/ration/details/:rationDayId?" render={(props) => 
                    <RationDetails handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>

               <Route path="/ration/media/:rationDayId" render={(props) => 
                    <RationMedia handleMessage={this.handleMessage} 
                          handleLogout={this.handleLogout}  {...props}/>}></Route>
               
                <Route path="/ration/view/:rdId/:rId?" render={(props) => <RationView   {...props}/>}></Route>

                <Route path="/calc" render={(props) =>  <Calculator {...props}/>}></Route>
                <Route path="/news/:newsid" render={(props) => <News {...props}/>}/>
                

                <Route component={NotFound}></Route>      
                </Switch>
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}> ©2019 Created by @UomoStella</Footer>
        </div>
        }
        </Layout>
      );
  }
  }

}

export default withRouter(App);


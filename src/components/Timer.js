import React, { Component } from 'react'
import Guitar from '../resources/guitar.mp3'
import { Progress } from 'antd';

class Timer extends Component {
    constructor(props) {
      super(props);
      this.startTimer = this.startTimer.bind(this);
      this.state = {
        timeLeft: null,   // Указывает на оставшееся время. Изначально равен null
        timer: null       // Отсылается на наш таймер. Изначально равен null
      };
    }
  
    componentDidMount() {
       this.setState({
            timeMax :this.props.timeLeft,
            timeLeft :this.props.timeLeft
       })
       this.startTimer(this.props.timeLeft);
    }


    startTimer(timeLeft) {   // Вызывается при нажатии на button
      clearInterval(this.state.timer);  // Избавляемся от запусков нескольких таймеров одновременно при нажатии на разные кнопки
      let timer = setInterval(() => {
        let timeLeft = this.state.timeLeft - 1;  // Отнимает 1 секунду от оставшегося времени
        if (timeLeft === 0) {    // Если оставшееся время равно 0,
          clearInterval(timer);  // очищаем таймер, чтоб таймер не уходил в минус
        }
        this.setState({
          timeLeft: timeLeft   // timeLeft из строки 10 равен timeLeft из строки 17
        });
      }, 1000);
      return this.setState({timeLeft: timeLeft, timer: timer});
    }
  
    render() {
      return(
        <div>
          <TimerDisplay onClose={this.props.onClose} timeMax={this.state.timeMax} timeLeft = {this.state.timeLeft}/>
          <audio id = "end" preload="auto" src={Guitar}></audio>
        </div>
      )
    }
  }
  
  class Button extends Component {
    handleStartTimer() {
      return this.props.startTimer(this.props.time)
    }
    render() {
      return <button onClick = {this.handleStartTimer.bind(this)}>
        {this.props.time} секунд</button>
    }
  }
  
  class TimerDisplay extends Component {
    render() {
      if (this.props.timeLeft === 0) {
        document.getElementById("end").play()

      }
      if (this.props.timeLeft === 0 || this.props.timeLeft === null) {
        return <Progress type="circle" successPercent={0} seconds={this.props.timeLeft} 
        percent={0} format={() => `Время вышло`} />
      }
      
      const percent = 100 * this.props.timeLeft / this.props.timeMax;
      return <Progress type="circle" successPercent={0} seconds={this.props.timeLeft} 
      percent={percent} format={() => `${this.props.timeLeft} c.`} /> 
    }
  }



export default Timer
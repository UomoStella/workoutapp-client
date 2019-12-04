import React, { Component } from 'react'
import ReactPlayer from 'react-player'

class VideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.url,
            playing : this.props.playing,
            width: this.props.width
        }
    }

    render () {
        return <ReactPlayer style={{border: '1px solid #e0ccff'}}
                             url={this.state.url} 
                            controls={true} 
                            light={true}
                            width={this.state.width}
                            playing={this.state.playing} />
      }


}

export default VideoPlayer;
import React from 'react'
import VideoPlayer from './VideoCall/VideoPlayer'
import Options from './VideoCall/Options'
import Notifications from './VideoCall/Notifications'

const VideoCall = () => {
  return (
    <div className={"chatArea-container"}>
        <h1 className='video-chat-heading'>Video Call</h1>
        <VideoPlayer/>
        <Options>
            <Notifications/>
        </Options>
    </div>
  )
}

export default VideoCall;
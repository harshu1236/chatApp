import React, { useContext } from 'react';
import {Paper} from '@mui/material';
import { SocketContext } from '../../SocketContext';
import '../style.css';
const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  return (
    <div className='video-align'>
      {stream && (
        <Paper>
          <div className='video-box-main'>
            <video playsInline muted ref={myVideo} autoPlay className='video-box'/>
            <h3 className='video-box-name'>{name || 'Name'}</h3>
          </div>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper>
          <div className='video-box-main'>
            <video playsInline ref={userVideo} autoPlay className='video-box'/>
            <h3 className='video-box-name'>{call.name || 'Name'}</h3>
          </div>
        </Paper>
      )}
    </div>
  );
};

export default VideoPlayer;
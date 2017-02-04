/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioRecorder = null;
var recIndex = 0;

/* TODO:

- offer mono option
- "Monitor input" switch
*/

function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
}

function gotBuffers( buffers ) {
    audioRecorder.exportWAV( doneEncoding );
}

function doneEncoding( blob ) {
    var filename = "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav"
    recIndex++;
    var url = (window.URL || window.webkitURL).createObjectURL(blob);

    console.log('go get it', blob.type, url);

}

function stopRecording() {
  audioRecorder.stop();
  audioRecorder.getBuffers( gotBuffers );
}
function startRecording() {
  // start recording
  if (!audioRecorder)
      return;
  audioRecorder.clear();
  audioRecorder.record();
}

function gotStream(stream) {
    var audioContext = new AudioContext();
    var inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    audioContext.createMediaStreamSource(stream).connect(inputPoint);
    audioRecorder = new Recorder( inputPoint );
}

function initAudio() {
    if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    }

    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "true",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, function(e) {
            alert('Error getting audio');
            console.log(e);
        });
}

window.addEventListener('load', initAudio );

function failFn() {}
function onAPILoadReady() {

  console.log('API ready to proceed');
  IPCortex.Types.Room.addListener('new', roomCreateEventListener);

  IPCortex.PBX.Auth.login({username: 'fac30b', password: 'gh2ig32z'})
    .then(IPCortex.PBX.startFeed)
    .then(initialDataAvailable)
    .catch(failFn);
  return;
  $(window).unload(function() {
    console.log("...and exit");
    IPCortex.PBX.Auth.exit();
  });
}

let res;

function roomCreateEventListener(room) {
  console.log('Created room');
  rooms[room.roomID] = room;
  navigator.mediaDevices.getUserMedia({audio: true, video: true})
  .then(function(stream) {
    room.videoChat(stream).addListener('update', processFeedCB)

    })

}

window.addEventListener('unhandledrejection', event => {
  console.log(event);
});



function initialDataAvailable () {
  IPCortex.PBX.enableChat();
  IPCortex.PBX.enableFeature('av', registernewav, ['chat']);

  // console.log(IPCortex.PBX.contacts);
  // 'gate-a'

  var objGateA = findGate(IPCortex.PBX.contacts, 'gate-a');
  objGateA.chat();


  var objGateB = findGate(IPCortex.PBX.contacts, 'gate-b');
  objGateB.chat();
}

function findGate (arrayContacts, gate) {
  return arrayContacts.filter(function(obj) {
    return obj.uname === gate;
  })[0];
}

let video = {};
let rooms = {};

function registernewav (av) {
  console.log("NEW AV STREAM: "+av.signalling.roomID);
  let room = rooms[av.signalling.roomID]

  if (room.AV) {
    //av.merge(room.AV)
  } else {
    room.AV = av;
    av.accept();
  }
  av.addListener('update', processFeedCB);
  // processFeedCB(av);
}

function processFeedCB (data) {
  console.log("CURRENT AV STATE: ",data.state)
  if (data.state=='timeout' || data.state=='error' || data.state=='rejected' || data.state=='closed')
     return;

  for (let id in data.remoteMedia) {
    var video = document.getElementById(id);
    const stream = data.remoteMedia[id];
    console.log(id, stream.cid == IPCortex.PBX.Auth.id, stream.status);
    if (stream.cid == IPCortex.PBX.Auth.id) {
      // Do nothing
    } else if (stream.status === 'connected' && !video) {
      console.log('connected');
      video = document.createElement('video');
      video.id = id;
      document.getElementById('videoWrapper').appendChild(video);
      attachMediaStream(video, stream);
      video.play();
      var gate = new Gate(video, function() {console.log('Woop! New Gate!!!')});
      gate.dropper('Colour');

    }
  }
};

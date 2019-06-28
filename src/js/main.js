'use strict';
  
// class Ping {
//   constructor(options) {
//     this.opt = options || {};
//     this.favicon = this.opt.favicon || 'favicon.ico';
//     this.timeout = this.opt.timeout || 0;
//   }
//   ping(ipAddress, callback) {
//     let timer = null;
//     const image = new Image();
//     const startTime = new Date();

//     function recieveResponse(e) {
//       if (timer) {
//         clearTimeout(timer);
//         image.onload = null;
//         image.onerror = null;
//       }
//       const endTime = new Date();
//       const pingVal = endTime - startTime;
//       if (typeof callback === 'function') {
//         if (e.type === 'error') {
//           console.log('Server not responding');
//           callback('error', pingVal);
//         } else {
//           callback(null, pingVal); 
//         }
//       }
//     }

//     image.onload = recieveResponse;
//     image.onerror = recieveResponse;
//     if (this.timeout) {
//       timer = setTimeout(ping, this.timeout);
//       image.src = `${ipAddress}/${this.favicon}?${new Date()}`;
//     }
//   }
// }
// // o.r(e);
// // var n = o(0);
// const apiEndpoint = 'https://dqbth38up2.execute-api.eu-west-1.amazonaws.com/default/manage-minecraft-server/';
// const secret = '2bhMntUOY59j4VAZ2wmLya30M9ty3S5x2qTxEstt';
// const serverAddress = 'http://34.255.56.75';
// const pingUtil = new Ping({
//   timeout: 5500
// });
// const loader = document.getElementById('loader');
// const page = document.getElementById('page');
// const stateBlock = document.getElementById('stat_id');
// const sliderContainer = document.getElementById('contentwrapper');

// function f() {
//   pingUtil.ping(serverAddress, function (type, time) {
//     if (parseInt(time) < 5e3) {
//       if (!stateBlock.classList.contains('on')) {
//         stateBlock.classList = [];
//         stateBlock.classList.add('on');
//         stateBlock.innerText = 'on';
//         if (sliderContainer.classList.contains('off')) {
//           document.body.style.backgroundColor = 'rgb(135, 206, 250)';
//           sliderContainer.classList.remove('off');
//         }
//       }
//     } else {
//       if (!stateBlock.classList.contains('off')) {
//         stateBlock.classList = [];
//         stateBlock.classList.add('off');
//         stateBlock.innerText = 'off';
//         if (!sliderContainer.classList.contains('off')) {
//           document.body.style.backgroundColor = 'rgb(10, 11, 31)';
//           sliderContainer.classList.add('off');
//         }
//       }
//     }
//   });
// }
// window.onload = (() => {
//   pingUtil.ping(serverAddress, function (type, time) {
//     if (parseInt(time) < 5000) {
//       document.body.style.backgroundColor = 'rgb(135, 206, 250)';
//       stateBlock.classList.add('on');
//       stateBlock.innerText = 'on';
//     } else {
//       document.body.style.backgroundColor = 'rgb(10, 11, 31)';
//       sliderContainer.classList.add('off');
//       stateBlock.classList.add('off');
//       stateBlock.innerText = 'off';
//     }
//     loader.style.visibility = 'hidden';
//     page.style.visibility = 'visible';
//     setInterval(f, 3000);
//   });
// });
// sliderContainer.addEventListener('click', function changeServerState() {
//   document.body.style.transition = 'background-color 2s';
//   sliderContainer.removeEventListener('click', changeServerState);
//   setTimeout(() => {
//     sliderContainer.addEventListener('click', changeServerState);
//   }, 20000);
//   if (sliderContainer.classList.contains('off')) {
//     fetch(apiEndpoint + 'start', {
//       method: 'GET',
//       headers: {
//         'x-api-key': secret
//       }
//     });
//     sliderContainer.classList.remove('off');
//     document.body.style.backgroundColor = 'rgb(135, 206, 250)';
//   } else {
//     fetch(apiEndpoint + 'stop', {
//       method: 'GET',
//       headers: {
//         'x-api-key': secret
//       }
//     });
//     sliderContainer.classList.add('off');
//     document.body.style.backgroundColor = 'rgb(10, 11, 31)';
//   }
// });
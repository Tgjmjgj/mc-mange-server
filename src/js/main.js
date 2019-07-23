'use strict';

const backgroundUpdateInterval = 10000;
const changeStatusWaitInterval = 1000;
const loaderMinTime = 2000;

const serverIp = '18.200.47.55';
const apiEndpoint = 'https://qavsxtj4cf.execute-api.eu-west-1.amazonaws.com/production/server';
const secret = 'f3KHNZlRQB9s4jSuiRKocafML7sQWwp41A7TXXEL';
// First server has stop working
// const servStatusEndpoint = `https://api.minetools.eu/ping/${serverIp}`;
const servStatusEndpoint = `https:/api.mcsrvstat.us/2/${serverIp}`;

async function isOnline() {
  const response = await fetch(servStatusEndpoint);
  const data = await response.json();
  return data.online;
}
const responseParams = {
  method: 'GET',
  headers: {
    'x-api-key': secret,
  },
};
async function getInstanceState() {
  const response = await fetch(`${apiEndpoint}/state`, responseParams);
  const data = await response.json();
  return data.state;
}

async function doSmthgWithServer(cmd) {
  const response = await fetch(`${apiEndpoint}/${cmd}`, responseParams);
  const isOk = await response.text();
  return isOk === 'true';
}
const startServer = async() => await doSmthgWithServer('start');
const stopServer = async() => await doSmthgWithServer('stop');

window.addEventListener('load', async () => {
  const loader = document.getElementById('loader');
  const page = document.getElementById('page');
  const stateBlock = document.getElementById('stat_id');
  const sliderContainer = document.getElementById('contentwrapper');

  const updateStatusOnPage = (newStatus) => {
    switch (newStatus) {
      case 'online':
        stateBlock.classList = [];
        stateBlock.classList.add('on');
        stateBlock.innerText = 'on';
        sliderContainer.classList.remove('off');
        document.body.style.backgroundColor = 'rgb(135, 206, 250)';
        break;
      case 'offline':
        stateBlock.classList = [];
        stateBlock.classList.add('off');
        stateBlock.innerText = 'off';
        sliderContainer.classList.add('off');
        document.body.style.backgroundColor = 'rgb(10, 11, 31)';
        break;
      case 'pending':
        stateBlock.classList = [];
        stateBlock.classList.add('pending');
        stateBlock.innerText = 'pending';
        document.body.style.transition = 'background-color 3s';
        document.body.style.backgroundColor = 'rgba(222, 222, 178, .82)';
        break;
      case 'stopping':
        stateBlock.classList = [];
        stateBlock.classList.add('stopping');
        stateBlock.innerText = 'stopping';
        document.body.style.transition = 'background-color 3s';
        document.body.style.backgroundColor = 'rgba(222, 222, 178, .82)';
        break;
      default:
        break;
    }
  };
  const toggleStatusOnPage = () => {
    if (sliderContainer.classList.contains('off')) {
      updateStatusOnPage('online');
    } else {
      updateStatusOnPage('offline');
    }
  }
  let timer = null;
  const runBackgroundCheck = () => {
    timer = setInterval(async() => {
      const online = await isOnline();
      updateStatusOnPage(online ? 'online' : 'offline');
    }, backgroundUpdateInterval);
  };
  const stopBackgroundCheck = () => {
    if (timer) {
      clearInterval(timer);
    }
  };
  const loadTime = new Date();
  const online = await isOnline();
  const passedTime = new Date() - loadTime;
  let elapsedTime = loaderMinTime - passedTime;
  if (elapsedTime < 0) {
    elapsedTime = 0;
  }
  setTimeout(() => {
    updateStatusOnPage(online ? 'online' : 'offline');
    loader.style.display = 'none';
    page.style.visibility = 'visible';
  }, elapsedTime);

  sliderContainer.addEventListener('click', async function changeServerState() {
    const disableClick = () => {
      sliderContainer.removeEventListener('click', changeServerState);
      sliderContainer.classList.remove('clickable');
    }
    const enableClick = () => {
      sliderContainer.addEventListener('click', changeServerState);
      sliderContainer.classList.add('clickable');
    }
    disableClick();
    stopBackgroundCheck();
    const actualOnline = await isOnline();
    const onlineOnPage = !sliderContainer.classList.contains('off');
    if (actualOnline !== onlineOnPage) {
      toggleStatusOnPage();
      return;
    }
    if (actualOnline === false) {
      const successful = await startServer();
      if (successful) {
        updateStatusOnPage('pending');
        const waitTimer = setInterval(async() => {
          const currentOnlineStatus = await isOnline();
          if (currentOnlineStatus === true) {
            clearInterval(waitTimer);
            enableClick();
            updateStatusOnPage('online');
            runBackgroundCheck();
          }
        }, changeStatusWaitInterval);
      }
    } else {
      const successful = await stopServer();
      if (successful) {
        updateStatusOnPage('stopping');
        const waitTimer = setInterval(async() => {
          const currentInstanceState = await getInstanceState();
          if (currentInstanceState === 'stopped') {
            clearInterval(waitTimer);
            enableClick();
            updateStatusOnPage('offline');
            runBackgroundCheck();
          }
        }, changeStatusWaitInterval);
      }
    }
  });
});

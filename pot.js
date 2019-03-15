const potWidth = 20;
const potHeight = 20;
const playingAreaWidth = 500;
const playingAreaHeight = 600;

let clickCount = -1;
let potPositionY = null;
let potPositionX = null;
let clickPositionY = null;
let clickPositionX = null;
let potDistance = null;

const body = document.querySelector('body');
const playingArea = document.querySelector('.playing-area');
const pot = document.querySelector('div.pot');
const displayClickCount = document.querySelector('#click-count');
const status = document.querySelector('#status');
const clickCountText = document.querySelector('#click-p');

const generatePosition = (axis) => {
  if (axis === 'x') return Math.floor(Math.random() * (((playingAreaWidth - potWidth) - potWidth) + potWidth));
  if (axis === 'y') return Math.floor(Math.random() * (((playingAreaHeight - potHeight) - potHeight) + potHeight));
  else throw Error('function generatePosition -> invalid parameter');
}

const getResult = (xClick, yClick, xPot, yPot) => {
  let newStatus = 'COLD';
  let newDistance = Math.sqrt(Math.pow((xPot - xClick), 2) + Math.pow((yPot - yClick), 2));

  if ((xClick >= xPot && xClick <= (xPot + 20)
    && (yClick >= yPot && yClick <= (yPot + 20)))
  ) {
    newStatus = 'B I N G O';
  } else if (newDistance < potDistance || potDistance === null) {
    newStatus = 'HOT';
  }
  return { newStatus, newDistance };
};

const updateStatus = (newStatus) => {
  displayClickCount.innerHTML = ++clickCount;
  status.innerHTML = newStatus;
  return true;
}

const firstClick = () => {
  potPositionX = generatePosition('x');
  potPositionY = generatePosition('y');
  pot.style.left = potPositionX + 'px';
  pot.style.top = potPositionY + 'px';
  clickCountText.style.visibility = 'visible';
  updateStatus('Hit the Pot!');

  body.removeEventListener('click', firstClick);
  playingArea.addEventListener('click', handleClicks);
}

const handleClicks = async (e) => {
  clickPositionX = e.clientX;
  clickPositionY = e.clientY;
  const { newStatus, newDistance } = getResult(clickPositionX, clickPositionY, potPositionX, potPositionY);
  await updateStatus(newStatus);
  potDistance = newDistance;

  if (newStatus === 'B I N G O') {
    playingArea.removeEventListener('click', handleClicks);
    pot.style.background = 'red';
    setTimeout(() => alert(`YOU FOUND THE POT AFTER ${clickCount} CLICK${(clickCount === 1 ? '' : 'S')}`), 0);
  }
}

body.addEventListener('click', firstClick);

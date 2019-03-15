// get our elements 

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');




// build our functions


function togglePlay() {

    const method = video.paused ? 'play' : 'pause';
    video[method]();
   //if (video.paused) {
    //    video.play();
    //} else {
     //   video.pause();
   // }
}

function updateButton() {

    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
    //console.log('Update the button');
}  // listen for any time the video is played or paused to change icon, not hooking to play function because this way any time the video is paused/played  - no matter the user's method the button still toggles


function skip() {
    //console.log(this.dataset.skip);
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    video[this.name] = this.value;
    //console.log(this.name);

    //console.log(this.value);
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100; // currentTime and duration are properties on video
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    //console.log(e);
}

//hook up event listeners

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);


toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);


//add a button to make video go fullscreen







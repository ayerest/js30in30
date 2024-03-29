const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
        console.log(localMediaStream);
        video.srcObject = localMediaStream;
        video.play();
    })
    .catch(err => {
        console.error(`OH NOO!!!`, err);
    });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    // console.log(width, height);
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //mess with them
        // pixels = redEffect(pixels);

        pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.5;

        // pixels = greenScreen(pixels);
        //put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {

    //played the sound
  snap.currentTime = 0;
  snap.play();

    // take the data out of the canvas

    const data = canvas.toDataURL('image/jpeg');
    //console.log(data);
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome person" />`;
    //link.textContent = 'Download Image';
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) { //for loop because pixels is a special kind of array in JS that doesn't have map as a method -- incrementing by 4 because each pixel has 4 values to represent rgba
    pixels[i + 0] = pixels.data[i + 0] + 150; // r
    pixels[i + 1] = pixels.data[i + 1] - 110;// g
    pixels[i + 2] = pixels.data[i + 2] * 0.5; // b
  }
  return pixels;
}

function rgbSplit(pixels) {

    for (let i = 0; i < pixels.data.length; i += 4) { //for loop because pixels is a special kind of array in JS that doesn't have map as a method -- incrementing by 4 because each pixel has 4 values to represent rgba
    pixels[i - 150] = pixels.data[i + 0]; // r
    pixels[i + 500] = pixels.data[i + 1];// g
    pixels[i - 550] = pixels.data[i + 2]; // b
  }
  return pixels;

}

function greenScreen(pixels) {
    const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0; // transparency pixel
    }
  }

  return pixels;
}


getVideo();


video.addEventListener('canplay', paintToCanvas);
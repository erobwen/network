export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export function getTimestamp() {
  let d = new Date();
  return d.getTime();
}

export async function releaseControl(time) {
  if (typeof(time) === "undefined") time = 0;
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve()} , time);
  })
}
export const throttle = (func, wait = 100) => {
  let timer = null;
  return function (...args) {
    if (timer === null) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, wait);
    }
  };
};

export function calculateReadingTime(text) {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export function getRepoName(url) {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  if (match) {
    return match[2];
  } else {
    return null; // or handle the error as needed
  }
}

export function getStar(repoWithUsername) {
  const url = `https://api.github.com/repos/${repoWithUsername}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log({ data });
      return data.stargazers_count;
    });
}

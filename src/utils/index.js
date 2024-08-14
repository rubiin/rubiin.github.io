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

/**
 * Gets the number of stars for a github repo
 * @constructor
 * @param {string} repoWithUsername - The repo with the username
 */
export function getStar(repoWithUsername) {
  const url = `https://api.github.com/repos/${repoWithUsername}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log({ data });
      return data.stargazers_count;
    });
}

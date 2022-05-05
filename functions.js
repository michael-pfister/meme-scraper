import axios from 'axios';
import fs from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';

/**
 * Sends a request to a given URL and returns the response
 * @example let response = await httpRequest('http://www.google.at/');
 * @param {string} URL
 * @returns A Promise with a 'resolve' of the response
 */
export async function httpRequest(URL) {
  return axios
    .get(URL)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * Filters links inside of img tags out of a given array of HTML tags and returns them as an array
 * @param {string[]} htmlLines
 * @returns {string[]} img links
 */
export function imageLinks(htmlLines) {
  let imageLinks = [];
  let boolean = false;
  let link = '';

  htmlLines.forEach((element) => {
    if (element.includes(`<img src="`)) {
      element.split('').map((char) => {
        if (boolean) {
          link += char;
        }
        if (char == `"`) {
          boolean = !boolean;
        }
      });
      imageLinks.push(link.substring(0, link.length - 1));
      link = '';
    }
  });

  return imageLinks;
}

//prerequisite
const finished = promisify(stream.finished);
/**
 * stackoverflow copypasta, downloads a file to a given directory
 * @credit https://stackoverflow.com/users/737457/csotiriou
 * @param {string} fileUrl
 * @param {string} outputLocationPath
 */
export async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);
  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then((response) => {
    response.data.pipe(writer);
    return finished(writer); //this is a Promise
  });
}

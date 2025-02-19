/* eslint-disable no-useless-escape */
export function isUrl(url: string): boolean {
  const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  return regex.test(url);
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isEmail(email: string) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

export const generateUuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  /* eslint-disable */
  const r = (Math.random() * 16) | 0;
  const v = c === 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
})

export function checkDarkmode(theme) {
  return theme === 'dark' ? true : false;
}

export function convertHtml(html: string) {
  // Create a new div element
  const tempDivElement = document.createElement("div");
  // Set the HTML content with the given value
  tempDivElement.innerHTML = html;
  // Retrieve the text property of the element 
  return tempDivElement.textContent || tempDivElement.innerText || html;
} 

function toUtf8(text) {
  let surrogate = encodeURIComponent(text);
  let result = '';
  for (let i = 0; i < surrogate.length;) {
    let character = surrogate[i];
    i += 1;
    if (character == '%') {
      let hex = surrogate.substring(i, i += 2);
      if (hex) {
        result += String.fromCharCode(parseInt(hex, 16));
      }
    } else {
      result += character;
    }
  }
  return result;
};

/**
* Removes invalid XML characters from a string
* @param {string} str - a string containing potentially invalid XML characters (non-UTF8 characters, STX, EOX etc)
* @param {boolean} removeDiscouragedChars - should it remove discouraged but valid XML characters
* @return {string} a sanitized string stripped of invalid XML characters
*/
export function removeXMLInvalidChars(str: string, removeDiscouragedChars = true) {
  let result = toUtf8(str)
  // remove everything forbidden by XML 1.0 specifications, plus the unicode replacement character U+FFFD
  var regex = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;

  // ensure we have a string
  result = String(result || '').replace(regex, '');

  if (removeDiscouragedChars) {

    // remove everything discouraged by XML 1.0 specifications
    regex = new RegExp(
      '([\\x7F-\\x84]|[\\x86-\\x9F]|[\\uFDD0-\\uFDEF]|(?:\\uD83F[\\uDFFE\\uDFFF])|(?:\\uD87F[\\uDF' +
      'FE\\uDFFF])|(?:\\uD8BF[\\uDFFE\\uDFFF])|(?:\\uD8FF[\\uDFFE\\uDFFF])|(?:\\uD93F[\\uDFFE\\uD' +
      'FFF])|(?:\\uD97F[\\uDFFE\\uDFFF])|(?:\\uD9BF[\\uDFFE\\uDFFF])|(?:\\uD9FF[\\uDFFE\\uDFFF])' +
      '|(?:\\uDA3F[\\uDFFE\\uDFFF])|(?:\\uDA7F[\\uDFFE\\uDFFF])|(?:\\uDABF[\\uDFFE\\uDFFF])|(?:\\' +
      'uDAFF[\\uDFFE\\uDFFF])|(?:\\uDB3F[\\uDFFE\\uDFFF])|(?:\\uDB7F[\\uDFFE\\uDFFF])|(?:\\uDBBF' +
      '[\\uDFFE\\uDFFF])|(?:\\uDBFF[\\uDFFE\\uDFFF])(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\' +
      'uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|' +
      '(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))', 'g');

    result = result.replace(regex, '');
  }

  return result;
}

export function removeStripTags(str) {
  if ((str === null) || (str === ''))
      return false;
  else
      str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace(/(<([^>]+)>)/ig, '');
}

export const stripTags = (input: string, allowed?: string) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const allowedTmp = (
    `${allowed || ''}`.toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []
  ).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input
    .replace(commentsAndPhpTags, '')
    .replace(tags, ($0, $1) => (allowedTmp.indexOf(`<${$1.toLowerCase()}>`) > -1 ? $0 : ''));
};

export const  buildUrl = (baseUrl: string, params?: { [key: string]: any }) => {
  if (!params) {
    return baseUrl;
  }

  const queryString = Object.keys(params)
    .map((k) => {
      if (Array.isArray(params[k])) {
        return params[k].map((param) => `${encodeURIComponent(k)}=${encodeURIComponent(param)}`)
          .join('&');
      }
      return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
    })
    .join('&');
  return `${baseUrl}?${encodeURI(queryString)}`;
}
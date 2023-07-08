const { readFileSync } = require('node:fs');
const htmls = require('htmls');
const stylus = require('stylus');
const { name, version } = require('./package.json');

const country = new Intl.DisplayNames('en', {'type': 'region'});
const dateFmt = new Intl.DateTimeFormat('en', {month: 'long', year: 'numeric'});

const lib = {
  /**
   * Strip the scheme from a URL.
   * @param {string} url a URL
   * @returns {string}
   */
  strip: (url) => /^(?:https?:\/\/)?(.*)/.exec(url)[1],
  /**
   * Get the URL of an icon from heroicons.
   * @param {'outline' | 'solid'} style the icon style
   * @param {string} icon the icon name
   * @returns {string}
   */
  icon: (style, icon) => `https://cdn.statically.io/gh/tailwindlabs/heroicons/master/src/24/${style}/${icon}.svg`,
  /**
   * Get the URL of an icon from simple-icons.
   * @param {string} name the icon name
   * @returns {string}
   */
  brand: (name) => `https://cdn.simpleicons.org/${name.toLowerCase().replace(' ', '')}`,
  /**
   * Get the skill level as a percentage.
   * @param {'beginner' | 'intermediate' | 'advanced' | 'master'} level the skill level as a string
   * @returns {25 | 50 | 75 | 100}
   * @throws if the skill level is invalid
   */
  skill: (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 25;
      case 'intermediate':
        return 50;
      case 'advanced':
        return 75;
      case 'master':
        return 100;
      default:
        throw Error(`Unexpected skill level: ${level}`);
    }
  },
  /**
   * Format `YYYY-MM-DD` date as `MMMM YYYY`.
   * @param {string} date a date in ISO format
   * @returns {string}
   */
  format: (date) => dateFmt.format(Date.parse(date)),
  /**
   * Format location data as an address.
   * @param {ResumeSchema['basics']['location']} location the location data
   * @returns {string}
   */
  address: (location) => [
    location.address,
    location.city,
    location.postalCode,
    location.region,
    location.countryCode && country.of(location.countryCode)
  ].filter(e => e).join(', '),
}

const template = readFileSync('src/resume.htmls', 'utf-8');

// @ts-ignore (type stub missing 'compress' key)
const style = stylus.render(readFileSync('src/resume.styl', 'utf-8'), {compress: true});

const font = 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;600&display=swap';

module.exports = {
  /**
   * Render the resume.
   * @param {ResumeSchema} resume the JSON resume
   * @returns {string}
   */
  render: (resume) => htmls(template)({
    resume, lib, style, font, name, version
  }),
  pdfRenderOptions: {
    format: 'A4',
    mediaType: 'screen',
  },
};
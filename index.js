const { promises: fs } = require('fs');
const readme = require('./readme');
const { getWeather } = require('./src/weather');
const { getRandomBanner } = require('./src/banner');

const msInOneDay = 1000 * 60 * 60 * 24;

const today = new Date();

function generateNewREADME() {
  const readmeRow = readme.split('\n');

  function updateIdentifier(identifier, replaceText) {
    const identifierIndex = findIdentifierIndex(readmeRow, identifier);
    if (!readmeRow[identifierIndex]) return;
    readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
      `<#${identifier}>`,
      replaceText
    );
  }

  const identifierToUpdate = {
    day_before_new_years: getDBNWSentence(),
    today_date: getTodayDate(),
    fortune_cookie: getFortuneCookie(),
    gabot_signing: getGabotSigning(),
    RandomDish: getRandomDish(),
    today_weather: getWeather(),
    banner_light: getRandomBanner(false), // light theme
    banner_dark: getRandomBanner(true), // dark theme
  };

  Object.entries(identifierToUpdate).forEach(([key, value]) => {
    updateIdentifier(key, value);
  });

  return readmeRow.join('\n');
}

const moodByDay = {
  1: 'hate',
  2: 'wickedness',
  3: 'pleasure',
  4: 'wickedness',
  5: 'cruelty',
  6: 'horror',
  7: 'love',
};

function getGabotSigning() {
  const mood = moodByDay[today.getDay() + 1];
  return `🤖 This README.md is updated with ${mood}`;
}

function getFortuneCookie() {
  return process.env.FORTUNE_COOKIE || 'No fortune cookie today.';
}

function getTodayDate() {
  return today.toDateString();
}

function getRandomDish() {
  const dishes = ['🍕', '🍔', '🧀', '🧇', '🌮', '🌯',
                  '🥪', '🍟', '🍿', '🍝', '🥐', '🥖',
                  '🥨', '🥯', '🍰', '🍫', '🍭', '🍧',
                  '🍦', '🧁', '🍨', '🍩', '🍪', '🎂'];
  const randomIndex = Math.floor(Math.random() * dishes.length);
  return dishes[randomIndex];
}

function getDBNWSentence() {
  const nextYear = today.getFullYear() + 1;
  const nextYearDate = new Date(String(nextYear));

  const timeUntilNewYear = nextYearDate.getTime() - today.getTime();
  const dayUntilNewYear = Math.round(timeUntilNewYear / msInOneDay);

  return `**${dayUntilNewYear} day before ${nextYear} ⏱**`;
}

const findIdentifierIndex = (rows, identifier) =>
  rows.findIndex((r) => Boolean(r.match(new RegExp(`<#${identifier}>`, 'i'))));

const updateREADMEFile = (text) => fs.writeFile('./README.md', text);

function main() {
  const newREADME = generateNewREADME();
  console.log(newREADME);
  updateREADMEFile(newREADME);
}

main();
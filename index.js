const { promises: fs } = require('fs');
const readme = require('./readme');
const { getWeatherInformationForToday, getWeatherInformationForTomorrow} = require('./src/weather');
const { getRandomBanner } = require('./src/banner');

const city = "Grenoble,FR";

const msInOneDay = 1000 * 60 * 60 * 24;

const today = new Date();

function getOpenWeatherMapAPIKey() {
  if (!process.env.OPEN_WEATHER_MAP_KEY) {
    console.error('Please provide an API Key for OpenWeatherMap');
    return null;
  }
  return process.env.OPEN_WEATHER_MAP_KEY;
}

function getFortuneCookie() {
  return process.env.FORTUNE_COOKIE || 'No fortune cookie today.';
}

async function generateNewREADME() {

  // Retrieve complete weather data
  const completeWeatherDataForToday = await getWeatherInformationForToday(getOpenWeatherMapAPIKey(), city);
  const completeWeatherDataForTomorrow = await getWeatherInformationForTomorrow(getOpenWeatherMapAPIKey(), city);

  // Extracting specific values
  const TodaysTemperature = completeWeatherDataForToday ? completeWeatherDataForToday.temperature : null;
  const TodaysFeltTemperature = completeWeatherDataForToday ? completeWeatherDataForToday.felt_temperature : null;
  const TodaysWeather = completeWeatherDataForToday ? completeWeatherDataForToday.weather : null;
  const TodaysSunRise = completeWeatherDataForToday ? completeWeatherDataForToday.sunrise : null;
  const TodaysSunSets = completeWeatherDataForToday ? completeWeatherDataForToday.sunset : null;
  // const TomorrowTemperature = completeWeatherDataForToday ? completeWeatherDataForToday.forecast.data.temperature : null;

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
    signing: getSigning(),
    RandomDish: getRandomDish(),
    todays_weather: TodaysWeather,
    todays_temperature: TodaysTemperature,
    todays_felt_temperature: TodaysFeltTemperature,
    todays_sun_rise: TodaysSunRise,
    todays_sun_sets: TodaysSunSets,
    tomorrow_weather: null,
    banner_light: getRandomBanner(false), // light theme
    banner_dark: getRandomBanner(true), // dark theme
  };

  Object.entries(identifierToUpdate).forEach(([key, value]) => {
    updateIdentifier(key, value);
    console.log(key, value);
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

function getSigning() {
  const mood = moodByDay[today.getDay() + 1];
  return `🤖 This README.md is updated with ${mood}`;
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

async function main() {
  const newREADME = await generateNewREADME();
  console.log(newREADME);
  await updateREADMEFile(newREADME);
}

main();
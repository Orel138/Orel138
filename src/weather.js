const fetch = require('node-fetch');

const DEBUG_LOG = false; // Set this variable to 'false' to disable debug logs, or 'true' to enable debug logs.

// Function to get today's weather information for a specified city
async function getWeatherInformationForToday(OPEN_WEATHER_MAP_KEY, city) {
  try {
    // Fetch current weather data from OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_MAP_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error(`HTTP Error ! status: ${response.status}`);
    }

    // Parsing the response as JSON
    const weatherData = await response.json();

    if (DEBUG_LOG) {
    // Display of weather data in logs.
    console.log(`Weather for today:`);
    console.log(weatherData);
    }

    // Storing today's weather information
    return {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: Math.round(weatherData.main.temp),
      felt_temperature: weatherData.main.feels_like,
      min_temperature: weatherData.main.temp_min,
      max_temperature: weatherData.main.temp_max,
      pressure: weatherData.main.pressure,
      humidity: weatherData.main.humidity,
      sea_level: weatherData.main.sea_level,
      grnd_level: weatherData.main.grnd_level,
      weather: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris',
      }),
      sunset: new Date(weatherData.sys.sunset * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris',
      })
    };
  } catch (error) {
    console.error('Error fetching today\'s weather data:', error);
    return null;
  }
}

// Function to get tomorrow's weather information for a specified city
async function getWeatherInformationForTomorrow(OPEN_WEATHER_MAP_KEY, city) {
  try {
    // Fetch weather forecast data from OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPEN_WEATHER_MAP_KEY}&units=metric`
    );

    if (!response.ok) {
        throw new Error(`HTTP Error ! status: ${response.status}`);
    }

    // Parsing the response as JSON
    const forecastData = await response.json();

    if (DEBUG_LOG) {
    console.log(`Weather for tomorrow:`);
    console.log(forecastData.list.slice(8, 16));
    }

    // Extracting and returning tomorrow's weather forecast
    // Assuming the data starts from today, tomorrow's forecast starts from the 8th interval (24 hours later)
    return forecastData.list.slice(8, 16).map(forecast => {
      return {
        time: new Date(forecast.dt * 1000).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Paris'
        }),
        temperature: Math.round(forecast.main.temp),
        humidity: forecast.main.humidity,
        weather: forecast.weather[0].description,
        icon: forecast.weather[0].icon
      };
    });
  } catch (error) {
    console.error('Error fetching tomorrow\'s weather data:', error);
    return null;
  }
}

// // Function to get today's weather information and format it as a string
// async function getWeatherInformationForTodayAsString(OPEN_WEATHER_MAP_KEY, city) {
//   const data = await getWeatherInformationForToday(OPEN_WEATHER_MAP_KEY, city);
//   if (data) {
//     return `Weather in ${city} today: ${data.temperature}°C, ${data.weather}. Sunrise at ${data.sunrise}, Sunset at ${data.sunset}.`;
//   } else {
//     return "Weather data not available.";
//   }
// }
  
// // Function to get tomorrow's weather information and format it as a string
// async function getWeatherInformationForTomorrowAsString(OPEN_WEATHER_MAP_KEY, city) {
//   const data = await getWeatherInformationForTomorrow(OPEN_WEATHER_MAP_KEY, city);
//   if (data) {
//     return `Weather forecast for ${city} tomorrow: ${data.map(forecast => `${forecast.time}: ${forecast.temperature}°C, ${forecast.weather}`).join('; ')}.`;
//   } else {
//     return "Weather forecast not available.";
//   }
// }

module.exports = { 
    getWeatherInformationForToday,
    getWeatherInformationForTomorrow,
    // getWeatherInformationForTodayAsString,
    // getWeatherInformationForTomorrowAsString,
 };

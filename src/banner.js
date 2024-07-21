function getRandomBanner(isDarkTheme) {
  const bannersLight = ['light-banner-1.png', 'light-banner-2.png'];
  const bannersDark = ['dark-banner-1.png'];

  // Choose the appropriate listing based on the theme
  const selectedList = isDarkTheme ? bannersDark : bannersLight;

  // Select an image randomly from the chosen list
  const randomIndex = Math.floor(Math.random() * selectedList.length);
  return selectedList[randomIndex];
}

module.exports = { getRandomBanner };

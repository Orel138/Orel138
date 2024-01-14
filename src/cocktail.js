const fetch = require('node-fetch');

const DEBUG_LOG = false; // Set this variable to 'false' to disable debug logs, or 'true' to enable debug logs.

// Function to get today's cocktail information
async function getCocktailForToday() {
  try {
    // Fetch current cocktail data from thecocktaildb API
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/random.php`
    );

    if (!response.ok) {
        throw new Error(`HTTP Error ! status: ${response.status}`);
    }

    // Parsing the response as JSON
    const Cocktail = await response.json();

    if (DEBUG_LOG) {
    // Display of Cocktail datas in logs.
    console.log(`Cocktail for today:`);
    console.log(Cocktail);
    }

    // Storing today's cocktail information
    return {
      idDrink: Cocktail.drinks[0].idDrink,
      strDrink: Cocktail.drinks[0].strDrink,
      strDrinkAlternate: Cocktail.drinks[0].strDrinkAlternate,
      strGlass: Cocktail.drinks[0].strGlass,
      strInstructions: Cocktail.drinks[0].strInstructions,
      strDrinkThumb: Cocktail.drinks[0].strDrinkThumb,
      strIngredientsAndMeasures: await extractIngredientsAndMeasures(Cocktail.drinks[0]),
      strDrinkPreview: Cocktail.drinks[0].strDrinkThumb + "/preview"
    };
  } catch (error) {
    console.error('Error fetching today\'s cocktail:', error);
    return null;
  }
}

async function extractIngredientsAndMeasures(data) {
  let ingredients = [];
  for (let i = 1; i <= 15; i++) {
      let ingredientKey = `strIngredient${i}`;
      let measureKey = `strMeasure${i}`;

      if (data[ingredientKey] || data[measureKey]) {
        ingredients.push(`${data[measureKey] || ''} ${data[ingredientKey] || ''}`.trim());
      }
  }
  return ingredients.join(', ');
}

module.exports = { 
    getCocktailForToday,
 };

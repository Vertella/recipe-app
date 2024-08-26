// File for managing recipes on my website using JSON bin for storage.

// Global variables and cinfiguration
let existingRecipes = []; //Array to store fetched recipes
// BIN ID and APIKEY
const binUrl = 'https://api.jsonbin.io/v3/b/66cb7080ad19ca34f89ae61b';  
const apiKey = '$2a$10$pTtkNZgkNGVbM03EImHjIeUcYi2f0qT6EvlAf6LfegR6VFdYeJAKS';

//DOMCOntentLoaded to make sure code runs after HTML has been loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchRecipes();  // Fetch and display recipes when the page loads

    // Function to handle the Add Recipe form submission
    const addRecipeForm = document.querySelector('#add-recipe-form');
    addRecipeForm.addEventListener('submit', async function(event) {
        event.preventDefault();  // Prevents the form from submitting the traditional way

        // Getting values from the form
        const title = document.querySelector('#recipe-title').value;
        const ingredients = document.querySelector('#recipe-ingredients').value.split(',').map(ing => ing.trim());
        const instructions = document.querySelector('#recipe-instructions').value;
        const image = document.querySelector('#recipe-image').value;

        // Creating a new recipe object
        const newRecipe = {
            title: title,
            ingredients: ingredients,
            instructions: instructions,
            image: image || '/images/mash.jpg'
        };

        // Adding the recipe to the JSON bin
        await addRecipe(newRecipe);

        // Fetching and displaying the updated recipes
        await fetchRecipes();

        // Clearing the form fields so you don't send another one
        addRecipeForm.reset();
    });
    const addRecipeBtn = document.getElementById('add-recipe-btn');
    const addRecipeContainer = document.getElementById('add-recipe-container');

    addRecipeBtn.addEventListener('click', function() {
        // Toggle the visibility of the form container
        if (addRecipeContainer.style.display === 'none' || addRecipeContainer.style.display === '') {
            addRecipeContainer.style.display = 'block';
            addRecipeBtn.textContent = 'Hide Form';
        } else {
            addRecipeContainer.style.display = 'none';
            addRecipeBtn.textContent = 'Add Recipe';
        }
    });
});

// Function to fetch recipes, when successful it updates "existingRecipes"
async function fetchRecipes() {
    try {
        const response = await fetch(binUrl, {
            headers: {
                'X-Access-Key': apiKey
            }
        });
        
        //Will throw error if connection issues
        if (!response.ok) { 
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Fetched data:', response.data)

        if (data.record && data.record.recipes) {
            existingRecipes = data.record.recipes;  // Update and store the existing recipes
            displayRecipes(existingRecipes);  // Display the recipes
        } else {
            document.querySelector('#recipes').innerHTML = '<p>No recipes available.</p>';
        }
    } catch (error) {
        console.error("error fetching recipes:", error);
        document.querySelector('#recipe-list').innerHTML = '<p>Failed to load recipes. Please try again later.</p>';
    
    }
}

// Function to display recipes on the page
function displayRecipes(recipes) {
    const recipeContainer = document.querySelector('#recipe-list');
    recipeContainer.innerHTML = '';  // Clear current recipes

    recipes.forEach((recipe, index) => {
        console.log('Current Index:', index);
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';

        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image || '/images/mash.jpg'}" alt="${recipe.title}" style="max-width: 100px; max-height: 100px;">
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <button class="view-recipe-btn">View Recipe</button>
            <button class="delete-recipe-btn" data-index="${index}">Delete Recipe</button>
            
        `;
        recipeContainer.appendChild(recipeCard);
    });

    addEventListenersToButtons();  // Adding event listeners after populating recipes, giving them buttons
}
// Function to add a recipe
async function addRecipe(newRecipe) {
    try {
        const updatedRecipes = [...existingRecipes, newRecipe];  // Adding the new recipe to the existing list
        const response = await fetch(binUrl, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': apiKey
            },
            body: JSON.stringify({ recipes: updatedRecipes })  // Send the updated list
        });
        const data = await response.json();
        console.log('Recipe added:', data);
    } catch (error) {
        console.error('Error adding recipe:', error);
    }
}


async function deleteRecipe(index) {
    try {
        existingRecipes.splice(index, 1);  // Removes the recipe at the given index

        const response = await fetch(binUrl, {
            method: 'PUT',  // Use 'PUT' to update the entire array after deletion
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': apiKey
            },
            body: JSON.stringify({ recipes: existingRecipes })  // Send the updated list
        });

        const data = await response.json();
        console.log('Recipe deleted:', data);

        // Re-fetch and display the updated recipes
        await fetchRecipes();

    } catch (error) {
        console.error('Error deleting recipe:', error);
    }
}

//For buttons
function addEventListenersToButtons() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach((card, index) => {
        const viewButton = card.querySelector('.view-recipe-btn');
        const deleteButton = card.querySelector('.delete-recipe-btn');

        viewButton.addEventListener('click', function() {
            alert('Showing details for ' + card.querySelector('h3').innerText);
            // Going to add dynamic load more details about the recipe or navigate to a detailed view page, haven't decided.
        });
    

        deleteButton.addEventListener('click', async function() {
            const confirmed = confirm('Are you sure you want to delete this recipe?');
            if (confirmed) {
                await deleteRecipe(index);  // Call the deleteRecipe function with the index
            }
        });
    });
};




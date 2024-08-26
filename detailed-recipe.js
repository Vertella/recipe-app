document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeIndex = urlParams.get('index');

    if (recipeIndex !== null) {
        fetchRecipeDetails(recipeIndex);
    } else {
        document.getElementById('recipe-details').innerHTML = '<p>No recipe selected.</p>';
    }
});

async function fetchRecipeDetails(index) {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/66cb7080ad19ca34f89ae61b', {
            headers: {
                'X-Access-Key': '$2a$10$pTtkNZgkNGVbM03EImHjIeUcYi2f0qT6EvlAf6LfegR6VFdYeJAKS'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        const recipe = data.record.recipes[parseInt(index, 10)];

        if (recipe) {
            document.getElementById('recipe-title').innerText = recipe.title;
            document.getElementById('recipe-image').src = recipe.image || '/images/mash.jpg';
            document.getElementById('recipe-ingredients').innerText = recipe.ingredients.join(', ');
            document.getElementById('recipe-instructions').innerText = recipe.instructions;
        } else {
            document.getElementById('recipe-details').innerHTML = '<p>Recipe not found.</p>';
        }
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        document.getElementById('recipe-details').innerHTML = '<p>Failed to load recipe details. Please try again later.</p>';
    }
}

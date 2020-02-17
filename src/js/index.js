import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from "./views/recipeView";
import {
    elements,
    renderLoader,
    clearLoader
} from "./views/base";
/*Global state of the app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
 */
const state = {};

// Search Controller
const controlSearch = async () => {
    //1. Get query from view
    const query = searchView.getInput();
    if (query) {
        //2. New search object and add to state
        state.search = new Search(query);
        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);
        try {
              //4. Search for recipes
              await state.search.getResult();
              //5. Render result from UI
              clearLoader();
              searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something went wrong !!');
            clearLoader();
            }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
})

//Recipe Controller

const controlRecipe = async () => {
        // Get the id from url
        const id = window.location.hash.replace('#', '');

        if (id) {
            //Prepare UI for change
            recipeView.clearRecipe(); 
            renderLoader(elements.recipe);
            // highlight selector
            if(state.search) searchView.highlightSelected(id);
            //Create new replace object
            state.recipe = new Recipe(id);
            try {
                //Get recipe data
                await state.recipe.getRecipe();
                state.recipe.parseIngredients();
                //Calculate servings and time
                state.recipe.calcTime();
                state.recipe.calcServings();
                //Render recipe
                clearLoader();
                recipeView.renderRecipe(state.recipe);
            } catch (err) {
                alert('Something went wrong !!');
            }

        }
    }
    ['hashchange', 'load'].forEach(event => {
        window.addEventListener(event, controlRecipe);
    });
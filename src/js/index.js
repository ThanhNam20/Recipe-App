import Search from './models/Search';
import Recipe from './models/Recipe';
import List from "./models/List";
import Like from "./models/Like"; 
import * as searchView from './views/searchView';
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
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
            // Highlight Selector
            if (state.search) searchView.highlightSelected(id);
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

// List Controller
const controlList = () => {
    //Create a new list if there is none yet
    if (!state.list) state.list = new List();

    //Adding each ingredient to the list 
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

//Like Controller
const controlLike = () => {
    if (!state.likes) state.likes = new Like();
    const currentID = state.recipe.id;

    //User has not yet like current recipe
    if (!state.likes.isLike(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
          currentID,
          state.recipe.title,
          state.recipe.author,
          state.recipe.img
        );
        //Toggle the like button

        //Add like to UI list
        console.log(state.likes);
    //User has like current recipe    
    } else {
        //Remove like from the state
        state.likes.deleteLike(currentID);
        //Toggle the like button

        //Remove like from UI list
        console.log(state.likes);
    }
};

//Handle delete and update list view events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //Handle detele event
    if (e.target.matches('.shopping__delete,.shopping__delete *')) {
        // Detele from state
        state.list.deleteItem(id);
        // Detele from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id,val);
    }
})

//Handling recipe button clicks 
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease,.btn-decrease *')) {
        // Decrease button is click
        if (state.recipe.servings > 1) {
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase,.btn-increase *')) {
        //Increase button is click 
        state.recipe.updateServings("inc");
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Adding ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love,.recipe__love *')) {
       // Like controller 
        controlLike();
    }
});

window.l = new List();


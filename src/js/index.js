import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from "./views/base";
/*Global state of the app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
 */
const state = {};
 
const  controlSearch = async() => {
    //1. Get query from view
    const query = searchView.getInput();
    if (query) {

        //2. New search object and add to state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput(); 
        searchView.clearResult(); 
        renderLoader(elements.searchRes);

        //4. Search for recipes
        await state.search.getResult();

        //5. Render result from UI
        clearLoader();
        searchView.renderResults(state.search.result);
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const  btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult(); 
        searchView.renderResults(state.search.result, goToPage);
    }
})
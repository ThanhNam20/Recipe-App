import { elements } from "./base";

export const getInput = () => {
    return elements.searchInput.value;
}

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => el.classList.remove('results__link--active'));

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
    } else {
        return title;
    }
    return `${newTitle.join(' ')}...`;
}

const renderRecipe = recipe => {
    const markup = `<li>
                    <a class="results__link " href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${
      recipe.title
    }">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(
                              recipe.title
                            )}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;
    
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

// type "prev" or next
const createButton = (page,type) => {
    return `<button class="btn-inline results__btn--${type}" data-goto = ${
      type === "prev" ? page - 1 : page + 1
    }>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${
                          type === "prev" ? "left" : "right"
                        }"></use>
                    </svg>
                    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
                </button>
               `;
}

const renderButtons = (page, numResults, resPrePage) => {
    const pages = Math.ceil(numResults / resPrePage);
    let button;
    if (page === 1 && pages > 1) {
        // Button to go the next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both button
        button = `${createButton(page, 'prev')}
                  ${createButton(page,'next')}`;
    }
    else if (page === pages& pages>1) {
        // only button to go the pre page
        button = createButton(page,'prev')
    }
    elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPrePage = 10) => {
    //Render Result
    const start = (page - 1) * resPrePage;
    const end = page*resPrePage ;

    recipes.slice(start, end).forEach(renderRecipe); 
    
    //render Button page
    renderButtons(page, recipes.length, resPrePage); 
};
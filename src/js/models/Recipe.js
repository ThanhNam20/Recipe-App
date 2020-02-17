import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(
              `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
            );
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
    
        } catch (error) {
            console.log(error);
            alert('Something went wrong!!');
        }
    }
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    };

    calcServings() {
        this.servings = 4;
    };

    parseIngredients() {  // ingredients = thành phần
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const newIngredients = this.ingredients.map(el => {
            //1. Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })
            //2.Remove parentheses
            ingredient = ingredient.replace(/["'()]/g, " ");
            //3. Parse ingredients into count, unit and  ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //There is a unit
                const arrCount = arrIng.slice(0, unitIndex)// ex
                let count;
                if (arrCount.length === 1) {
                    count = arrIng[0].replace('-','+');
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count: count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex +1).join(' ')
                } 

            } else if (parseInt(arrIng[0],10) ) {
                //There is no unit but first is a num
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // No uint anfd no num
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }
}
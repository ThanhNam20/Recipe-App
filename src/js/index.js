import axios from 'axios';

async function getResult(query) {
    try {
        const res = await axios(
          `https://forkify-api.herokuapp.com/api/search?q=${query}`
        );
        const recipes = res.data.recipes;
        console.log(recipes);
    } catch {
        alert('Someing went wrong!!')
    }
}
getResult('pizza');

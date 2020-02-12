import axios from "axios";

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResult(query) {
        try {
            const res = await axios(
                `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
            );
            this.result = res.data.recipes;
            console.log(this.result);
        } catch {
            alert("Someing went wrong!!");
        }
    }
}

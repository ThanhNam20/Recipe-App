import uniquid from "uniquid";

export default class List {
    constructor() {
        this.items = [];

    }
    addItem(count, unit, ingredient) {
        const item = {
          id: uniquid(),
          count,
          unit,
          ingredient
        };
    }
    deleteItem(id) {
        const index = this.items.findIndex(el => {
            return el.id === id;
        })
        this.item.splice(index, 1);
    }
    updateCount(id,newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
} 
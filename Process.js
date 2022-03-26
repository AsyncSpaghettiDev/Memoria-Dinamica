export default class Process {
    #id = 0;
    #space = 0;
    #max_space = 0;
    #active;
    #colors = [
        '#52595D', 
        '#7F5A58', 
        '#728FCE', 
        '#95B9C7',
        '#3B2F2F',
        '#00A36C',
        '#342D7E',
        '#F75D59',
        '#B666D2',
        '#98AFC7',
        '#C7A317']
    constructor(id, space, active = false) {
        this.#id = id;
        this.#space = space;
        this.#max_space = space;
        this.#active = active
    }

    get id() {
        return this.#id;
    }

    get space() {
        return this.#space;
    }

    get active() {
        return this.#active;
    }

    set max_space(value) {
        this.#max_space = value;
    }

    get max_space() {
        return this.#max_space;
    }

    get color(){
        return this.#colors[this.id % 11];
    }

    expand(new_process) {
        this.#id = new_process.id;
        this.#space = this.max_space;
        this.#active = true;
    }

    replace(new_process) {
        this.#id = new_process.id;
        this.#space = new_process.space;
        this.#active = true;
    }

    disable() {
        this.#active = false;
    }
}
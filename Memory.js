import Process from './Process.js';
export default class Memory {
    #memory = [];
    #memory_size = 0;
    #actual_memory_size = 0;
    constructor(size = 40) {
        this.#memory_size = size;

        for (let i = 0; i < this.#memory_size; i++) {
            this.memory.push(new Process(0, 0));
        }
    }

    /**
     * @param {number} value
     */
    set memory_size(value) {
        this.#memory_size = value;
    }

    set memory(value) {
        this.#memory = value;
    }

    get memory() {
        return this.#memory;
    }

    delete(process_toDelete){
        const index_toDelete = this.memory.findIndex(proce => proce.id == process_toDelete);
        if(index_toDelete != -1 && this.memory[index_toDelete].active){
            this.memory[index_toDelete].disable();
            this.#actual_memory_size -= this.memory[index_toDelete].max_space;
        }
    }

    first_fit(new_process) {
        this.#validate(new_process);
        for (let i = 0; i < this.#memory_size; ++i) {
            if (!this.memory[i].active && this.memory[i].space == 0) {
                this.#memory[i] = new_process;
                this.#actual_memory_size += new_process.space;
                break;
            }
            if(!this.memory[i].active && this.memory[i].space >= new_process.space){
                this.#memory[i].replace(new_process);
                this.#actual_memory_size += this.#memory[i].max_space;
                break;
            }
        }
    }

    best_fit(new_process) {
        this.#validate(new_process);

        let first_blank_space = -1;
        let possibilities = [];
        for (let i = 0; i < this.#memory_size; ++i) {
            if(first_blank_space == -1 && this.memory[i].space == 0 && !this.memory[i].active ) first_blank_space = i;

            if (this.memory[i].space > 0 && !this.memory[i].active && this.memory[i].space >= new_process.space) {
                possibilities.push([this.memory[i], i]);
            }
        }
        if(possibilities.length == 0){
            this.#memory[first_blank_space] = new_process;
            this.#actual_memory_size += new_process.space;
        }
        else{
            let smallest = null;
            let smallest_ID = null;
            for (const posible of possibilities) {
                if(smallest == null || smallest.space > posible[0].space ){
                    smallest = posible[0];
                    smallest_ID = posible[1];
                }
            }
            this.#memory[smallest_ID].replace(new_process);
            this.#actual_memory_size += this.#memory[smallest_ID].max_space;
        }
    }

    best_fit_expanded(new_process) {
        this.#validate(new_process);

        let first_blank_space = -1;
        let possibilities = [];
        for (let i = 0; i < this.#memory_size; ++i) {
            if(first_blank_space == -1 && this.memory[i].space == 0 && !this.memory[i].active ) first_blank_space = i;

            if (this.memory[i].space > 0 && !this.memory[i].active && this.memory[i].space >= new_process.space) 
                possibilities.push([this.memory[i], i]);
        }
        if(possibilities.length == 0){
            this.#memory[first_blank_space] = new_process;
            this.#actual_memory_size += new_process.space;
        }
        else{
            let smallest = null;
            let smallest_ID = null;
            for (const posible of possibilities) {
                if(smallest == null || smallest.space > posible[0].space ){
                    smallest = posible[0];
                    smallest_ID = posible[1];
                }
            }
            this.#memory[smallest_ID].expand(new_process);
            this.#actual_memory_size += this.#memory[smallest_ID].max_space;
        }
    }

    printProcess(){
        const container = document.createDocumentFragment();
        this.memory.map(process => {
            if(process.space != 0){
                const span = document.createElement('span');
                process.active ?span.classList.add('process') : span.classList.add('process', 'empty');
                span.setAttribute('id', process.id);
                span.style.setProperty("--size", `${process.max_space}ch`);
                span.style.setProperty("--process-size", `${process.space}ch`);
                span.style.setProperty("--color", `${process.color}`);
                container.append(span);
            }
        })
        return container;
    }

    #validate(new_process) {
        if (this.#memory.some(proce => proce.id == new_process.id)) throw new Error(409, "ID duplicado");
        if (this.#memory_size - this.#actual_memory_size < new_process.space) throw new Error(401, "Memoria Llena");
    }
}

function Error(id, message) {
    this.id = id;
    this.message = message;
    this.toString = function () {
        return ` Error ${this.id}, ${this.message}`
    };
}
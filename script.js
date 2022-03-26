import Memory from "./Memory.js";
import Process from "./Process.js";
const mem_value = document.querySelector('#memory-size-field');
const memory_display = document.querySelector('.dynamic-memory');
const add_process = document.querySelector('.add-process');
const del_process = document.querySelector('.delete-process');

mem_value.addEventListener('input', _ => {
    modSize();
});

const dynamic_memory = new Memory(40);
const updateMemory = () => memory_display.replaceChildren(dynamic_memory.printProcess());
updateMemory();

add_process.addEventListener('click', _ => {
    const id = parseInt(document.querySelector('#id-program').value);
    const space = parseInt(document.querySelector('#tamanio-program').value);
    const method = document.querySelector("input[name=metodo-program]:checked").value;
    try {
        const process_toAdd = new Process(id, space, true);
        switch (method) {
            case '0':
                dynamic_memory.first_fit(process_toAdd);
                break;

            case '1':
                dynamic_memory.best_fit(process_toAdd);
                break;

            case '2':
                dynamic_memory.best_fit_expanded(process_toAdd);
                break;
        }
        updateMemory();
        document.querySelector('#id-program').value = id + 1;
    }
    catch (e) {
        alert(e.toString());
    }
});

del_process.addEventListener('click', _ => {
    const id = parseInt(document.querySelector('#id-program-toDelete').value);
    dynamic_memory.delete(id);
    updateMemory();
})

const modSize = () => {
    memory_display.style.setProperty("--memory-size", `${mem_value.value}ch`);
    memory_display.setAttribute("memory-size", mem_value.value);
    dynamic_memory.memory_size = mem_value.value;
}

modSize();
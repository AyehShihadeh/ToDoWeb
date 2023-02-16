// SELECT ELEMENTS
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListElement = document.getElementById("todos-list");
const notificationElement = document.querySelector('.notification');

//storing a user’s selected theme in local storage so the page takes the -
// chosen theme by default every time they visit
const setTheme = (theme) => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
    }

//gets the theme item from localStorage and call the function 
//whenever the script is loaded
const getTheme = () => {
    const theme = localStorage.getItem('theme');
    theme && setTheme(theme);
    }

getTheme();

// VARS
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

// 1ST render ever
renderTodos();

// FORM SUBMIT 
form.addEventListener('submit', function(event) {
    event.preventDefault();

    saveTodo();
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
});

// saveTodo FUNCTION
function saveTodo(){
    const todoValue = todoInput.value;

    // check if todo input is empty
    const isEmpty = todoValue === '';

    // check for duplicate todos
    const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

    if(isEmpty){
        showNotification("Todo's input is empty!");
    }else if(isDuplicate){
        showNotification("Todo is already on list!");
    }else{
        if(EditTodoId >= 0){
            // update the edit todo
            todos = todos.map((todo, index) => ({
                ...todo,
                value: index === EditTodoId ? todoValue : todo.value,
            }));
            EditTodoId = -1;
        }else{
            todos.push({
                value: todoValue,
                checked: false    
            });
        }
        todoInput.value = '';
    }
}


// renderTodos FUNCTION
function renderTodos(){

    // clear element before a re-render 
    todosListElement.innerHTML = "";

    //RENDER TO-DO
    todos.forEach((todo, index) => {
        todosListElement.innerHTML += `
        <div class="todo" id=${index}>
            <i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}" data-action="check"></i>
            <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
            <i class="bi bi-pencil-square" data-action="edit"></i>
            <i class="bi bi-trash" data-action="delete"></i>
        </div> 
        `;
    });
}

// CLICK EVENT LISTENER FOR ALL THE TODOS
todosListElement.addEventListener('click', (event) => { 
    const target = event.target;
    const parentElement = target.parentNode;

    if(parentElement.className !== 'todo') return;


    // todo ID 
    const todo = parentElement;
    const todoId = Number(todo.id);

    // target action
    const action = target.dataset.action;

    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);

    console.log(todoId, action);

    });

// checkTodo FUNCTION
function checkTodo(todoId){
    todos = todos.map((todo, index) => ({
        ...todo,
        checked: index === todoId ? !todo.checked : todo.checked
    }));
    
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}


// editTodo FUNCTION
function editTodo(todoId){
    todoInput.value = todos[todoId].value;
    EditTodoId = todoId;
}


// deleteTodo FUNCTION
function deleteTodo(todoId){  
    todos = todos.filter((todo, index) => index != todoId);
    EditTodoId = -1;

    //re render
    renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}


// SHOW NOTIFICATION
function showNotification(msg){
    
    //change the message
    notificationElement.innerHTML = msg;

    //notification enter
    notificationElement.classList.add('notif-enter');

    //notification leaves
    setTimeout(() => {
        notificationElement.classList.remove('notif-enter');
    }, 2000);

}
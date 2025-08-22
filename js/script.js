(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

const themeBtn = document.querySelector('.header__theme-btn');
const themeIcon = document.querySelector('.header__theme-icon');

themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeIcon.src = isDark ? '../images/icon-sun.svg' : '../images/icon-moon.svg';
});


const form = document.querySelector('.todo__form')
const todoInput = document.querySelector('.todo__new-task');
const todoList = document.querySelector('.todo__list');
const clearCompletedBtns = document.querySelectorAll('.todo__clear-btn');
const todoCounter = document.querySelectorAll('.todo__counter');
const filterBtns = document.querySelectorAll('.todo__filter-btn');

let currentFilter = 'all';
let todos = JSON.parse(localStorage.getItem('todos')) || [];


function updateHTML(todo, index) {
  const li = document.createElement('li');
  li.className = 'todo__list-item';
  li.innerHTML = `
    <div class="todo__checkbox ${todo.completed ? 'checked' : '' }" tabindex="0"></div>
    <span class="todo__item-name ${todo.completed ? 'checked' : '' }">${todo.name}</span>
    <button class="todo__delete-btn"><img src="./images/icon-cross.svg" alt="Delete todo"></button>
  `

  li.querySelector('.todo__checkbox').addEventListener('click', () => {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
  });

  li.querySelector('.todo__delete-btn').addEventListener('click', () => {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  });

  todoList.appendChild(li);
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';
  
  const left = todos.filter(todo => !todo.completed).length;
  todoCounter.forEach(field => field.textContent = `${left} ${left === 1 ? 'item' : 'items'} left`);

  todos.forEach((todo, index) => {
    const show =
      currentFilter === 'all' ||
      (currentFilter === 'active' && !todo.completed) ||
      (currentFilter === 'completed' && todo.completed);

    if (show) updateHTML(todo, index);
  });

  filterBtns.forEach(btn => {
    const val = (btn.dataset.filter || btn.textContent).trim().toLowerCase();
    const isActive = val === currentFilter;
    btn.classList.toggle('todo__filter-btn--active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = todoInput.value.trim();
  if (!name) return;

  todos.push({ name, completed: false });
  saveTodos()
  renderTodos();
  todoInput.value = '';
});

clearCompletedBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
  });
});

filterBtns.forEach(btn => {
  btn.addEventListener('click' , () => {
    currentFilter = (btn.dataset.filter || btn.textContent).trim().toLowerCase();
    renderTodos();
  });
});

renderTodos();
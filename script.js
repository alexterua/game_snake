"use strict";

// размеры поля
var FIELD_SIZE_X = 20;
var FIELD_SIZE_Y = 20;

// скорость перемещения
var SNAKE_SPEED = 300; // интервал в мс м/у перемещениями
var snake = []; // змейка
var direction = "x-"; // по умолч. движется вверх, уменьшая координату x
var gameIsRunning = false; // по умолч. игра не запущена
var snake_timer; // скорость обновления змейки
var food_timer; // скорость обновления еды
var score = 0; // очки (кол-во съедененной еды)

function init () {
    prepareGameField(); // подготовка игрового поля
    // по нажатию на кнопку начинается игра
    document.querySelector('#snake-start').addEventListener('click', startGame);
    // по нажатию на кнопку происходит сброс игры
    document.querySelector('#snake-renew').addEventListener('click', refreshGame);
    // по нажатию на кнопки клавиатуры происходит перемещение змейки
    addEventListener('keydown', changeDirection);
}

// подготовка игрового поля
function prepareGameField() {
    var game_table = document.createElement('table'); // создали <table>
    game_table.classList.add('game-table'); // добавляем класс таблицы game-table

    // генерируем строки и ячейки игровой таблицы
    for (var i = 0; i < FIELD_SIZE_X; i++) {
        var row = document.createElement('tr'); // создали строку
        row.classList.add('game-table-row'); // с классом game-table-row
        row.dataset.row = i;    // добавили атрибут data-row = "i" (от 0 до 20)

        for (var j = 0; j < FIELD_SIZE_Y; j++) {
            var cell = document.createElement('td'); // создали ячейку
            cell.classList.add('game-table-cell'); // с классом game-table-cell
            cell.dataset.cell = i + '-' + j; // добавили атрибут data-row = "i-j" (от 0 до 20 - от 0 до 20)

            row.appendChild(cell); // создать ячейку в строке
        }
        game_table.appendChild(row); // создать строку в таблице
    }
    document.querySelector('#snake-field').appendChild(game_table); // выбрать поле и создать в поле таблицу
}

// запуск игры
function startGame () {
    gameIsRunning = true;    
    respawn();

    snake_timer = setInterval(move, SNAKE_SPEED); // move запустится ч/з SNAKE_SPEED мс
    // создание еды
    setTimeout(createFood, 5000); // еда создается ч/з 5сек после старта игры
}

// расположение змейки на игровом поле
function respawn () {
    /****   стандартаня длина змейки = 2 ячейки
            класс food-unit // позиция для еды
            класс snake-unit // позиция змейки   ****/ 

    // координаты центра
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);
    
    // атрибут расположения головы змейки "[data-cell='10-10']"
    var snake_head = document.querySelector("[data-cell='" + start_coord_x + "-" + start_coord_y +"']");
    snake_head.classList.add('snake-unit');

    // атрибут расположения хвоста змейки
    var snake_tail = document.querySelector("[data-cell='" + (start_coord_x - 1) + "-" + start_coord_y +"']");
    snake_tail.classList.add('snake-unit');

    snake.push(snake_head, snake_tail);
}

// перемещение змейки
function move () {
    var snake_head = snake[snake.length - 1];
    var new_unit;
    var snake_coords = snake_head.dataset.cell.split('-');
    var coord_x = parseInt(snake_coords[0]);
    var coord_y = parseInt(snake_coords[1]);    

    // определение новой точки
    if (direction == "x-") {
        new_unit = document.querySelector("[data-cell='" + (coord_x - 1) + '-' + coord_y + "']");
    } else if (direction == "x+") {
        new_unit = document.querySelector("[data-cell='" + (coord_x + 1) + '-' + coord_y + "']");
    } else if (direction == "y+") {
        new_unit = document.querySelector("[data-cell='" + coord_x + '-' + (coord_y + 1) + "']");
    } else if (direction == "y-") {
        new_unit = document.querySelector("[data-cell='" + coord_x + '-' + (coord_y - 1) + "']");
    }
    // проверяем, что new_unit - не часть змейки
    // и что змейка не дошла до границ
    if (!isSnakeUnit(new_unit) && new_unit !== null) {
        new_unit.classList.add('snake-unit'); // создаем дополнительную ячейку с классом 'snake-unit'
        snake.push(new_unit);

        // если змейка не ела, то убираем хвост
        if (!haveFood(new_unit)) {
            var removed = snake.splice(0, 1)[0];
            removed.classList.remove('snake-unit', 'food-unit');
        }
    } else {
        // игра закончена
        finishTheGame();
    }
    
}

// остановка игры
function finishTheGame () {
    gameIsRunning = false;
    clearInterval(snake_timer);
    alert('Игра окончена! Количество очков: ' + score);
}

// проверка принадлежит ли змейка точке на границе
function isSnakeUnit(unit) {
    var check = false;

    // includes() - метод проверки массива на совпадения
    if (snake.includes(unit)) {
        check = true;
    }

    return check;
}

// проверка на встречу с едой
function haveFood (unit) {
    var check = false;
    var isSnakeEating = unit.classList.contains('food-unit');

    // если змейка сьела еду
    if (isSnakeEating) {
        check = true;
        // создание новой еды
        createFood();
        // увеличение количества очков
        score++;
    }
    return check;
}

// создание еды
function createFood () {
    var foodCreated = false; // еда по умолч. не создана

    // координаты случайной клетки с едой
    var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
    var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);
    // ищем атрибут ячейки с едой
    var food_cell = document.querySelector("[data-cell ='" + food_x + '-' + food_y + "']");
    var isSnake = food_cell.classList.contains('snake-unit'); // true || false
    // если нет змейки
    if (!isSnake) {
        food_cell.classList.add('food-unit');
        foodCreated = true;
        console.log(food_cell, foodCreated);
    }
}

// передвижение змейки
function changeDirection (event) {
    switch (event.keyCode) {
        case 37: // кнопка влево
            if (direction != "y+") {
                direction = "y-";
            }
            break;
        case 38: // кнопка вверх
            if (direction != "x+") {
                direction = "x-";
            }
            break;
        case 39: // кнопка вправо
            if (direction != "y-") {
                direction = "y+";
            }
            break;
        case 40: // кнопка вниз
            if (direction != "x-") {
                direction = "x+";
            }
            break;
    }
}

// новая игра (сброс)
function refreshGame () {
    location.reload(); // перезагружает текущий url
}

window.onload = init;
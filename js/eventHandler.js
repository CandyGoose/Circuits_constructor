const LAMP = 'lamp';
const WIRE = 'wire';

var current = 'lamp';
var action = chooseElement
let flagQ = false;
let flagW = false;
let flagA = false;
let voltmeter = 12
let ammeter = 2


//нажатие на картинку в режиме работы
function handleWorkModeImage(e, cell) {

}

//нажатие на картинку в режиме строительства
function handleBuildModeImage(e, cell) {
    let previousElementName = current;
    let previousAction = action;
    if (e.ctrlKey) {
        if (e.shiftKey) {
            current = "rotate_left";
        } else current = "rotate_right";
        action = chooseInstrument;
    } else if (e.altKey) {
        current = 'clean';
        action = chooseInstrument;
    }
    action(cell);
    current = previousElementName;
    action = previousAction;
}

//нажатие на кнопку в режиме работы
function handleWorkModeButton(cell) {

}

function removeButtonsLighting() {
    let previous = document.getElementById(current);
    const regex = /wire/;
    if (previous.id.match(regex) !== null) document.getElementById('drop_wires').style.filter = '';
    previous.style.filter = '';
}

//нажатие на кнопку в режиме строительства
function handleBuildModeButton(cell) {

    removeButtonsLighting();
    //отсекаем рабочие кнопки
    if (cell.id === '' || cell.id === 'scale_plus' || cell.id === 'scale_minus'
        || cell.id === 'project_description' || cell.id === 'elements_description' || cell.id === 'instruction'
        || cell.id === 'button_for_default_circ') return;
    current = cell.id;
    document.getElementById(current).style.filter = 'brightness(50%)';
    let category = document.getElementById(current).closest('table').classList[0];
    let menue = document.getElementById(current).classList[0];
    switch (category) {
        case 'elements': //выбираем элемент
            if (menue === "drop_wires") {
                current = "wire";
                toggle_wires();
            }
            action = chooseElement;
            break;
        case 'instruments':
            if (current === 'clean_all') {
                clean_all();
                return;
            }
            action = chooseInstrument;
            break;
        default:
            break;
    }

}


$(document).ready(function () {

    //Отлавливаем клик по картинке и всегда ее заменяем на что-то указанной функцией
    $('body').on('click', 'img', function (event) {
        let e = event;
        let cell = this;
        if (MODE === BUILD) handleBuildModeImage(e, cell);
        else handleWorkModeImage(e, cell);

    });

    $('body').on('mouseover', 'img', function (event) {
        let cell = this;
        if (MODE === WORK) {
            let id = cell.id.split("_")[1]
            let button = document.getElementById("button_" + id);
            if (button !== null && button !== undefined) {
                button.style.backgroundColor = "lightpink";
            }
        }
    });

    $('body').on('mouseout', 'img', function (event) {
        let cell = this;
        if (MODE === WORK) {
            let id = cell.id.split("_")[1]
            let button = document.getElementById("button_" + id);
            if (button !== null && button !== undefined) {
                button.style.backgroundColor = "aliceblue";
            }
        }
    });

    // Отлавливаем нажатие на кнопку и выбираем, с каким элементом меню заботаем
    $('button').on('click', function () {
        let cell = this;
        if (MODE === BUILD) handleBuildModeButton(cell);
        else handleWorkModeButton(cell);

    });


});


function toggle_circuits() {
    document.getElementById("myСircuits").classList.toggle("show_list");
}

function toggle_wires() {
    document.getElementById("myWires").classList.toggle("show_list");
}

function toggle_U_and_R(e) {
    let id = e.getAttribute("id").toString().split("_");
    document.getElementById("UandR_" + id[1]).classList.toggle("show_list");
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'q' || event.key === 'й') {
        flagQ = true;
        voltmeter = parseFloat(document.querySelector('[class_name="voltmeter"]').value);
        ammeter = parseFloat(document.querySelector('[class_name="ammeter"]').value);
    }
});


document.addEventListener('keydown', function(event) {
    if (event.key === 'w' || event.key === 'ц') {
        flagW = true;
        voltmeter = parseFloat(document.querySelector('[class_name="voltmeter"]').value);
        ammeter = parseFloat(document.querySelector('[class_name="ammeter"]').value);
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'a' || event.key === 'ф') {
        flagA = true;
        voltmeter = parseFloat(document.querySelector('[class_name="voltmeter"]').value);
        ammeter = parseFloat(document.querySelector('[class_name="ammeter"]').value);
    }
});

window.onclick = function (event) {
    if (!event.target.matches('.drop_wires')) {
        document.getElementById("myWires").classList.remove("show_list");
    }
    if (!event.target.matches('.drop_circuits')) {
        document.getElementById("myСircuits").classList.remove("show_list");
    }
    for (let i = 0; i < N * M; i++) {
        if (document.getElementById("button_" + i) !== null) {
            //event.target.matches('#button_'+i)
            if (!(event.target.matches('.show_U_and_R') || event.target.matches('#button_' + i))) {
                document.getElementById("UandR_" + i).classList.remove("show_list");
            }
        }
    }
}



// Короткое замыкание
function circuits_one(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start, 'corner_wire_4'],
        [start + 1, 'current_source'],
        [start + 2, 'corner_wire'],

        [start + M, 'corner_wire_3'],
        [start + M + 1, 'wire'],
        [start + M + 2, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}

// Один резистор
function circuits_two(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start, 'corner_wire_4'],
        [start + 1, 'current_source'],
        [start + 2, 'corner_wire'],

        [start + M, 'corner_wire_3'],
        [start + M + 1, 'resistor'],
        [start + M + 2, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}

// Последовательное соединение
function circuits_three(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start, 'corner_wire_4'],
        [start + 1, 'current_source'],
        [start + 2, 'wire'],
        [start + 3, 'corner_wire'],

        [start + M, 'corner_wire_3'],
        [start + M + 1, 'resistor'],
        [start + M + 2, 'resistor'],
        [start + M + 3, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}

// Параллельное соединение
function circuits_four(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start, 'corner_wire_4'],
        [start + 1, 'wire'],
        [start + 2, 'current_source'],
        [start + 3, 'wire'],
        [start + 4, 'corner_wire'],

        [start + M, 'wire_2'],
        [start + M + 1, 'corner_wire_4'],
        [start + M + 2, 'resistor'],
        [start + M + 3, 'corner_wire'],
        [start + M + 4, 'wire_2'],

        [start + 2*M, 'corner_wire_3'],
        [start + 2*M + 1, 'triple_wire_2'],
        [start + 2*M + 3, 'triple_wire_4'],
        [start + 2*M + 4, 'corner_wire_2'],

        [start + 3*M + 1, 'corner_wire_3'],
        [start + 3*M + 2, 'resistor'],
        [start + 3*M + 3, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}

// Смешанное соединение
function circuits_five(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start, 'corner_wire_4'],
        [start + 1, 'wire'],
        [start + 2, 'wire'],
        [start + 3, 'current_source'],
        [start + 4, 'wire'],
        [start + 5, 'corner_wire'],

        [start + M, 'wire_2'],
        [start + M + 2, 'corner_wire_4'],
        [start + M + 3, 'resistor'],
        [start + M + 4, 'corner_wire'],
        [start + M + 5, 'wire_2'],

        [start + 2*M, 'corner_wire_3'],
        [start + 2*M + 1, 'resistor'],
        [start + 2*M + 2, 'triple_wire_2'],
        [start + 2*M + 4, 'triple_wire_4'],
        [start + 2*M + 5, 'corner_wire_2'],

        [start + 3*M + 2, 'corner_wire_3'],
        [start + 3*M + 3, 'resistor'],
        [start + 3*M + 4, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}


// Амперметр и вольтметр
function circuits_six(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start, 'corner_wire_4'],
        [start + 1, 'current_source'],
        [start + 2, 'ammeter'],
        [start + 3, 'corner_wire'],

        [start + M, 'triple_wire_4'],
        [start + M + 1, 'resistor'],
        [start + M + 2, 'resistor'],
        [start + M + 3, 'triple_wire_2'],

        [start + 2*M, 'corner_wire_3'],
        [start + 2*M + 1, 'voltmeter'],
        [start + 2*M + 2, 'wire'],
        [start + 2*M + 3, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}

// До соединения проводом
function circuits_seven(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start + 1, 'corner_wire_4'],
        [start + 2, 'resistor'],
        [start + 3, 'wire'],
        [start + 4, 'corner_wire'],

        [start + M, 'corner_wire_4'],
        [start + M + 1, 'triple_wire_2'],
        [start + M + 4, 'triple_wire_4'],
        [start + M + 5, 'corner_wire'],

        [start + 2*M, 'wire_2'],
        [start + 2*M + 1, 'corner_wire_3'],
        [start + 2*M + 2, 'resistor'],
        [start + 2*M + 3, 'ammeter'],
        [start + 2*M + 4, 'corner_wire_2'],
        [start + 2*M + 5, 'wire_2'],

        [start + 3*M, 'corner_wire_3'],
        [start + 3*M + 1, 'wire'],
        [start + 3*M + 2, 'resistor'],
        [start + 3*M + 3, 'ammeter'],
        [start + 3*M + 4, 'current_source'],
        [start + 3*M + 5, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}


// Закорочен проводом
function circuits_eight(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start - M + 1, 'corner_wire_4'],
        [start - M + 2, 'resistor'],
        [start - M + 3, 'wire'],
        [start - M + 4, 'corner_wire'],

        [start + 1, 'triple_wire_4'],
        [start + 2, 'wire'],
        [start + 3, 'wire'],
        [start + 4, 'triple_wire_2'],

        [start + M, 'corner_wire_4'],
        [start + M + 1, 'triple_wire_2'],
        [start + M + 4, 'triple_wire_4'],
        [start + M + 5, 'corner_wire'],

        [start + 2*M, 'wire_2'],
        [start + 2*M + 1, 'corner_wire_3'],
        [start + 2*M + 2, 'resistor'],
        [start + 2*M + 3, 'wire'],
        [start + 2*M + 4, 'corner_wire_2'],
        [start + 2*M + 5, 'wire_2'],

        [start + 3*M, 'corner_wire_3'],
        [start + 3*M + 1, 'wire'],
        [start + 3*M + 2, 'resistor'],
        [start + 3*M + 3, 'ammeter'],
        [start + 3*M + 4, 'current_source'],
        [start + 3*M + 5, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}

// Вольтметр 1
function circuits_nine(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start, 'corner_wire_4'],
        [start + 1, 'wire'],
        [start + 2, 'current_source'],
        [start + 3, 'wire'],
        [start + 4, 'wire'],
        [start + 5, 'corner_wire'],

        [start + M, 'wire_2'],
        [start + M + 1, 'corner_wire_4'],
        [start + M + 2, 'voltmeter'],
        [start + M + 3, 'wire'],
        [start + M + 4, 'corner_wire'],
        [start + M + 5, 'wire_2'],

        [start + 2*M, 'corner_wire_3'],
        [start + 2*M + 1, 'triple_wire_3'],
        [start + 2*M + 2, 'resistor'],
        [start + 2*M + 3, 'ammeter'],
        [start + 2*M + 4, 'triple_wire_3'],
        [start + 2*M + 5, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}

// Вольтметр 2
function circuits_ten(first = false) {
    if (!first) clean_all(false);
    let start = 53;
    let scheme = [
        [start, 'corner_wire_4'],
        [start + 1, 'wire'],
        [start + 2, 'current_source'],
        [start + 3, 'wire'],
        [start + 4, 'wire'],
        [start + 5, 'corner_wire'],

        [start + M, 'wire_2'],
        [start + M + 1, 'corner_wire_4'],
        [start + M + 2, 'voltmeter'],
        [start + M + 3, 'corner_wire'],
        [start + M + 5, 'wire_2'],

        [start + 2*M, 'corner_wire_3'],
        [start + 2*M + 1, 'triple_wire_3'],
        [start + 2*M + 2, 'resistor'],
        [start + 2*M + 3, 'triple_wire_3'],
        [start + 2*M + 4, 'ammeter'],
        [start + 2*M + 5, 'corner_wire_2']
    ]
    draw_circuit(start, scheme);
}


function draw_circuit(start, scheme) {
    let oldCurrent = current;
    let oldAction = action;

    for (let i = 0; i < scheme.length; i++) {
        current = scheme[i][1]
        let cell = document.getElementById("img_" + scheme[i][0])
        chooseElement(cell)
        if (scheme[i].length > 2) scheme[i][2](cell)
    }
    current = oldCurrent;
    action = oldAction;
}

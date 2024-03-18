const main_game = document.getElementById("mainGame");
const div_select_colors = document.getElementById("div-select-color");
const crack_button = document.getElementById("crack-btn");

let options = 4;
let trys = 8;
let colors = ["blue", "red", "yellow", "black", "pink", "green"];

let solutionColors = [];
let firstTry = 1;

startGame();

function startGame() {
  solutionColors = [];
  firstTry = 1;
  main_game.innerHTML = "";
  div_select_colors.innerHTML = "";

  //Creación de panel de intentos
  for (let i = 1; i <= trys; i++) {
    //Creación containers intentos fallidos
    let div_try = document.createElement("div");
    div_try.setAttribute("id", "try-" + i);
    div_try.setAttribute("class", "try");
    let div_left = document.createElement("div");
    div_left.setAttribute("class", "left");
    let div_right = document.createElement("div");
    div_right.setAttribute("class", "right");

    //Creación divs dentro del conatiner de cada intento
    for (let i = 1; i <= options; i++) {
      let div_l = document.createElement("div");
      let div_r = document.createElement("div");
      div_left.append(div_l);
      div_right.append(div_r);
    }

    div_try.append(div_left);
    div_try.append(div_right);
    main_game.prepend(div_try);
  }
  //Creación container para seleccionar respuesta
  for (let i = 1; i <= options; i++) {
    let div_select_wrapper = document.createElement("div");
    div_select_wrapper.setAttribute("class", "select-wrapper");
    let select = document.createElement("select");

    //Creación opciones select
    for (let color of colors) {
      let option = document.createElement("option");
      option.setAttribute("style", "background-color:" + color);
      option.setAttribute("value", color);
      select.append(option);
    }
    //Color select fondo predeterminado
    select.setAttribute("style", "background-color:" + colors[0]);

    //Cambio del color select de fondo al seleccionar un color
    select.addEventListener("change", (e) => {
      e.target.setAttribute("style", "background-color:" + e.target.value);
    });

    div_select_wrapper.append(select);
    div_select_colors.append(div_select_wrapper);
  }
  //Llama a la función que se encarga de generar uina solución aleatoria
  createRandomCode();
}

function createRandomCode() {
  //Genera un numero aleatorio y selecciona el color asignado en esa posición de la array
  for (let i = 1; i <= options; i++) {
    let random_color = colors[Math.floor(Math.random() * colors.length)];
    solutionColors.push(random_color);
  }
  //Mostrar por consola la solución
  console.log(solutionColors);
}

crack_button.addEventListener("click", (e) => {
  //Agarramos todos los valores de los select (colores) y los añadimos a una array para poder usar esos colores
  let input_colors = document.querySelectorAll(".select-wrapper>select");
  let input_colors_arr = [];
  for (let v of input_colors) {
    input_colors_arr.push(v.value);
  }
  show("left", input_colors_arr);
  correction_Array = createCorrectionArray(input_colors_arr);
  show("right", correction_Array);
  //Aumentamos el numero de intento
  firstTry++;
  checkWin(correction_Array);
});

function show(type, colors) {
  //Función pars asignar el color del intento realiado a los intentos ya introducidos
  let tryView = document.querySelectorAll(
    "#try-" + firstTry + ">." + type + ">div"
  );
  tryView.forEach((v, i) => {
    v.setAttribute("style", "background-color:" + colors[i]);
  });
}

function createCorrectionArray(input_colors_arr) {
  // Hacer una copia de la combinación secreta
  let solutionColors_copy = [...solutionColors];
  // Inicializar un array para almacenar los resultados de corrección
  let correction_Array = [];

  // Comparar los colores en la posición correcta
  for (let i in solutionColors_copy) {
    if (solutionColors_copy[i] == input_colors_arr[i]) {
      // Marcar los colores comparados como null para evitar repeticiones
      solutionColors_copy[i] = null;
      input_colors_arr[i] = null;
      // Agregar "red" al array de corrección
      correction_Array.push("red");
    }
  }

  // Comparar los colores en posición incorrecta
  for (let i in solutionColors_copy) {
    for (j in input_colors_arr) {
      if (
        solutionColors_copy[i] != null &&
        solutionColors_copy[i] == input_colors_arr[j]
      ) {
        // Marcar los colores comparados como null para evitar repeticiones
        solutionColors_copy[i] = null;
        input_colors_arr[j] = null;
        // Agregar "white" al array de corrección
        correction_Array.push("white");
      }
    }
  }
  // Devolver el array con los resultados de corrección
  return correction_Array;
}

function checkWin(correction_Array) {
  let countCorrect = 0;
  for (let v of correction_Array) {
    if (v == "red") {
      countCorrect++;
    }
  }
  if (countCorrect == options) {
    alert("FELICIDADES! HAS GANADO");
    startGame();
  } else if (firstTry > trys) {
    alert("Has perdido! Vuelve a jugar");
    startGame();
  }
}

/* Ejercicio interactivo: que version del problema y que algoritmo conviene (clase 12).
   Diez escenarios en palabras. Cada respuesta equivocada trae su explicacion. */
var EJERCICIO = (function () {
  var ALGS = [
    { clave: "bfs", nombre: "Búsqueda en amplitud (BFS)" },
    { clave: "dag", nombre: "Caminos en un DAG" },
    { clave: "dijkstra", nombre: "Dijkstra" },
    { clave: "bfm", nombre: "Bellman-Ford-Moore" },
    { clave: "fw", nombre: "Floyd-Warshall" },
    { clave: "nsssp", nombre: "n veces un algoritmo de SSSP" }
  ];

  /* version: "sssp" o "apsp"; alg: la clave del que conviene; ok: por que;
     no: una explicacion por cada algoritmo que no conviene; nover: por que la otra version no es. */
  var ESCENARIOS = [
    { titulo: "Peajes con subsidio",
      texto: "Una empresa de reparto sale de una sola bodega y quiere el costo mínimo hasta cada uno de los 300 barrios. Cada tramo tiene su peaje, y algunos peajes son negativos porque la ciudad devuelve un subsidio al pasar por zonas de bajas emisiones. Hay tramos de un solo sentido, rotondas y vueltas a la manzana, y se sabe que ningún recorrido circular sale ganando.",
      version: "sssp", alg: "bfm",
      ok: "Un origen y pesos negativos sin ciclos negativos: Bellman-Ford-Moore admite aristas negativas y cuesta O(n · m).",
      nover: "Hay una sola bodega: un origen y muchos destinos, que es SSSP. APSP pediría el costo entre cada par de barrios.",
      no: {
        bfs: "La amplitud minimiza el número de aristas, no el costo. Con peajes distintos, y más aún con unos negativos, el camino de menos tramos casi nunca es el más barato.",
        dag: "El algoritmo para grafos acíclicos pide un orden topológico, y esta red tiene rotondas y vueltas a la manzana, es decir ciclos. Ese orden no existe.",
        dijkstra: "Dijkstra da por definitivo el vértice de menor d que extrae. Con un peaje negativo más adelante puede aparecer un camino más barato hacia un vértice ya cerrado, y la respuesta sale mal.",
        fw: "Floyd-Warshall admite pesos negativos, pero calcula las distancias entre todos los pares, O(n³), cuando solo se pidió una fila. Para un origen basta O(n · m).",
        nsssp: "Repetir un algoritmo de origen único n veces entrega todos los pares. Aquí hay un solo origen, así que una invocación es suficiente." } },
    { titulo: "Cuatrocientas ciudades",
      texto: "Una aseguradora necesita la distancia por carretera entre cada par de sus 400 ciudades. Casi todas las ciudades tienen carretera directa con casi todas las demás, y las distancias son positivas.",
      version: "apsp", alg: "fw",
      ok: "Todos los pares en un grafo denso: m crece como n², y Floyd-Warshall lo resuelve en O(n³) con un código corto. Repetir Dijkstra n veces cuesta O(n³ log n).",
      nover: "Se piden las distancias entre cada par de ciudades y no desde una sola: es APSP.",
      no: {
        bfs: "La amplitud cuenta aristas. En una red casi completa casi todo par está a una arista, y la respuesta sería 1 para casi todos, sin importar los kilómetros.",
        dag: "Con carreteras en ambos sentidos hay ciclos por todas partes y no existe un orden topológico.",
        dijkstra: "Dijkstra llena una fila, la de un origen. Para la matriz haría falta invocarlo 400 veces, y en un grafo denso eso cuesta O(n³ log n), más que Floyd-Warshall.",
        bfm: "Un origen por invocación, y con 400 orígenes en un grafo denso la cuenta es O(n⁴): unas 2,6 · 10¹⁰ operaciones contra 6,4 · 10⁷ de Floyd-Warshall.",
        nsssp: "La idea es válida, pues APSP se resuelve con n invocaciones, pero en un grafo denso con Dijkstra sale O(n³ log n) y con Bellman-Ford-Moore O(n⁴). Floyd-Warshall lo hace en O(n³)." } },
    { titulo: "Estaciones de metro",
      texto: "Una red de metro tiene 120 estaciones, con tramos que van y vuelven entre estaciones vecinas. Un pasajero quiere saber cuántas estaciones debe recorrer, como mínimo, desde la estación donde está hasta cada una de las demás. Los tramos no tienen costo asociado.",
      version: "sssp", alg: "bfs",
      ok: "Sin pesos, el camino más corto es el de menos aristas, y la amplitud lo calcula en O(n + m).",
      nover: "El pasajero está en una sola estación: es un origen y muchos destinos.",
      no: {
        dag: "Un metro tiene líneas que van y vuelven, o sea ciclos. Sin orden topológico, este algoritmo no arranca.",
        dijkstra: "Funciona, porque sin pesos todos los tramos valen 1, pero cuesta O((n + m) log n) cuando la cola simple de la amplitud lo hace en O(n + m).",
        bfm: "También funciona, pero en O(n · m). Las rondas completas sobre todas las aristas sobran cuando todos los tramos cuestan lo mismo.",
        fw: "Calcula las 120 × 120 distancias, O(n³), y el pasajero pidió una sola fila.",
        nsssp: "Hay un solo origen, la estación del pasajero. Repetir el algoritmo n veces llena filas que nadie preguntó." } },
    { titulo: "Etapas de producción",
      texto: "Una línea de producción tiene 40 etapas. Una etapa solo empieza cuando terminaron las que la preceden, de modo que ninguna depende, directa o indirectamente, de sí misma. Pasar de una etapa a otra tiene un costo, y algunas transiciones dan un crédito, es decir, un costo negativo. Se quiere el costo mínimo de llegar desde la etapa inicial a cada una de las demás.",
      version: "sssp", alg: "dag",
      ok: "El grafo es acíclico: se ordena topológicamente y se relaja cada arista una vez, en O(n + m). Los pesos negativos no estorban porque sin ciclos no hay nada que abaratar sin límite.",
      nover: "Hay una etapa inicial de la que se parte: un origen y muchos destinos.",
      no: {
        bfs: "Los costos son distintos y algunos negativos. La amplitud cuenta etapas recorridas, no el costo.",
        dijkstra: "Con costos negativos Dijkstra puede cerrar un vértice demasiado pronto. Además aquí hay algo mejor: aprovechar que no hay ciclos.",
        bfm: "Admite negativos y daría la respuesta correcta, pero en O(n · m). El orden topológico la obtiene en O(n + m).",
        fw: "Calcula todos los pares en O(n³) cuando solo se pidió una fila.",
        nsssp: "Hay un único origen, la etapa inicial. Una invocación basta." } },
    { titulo: "Mapa de una ciudad",
      texto: "Una aplicación de mapas tiene 50 000 intersecciones y 150 000 tramos, con calles de doble sentido. Cada tramo tiene su tiempo en segundos, siempre positivo. Dada la ubicación de un usuario, calcula el tiempo mínimo hasta todas las intersecciones.",
      version: "sssp", alg: "dijkstra",
      ok: "Un origen y pesos positivos: Dijkstra con cola de prioridad cuesta O((n + m) log n), del orden de 3 · 10⁶ operaciones aquí.",
      nover: "Hay un usuario con una ubicación: un origen. Las distancias entre todos los pares no se piden.",
      no: {
        bfs: "Los tiempos son distintos. La amplitud minimiza el número de tramos, y una calle larga de un tramo puede tardar más que tres cortas.",
        dag: "Las calles de doble sentido son ciclos de dos aristas. No hay orden topológico.",
        bfm: "Funciona, pero hace O(n · m): unas 7,5 · 10⁹ relajaciones frente a las 3 · 10⁶ de Dijkstra. Sin pesos negativos no hace falta pagarlo.",
        fw: "O(n³) son 1,25 · 10¹⁴ operaciones y una matriz de 2 500 millones de celdas, para responder por un solo usuario.",
        nsssp: "Hay un solo usuario, un origen. Repetir n veces un algoritmo de SSSP multiplica el costo por 50 000." } },
    { titulo: "Millas con promociones",
      texto: "Una aplicación de millas aéreas modela cada vuelo como una arista con su costo en dólares, y las promociones convierten algunos vuelos en aristas negativas. Desde un aeropuerto de origen se quiere el costo mínimo hasta cada destino, y avisar si existe algún ciclo de vuelos que acumule ganancia sin límite.",
      version: "sssp", alg: "bfm",
      ok: "Con la ronda n, Bellman-Ford-Moore detecta los ciclos negativos alcanzables desde el origen, que es justo lo que se pide, además de admitir aristas negativas.",
      nover: "Hay un aeropuerto de origen. Se pide desde él hasta cada destino, no entre todos los pares.",
      no: {
        bfs: "Hay costos distintos, algunos negativos. La amplitud cuenta vuelos, y no sabe de ciclos de ganancia.",
        dag: "Un ciclo de vuelos es lo que este algoritmo supone que no existe: sin orden topológico no arranca, y menos sabría avisar.",
        dijkstra: "No admite aristas negativas y no detecta ciclos negativos: dentro de uno seguiría abaratando sin que el algoritmo lo note.",
        fw: "Podría detectar el ciclo en la diagonal, pero calcula todos los pares en O(n³) cuando se partió de un solo aeropuerto.",
        nsssp: "Hay un solo origen. Una invocación del algoritmo adecuado basta." } },
    { titulo: "Veinte mil intersecciones",
      texto: "Una empresa de logística necesita tener calculado el tiempo mínimo entre cada par de 20 000 intersecciones de una ciudad. Cada intersección se conecta con tres o cuatro vecinas, y los tiempos son positivos.",
      version: "apsp", alg: "nsssp",
      ok: "El grafo es disperso, m es del orden de n. Invocar Dijkstra desde cada origen cuesta O(n (n + m) log n), unas 3 · 10¹⁰ operaciones, contra 8 · 10¹² de Floyd-Warshall.",
      nover: "Se piden los tiempos entre cada par de intersecciones: APSP.",
      no: {
        bfs: "Los tiempos son distintos, y la amplitud minimiza el número de tramos. Además, una invocación llena una sola fila.",
        dag: "Una ciudad con calles de ida y vuelta tiene ciclos. No hay orden topológico.",
        dijkstra: "Es el algoritmo que conviene repetir, pero una invocación llena una sola fila. Para la matriz hay que invocarlo desde cada uno de los 20 000 orígenes, que es la opción de n veces un algoritmo de SSSP.",
        bfm: "Repetido n veces cuesta O(n² · m), unas 3 · 10¹³ operaciones. Sin pesos negativos, Dijkstra hace el mismo trabajo en mucho menos.",
        fw: "O(n³) son 8 · 10¹² operaciones. Floyd-Warshall conviene en grafos densos, y este es disperso." } },
    { titulo: "Grados de separación",
      texto: "Una red social con 5 000 usuarios y 20 000 amistades quiere el grado de separación entre cada par de usuarios: el menor número de amistades en cadena. Las amistades son mutuas y no llevan peso.",
      version: "apsp", alg: "nsssp",
      ok: "Sin pesos y con un grafo disperso, n amplitudes cuestan O(n (n + m)), unas 1,25 · 10⁸ operaciones, contra 1,25 · 10¹¹ de Floyd-Warshall.",
      nover: "Se pide el grado de separación entre cada par de usuarios: APSP.",
      no: {
        bfs: "La amplitud es el algoritmo adecuado, pero una invocación resuelve un origen. Para todos los pares hay que invocarla desde cada usuario, que es la opción de n veces un algoritmo de SSSP.",
        dag: "Las amistades mutuas son ciclos de dos aristas. No hay orden topológico.",
        dijkstra: "Repetido n veces sirve, pero sin pesos la amplitud hace lo mismo sin el factor log n de la cola de prioridad.",
        bfm: "Repetido n veces cuesta O(n² · m), unas 5 · 10¹¹ operaciones, frente a 1,25 · 10⁸ de n amplitudes.",
        fw: "O(n³) son 1,25 · 10¹¹ operaciones. Sin pesos y con pocas amistades por usuario, n amplitudes lo hacen mil veces más rápido." } },
    { titulo: "Robot en un almacén",
      texto: "Un robot recorre un almacén cuadriculado de 50 por 50 celdas, con estantes que bloquean algunas. Moverse a una celda vecina libre cuesta 3 segundos, siempre lo mismo. Se quiere el tiempo mínimo desde la puerta hasta cada celda libre.",
      version: "sssp", alg: "bfs",
      ok: "Todas las aristas pesan lo mismo: el camino más corto es el de menos aristas, y el tiempo es 3 · d[v]. La amplitud lo calcula en O(n + m).",
      nover: "Hay una sola puerta de salida: un origen y muchos destinos.",
      no: {
        dag: "El robot puede ir y volver entre celdas vecinas, y eso son ciclos de dos aristas.",
        dijkstra: "Funciona, pero cuesta O((n + m) log n) donde la amplitud, con pesos iguales, necesita O(n + m).",
        bfm: "Funciona, pero hace O(n · m) cuando con una cola alcanza O(n + m).",
        fw: "Son 2 500 celdas: O(n³) son 1,6 · 10¹⁰ operaciones para responder por una sola puerta.",
        nsssp: "Hay un solo origen, la puerta. No hace falta repetir nada." } },
    { titulo: "Productos financieros",
      texto: "Una consultora modela 300 productos financieros. De un producto a otro hay una arista con el costo de pasar del primero al segundo, positivo o negativo. Está garantizado que ningún ciclo suma un valor negativo. Casi todos los pares de productos tienen arista directa y se necesita el menor costo entre cada par.",
      version: "apsp", alg: "fw",
      ok: "Todos los pares en un grafo denso con aristas negativas y sin ciclos negativos: Floyd-Warshall las admite y cuesta O(n³), unas 2,7 · 10⁷ operaciones.",
      nover: "Se pide el menor costo entre cada par de productos: APSP.",
      no: {
        bfs: "Los costos son distintos y algunos negativos. La amplitud cuenta aristas, no costo.",
        dag: "Con casi todos los pares unidos en ambos sentidos hay ciclos por todas partes.",
        dijkstra: "Dijkstra no admite aristas negativas, ni solo ni repetido n veces, y además una sola invocación llena una fila.",
        bfm: "Es el único algoritmo de SSSP de la lista que admite negativos, pero repetido n veces en un grafo denso cuesta O(n⁴): unas 8,1 · 10⁹ operaciones contra 2,7 · 10⁷.",
        nsssp: "La idea de repetir un algoritmo de SSSP exige que ese algoritmo admita negativos, y el único que lo hace es Bellman-Ford-Moore, a O(n⁴) en un grafo denso. Floyd-Warshall resuelve el problema en O(n³)." } }
  ];

  function nombreAlg(clave) {
    var i = 0, r = "";
    while (i < ALGS.length) { if (ALGS[i].clave === clave) { r = ALGS[i].nombre; } i = i + 1; }
    return r;
  }

  /* Devuelve {ok, msg} para la version ("sssp" o "apsp") y el algoritmo escogidos. */
  function evaluar(sc, version, alg) {
    var res, partes = [];
    if (version !== sc.version) { partes.push(sc.nover); }
    if (alg !== sc.alg) { partes.push(sc.no[alg]); }
    if (partes.length === 0) {
      res = { ok: true, msg: "Correcto: " + (sc.version === "sssp" ? "SSSP" : "APSP") + " con " + nombreAlg(sc.alg) + ". " + sc.ok };
    } else {
      res = { ok: false, msg: partes.join(" ") };
    }
    return res;
  }

  return { algoritmos: ALGS, escenarios: ESCENARIOS, evaluar: evaluar, nombreAlg: nombreAlg };
})();

if (typeof module !== "undefined") {
  module.exports = EJERCICIO;
} else {
  (function () {
    var ESC = EJERCICIO.escenarios, actual = 0, hechos = [];
    var i = 0;
    while (i < ESC.length) { hechos.push(false); i = i + 1; }

    function marcar() {
      Array.prototype.forEach.call(document.querySelectorAll("#presets-esc button"), function (b, k) {
        b.classList.toggle("primario", k === actual);
        b.textContent = (k + 1) + (hechos[k] ? " ✓" : "");
      });
      var n = 0, j = 0;
      while (j < hechos.length) { if (hechos[j]) { n = n + 1; } j = j + 1; }
      document.getElementById("avance").textContent = n + " de " + ESC.length + " resueltos";
    }

    function mostrar() {
      var sc = ESC[actual];
      document.getElementById("rot-escenario").textContent = (actual + 1) + " de " + ESC.length + " · " + sc.titulo;
      document.getElementById("enunciado").textContent = sc.texto;
      document.getElementById("resp-version").value = "";
      document.getElementById("resp-alg").value = "";
      var v = document.getElementById("veredicto");
      v.className = "veredicto"; v.textContent = "";
      marcar();
    }

    function comprobar() {
      var version = document.getElementById("resp-version").value, alg = document.getElementById("resp-alg").value;
      var v = document.getElementById("veredicto"), r;
      if (version === "" || alg === "") {
        v.className = "veredicto mal";
        v.textContent = "Escoja la versión del problema y un algoritmo.";
      } else {
        r = EJERCICIO.evaluar(ESC[actual], version, alg);
        v.className = r.ok ? "veredicto bien" : "veredicto mal";
        v.textContent = r.msg;
        if (r.ok) { hechos[actual] = true; marcar(); }
      }
    }

    var botones = "", k = 0;
    while (k < ESC.length) { botones += "<button data-k='" + k + "'>" + (k + 1) + "</button>"; k = k + 1; }
    document.getElementById("presets-esc").innerHTML = "<span class='nota' style='margin-top:0'>Escenario:</span>" + botones;
    var opciones = "<option value=''>Escoja</option>";
    k = 0;
    while (k < EJERCICIO.algoritmos.length) {
      opciones += "<option value='" + EJERCICIO.algoritmos[k].clave + "'>" + EJERCICIO.algoritmos[k].nombre + "</option>";
      k = k + 1;
    }
    document.getElementById("resp-alg").innerHTML = opciones;
    mostrar();
    document.getElementById("btn-comprobar").addEventListener("click", comprobar);
    Array.prototype.forEach.call(document.querySelectorAll("#presets-esc button"), function (b) {
      b.addEventListener("click", function () {
        actual = parseInt(b.getAttribute("data-k"), 10);
        mostrar();
      });
    });
  })();
}

# Sesión 03: Redes Complejas

Red compleja

Es una estructura de datos tipo grafo, cuyos nodos representan a los agentes en un modelo y las aristas representan las relaciones entre ellos

---

Medidas

Grado: Es la adyacencia o número de aristas incidentes a un nodo

Distancia. Es el número de aristas entre un par de nodos

Distribución de grado: Histograma que representa el grado y el número de vertices que tienen ese grado

Intermediación: Es el número de caminos minimos que pasan por un nodo

Centralidad: Es el promedio de distancias de un nodo a los demas, entre más “central” sea un nodo este promedio el minimo

---

Tipos de redes

- Mundo pequeño: Donde la distancia de los nodos es aprox el log(n) n es el número de nodos. Son redes mas robustas (pueden fallar nodos sin consecuencia en la red)
- Aleatoria: Sigue una distribución de Poisson
- Libres de escala: Distribución de ley de potencia, pocos nodos muy conectados y muchos nodos poco conectados (Red sociales) Hub: Nodo altamente conectado. Son debiles ante disturbio ¿Que pasa si desconectamos un hub?

---

Tipos de redes

- Preferencial attachment: Dado un grafo se inserta un nuevo nodo y se conecta con mayor probabilidad al que esta más conectado: **barabasi_albert_graph**
- Random attachment: Dado un grafo se inserta un nuevo nodo y se conecta con cualquier con igual probabilidad. **erdos_renyi_graph**
- Mundo pequeño: Tenemos un grafo en el cual cada nodo tiene tiene k vecinos y tenemos una probabilidad de k de cambiar una conexión, estos nodos suelen colocarse en forma de anillo, Esta red tiene como longitud el log(n)
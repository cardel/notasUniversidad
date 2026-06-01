# Solución - Segundo Examen Parcial

---

## Pregunta 1 - Replicación y partición en PostgreSQL

**Escenario:** PostgreSQL con un nodo `primary` y un `standby` que replica de forma asíncrona. Se simula una partición desconectando al `standby`; durante la partición se inserta en `primary` y se lee en `standby`.

**Respuestas correctas: A, B, C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Con la replicación detenida, los cambios del `primary` no llegan al `standby`; la lectura ve datos viejos. |
| **B** | **Correcta** | El `primary` no depende del `standby` para escribir. El sistema sigue disponible y sacrifica la consistencia entre réplicas: es el comportamiento AP del teorema CAP. |
| **C** | **Correcta** | La replicación asíncrona reenvía los cambios pendientes cuando vuelve el enlace; las réplicas convergen. |
| **D** | Incorrecta | Es lo contrario: durante la partición el `standby` queda desactualizado. |
| **E** | Incorrecta | La replicación asíncrona admite un retraso entre `primary` y `standby`; no son idénticos en todo instante. |

---

## Pregunta 2 - Consistencia eventual con G-Counter

**Escenario:** dos nodos cuentan eventos y se sincronizan. Diseño (i): un entero que se sobrescribe al sincronizar. Diseño (ii): un vector por nodo cuya fusión toma el máximo posición a posición (G-Counter).

**Respuestas correctas: A, B, C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Al copiar el entero del otro nodo se pisa el conteo local; los incrementos hechos entre dos sincronizaciones se pierden. |
| **B** | **Correcta** | Cada nodo solo escribe en su posición; el máximo posición a posición nunca descarta incrementos y los nodos llegan al mismo vector. |
| **C** | **Correcta** | Una fusión asociativa, conmutativa e idempotente converge sin importar el orden de las sincronizaciones ni que una se repita. |
| **D** | Incorrecta | El diseño (i) usa menos memoria, pero sí pierde incrementos concurrentes. |
| **E** | Incorrecta | El G-Counter converge sin coordinador: esa es justamente su ventaja. |

---

## Pregunta 3 - Costo de los round-trips en red

**Escenario:** una aplicación hace 50 consultas secuenciales contra dos servidores con RTT de 4 ms y 200 ms; el cómputo por consulta es despreciable.

**Respuestas correctas: A, B, C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | 50 consultas secuenciales por 200 ms de RTT dan unos 10 s, casi todo en esperar la red. |
| **B** | **Correcta** | Las mismas 50 consultas por 4 ms dan unos 0,2 s; el patrón secuencial es igual, cambia solo el RTT. |
| **C** | **Correcta** | Si las 50 consultas viajan en una sola petición, se paga un único round-trip en lugar de 50. |
| **D** | Incorrecta | El ancho de banda fija el caudal de datos, no la latencia; no acorta la distancia que recorre la señal. |
| **E** | Incorrecta | Los tiempos son 10 s frente a 0,2 s: la latencia domina porque el cómputo por consulta es despreciable. |

---

## Pregunta 4 - Enlace estático vs dinámico en multietapa

**Escenario:** un Dockerfile multietapa compila C++ con `-static`. Al quitar `-static`, la imagen construye pero el contenedor falla con `libstdc++.so.6: cannot open shared object file`.

**Respuestas correctas: A, B, C, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Sin `-static` el binario se enlaza de forma dinámica: al ejecutarse busca `libstdc++` en el sistema. |
| **B** | **Correcta** | La etapa `gcc:13` traía el runtime de C++; `debian:bookworm-slim` no lo incluye, y solo esa imagen llega al despliegue. |
| **C** | **Correcta** | `-static` incrusta las bibliotecas dentro del binario; por eso la versión original corría en la imagen mínima. |
| **D** | Incorrecta | El `COPY --from=build` sí copió el binario: el contenedor llegó a ejecutarlo. El error es al cargar bibliotecas, no al encontrar el ejecutable. |
| **E** | **Correcta** | Recuperar `-static`, o instalar `libstdc++6` en la etapa final, le da al binario el runtime que le falta. |

---

## Pregunta 5 - Límites de recursos en contenedores

**Escenario:** `docker run --memory=64m` y un proceso que intenta reservar 200 MiB.

**Respuestas correctas: A, B, C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Al pedir más memoria que el límite, el kernel termina el proceso (OOM). |
| **B** | **Correcta** | Los límites de contenedor se aplican con cgroups del kernel del host. |
| **C** | **Correcta** | `--cpus=0.5` asigna la mitad de un núcleo repartiendo el tiempo de CPU. |
| **D** | Incorrecta | El límite no convierte el disco en memoria; el proceso falla al excederlo. |
| **E** | Incorrecta | El número de procesos se limita con `--pids-limit`, no con `--memory`. |

---

## Pregunta 6 - Traza de escrituras con y sin volumen

**Escenario:** una secuencia de comandos escribe sobre `/d/f.txt`; tres de los `docker run` montan el volumen `datos` y uno no lo monta.

**Respuestas correctas: A, B, C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | El 2.º comando escribe `uno` en el volumen y el 3.º le añade `dos`; el 5.º lee esas dos líneas. |
| **B** | **Correcta** | El 4.º comando corre sin `-v`: su `/d/f.txt` vive en la capa del contenedor y se descarta con `--rm`; el volumen no se toca. |
| **C** | **Correcta** | El 3.º comando usa `>>` sobre el archivo que el 2.º dejó en el volumen, así que añade una línea. |
| **D** | Incorrecta | El 5.º comando lee del volumen, donde `tres` nunca llegó; imprime `uno` y `dos`. |
| **E** | Incorrecta | `--rm` elimina el contenedor, no el volumen; `datos` se creó aparte con `docker volume create` y persiste. |

---

## Pregunta 7 - Healthchecks y dependencias en Compose

**Escenario:** `compose.yml` con healthcheck en `db`, `migrate` que depende de `service_healthy` y `web` que depende de `service_completed_successfully`.

**Respuestas correctas: A, B, C, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | `condition: service_healthy` retiene a `migrate` hasta que el healthcheck de `db` pase. |
| **B** | **Correcta** | `service_completed_successfully` exige que `migrate` termine sin error antes de arrancar `web`. |
| **C** | **Correcta** | Un contenedor «arriba» no implica un servicio «listo»; el healthcheck distingue ambos estados. |
| **D** | **Correcta** | Un `depends_on` simple ordena el arranque, pero no espera a que el servicio acepte conexiones. |
| **E** | Incorrecta | Compose opera sobre un host; no reprograma contenedores en otros nodos. |

---

## Pregunta 8 - Actualización gradual en Docker Swarm

**Escenario:** servicio con 6 réplicas, `parallelism: 2`, `delay: 5s`, `order: start-first`, `failure_action: rollback`.

**Respuestas correctas: A, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | `parallelism: 2` actualiza dos réplicas por lote y `delay: 5s` espacia los lotes. |
| **B** | Incorrecta | `start-first` hace lo contrario: arranca la réplica nueva antes de retirar la vieja. |
| **C** | Incorrecta | La actualización es gradual, por lotes; no detiene las 6 réplicas a la vez. |
| **D** | **Correcta** | Si se supera el umbral de fallos, `failure_action: rollback` vuelve a la versión anterior. |
| **E** | Incorrecta | `parallelism` indica cuántas se actualizan a la vez, no cuántas quedan activas. |

---

## Pregunta 9 - Distribución de réplicas en Docker Swarm

**Escenario:** clúster con 1 manager y 3 workers; un stack pide 6 réplicas de `web` restringidas a worker y 1 de `panel` restringida a manager.

**Respuestas correctas: A, B, C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | La restricción `node.role == worker` excluye al manager; las 6 réplicas van a los 3 workers. |
| **B** | **Correcta** | 6 réplicas entre 3 workers, con reparto parejo, dan unas 2 por worker. |
| **C** | **Correcta** | Swarm mantiene el número deseado: las réplicas de un worker caído se reprograman en los workers que quedan. |
| **D** | Incorrecta | `web` corre en los workers y sirve tráfico por su cuenta; la caída del manager no detiene esas réplicas. |
| **E** | Incorrecta | `panel` exige un nodo manager, y el clúster tiene uno; sí puede arrancar. |

---

## Pregunta 10 - Deployment con requests y limits

**Escenario:** Deployment con 3 réplicas y `requests` 100m/64Mi, `limits` 500m/128Mi.

**Respuestas correctas: A, B, C, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | El Scheduler ubica el Pod en un nodo que tenga libre lo pedido en `requests`. |
| **B** | **Correcta** | `requests` es lo reservado; `limits` es el techo de uso del contenedor. |
| **C** | **Correcta** | El Deployment reconcilia el estado: repone los Pods que faltan para llegar a 3. |
| **D** | **Correcta** | Superar el `limit` de memoria provoca la terminación del contenedor (OOMKilled). |
| **E** | Incorrecta | `100m` son 0,1 CPU (cien millicores), no 100 CPUs. |

---

## Pregunta 11 - Elección de tipo de Service y seguridad

**Escenario:** el `frontend` debe verse desde Internet y el `backend` solo desde el `frontend`. Un desarrollador expone el `backend` con `NodePort`.

**Respuestas correctas: A, B, C**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | `NodePort` abre un puerto en todos los nodos: el `backend` queda accesible desde fuera, justo lo que se quería evitar. |
| **B** | **Correcta** | `ClusterIP` da una IP interna; el `backend` solo sería alcanzable desde dentro del clúster, que es el requisito. |
| **C** | **Correcta** | El `frontend` sí debe verse desde Internet; `LoadBalancer` es el tipo adecuado para ese caso. |
| **D** | Incorrecta | `ClusterIP` es accesible desde dentro del clúster; el `frontend`, que corre ahí, seguiría consultando el `backend`. |
| **E** | Incorrecta | No es indiferente: `NodePort` además expone el servicio fuera del clúster; `ClusterIP` no. |

---

## Pregunta 12 - Probes en Kubernetes

**Escenario:** contenedor con `startupProbe` (30 intentos cada 2 s), `readinessProbe` y `livenessProbe`.

**Respuestas correctas: A, B, C, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | Kubernetes posterga readiness y liveness hasta que la `startupProbe` tenga éxito. |
| **B** | **Correcta** | Una `readinessProbe` fallida saca al Pod de los endpoints del Service, pero no lo reinicia. |
| **C** | **Correcta** | Una `livenessProbe` fallida de forma sostenida hace que Kubernetes reinicie el contenedor. |
| **D** | **Correcta** | 30 intentos cada 2 s dan hasta 60 s de arranque antes de declarar el fallo. |
| **E** | Incorrecta | Cada probe responde una pregunta distinta: ¿ya arrancó?, ¿puede recibir tráfico?, ¿sigue vivo? |

---

## Pregunta 13 - Tamaño de una matriz en GitHub Actions

**Escenario:** un workflow con `strategy.matrix` sobre 2 sistemas operativos y 3 versiones de Python.

**Respuestas correctas: A, B, C, D**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | La matriz cruza cada `os` con cada `python`: 2 × 3 = 6 ejecuciones del job. |
| **B** | **Correcta** | Las combinaciones de la matriz corren en paralelo, cada una en su propio runner. |
| **C** | **Correcta** | `ubuntu-latest` con Python 3.12 es una de las 6 combinaciones del producto. |
| **D** | **Correcta** | Una tercera dimensión multiplica el total: 2 × 3 × 2 = 12 ejecuciones. |
| **E** | Incorrecta | La matriz no produce una corrida secuencial: genera un job independiente por combinación. |

---

## Pregunta 14 - Condicionales en un workflow

**Escenario:** job `deploy` con `if: github.ref == 'refs/heads/main'` y un paso con `if: failure()`.

**Respuestas correctas: A, B, C, E**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | El `if` del job lo limita a los eventos sobre la rama `main`. |
| **B** | **Correcta** | `if: failure()` ejecuta el paso solo cuando un paso anterior falló. |
| **C** | **Correcta** | Es el efecto de la condición: ningún despliegue se lanza desde otras ramas. |
| **D** | Incorrecta | Con `if: failure()` el paso no corre si el despliegue tuvo éxito. |
| **E** | **Correcta** | Sin el `if` del job, cualquier `push` activaría el despliegue. |

---

## Pregunta 15 - Dependencias entre jobs con needs

**Escenario:** jobs `windows` y `mac` con `needs: linux`; el job `linux` falla.

**Respuesta correcta: A**

| Opción | Correcta | Análisis |
|--------|----------|----------|
| **A** | **Correcta** | `needs: linux` condiciona ambos jobs al éxito de `linux`; si falla, no se ejecutan. |
| **B** | Incorrecta | `needs` impone dependencia; sin él correrían en paralelo, pero aquí no es el caso. |
| **C** | Incorrecta | Cada job usa su propio runner y su propio sistema de archivos. |
| **D** | Incorrecta | GitHub Actions no reintenta un job fallido de forma automática. |
| **E** | Incorrecta | Ambos dependen de `linux`; el sistema operativo no cambia la dependencia. |

---

## Tabla resumen de respuestas

| Pregunta | Tema | Respuestas correctas |
|----------|------|----------------------|
| 1 | Replicación y partición en PostgreSQL | A, B, C |
| 2 | Consistencia eventual con G-Counter | A, B, C |
| 3 | Costo de los round-trips en red | A, B, C |
| 4 | Enlace estático vs dinámico en multietapa | A, B, C, E |
| 5 | Límites de recursos en contenedores | A, B, C |
| 6 | Traza de escrituras con y sin volumen | A, B, C |
| 7 | Healthchecks y dependencias en Compose | A, B, C, D |
| 8 | Actualización gradual en Docker Swarm | A, D |
| 9 | Distribución de réplicas en Docker Swarm | A, B, C |
| 10 | Deployment con requests y limits | A, B, C, D |
| 11 | Elección de tipo de Service y seguridad | A, B, C |
| 12 | Probes en Kubernetes | A, B, C, D |
| 13 | Tamaño de una matriz en GitHub Actions | A, B, C, D |
| 14 | Condicionales en un workflow | A, B, C, E |
| 15 | Dependencias entre jobs con needs | A |

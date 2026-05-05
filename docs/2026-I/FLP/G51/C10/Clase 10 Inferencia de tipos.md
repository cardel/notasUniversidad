# ¿Qué es inferencia de tipos?

Hasta ahora hemos realizado **chequeo de tipos** (type checking) de manera explícita:

1. Indicamos los tipos en los `proc` y en el `letrec`.
2. Las reglas del `proc` y del `app-exp` aplican sobre datos **etiquetados** (tipos explícitos).

## ¿Qué sucede si no especificamos los tipos?

Para esto vamos a agregar el **no-tipo** `"?"`, el cual va a emitir una **variable de tipo** (type variable), que es de **asignación única** (single assignment). Es decir, una vez que se le asigna un tipo concreto, no puede cambiar.

### Agregamos en la validación lo siguiente:

1. Si es tipo **etiquetado** (explícito), aplicamos el chequeo normal.
2. Si es **no-tipo** (`?`):
   - Si la variable de tipo **está establecida** (ya tiene un tipo asignado), la obtenemos y luego aplicamos chequeo normal.
   - Si **no está establecida**, la establecemos con el tipo que se infiere del contexto.

## Reglas de tipo para inferencia

Para aplicar esto necesitamos las **reglas de tipo** (type rules) del lenguaje:

1. **Regla del `if`**:  
   `if e1 then e2 else e3`  
   - $t(e1) = bool$  
   - $t(e2) = t(e3)$  
   - Salida: $t(e2)$

2. **Regla del `proc`**:  
   `proc(t1 x1, ..., tn xn) e`  
   - Tipo: $(t_1 * t_2 * \ldots * t_n) \to t(e)$  
   - Para obtener $t(e)$ debemos aplicar sobre `e` un **ambiente de tipo** (type environment) extendido con las etiquetas de los argumentos.

3. **Reglas de las primitivas** (procedimientos incorporados):
   - **Numéricas**: $(int * int) \to int$
   - **Relacionales**: $(int * int) \to bool$
   - **Lógicas**: $(bool * bool) \to bool$

4. **Regla del `letrec`**:  
   A diferencia del `proc`, tenemos la etiqueta de la **salida** de los procedimientos (para evitar evaluación recursiva infinita durante la inferencia).

5. **Regla del `let`**:  
   `let a = e1, b = e2 in e`  
   - $t(e)$ evaluado en un ambiente de tipo extendido con las etiquetas `a`, `b`, `c`, ...

## Ejemplos

```scheme
;; Ejemplo de inferencia fallida por tipo recursivo
let f = proc(? a) a in (f f)
;; Error: check-equal-type!: Can't unify: tvar1 occurs in type (tvar1 -> tvar1)
;; in expression #(struct:app-exp #(struct:var-exp f) (#(struct:var-exp f)))
```

**Explicación del error**:  
No podemos obtener $t_f$ porque:

$t_f = t_f \to t_f$

Esto no se puede unificar dado que es una expresión de tipos **recursiva** (ocurre el error de "occurs check" en la unificación). La variable de tipo `tvar1` aparece dentro de su propia definición, lo que genera un tipo infinito.

## Tabla resumen de conceptos

| Concepto | Descripción | Comentario adicional |
|----------|-------------|----------------------|
| **Chequeo de tipos** (type checking) | Verificación estática de tipos con anotaciones explícitas | Es un proceso **dirigido por sintaxis** (syntax-directed) |
| **Inferencia de tipos** (type inference) | Deducción automática de tipos sin anotaciones explícitas | Utiliza **variables de tipo** y **unificación** |
| **Variable de tipo** (type variable) | Representa un tipo desconocido que se instancia durante la inferencia | Se denota comúnmente con `?` o letras griegas ($\alpha$, $\beta$) |
| **Asignación única** (single assignment) | Una variable de tipo solo puede recibir un valor una vez | Similar a la lógica de **Prolog** o **asignación lógica** |
| **Unificación** (unification) | Proceso de igualar dos expresiones de tipo resolviendo variables | Algoritmo de **Robinson** (1965) |
| **Occurs check** | Verificación de que una variable no aparece dentro de su propia definición | Previene tipos recursivos infinitos como $t = t \to t$ |
| **Ambiente de tipo** (type environment) | Mapeo de identificadores a sus tipos en un contexto dado | Se extiende al entrar en ámbitos anidados |
| **Reglas de tipo** (type rules) | Reglas formales que definen cómo asignar tipos a expresiones | Siguen la estructura del **sistema de tipos de Hindley-Milner** |

### Comentarios adicionales sobre el tema

- La inferencia de tipos es fundamental en lenguajes como **ML**, **Haskell** y **OCaml**, donde permite escribir código sin anotaciones de tipo explícitas manteniendo la seguridad de tipos.
- El algoritmo de inferencia más conocido es el **algoritmo W** de Damas-Milner, que utiliza unificación con occurs check.
- El error del ejemplo `(f f)` es clásico: muestra que no todo programa bien formado sintácticamente tiene un tipo válido en un sistema de tipos simple.
- La diferencia clave entre `proc` y `letrec` en inferencia es que `letrec` requiere manejar la **recursión** con cuidado para evitar ciclos en la unificación.
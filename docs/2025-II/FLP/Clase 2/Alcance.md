Con la visibilidad de las variables a lo largo del código

# let

**Análisis del código con alcance léxico:**

```lisp
(let ((x 6) (y 7))           ; Nivel 1: x=6, y=7
  (*
    (let ((y 8))             ; Nivel 2: y=8 (oculta y=7)
      (+
        (let ((x 6) (y x))   ; Nivel 3: x=6, y=x → y=6 (del nivel 1)
          (+ x
            (let ((y 3) (x y)) ; Nivel 4: y=3, x=y → x=6 (del nivel 3)
              (+ x (+ 2 y)))))
        y))                  ; y=8 (del nivel 2)
    (let ((x 4))             ; Nivel 2': x=4 (oculta x=6)
      (- y x))))             ; y=7 (del nivel 1), x=4
```

**Evaluación paso a paso:**

1. **Nivel 1:** `x=6`, `y=7`
2. **Primer `let` interno (nivel 2):** `y=8` (oculta `y=7`)
3. **`let` anidado (nivel 3):** `x=6`, `y=x` → `y=6` (toma `x` del nivel 1)
4. **`let` más interno (nivel 4):** `y=3`, `x=y` → `x=6` (toma `y` del nivel 3)
   - `(+ x (+ 2 y))` → `(+ 6 (+ 2 3))` → `11`
5. **Nivel 3 continúa:** `(+ x [resultado 11])` → `(+ 6 11)` → `17`
6. **Nivel 2 continúa:** `(+ [resultado 17] y)` → `(+ 17 8)` → `25`
7. **Segundo `let` (nivel 2'):** `x=4` (oculta `x=6` del nivel 1)
   - `(- y x)` → `(- 7 4)` → `3` (toma `y=7` del nivel 1, `x=4` local)
8. **Operación final:** `(* [resultado 25] [resultado 3])` → `75`

**Resultado final:** `75`

**Reglas de alcance léxico:**
- Cada `let` crea un nuevo ámbito anidado
- Las referencias a variables resuelven al binding más cercano en el ámbito léxico
- Los bindings internos ocultan los externos con el mismo nombre
- Las referencias siempre usan el valor del ámbito donde fueron definidas, no donde son usadas

# let*

Es similar la let pero las ligaduras se conocen entre sí por el orden creación
**Análisis del código con `let*` (enlace secuencial):**

```scheme
(let* ((x 6) (y 7))          ; x=6, y=7
  (*
    (let* ((y 8))            ; y=8
      (+
        (let* ((x 6) (y x))  ; x=6, y=x → y=6 (x del binding anterior)
          (+ x
            (let* ((y 3) (x y)) ; y=3, x=y → x=3 (y del binding anterior)
              (+ x (+ 2 y)))))
        y))                  ; y=8
    (let* ((x 4))            ; x=4
      (- y x))))             ; y=7 (ámbito externo), x=4
```

**Evaluación paso a paso:**

1. **Primer `let*`:** `x=6`, `y=7`
2. **`let*` interno 1:** `y=8` (oculta `y=7`)
3. **`let*` interno 2:** `x=6`, `y=x` → `y=6` (usa `x=6` del binding anterior en el mismo `let*`)
4. **`let*` interno 3:** `y=3`, `x=y` → `x=3` (usa `y=3` del binding anterior)
   - `(+ x (+ 2 y))` → `(+ 3 (+ 2 3))` → `8`
5. **Continúa `let*` interno 2:** `(+ x [resultado 8])` → `(+ 6 8)` → `14`
6. **Continúa `let*` interno 1:** `(+ [resultado 14] y)` → `(+ 14 8)` → `22`
7. **`let*` final:** `x=4`
   - `(- y x)` → `(- 7 4)` → `3` (toma `y=7` del ámbito más externo)
8. **Operación final:** `(* [resultado 22] [resultado 3])` → `66`

**Resultado final:** `66`

**Diferencia clave con `let` normal:**
- `let*` permite referenciar bindings anteriores **en el mismo `let*`**
- En `(let* ((x 6) (y x))`, `y` puede usar el valor de `x` recién bindeado
- En `let` normal esto produciría error porque todos los bindings son paralelos

**Ámbito léxico se mantiene:** Las referencias a variables fuera de los `let*` siguen las mismas reglas de ámbito léxico que `let` normal.

# letrec
**Aclaración correcta:** Efectivamente, `letrec` funciona como `let*` para valores no recursivos, pero permite referencias mutuas para funciones.

**Código corregido y análisis:**

```scheme
(letrec ((x 6) (y 7) (f (lambda (x y) (if (> x 0) (f (- x 1) y) y))))
  (*
    (letrec ((y 8))                    ; y=8
      (+
        (letrec ((x 6) (y x))          ; x=6, y=x → y=6 (usa x del mismo letrec)
          (+ x
             (letrec ((y 3) (x y))     ; y=3, x=y → x=3 (usa y del mismo letrec)
               (+ x (+ 2 y)))))        ; (+ 3 (+ 2 3)) = 8
        y))                            ; y=8 → (+ 14 8) = 22
    (letrec ((x 4))                    ; x=4
      (- y x))))                       ; y=7 (ámbito externo), x=4 → (- 7 4)=3
```

**Evaluación paso a paso:**

1. **Ámbito principal:** `x=6`, `y=7`, `f` definida
2. **Primer `letrec` interno:** `y=8`
3. **Segundo `letrec` interno:** `x=6`, `y=x` → `y=6` (referencia válida dentro del mismo `letrec`)
   - `(+ x ...)` → `(+ 6 ...)`
4. **Tercer `letrec` interno:** `y=3`, `x=y` → `x=3` (referencia válida)
   - `(+ x (+ 2 y))` → `(+ 3 (+ 2 3))` → `8`
5. **Resultado nivel 3:** `(+ 6 8)` → `14`
6. **Resultado nivel 2:** `(+ 14 8)` → `22`
7. **Cuarto `letrec`:** `x=4`
   - `(- y x)` → `(- 7 4)` → `3` (toma `y=7` del ámbito principal)
8. **Resultado final:** `(* 22 3)` → `66`

**Comportamiento de `letrec`:**
- Para valores simples: funciona como `let*` - cada binding puede referenciar bindings anteriores en el mismo `letrec`
- Para funciones: permiten autorreferencia y referencias mutuas entre bindings del mismo `letrec`
- El ámbito se crea de una vez, permitiendo referencias circulares entre todos los bindings

**Resultado final:** `66` (igual que con `let*` en este caso específico)
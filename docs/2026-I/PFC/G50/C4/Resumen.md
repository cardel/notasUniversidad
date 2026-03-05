## Resumen de conceptos de currificación

**Currificación**: Proceso de transformar funciones de múltiples argumentos en cadenas de funciones de un solo argumento. Nombrado en honor al lógico Haskell Curry, permite la descomposición de funciones complejas en unidades más simples y composables.

**Mecanismo fundamental**: Una función `f: (A, B) → C` se transforma en `f': A → (B → C)`, donde `f'` toma un argumento de tipo `A` y retorna una función `B → C`.

**Sintaxis en Scala**:
- Tradicional: `def suma(a: Int, b: Int): Int`
- Currificada: `def sumaC(a: Int)(b: Int): Int`
- Explícita: `def sumaD(a: Int): Int => Int`

**Aplicación parcial**: Técnica relacionada que permite fijar algunos argumentos de una función para crear funciones más especializadas. Ejemplo: `val sumaConUno = sumaC(1)_` crea una función que siempre suma 1 a su argumento.

## Conceptos teóricos adicionales

**Isomorfismo de Curry-Howard**: La currificación tiene fundamentos en lógica formal, donde corresponde a la equivalencia entre `(A ∧ B) → C` y `A → (B → C)` en lógica proposicional.

**Closures**: Las funciones currificadas crean closures que capturan el entorno (valores de argumentos ya aplicados), permitiendo mantener estado entre aplicaciones.

**Equivalencia con tuplas**: Existe una correspondencia biyectiva entre funciones currificadas y funciones que toman tuplas: `(A, B) → C ≅ A → (B → C)`.

## Aplicaciones prácticas

1. **Configuración incremental**: En frameworks como Akka HTTP, las rutas se construyen mediante currificación, permitiendo añadir middleware y handlers gradualmente:
   ```scala
   path("api") {
     get { complete("GET") } ~
     post { entity(as[User]) { user => complete(createUser(user)) } }
   }
   ```

2. **Inyección de dependencias**: Patrón Reader Monad utiliza currificación para pasar configuraciones implícitamente:
   ```scala
   def servicio(config: Config)(param: Input): Output = {
     // Usa config sin pasarlo explícitamente en cada llamada interna
   }
   ```

3. **DSLs internos**: Creación de lenguajes específicos de dominio expresivos:
   ```scala
   // Ejemplo: DSL para pruebas
   test("suma") { using(database) { db =>
     assert(db.query(1 + 2) == 3)
   }}
   ```

4. **Optimización de rendimiento**: En procesamiento de datos (Spark), la currificación permite pre-compilar partes de transformaciones:
   ```scala
   val transformacionBase = sparkTransformation(configFija)_
   // Reutilizable con diferentes datos
   val resultado1 = datos1.map(transformacionBase(param1))
   val resultado2 = datos2.map(transformacionBase(param2))
   ```

5. **Composición funcional**: Base para combinadores como `compose` y `andThen`:
   ```scala
   val procesar = (limpiar _).compose(validar _).compose(parsear _)
   ```

**Importancia**: La currificación no es solo un ejercicio académico; es fundamental para escribir código modular, reusable y expresivo. Permite crear abstracciones poderosas, reducir duplicación y construir sistemas más mantenibles al separar claramente la configuración de la ejecución.

## Motivación

Dominar la currificación transforma tu forma de pensar sobre problemas complejos. Te permite descomponer funciones en partes manejables, crear herramientas reutilizables y escribir código que se lee como una descripción clara de lo que hace, no solo cómo lo hace. Esta habilidad es lo que separa a quienes solo escriben código funcional de quienes realmente piensan funcionalmente, abriendo puertas a arquitecturas más elegantes y soluciones más robustas en tu carrera como desarrollador.
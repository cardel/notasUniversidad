# Sesión 10: GUI

Para instalar la librería

```bash
py -m pip install tk
```

Para probar que todo esta bien

```python
from tkinter import *
```

Que elementos tenemos:

- Labels: Los textos en la GUI
- Widget: Que es la ventana
- Entry: Que son entradas / salidas
- Button: Los botones que van atados a una función sin argumentos de entrada

¿Como unimos?

Basicamente estamos colocando fila por fila en el orden que hacemos pack()

Aquí te dejo un ejemplo sencillo de una interfaz gráfica usando `tkinter` para sumar dos números. Cada línea está comentada para explicar su función:

```python
from tkinter import *  # Importamos todo desde la librería tkinter

def sumar():  # Definimos una función para sumar los números
		resultado.delete(0,END)
    resultado.insert(0,float(num1.get()) + float(num2.get()))  # Convertimos las entradas en flotantes y las sumamos. El resultado se establece en la variable resultado

raiz = Tk()  # Creamos la ventana raíz

num1 = 0 # Definimos las variables para guardar las entradas
num2 = 0
resultado = Entry(raiz, width=10)

etiqueta1 = Label(raiz, text="Número 1")  # Creamos las etiquetas para las entradas
etiqueta1.pack()  # Las colocamos en la interfaz
entrada1 = Entry(raiz, textvariable=num1)  # Creamos las entradas y las vinculamos a sus variables correspondientes
entrada1.pack()

etiqueta2 = Label(raiz, text="Número 2")
etiqueta2.pack()
entrada2 = Entry(raiz, textvariable=num2)
entrada2.pack()

boton = Button(raiz, text="Sumar", command=sumar)  # Creamos un botón que llame a la función sumar cuando se presione
boton.pack()

etiqueta_resultado = Label(raiz, text="Resultado")  # Creamos una etiqueta para mostrar el resultado
etiqueta_resultado.pack()
entrada_resultado = Entry(raiz, textvariable=resultado)  # Creamos una entrada para mostrar el resultado. Esta entrada está vinculada a la variable resultado
entrada_resultado.pack()
resultado.pack()

raiz.mainloop()  # Iniciamos el bucle principal de la interfaz

```

# Pygame

```python
py -m pip install pygame
```
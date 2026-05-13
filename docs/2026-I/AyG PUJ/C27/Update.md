$[8,5,3,9,0,1,2,3,4,9]$

Deseo hacer $A[3] = 10$ mi arreglo queda $[8,5,3,10,0,1,2,3,4,9]$

Inicialmente para $[8,5,3,9,0,1,2,3,4,9]$ el arbol es:

```mermaid
graph TD
	A["[0,9],44"] --> B["[0,5],26"]
	A --> C["[6,9],18"]
	B --> D["[0,3],25"]
	B --> E["[4,5],1"]
	C --> F["[6,7],5"]
	C --> G["[8,9],13"]
	D --> H["[0,1],13"]
	D --> I["[2,3],12"]
	E --> J["[4],0"]
	E --> K["[5],1"]
	F --> L["[6],2"]
	F --> M["[7],3"]
	G --> N["[8],4"]
	G --> O["[9],9"]
	H --> P["[0],8"]
	H --> Q["[1],5"]
	I --> R["[2],3"]
	I --> S["[3],9"]
```

Y ahora con el cambio $[8,5,3,10,0,1,2,3,4,9]$

```mermaid
graph TD
	A["[0,9],44 --> 45"] --> B["[0,5],26 --> 27"]
	A --> C["[6,9],18"]
	B --> D["[0,3],25 --> 26"]
	B --> E["[4,5],1"]
	C --> F["[6,7],5"]
	C --> G["[8,9],13"]
	D --> H["[0,1],13"]
	D --> I["[2,3],12 --> 13"]
	E --> J["[4],0"]
	E --> K["[5],1"]
	F --> L["[6],2"]
	F --> M["[7],3"]
	G --> N["[8],4"]
	G --> O["[9],9"]
	H --> P["[0],8"]
	H --> Q["[1],5"]
	I --> R["[2],3"]
	I --> S["[3],9 --> 10"]
```

En la actualizacion vamos a afectar directamente los ancentros de la posición que estamos modificando

# Evaluación perezosa

Tenemos cuando vamos a actualizar un rango, no necesiamente tenemos que actualizar todos los vertices asociados a esa actualización, por ejemplo para este caso, por ejemplo para el arreglo inicial vamos a aplicar update-range(1,4,10) $[8,5,3,9,0,1,2,3,4,9]$ 
```mermaid
graph TD
	A["[0,9],44+10"] --> B["[0,5],26"]
	A --> C["[6,9],18"]
	B --> D["[0,3],25+10"]
	B --> E["[4,5],1+10"]
	C --> F["[6,7],5"]
	C --> G["[8,9],13"]
	D --> H["[0,1],13+10"]
	D --> I["[2,3],12+L=10"]
	E --> J["[4],0"]
	E --> K["[5],1'"]
	F --> L["[6],2"]
	F --> M["[7],3"]
	G --> N["[8],4"]
	G --> O["[9],9"]
	H --> P["[0],8"]
	H --> Q["[1],5+10"]
	I --> R["[2],3"]
	I --> S["[3],9"]
```

En este caso no tocamos las hojas 2 y 3 fdado que quedan con una operacion pendiente L = 10 en el nodo 2 y 3 que esta contenido en el rango 1,4 que actualizamos.

En este caso no propagamos todos los cambios al arbol de segmentos.
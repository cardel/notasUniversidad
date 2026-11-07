# dict y set: una tabla hash con valor y una sin valor.
precios = {"pan": 1800, "leche": 4200}
precios["queso"] = 9500        # inserta
precios["pan"] = 2000          # ya estaba: cambia
print(precios)
print(precios["leche"], precios.get("cafe", 0))
print("queso" in precios, "cafe" in precios)
del precios["leche"]
print(precios, len(precios))

# la lista de asistencia de la clase del set de C++
llegan = [42, 17, 88, 17, 5, 63, 42, 30]
vinieron = set()
for codigo in llegan:
    vinieron.add(codigo)
print(vinieron, len(vinieron))
print(17 in vinieron, 18 in vinieron)
vinieron.discard(17)
print(sorted(vinieron))

def armar(lugares, caminos):
    # Lista de adyacencia indexada por el nombre del lugar.
    adj = {}
    for lugar in lugares:
        adj[lugar] = []
    for origen, destino in caminos:
        adj[origen].append(destino)
    return adj


def visitar(adj, prohibidos, u, visto, orden):
    # Profundidad que no toma un camino si su par esta cerrado.
    visto.add(u)
    orden.append(u)
    for v in adj[u]:
        if (u, v) not in prohibidos and v not in visto:
            visitar(adj, prohibidos, v, visto, orden)


def alcanzables(lugares, caminos, cerrados, inicio):
    # Los lugares a los que se llega, en orden de descubrimiento.
    adj = armar(lugares, caminos)
    prohibidos = set()
    for origen, destino in cerrados:
        prohibidos.add((origen, destino))
    visto = set()
    orden = []
    visitar(adj, prohibidos, inicio, visto, orden)
    return orden


def main():
    lugares = ["Plaza", "Parque", "Rio", "Museo", "Faro", "Mina"]
    caminos = [("Plaza", "Mina"), ("Plaza", "Parque"), ("Parque", "Rio"),
               ("Rio", "Museo"), ("Museo", "Rio"), ("Museo", "Faro")]
    cerrados = [("Plaza", "Mina"), ("Museo", "Rio")]
    print(alcanzables(lugares, caminos, cerrados, "Plaza"))


if __name__ == "__main__":
    main()

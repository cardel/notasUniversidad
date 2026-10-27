"""
Implementación Algoritmo de Floyd-Warshall

"""

def floydWarshallNoOpt(w):
    n = len(w)
    d = [[[float("inf") for j in range(n)] for i in range(n)] for _ in range(n + 1)]
    nex = [[[-1 for j in range(n)] for i in range(n)] for _ in range(n + 1)]

    for i in range(n):
        for j in range(n):
            d[0][i][j] = w[i][j]
            nex[0][i][j] = j
    for i in range(n):
        d[0][i][i], nex[0][i][i] = 0, i

    print("####################### Pasos intermedios ###########################")
    print("------> d0")
    print(d[0])
    print("***************************")
        
    for k in range(0, n):
        for i in range(0, n):
            for j in range(0, n):
                d[k + 1][i][j] = d[k][i][j]
                nex[k + 1][i][j] = nex[k][i][j]
                if d[k][i][k] + d[k][k][j] < d[k + 1][i][j]:
                    d[k + 1][i][j] = d[k][i][k] + d[k][k][j]
                    nex[k + 1][i][j] = nex[k][i][k]
        print("------> d", k + 1)
        print(d[k + 1])
        print("***************************")
    return d[n], nex[n]

def floydWarshall(w):
    n = len(w)
    d = [[float("inf") for j in range(n)] for i in range(n)]
    nex = [[-1 for j in range(n)] for i in range(n)]

    for i in range(n):
        for j in range(n):
            d[i][j] = w[i][j]
            nex[i][j] = j
    for i in range(n):
        d[i][i], nex[i][i] = 0, i

    print("####################### Pasos intermedios ###########################")
    print("------> d0")
    print(d)
    print("***************************")
        
    for k in range(0, n):
        for i in range(0, n):
            for j in range(0, n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
                    nex[i][j] = nex[i][k]
        print("------> d", k + 1)
        print(d)
        print("***************************")
    return d, nex

def main():
    w = [[0, -3, 2, 5, 4],
         [float('inf'), 0, float('inf'), 1, float('inf')],
         [float('inf'), float('inf'), 0, 2, 1],
         [4, float('inf'), 4, 0, -2],
         [5, float('inf'), float('inf'), 6, 0]]
    d, nex = floydWarshallNoOpt(w)
    
    print("####################### Resultados ###########################")
    print(d)
    print("***************************")
    print(nex)
    
    d, nex = floydWarshall(w)
    
    print("####################### Resultados ###########################")
    print(d)
    print("***************************")
    print(nex)

main()

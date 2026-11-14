#include <cstdio>
#include <map>
#include <set>
#include <string>
#include <utility>
#include <vector>
using namespace std;

typedef pair<string, string> Camino;

typedef map<string, vector<string> > Mapa;

Mapa armar(const vector<string> &lugares,
           const vector<Camino> &caminos) {
  // Lista de adyacencia indexada por el nombre del lugar.
  Mapa adj;
  for (size_t i = 0; i < lugares.size(); i++) {
    adj[lugares[i]] = vector<string>();
  }
  for (size_t i = 0; i < caminos.size(); i++) {
    adj[caminos[i].first].push_back(caminos[i].second);
  }
  return adj;
}

void visitar(Mapa &adj,
             const set<Camino> &prohibidos, const string &u,
             set<string> &visto, vector<string> &orden) {
  // Profundidad que no toma un camino si su par esta cerrado.
  visto.insert(u);
  orden.push_back(u);
  for (size_t i = 0; i < adj[u].size(); i++) {
    string v = adj[u][i];
    bool abierto = prohibidos.count(Camino(u, v)) == 0;
    if (abierto && visto.count(v) == 0) {
      visitar(adj, prohibidos, v, visto, orden);
    }
  }
}

vector<string> alcanzables(const vector<string> &lugares,
                           const vector<Camino> &caminos,
                           const vector<Camino> &cerrados,
                           const string &inicio) {
  // Los lugares a los que se llega, en orden de descubrimiento.
  Mapa adj = armar(lugares, caminos);
  set<Camino> prohibidos;
  for (size_t i = 0; i < cerrados.size(); i++) {
    prohibidos.insert(cerrados[i]);
  }
  set<string> visto;
  vector<string> orden;
  visitar(adj, prohibidos, inicio, visto, orden);
  return orden;
}

#ifndef SIN_MAIN
int main() {
  vector<string> lugares = {"Plaza", "Parque", "Rio",
                            "Museo", "Faro", "Mina"};
  vector<Camino> caminos = {
      Camino("Plaza", "Mina"), Camino("Plaza", "Parque"),
      Camino("Parque", "Rio"), Camino("Rio", "Museo"),
      Camino("Museo", "Rio"), Camino("Museo", "Faro")};
  vector<Camino> cerrados = {Camino("Plaza", "Mina"),
                             Camino("Museo", "Rio")};
  vector<string> r = alcanzables(lugares, caminos, cerrados, "Plaza");
  for (size_t i = 0; i < r.size(); i++) {
    printf("%s\n", r[i].c_str());
  }
  return 0;
}
#endif

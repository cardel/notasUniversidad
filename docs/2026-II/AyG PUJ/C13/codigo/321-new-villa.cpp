/*
The New Villa
https://uva.onlinejudge.org/external/3/321.pdf

BFS - State Space

*/

#include <cstdio>
#include <iostream>
#include <math.h>
#include <string>
#include <vector>
#include <queue>
#include <map>
#include <algorithm>

using namespace std;

struct step{
  string desc; // can be on, off and move
  int room;

  step(string d, int h){
    desc = d;
    room = h;
  }
};

struct state{
  int pos, light;
  vector<step> steps;

  state(){}

  state(int p, int c){
    pos = p;
    light = c;
    steps = vector<step>();
  }

  state(int p, int c, vector<step> &pa){
    pos = p;
    light = c;
    steps = pa;
  }
};

struct classcomp{
  bool operator() (const state& est1, const state& est2) const{
 bool ans = true;
 if(est1.pos != est2.pos)
   ans = est1.pos < est2.pos;
 else
   ans = est1.light < est2.light;
 return ans;
}
};

map<state, int, classcomp> dist;
bool roomAdj[11][11], lightAdj[11][11];

void solve(int r, int s, int d, int caso){
  int i, obj = 1 << r - 1;
  queue<state> q;
  state est(1, 1), curr, res;
  bool flag = false;
  dist[est] = 0;
  q.push(est);

  while(!flag && !q.empty()){
    curr = q.front();
    q.pop();

    if(curr.pos == r && obj == curr.light){
      res = curr;
      flag = true;
    }
    else{
      // verificar posibilidades de desplazarse a otra habitación
      for(i = 1; i <= r; i++){
	// se verifica que haya un pasillo hacía la habitación i y que la luz en esa roomitación esté
	// encendida
	if(roomAdj[curr.pos][i] && (curr.light & (1 << i - 1)) != 0){
	  est = state(i, curr.light, curr.steps);
	  est.steps.push_back(step("move", i));

	  if(dist.find(est) == dist.end()){
	    q.push(est);
	    dist[est] = dist[curr] + 1;
	  }
	}
      }

      // verificar posibilidades de encender o apagar una luz en otra habitación
      for(i = 1; i <= r; i++){
	// se verifica que haya un switch que permita encencer la luz de la habitación i
	// y que no sea la misma habitación en la que se está ubicado
	if(lightAdj[curr.pos][i] && i != curr.pos){
	  est = state(curr.pos, (curr.light ^ (1 << i - 1)), curr.steps);
	  est.steps.push_back(step((est.light > curr.light) ? "on" : "off", i));

	  if(dist.find(est) == dist.end()){
	    q.push(est);
	    dist[est] = dist[curr] + 1;
	  }
	}
      }
    }
  }

  printf("Villa #%d\n", caso);

  if(flag){
    printf("The problem can be solved in %d steps:\n", dist[res]);
    for(vector<step>::iterator itAux = res.steps.begin(); itAux != res.steps.end(); itAux++){
      if(itAux->desc == "on")
	printf("- Switch on light in room %d.\n", itAux->room);
      else if(itAux->desc == "off")
	printf("- Switch off light in room %d.\n", itAux->room);
      else
	printf("- Move to room %d.\n", itAux->room);
    }
  }
  else
    printf("The problem cannot be solved.\n");
  printf("\n");
}

int main(){
  int r, d, s, i, j, ini, fin, caso = 1;

  cin >> r >> d >> s;

  while(r != 0 || d != 0 || s != 0){
    for(i = 0; i < 11; i++){
      for(j = 0; j < 11; j++){
	roomAdj[i][j] = lightAdj[i][j] = false;
      }
    }
    dist.clear();

    for(i = 0; i < d; i++){
      cin >> ini >> fin;
      roomAdj[ini][fin] = roomAdj[fin][ini] = true;
    }

    for(i = 0; i < s; i++){
      cin >> ini >> fin;
      lightAdj[ini][fin] = true;
    }

    solve(r, d, s, caso);
    ++caso;
    cin >> r >> d >> s;
  }

  return 0;
}

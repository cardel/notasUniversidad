int n, m;
while (scanf("%d %d", &n, &m) == 2 && (n != 0 || m != 0)) {
  vector<vector<int> > adj(n + 1);
  for (int i = 0; i < m; i++) {
    int a, b;
    scanf("%d %d", &a, &b);
    adj[a].push_back(b);
  }
  /* aquí va el recorrido en profundidad */
}

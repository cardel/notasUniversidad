int n;
while (scanf("%d", &n) == 1 && n != 0) {
  vector<int> a(n), aux(n);
  for (int i = 0; i < n; i++) {
    scanf("%d", &a[i]);
  }
  printf("%lld\n", contar(a, aux, 0, n));
}

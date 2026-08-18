# CLAUDE.md

Guía para sesiones de Claude Code en este repositorio.

## Qué es este repositorio

El sitio de notas de clase publicado con MkDocs: una nota por clase bajo
`docs/`, con el código de ejemplo que la acompaña. `Instrucciones.md` en la raíz
fija cómo se publica cada clase; se lee antes de agregar material.

---

## Navegación de código: graft

Este repositorio está indexado por [graft](https://github.com/NanoNets/Graft),
que construye con tree-sitter un grafo de símbolos y lo expone por MCP. Para
orientarse o navegar código se consulta **antes** que `grep`, `sed`, `Read` de
archivos completos o el agente `Explore`: una consulta suele reemplazar varias
lecturas y cuesta una fracción de los tokens.

| Pregunta | Tool |
|---|---|
| ¿Cómo funciona X? ¿Dónde está Y? | `graft_find_code` |
| Necesito **todas** las ocurrencias | `graft_find_all` |
| ¿Quién llama a esto? ¿Qué rompo si lo cambio? | `graft_trace_calls` |
| ¿Qué expone este archivo? | `graft_file_api` |
| Repositorio desconocido, ¿por dónde empiezo? | `graft_repo_map` |

Si los tools llegan diferidos —solo los nombres, sin esquema— se cargan los
cinco de una vez, antes de la primera navegación:

```
ToolSearch "select:mcp__graft__graft_find_code,mcp__graft__graft_find_all,mcp__graft__graft_trace_calls,mcp__graft__graft_file_api,mcp__graft__graft_repo_map"
```

Al cablearlo, el 2026-08-18, el grafo traía 76 tarjetas: el código que
acompaña a las notas —C, JavaScript, Python— dentro de `docs/`. Las notas en
sí son Markdown y son la mayor parte del repositorio: quedan fuera del grafo y
se buscan de la forma normal.

### En una máquina nueva

`.mcp.json` viaja en el clon y ahí queda registrado el servidor; el grafo no
viaja, porque `graft/` es caché local y está en `.gitignore`. Si la carpeta no
existe, o si los tools no devuelven nada, se reconstruye una vez desde la raíz
del repositorio:

```bash
npx -y @nanonets/graft@0.10.1 build
```

Es tree-sitter puro: local, sin red y sin mandar una línea de código a ningún
modelo. Pide Node 20 o superior y tarda segundos. La versión va fijada en
`.mcp.json`; conviene construir con esa misma.

Los hooks que rehacen el grafo tras un `pull` o un cambio de rama viven en
`.git/hooks/`, que tampoco viaja en el clon. Para reponerlos:

```bash
for h in post-merge post-checkout; do
  printf '#!/usr/bin/env sh\ncommand -v npx >/dev/null 2>&1 || exit 0\nnpx -y @nanonets/graft@0.10.1 build >/dev/null 2>&1 &\nexit 0\n' > ".git/hooks/$h"
  chmod +x ".git/hooks/$h"
done
```

Con `cardel/claude-work` clonado, `bash scripts/bootstrap-graft.sh` hace las dos
cosas en todos los repositorios de `~/repositorios` de una sola pasada.

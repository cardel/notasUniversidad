**Virtualización**

Permite generar entornos aislados para diferentes propósitos.

1. **Virtualización completa**: VirtualBox o KVM permiten tener sistemas operativos totalmente aislados. Se emula hardware desde un sistema host.
2. **Paravirtualización**: Utiliza el sistema operativo del host y a través de una interfaz provee funciones. Docker es un ejemplo, lo que hace que sea menos pesado en memoria y procesamiento, pero dependemos del sistema host.

**Qué podemos virtualizar**

1. **Procesamiento**: Emular CPUs y asignar recursos de procesamiento
2. **Almacenamiento**: Usar imágenes como unidades de sistemas de archivos
3. **Redes**: Generar virtualmente routers, switches e interfaces de red con sus respectivas configuraciones

**Paravirtualización**

1. No nos preocupamos por la configuración del hardware, esto ya lo hace el sistema host y lo usamos a través de llamadas API (librería del SO host)
2. Usamos la memoria, CPU y disco del sistema host, sin embargo tenemos un entorno aislado
3. Docker es por excelencia un sistema de paravirtualización que permite tener un entorno aislado para el despliegue de aplicaciones y este se puede acceder a través de una IP y su puerto
4. Este sistema permite tener versiones diferentes de aplicaciones sin generar conflictos. Por ejemplo, si mi sistema host tiene Python 3.13, un contenedor podría tener Python 3.5 el cual ya es incompatible con el sistema host
5. Podemos tener diferentes gestores de bases de datos sin generar problemas por configuraciones

**Ejemplos adicionales**

- **Virtualización completa**: VMware ESXi, Hyper-V, QEMU, VirtuaBox
- **Paravirtualización**: LXC/LXD, Podman, Docker, Kubernetes pods
- **Casos de uso**: 
  - Desarrollo de software con diferentes versiones de dependencias
  - Entornos de testing aislados
  - Microservicios en arquitecturas cloud
  - CI/CD pipelines con entornos reproducibles

**Información adicional**

La paravirtualización utiliza tecnologías como namespaces (para aislamiento de procesos, red, usuarios) y cgroups (para limitación de recursos). Los contenedores comparten el kernel del host pero tienen su propio filesystem, procesos y espacio de red.

**Resumen comparativo**

| Característica | Virtualización completa | Paravirtualización |
|----------------|-------------------------|-------------------|
| Aislamiento | Total (SO completo) | Parcial (procesos) |
| Overhead | Alto | Bajo |
| Rendimiento | Menor | Mayor |
| Portabilidad | Limitada | Alta |
| Ejemplos | VirtualBox, VMware | Docker, LXC |
| Uso de recursos | Mayor consumo | Menor consumo |
| Tiempo de inicio | Lento (minutos) | Rápido (segundos) |
| Compatibilidad | Cualquier SO | Depende del kernel host |
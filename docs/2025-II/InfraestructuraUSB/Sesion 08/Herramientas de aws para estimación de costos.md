Aquí tienes una versión ampliada de las definiciones junto con una tabla comparativa:

### Definiciones ampliadas:

1. **[[Dashboard]]**  
   - Interfaz centralizada que consolida métricas clave de costos de AWS en una sola vista.  
   - Permite monitorear tendencias, comparar períodos y filtrar por servicios, cuentas o etiquetas.  
   - Ideal para stakeholders que necesitan una visión rápida y resumida.  

2. **[[Cost Explorer]]**  
   - Herramienta de visualización interactiva con gráficos y tablas personalizables.  
   - Analiza costos históricos (hasta 12 meses) y proyecciones basadas en patrones de uso.  
   - Soporta desgloses por dimensiones (servicio, región, tipo de instancia, etc.).  

3. **[[Informe de Costos]]**  
   - Documentos detallados en formatos CSV o PDF con granularidad ajustable (diaria/mensual).  
   - Incluye:  
     - Costos desglosados por servicio, cuenta o recurso.  
     - Proyecciones basadas en uso actual y tendencias.  
     - Datos crudos para análisis avanzado (ej. integración con BI).  

4. **[[Budgets]]**  
   - Configura límites de gasto con alertas (email/SNS) al alcanzar umbrales definidos (ej. 80% del presupuesto).  
   - Tipos de budgets:  
     - Costo: seguimiento de gastos totales.  
     - Uso: monitorea consumo de servicios específicos.  
     - Reservas: controla instancias reservadas.  

### Tabla comparativa:

| Herramienta       | Propósito Principal                     | Granularidad               | Alertas | Proyecciones | Personalización |  
|-------------------|----------------------------------------|----------------------------|---------|--------------|----------------|  
| [[Dashboard]]     | Visión general consolidada             | Media (agregada por filtros)| No      | No           | Widgets básicos |  
| [[Cost Explorer]] | Análisis visual interactivo            | Alta (multidimensional)     | No      | Sí           | Gráficos/Tablas |  
| [[Informe Costos]]| Reportes detallados para auditoría/BI  | Máxima (hasta nivel diario) | No      | Sí           | Columnas/Formatos |  
| [[Budgets]]       | Control presupuestario y alertas       | Media (por servicio/cuenta) | Sí      | No           | Umbrales personalizados |  


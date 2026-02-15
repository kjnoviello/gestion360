# Gestion360

## Descripción
Gestion360 es una aplicación web para la gestión integral de clientes y trabajos, incluyendo almacenamiento seguro de archivos (PDFs e imágenes), autenticación de usuarios y manejo de presupuestos. La app utiliza **Supabase** como backend y almacenamiento, manteniendo todos los documentos privados con URLs firmadas para acceso seguro.

## Tecnologías principales
- **Frontend:** React, TypeScript, React Router  
- **Backend / BaaS:** Supabase (Auth, Database, Storage)  
- **Almacenamiento de archivos:** Buckets privados en Supabase  
- **Gestión de PDFs e imágenes:** Generación dinámica de signed URLs  
- **Control de tipos:** TypeScript  

## Funcionalidades
1. **Gestión de clientes:**  
   - Crear, editar y eliminar clientes.  
   - Visualización de detalles de clientes y trabajos asociados.

2. **Gestión de trabajos:**  
   - Crear, editar y eliminar trabajos.  
   - Almacenamiento seguro de archivos asociados (PDFs e imágenes).  
   - Generación de URLs firmadas para acceder a archivos privados.  

3. **Presupuestos y reportes:**  
   - Guardado de presupuestos por trabajo.  
   - Registro de fechas y seguimiento histórico.  

4. **Autenticación y seguridad:**  
   - Inicio de sesión y registro de usuarios mediante Supabase Auth.  
   - Acceso seguro a archivos mediante signed URLs.  

## Estructura del proyecto
/src
├─ /components # Componentes reutilizables
├─ /pages # Páginas de la app (Dashboard, WorkForm, ClientForm)
├─ /hooks # Custom hooks (useAuth, useWorks, etc.)
├─ /lib # Librerías internas (supabase, storage helpers)
├─ /types # Definición de tipos TypeScript
└─ /utils # Funciones utilitarias
# 🌸 LumApp – Asistente educativo para el cuidado lumbar

**LumApp** es una **Progressive Web App (PWA)** desarrollada en **React** con **Next.js**, diseñada para ofrecer **asistencia educativa, práctica y preventiva** a personas con **dolores lumbares**.  
Su propósito es brindar orientación confiable sobre ejercicios, precauciones y educación postural, promoviendo hábitos saludables y el autocuidado.

---

## 🧠 Descripción general

La aplicación permite al usuario registrar sus datos personales, acceder a recomendaciones, aprender ejercicios guiados y conocer prácticas seguras para el cuidado de la zona lumbar.  
Incluye un **botón de emergencia** persistente en la esquina inferior derecha, que permite **llamar directamente a servicios de emergencia o al contacto de emergencia** configurado.

Los módulos principales son:
- Registro de datos personales  
- Recomendaciones  
- Ejercicios (cada uno con su propia página y detalles)  
- Precauciones  
- Educación  

---

## 🏗️ Arquitectura del proyecto

LumApp utiliza una **arquitectura modular basada en componentes**, organizada en tres capas principales:

### 1. **Capa de Presentación (Frontend)**
- Desarrollada con **React y Next.js**, implementando **Server-Side Rendering (SSR)** para mejorar el rendimiento y SEO.  
- Diseño **responsive y accesible**, compatible con dispositivos móviles y escritorio.  
- Navegación fluida entre páginas mediante el enrutador de Next.js.  
- Botón flotante de emergencia disponible en toda la aplicación.

### 2. **Capa de Datos (Data Layer)**
- Los contenidos de **ejercicios**, **precauciones** y **educación** se almacenan en archivos `.json`, cargados dinámicamente desde la carpeta `/public/data/`.  
- Ejemplo:
  - `/public/data/ejercicios.json`
  - `/public/data/precauciones.json`
  - `/public/data/educacion.json`
- Los datos personales del usuario se almacenan localmente mediante **LocalStorage** (sin autenticación remota).  

### 3. **Capa de Servicios (Service Layer)**
- **Service Worker** configurado para soporte **offline** y caché de recursos.  
- **Emergency Service** implementado para activar una llamada directa o redirigir a un número configurado.  
- **Netlify** se utiliza para el despliegue continuo (CI/CD) y hospedaje de la aplicación como **PWA**.

---

## ⚙️ Flujo de funcionamiento
Usuario → Interfaz (Next.js) → JSON/LocalStorage → Renderizado dinámico

1. El usuario accede a LumApp desde el navegador o la instalación PWA.  
2. Los componentes consultan la información almacenada en los archivos JSON locales.  
3. El contenido se muestra dinámicamente según la sección seleccionada.  
4. La aplicación puede operar sin conexión gracias al Service Worker.  
5. El botón de emergencia permanece disponible en todo momento.

---

## 🚀 Despliegue

El proyecto está **desplegado en Netlify**, utilizando integración continua (CI/CD) desde GitHub.

**Comandos básicos de ejecución:**
```bash
npm install
npm run dev       # Entorno de desarrollo
npm run build     # Compilación para producción
npm start         # Servidor local de producción
```

## 🏛️ Créditos

Proyecto académico desarrollado por estudiantes de Ingeniería Biomedica
de la Universidad Autónoma de Occidente (UAO).

Propósito: educativo y preventivo.
Uso: no clínico ni diagnóstico.
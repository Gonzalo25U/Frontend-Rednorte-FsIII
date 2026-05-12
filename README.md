# 🏥 RedNorte FSIII - Frontend

**Plataforma de Gestión de Listas de Espera Hospitalarias - Frontend**

Frontend de la solución tecnológica para RedNorte que permite gestionar de manera eficiente las listas de espera hospitalarias, optimizando la asignación de citas médicas y mejorando la comunicación con pacientes.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Testing](#testing)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Rutas y Roles](#rutas-y-roles)
- [Variables de Entorno](#variables-de-entorno)
- [Troubleshooting](#troubleshooting)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## 📱 Descripción General

RedNorte FSIII Frontend es una **aplicación web responsive** construida con **Astro 6**, **React 19** y **TypeScript**, que proporciona interfaces específicas para tres tipos de usuarios:

- **Pacientes:** Visualizar citas solicitadas, solicitar nuevas citas, cancelar citas
- **Médicos:** Gestionar citas asignadas, actualizar prioridades, registrar notas médicas
- **Administradores:** Gestionar usuarios, asignar roles, cambiar contraseñas

**Características principales:**
- ✅ Server-Side Rendering (SSR) con Astro
- ✅ Componentes interactivos con React
- ✅ Autenticación con JWT
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Testing con Vitest
- ✅ TypeScript para type-safety
- ✅ Integración con BFF Service (Puerto 8085)

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Astro | 6.1.9 | Metaframework SSR |
| React | 19.2.5 | Componentes UI interactivos |
| TypeScript | Inline | Type safety y autocompletion |
| TailwindCSS | 4.2.4 | Estilos utility-first |
| Vite | 6.x | Bundler rápido |
| Vitest | 4.1.5 | Testing unitario |
| jwt-decode | 4.0.0 | Decodificar tokens JWT |
| Node.js | ≥22.12.0 | Runtime de JavaScript |
| npm | 10.x | Package manager |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** ≥ 22.12.0 ([Descargar aquí](https://nodejs.org/))
- **npm** 10.x o superior (incluido con Node.js)
- **Git** para clonar el repositorio
- **Backend ejecutándose** en `http://localhost:8085` (BFF Service)

### Verificar Instalación

```bash
node --version    # Debe mostrar v22.12.0 o superior
npm --version     # Debe mostrar 10.x o superior
git --version     # Debe mostrar una versión
```

---

## 💾 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/rednorte/rednorte-FsIII-front.git
cd rednorte-FsIII-front/frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando descargará todas las dependencias especificadas en `package.json`:
- Astro y plugins
- React y React DOM
- Tailwind CSS
- Librerías de testing
- Utilidades (jwt-decode, etc.)

**Tiempo aproximado:** 2-3 minutos

### 3. Verificar Instalación

```bash
npm run astro --version    # Debe mostrar Astro 6.1.9
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto `frontend/`:

```env
# URL del Backend (BFF Service)
PUBLIC_API_URL=http://localhost:8085

# Puerto de desarrollo (opcional)
VITE_PORT=3000

# Ambiente
PUBLIC_ENV=development
```

### 2. Archivos de Configuración

- **astro.config.mjs** - Configuración de Astro (SSR, React integration)
- **tsconfig.json** - Configuración de TypeScript
- **vitest.config.js** - Configuración de testing
- **tailwind.config.js** - Temas y extensiones de Tailwind (si existe)

### 3. Estructura de Rutas

Las rutas están configuradas en Astro usando **file-based routing**:

```
src/pages/
├── index.astro              → /              (Login)
├── admin/
│   └── index.astro          → /admin/        (Panel Admin)
├── doctor/
│   └── index.astro          → /doctor/       (Panel Doctor)
└── paciente/
    └── index.astro          → /paciente/     (Panel Paciente)
```

---

## 🚀 Uso

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor se iniciará en http://localhost:3000
```

La aplicación se abrirá automáticamente. Si no, navega a [http://localhost:3000](http://localhost:3000)

**Características del dev server:**
- 🔄 Hot Module Replacement (HMR) - Cambios en vivo
- 🐛 Error overlay - Errores mostrados en navegador
- 📊 Astro Dashboard en [http://localhost:3000/__astro/](http://localhost:3000/__astro/)

### Build para Producción

```bash
# Compilar para producción
npm run build

# Esto genera la carpeta 'dist/' con assets optimizados
```

**Optimizaciones aplicadas:**
- ✅ Minificación de HTML, CSS, JavaScript
- ✅ Tree-shaking (elimina código no usado)
- ✅ Code splitting automático
- ✅ Compresión de imágenes

### Preview de Build

```bash
# Ver la versión compilada localmente
npm run preview

# Se abre en http://localhost:3000
```

### Lint y Formateo

```bash
# Si tienes ESLint configurado
npm run lint

# Si tienes Prettier configurado
npm run format
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Modo watch (rerun on change)
npm run test

# Ejecutar una sola vez
npm run test:run

# Abrir UI interactivo
npm run test:ui
```

### Estructura de Tests

Los tests están ubicados junto a los componentes:

```
src/components/
├── admin/
│   ├── UserTable.jsx
│   └── UserTable.test.jsx       ← Test unitario
├── shared/
│   ├── LoginForm.jsx
│   └── LoginForm.test.jsx       ← Test de autenticación
```

### Escribir un Nuevo Test

```jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent.jsx";

describe("MyComponent", () => {
  it("should render text", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Cobertura de Tests

```bash
# Generar reporte de cobertura (si está configurado)
npm run test:coverage
```

---

## 📁 Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/                    # Componentes React reutilizables
│   │   ├── admin/                     # Componentes para panel admin
│   │   │   ├── UserForm.jsx
│   │   │   ├── UserTable.jsx
│   │   │   ├── UserTable.test.jsx
│   │   │   └── ChangePasswordModal.jsx
│   │   ├── doctor/                    # Componentes para panel médico
│   │   │   ├── DoctorAppointmentList.jsx
│   │   │   ├── MedicalRecordModal.jsx
│   │   │   └── PriorityModal.jsx
│   │   ├── paciente/                  # Componentes para panel paciente
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── AppointmentList.jsx
│   │   │   ├── CancelAppointmentModal.jsx
│   │   │   └── PatientInfo.jsx
│   │   └── shared/                    # Componentes compartidos
│   │       ├── LoginForm.jsx
│   │       ├── LoginForm.test.jsx
│   │       ├── Logo.jsx
│   │       ├── Footer.jsx
│   │       └── ConfirmModal.jsx
│   ├── containers/                    # Contenedores (page-level components)
│   │   ├── LoginContainer.jsx
│   │   ├── admin/
│   │   │   └── UserListContainer.jsx
│   │   ├── doctor/
│   │   │   └── DoctorContainer.jsx
│   │   └── paciente/
│   │       └── PacienteContainer.jsx
│   ├── layouts/                       # Layouts de Astro
│   │   └── BaseLayout.astro
│   ├── pages/                         # Páginas (file-based routing)
│   │   ├── index.astro                # / - Login
│   │   ├── admin/
│   │   │   └── index.astro            # /admin - Panel admin
│   │   ├── doctor/
│   │   │   └── index.astro            # /doctor - Panel médico
│   │   └── paciente/
│   │       └── index.astro            # /paciente - Panel paciente
│   ├── services/                      # Servicios API
│   │   └── authService.js             # Lógica de autenticación
│   ├── utils/                         # Funciones utilitarias
│   │   ├── api.js                     # Cliente HTTP con interceptores
│   │   └── auth.js                    # Gestión de tokens y roles
│   ├── styles/                        # Estilos globales
│   │   ├── global.css
│   │   ├── login.css
│   │   ├── admin.css
│   │   ├── doctor.css
│   │   ├── paciente.css
│   │   └── modal.css
│   └── test/
│       └── setup.js                   # Setup para Vitest
├── public/                            # Assets estáticos (se sirven como-es)
├── astro.config.mjs                   # Configuración de Astro
├── tsconfig.json                      # Configuración de TypeScript
├── vitest.config.js                   # Configuración de Vitest
├── tailwind.config.js                 # Configuración de Tailwind (si existe)
├── package.json                       # Dependencias y scripts
├── package-lock.json                  # Lock file de npm
└── README.md                          # Este archivo
```

---

## 🔐 Rutas y Roles

### Rutas Públicas (Sin Autenticación)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | LoginForm | Pantalla de login |

### Rutas Protegidas (Requieren Token JWT)

#### Panel Admin (`/admin`)
- **Rol requerido:** ADMIN
- **Funcionalidades:**
  - Listar usuarios
  - Crear nuevos usuarios
  - Cambiar contraseñas
  - Eliminar usuarios
  - Gestionar roles

#### Panel Médico (`/doctor`)
- **Rol requerido:** DOCTOR
- **Funcionalidades:**
  - Ver citas asignadas
  - Actualizar prioridades de citas
  - Registrar notas médicas
  - Ver información del paciente

#### Panel Paciente (`/paciente`)
- **Rol requerido:** PACIENTE
- **Funcionalidades:**
  - Ver información personal
  - Listar citas solicitadas
  - Solicitar nuevas citas
  - Cancelar citas
  - Ver estado de citas

### Redirección Automática

Después de login, se redirige automáticamente según el rol:

```javascript
// En LoginForm.jsx
redirectByRole();  // Implementado en utils/auth.js

// Redirige a:
// ADMIN   → /admin/
// DOCTOR  → /doctor/
// PACIENTE → /paciente/
```

---

## 🔑 Variables de Entorno

### Archivo `.env` (Crear en la raíz de `frontend/`)

```env
# ===== BACKEND ===== 
# URL base del BFF Service (Backend For Frontend)
PUBLIC_API_URL=http://localhost:8085

# ===== DESARROLLO =====
# Puerto del servidor de desarrollo
VITE_PORT=3000

# Ambiente (development, staging, production)
PUBLIC_ENV=development

# ===== LOGGING (opcional) =====
# Mostrar logs en consola
PUBLIC_DEBUG=true

# ===== TIMEOUTS (opcional) =====
# Timeout para peticiones HTTP (ms)
PUBLIC_FETCH_TIMEOUT=30000
```

### Acceder a Variables de Entorno

#### Desde Astro (en .astro files)

```astro
---
const apiUrl = import.meta.env.PUBLIC_API_URL;
console.log(apiUrl);  // http://localhost:8085
---
```

#### Desde React/JavaScript

```javascript
const apiUrl = import.meta.env.PUBLIC_API_URL;
const env = import.meta.env.PUBLIC_ENV;
```

---

## 🐛 Troubleshooting

### Problema: "Cannot find module 'react'"

**Solución:**
```bash
npm install
rm -rf node_modules
npm cache clean --force
npm install
```

---

### Problema: Token JWT expirado

**Síntoma:** Eres redirigido al login de repente

**Causas posibles:**
- Token JWT expirado (24 horas)
- Token inválido o corrupto
- Backend no validó token

**Soluciones:**
```javascript
// En utils/auth.js, verifica la expiración
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000;
  return decoded.exp > now;  // Compara expiración
}

// Limpia localStorage y vuelve a login
logout();
```

---

### Problema: "ERR_CONNECTION_REFUSED" en API calls

**Síntoma:** Las peticiones al backend fallan

**Causas:**
- Backend no está corriendo
- URL incorrecta en `.env`
- Puerto incorrecto

**Solución:**
```bash
# 1. Verifica que el backend está corriendo (Puerto 8085)
# 2. Verifica la URL en .env
PUBLIC_API_URL=http://localhost:8085

# 3. Reinicia el frontend
npm run dev
```

---

### Problema: Cambios no se reflejan en el navegador

**Solución:**
```bash
# Hard refresh del navegador
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (macOS)

# O limpia el caché
npm run dev -- --force
```

---

### Problema: Tests no funcionan

**Síntoma:** `npm run test` falla

**Soluciones:**
```bash
# Verifica que vitest está instalado
npm list vitest

# Reinstala dependencias de desarrollo
npm install --save-dev

# Borra el caché de Vitest
rm -rf .vitest
npm run test:run
```

---

### Problema: Build falla

**Síntoma:** `npm run build` tiene errores

**Soluciones:**
```bash
# 1. Verifica errores de TypeScript
npm run build -- --verbose

# 2. Limpia el build anterior
rm -rf dist/
npm run build

# 3. Verifica que no hay errores de sintaxis
npm run dev  # Intenta en modo desarrollo primero
```

---

## 🤝 Contribuir

### Workflow de Desarrollo

1. **Crear rama de feature:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/mi-nueva-funcionalidad
   ```

2. **Hacer cambios y testar:**
   ```bash
   npm run test    # Tests en modo watch
   npm run dev     # Servidor de desarrollo
   ```

3. **Commits descriptivos:**
   ```bash
   git add src/
   git commit -m "feat: agregar validación de email en login"
   git commit -m "test: aumentar cobertura a 85%"
   ```

4. **Push y Pull Request:**
   ```bash
   git push origin feature/mi-nueva-funcionalidad
   # Luego crear PR en GitHub hacia develop
   ```

### Guía de Estilo

- **Componentes:** PascalCase (MyComponent.jsx)
- **Funciones:** camelCase (myFunction)
- **Constantes:** UPPER_SNAKE_CASE (MY_CONSTANT)
- **CSS Classes:** lowercase-kebab-case (my-container)
- **Comentarios:** Explicar el "porqué", no el "qué"

---

## 📄 Licencia

Este proyecto es propiedad de RedNorte - Servicio Público de Salud. Consulta LICENSE.md para detalles.

---

## 📞 Soporte

- **Issues:** [GitHub Issues](https://github.com/rednorte/rednorte-FsIII-front/issues)
- **Email:** dev-team@rednorte.cl
- **Slack:** #proyecto-fsiii

---

## 📝 Notas de Versión

### v1.0.0 (11 de Mayo 2026)

- ✨ Interfaces de login, admin, médico y paciente
- ✨ Autenticación con JWT
- ✨ Gestión de citas y usuarios
- ✨ Testing con Vitest
- ✨ Respuesta responsive con Tailwind

---

**Última actualización:** 11 de Mayo 2026  
**Estado:** En desarrollo (Fase 1)  
**Siguiente fase:** Integración con notificaciones (Junio 2026)

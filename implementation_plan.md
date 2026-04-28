# FLUX – Plan de Refactorización

> **Estado:** Pendiente de aprobación  
> **Fecha:** 2026-04-28  
> **Principio guía:** Máximo impacto, mínimo riesgo. La funcionalidad no cambia.

---

## Fase 1 – Diagnóstico

### Métricas de deuda técnica

| Archivo | Líneas | Problema |
|---|---|---|
| `servicios/grupos.api.js` | 1748 | Monolito: 12 dominios distintos en 1 archivo |
| `pages/Grupos/GrupoDetalle.jsx` | 1405 | 6 pestañas completas + realtime en 1 componente |
| `pages/Home/Home.jsx` | 1327 | Drawer + 4 modales + FAB + toasts en 1 componente |
| `pages/Perfil/EditarPerfil.jsx` | 921 | Perfil + avatar + contraseña + horario mezclados |
| `pages/IA/AsistenteIA.jsx` | 879 | 2 tabs con lógica independiente + historial |
| `estilos/flux.css` | 3614 | Todo el CSS en 1 archivo (aceptable, pero sin secciones claras) |

### Problemas identificados

#### 1 – Constante `DIAS` triplicada
Definida de forma idéntica en tres archivos:
- `Home.jsx` (línea 33–41)
- `EditarPerfil.jsx` (línea 17–25)
- `AsistenteIA.jsx` (línea 26–34)

#### 2 – Función `normalizarTexto()` duplicada
Implementación idéntica en:
- `servicios/grupos.api.js` (línea 34)
- `utils/nameModeration.js` (línea 32)

#### 3 – Lógica de sesión repetida en 5+ componentes
El patrón `supabase.auth.getSession()` + `onAuthStateChange` o el equivalente simple aparece en: `GrupoDetalle`, `Home`, `EditarPerfil`, `AsistenteIA`, `MetricasFundador`, `DetallesRepositorio`.

#### 4 – Utilidades de negocio dentro de un componente UI
`timeToMinutes()` y `validarBloque()` viven dentro de `EditarPerfil.jsx`. Son funciones puras de dominio (lógica de horario) que no dependen de React.

#### 5 – Componente mal ubicado
`pages/Tareas/TaskMaster.jsx` es un componente reutilizable controlado por props (no tiene routing propio, no llama a APIs). Su carpeta correcta es `components/`.

#### 6 – `servicios/grupos.api.js` es un monolito de 12 dominios
Actualmente gestiona: grupos, repositorios públicos, archivos, chat, tareas, búsqueda global, ratings, colaboradores, favoritos, historial IA, métricas de admin, y helpers compartidos. Cualquier modificación en chat afecta el mismo archivo que métricas.

#### 7 – `import React from 'react'` innecesario
`TaskMaster.jsx` importa React explícitamente; no necesario desde React 17 con el transform automático de JSX que usa Vite.

---

## Fase 2 – Estructura Propuesta

### Árbol de directorios nuevo

```
src/
├── assets/
│   └── logo-flux.png
│
├── components/                    (sin cambios de contenido, + TaskMaster)
│   ├── ConfirmModal.jsx
│   ├── Estrellas.jsx
│   ├── ModalQR.jsx
│   ├── PWAInstallPrompt.jsx
│   └── TaskMaster.jsx             ← MOVIDO desde pages/Tareas/
│
├── config/
│   └── supabaseClient.js          (sin cambios)
│
├── constants/                     ← NUEVA CARPETA
│   └── dias.js                    ← EXTRAÍDO: array DIAS compartido
│
├── hooks/                         ← NUEVA CARPETA
│   └── useSession.js              ← EXTRAÍDO: lógica de sesión Supabase
│
├── pages/
│   ├── Auth/                      (sin cambios)
│   ├── Grupos/                    (sin cambios)
│   ├── Home/                      (sin cambios)
│   ├── IA/                        (sin cambios)
│   └── Perfil/                    (sin cambios)
│                                  ← pages/Tareas/ ELIMINADA (vacía)
│
├── servicios/
│   ├── grupos.api.js              ← DIVIDIDO en 6 archivos:
│   │   (borrado al final)
│   ├── grupos.service.js          ← grupos CRUD + helpers internos
│   ├── repositorios.service.js    ← repositorios públicos
│   ├── archivos.service.js        ← subida/descarga de archivos
│   ├── chat.service.js            ← chat en tiempo real de grupos
│   ├── tareas.service.js          ← task master (crear/toggle/editar/borrar)
│   ├── busqueda.service.js        ← búsqueda global + ratings + colaboradores
│   ├── metricas.service.js        ← métricas de administrador/fundador
│   ├── ia.api.js                  (sin cambios – ya es enfocado)
│   └── index.js                   ← barrel re-export (compatibilidad)
│
└── utils/
    ├── groupColors.js             (sin cambios)
    ├── nameModeration.js          (sin cambios; normalizarTexto privada)
    └── schedule.js                ← EXTRAÍDO: timeToMinutes + validarBloque
```

---

## Fase 3 – Plan de Ejecución (pasos)

Los pasos van de menor a mayor riesgo. Después de cada bloque se verifica el build.

---

### BLOQUE A – Extracciones sin riesgo (no rompe nada)

**A1 – Crear `src/constants/dias.js`**
- Extraer el array `DIAS` a un archivo compartido
- Actualizar las 3 importaciones: `Home.jsx`, `EditarPerfil.jsx`, `AsistenteIA.jsx`
- Eliminar las 3 definiciones locales duplicadas

**A2 – Crear `src/utils/schedule.js`**
- Mover `timeToMinutes()` y `validarBloque()` desde `EditarPerfil.jsx`
- Actualizar el import en `EditarPerfil.jsx`
- Verificar que las firmas de función no cambian

**A3 – Mover `TaskMaster.jsx` a `src/components/`**
- Mover el archivo
- Eliminar `import React from 'react'` (línea innecesaria)
- Actualizar el 1 único import en `GrupoDetalle.jsx`
- Eliminar la carpeta `pages/Tareas/` que queda vacía

✅ **Punto de verificación A** → `npm run build`

---

### BLOQUE B – Custom hook de sesión (refactor de estado)

**B1 – Crear `src/hooks/useSession.js`**
```
Exporta: { session, userId, displayName, avatarUrl, loading }
Encapsula: supabase.auth.getSession() + limpieza al desmontar
```
- Actualizar `AsistenteIA.jsx` (patrón más simple de los 4)
- Actualizar `MetricasFundador.jsx`
- Actualizar `DetallesRepositorio.jsx`
- *(GrupoDetalle y EditarPerfil son más complejos; los dejamos para el Bloque C)*

✅ **Punto de verificación B** → `npm run build` + prueba manual de las 3 páginas

---

### BLOQUE C – División de `servicios/grupos.api.js`

Este es el cambio más impactante. Se hace creando los 6 archivos nuevos con sus funciones correspondientes, luego actualizando cada página importadora, y finalmente añadiendo un `servicios/index.js` de barrel como red de seguridad.

**Orden de creación:**
1. `tareas.service.js` – 5 funciones, solo lo usa `GrupoDetalle`
2. `chat.service.js` – 4 funciones, solo lo usa `GrupoDetalle`
3. `archivos.service.js` – funciones de subida/eliminación
4. `repositorios.service.js` – todo lo de repos públicos
5. `busqueda.service.js` – búsqueda global + ratings + colaboradores + favoritos
6. `metricas.service.js` – métricas admin (solo `MetricasFundador`)
7. `grupos.service.js` – lo que queda (grupos CRUD + helpers compartidos)
8. `servicios/index.js` – re-exporta todo para compatibilidad

**Páginas a actualizar:** `Home.jsx`, `GrupoDetalle.jsx`, `AsistenteIA.jsx`, `EditarPerfil.jsx`, `RepositorioPublicoDetalle.jsx`, `DetallesRepositorio.jsx`, `MetricasFundador.jsx`

✅ **Punto de verificación C** → `npm run build` + revisión de todas las rutas

---

### BLOQUE D – Limpieza final

- Eliminar `console.log` y `console.warn` en código de producción de pages (no los del `devLog` de ia.api.js que ya tienen guard)
- Eliminar comentarios de bloque multi-línea redundantes (los bloques `/* ─── 1. IMPORTACIONES ─── */` que no aportan más que el código mismo)
- Verificar que no quedan archivos sin importadores (`find src -name "*.jsx" | xargs grep -L "export"` para detectar huérfanos)

✅ **Punto de verificación D final** → `npm run build` + `npm run lint`

---

## Resumen de cambios por archivo

| Archivo | Acción | Motivo |
|---|---|---|
| `constants/dias.js` | CREAR | Eliminar triple duplicado |
| `utils/schedule.js` | CREAR | Sacar lógica pura de componente UI |
| `hooks/useSession.js` | CREAR | DRY del patrón de sesión |
| `components/TaskMaster.jsx` | MOVER | Está mal ubicado en `pages/` |
| `pages/Tareas/` | ELIMINAR | Vacía tras el move |
| `servicios/grupos.api.js` | DIVIDIR → 7 archivos | Monolito de 12 dominios |
| `servicios/index.js` | CREAR | Barrel de compatibilidad |
| `Home.jsx` | ACTUALIZAR imports | Constante + servicios nuevos |
| `EditarPerfil.jsx` | ACTUALIZAR imports | Constante + utils/schedule |
| `AsistenteIA.jsx` | ACTUALIZAR imports | Constante + hook + servicios |
| `GrupoDetalle.jsx` | ACTUALIZAR imports | TaskMaster + servicios |
| `MetricasFundador.jsx` | ACTUALIZAR imports | Hook + servicios |
| `DetallesRepositorio.jsx` | ACTUALIZAR imports | Hook + servicios |

---

## Lo que NO se toca (en esta iteración)

- La división de `GrupoDetalle.jsx` en sub-componentes por tab (alta complejidad, segunda iteración)
- La división de `Home.jsx` en sub-componentes de modales/drawer
- El CSS (`flux.css`) – estructuralmente aceptable como archivo único
- El renombrado de `servicios/` → `services/` (riesgo sin beneficio funcional)
- La lógica interna de `ia.api.js` – ya está bien estructurada con `devLog`

---

**¿Apruebas este plan? Si hay algo que quieras ajustar, agregar o priorizar diferente, dímelo antes de ejecutar.**

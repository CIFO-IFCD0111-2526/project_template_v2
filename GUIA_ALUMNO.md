# Guia del Alumno - App Tareas con JWT

---

## 1. Setup inicial (solo la primera vez)

### Clonar el repositorio

```bash
git clone https://github.com/CIFO-IFCD0111-2526/project_template_v2.git
cd project_template_v2
```

### Instalar dependencias del backend

```bash
cd back
cp .env.example .env
npm install
```

### Crear la base de datos

1. Abrir XAMPP y arrancar MySQL
2. Abrir phpMyAdmin o MySQL Workbench
3. Ejecutar el contenido de `back/database.sql`

### Probar que funciona

```bash
cd back
npm run dev
```

Abrir http://localhost:3000 en el navegador. Si ves "Bienvenido", todo funciona.
`Ctrl+C` para parar el servidor.

---

## 2. Ver tus tareas

1. Ir a: https://github.com/CIFO-IFCD0111-2526/project_template_v2/issues
2. Filtrar por tu label de equipo:
   - `front-html` → Equipo maquetacion
   - `front-js` → Equipo JavaScript
   - `back-express` → Equipo Express/API
   - `back-sql` → Equipo SQL/MySQL
3. Empezar por el issue con label `priority`

---

## 3. Flujo de trabajo diario

### Antes de empezar (SIEMPRE, cada dia)

```bash
# 1. Ir a develop y traer los ultimos cambios
git checkout develop
git pull origin develop

# 2. Crear tu rama (solo la primera vez)
git checkout -b feat/nombre-de-tu-tarea

# 2b. Si la rama ya existe, ir a ella y actualizarla
git checkout feat/nombre-de-tu-tarea
git merge develop
```

### Mientras trabajas

```bash
# Cuando tengas algo que funcione, guardar:
git add front/index.html front/styles.css
git commit -m "feat: formulario login con email y password"
```

Puedes hacer varios commits al dia. Es mejor hacer commits pequenos y frecuentes.

### Formato de commits

```
feat:  nueva funcionalidad    → feat: formulario login con validacion
fix:   corregir un bug        → fix: email no se validaba correctamente
style: cambios de CSS/formato → style: centrar formulario en la pagina
ref:   reorganizar codigo     → ref: separar validaciones en funcion aparte
chore: mantenimiento          → chore: actualizar dependencias
```

### Final de clase (SIEMPRE, antes de irte)

```bash
# Subir tu trabajo aunque no este terminado
git add .
git commit -m "chore: WIP formulario login"
git push -u origin feat/nombre-de-tu-tarea
```

Trabajo no pusheado = trabajo que puedes perder.

---

## 4. Cuando termines una tarea

### Subir tu rama

```bash
git push -u origin feat/nombre-de-tu-tarea
```

### Crear Pull Request en GitHub

1. Ir al repo en GitHub
2. Aparece un banner amarillo "Compare & pull request" → click
3. Verificar que dice: `base: develop` ← `compare: feat/tu-rama`
4. Titulo: describir que has hecho (ej: "feat: formulario login con validacion")
5. Body: explicar que has hecho, si es visual poner captura de pantalla
6. Click "Create pull request"

### Pedir review

Avisar al equipo que te toca revisar:

```
Front HTML  ←→  Front JS       (se revisan entre ellos)
Back Express ←→ Back SQL       (se revisan entre ellos)
```

### Esperar review y mergear

Cuando alguien apruebe tu PR, puedes mergear con el boton "Merge pull request".
Despues, borrar tu rama (GitHub te lo propone).

---

## 5. Revisar una PR de otro equipo

Cuando te pidan que revises:

1. Ir a la PR en GitHub
2. Click en la pestana "Files changed"
3. Leer el codigo
4. Si esta bien:
   - Click "Review changes" → "Approve" → comentario "LGTM" (Looks Good To Me)
5. Si hay algo que cambiar:
   - Click "Review changes" → "Request changes" → explicar que falta o que esta mal

---

## 6. Resolver conflictos de merge

Si al hacer `git merge develop` salen conflictos:

```bash
# Git te dice que archivos tienen conflicto
# Abrir esos archivos en el editor

# Veras algo asi:
<<<<<<< HEAD
tu codigo
=======
codigo de develop
>>>>>>> develop

# Elegir que te quedas (o combinar ambos)
# Borrar las lineas con <<<, === y >>>

# Guardar y commitear
git add archivo-con-conflicto.js
git commit -m "fix: resolver conflicto en archivo.js"
```

Si no sabes resolverlo, pedir ayuda al integrador o al formador.

---

## 7. Estructura del proyecto

```
project_template_v2/
├── front/                      # FRONTEND (equipos HTML y JS)
│   ├── index.html              # Pagina principal (login + registro)
│   ├── styles.css              # Estilos CSS
│   └── scripts.js              # Logica JavaScript
│
├── back/                       # BACKEND (equipos Express y SQL)
│   ├── server.js               # Servidor Express (sirve HTML + API)
│   ├── routes.js               # Endpoints de la API
│   ├── auth.middleware.js       # Middleware de autenticacion JWT
│   ├── mysql_conn.js           # Conexion a MySQL
│   ├── database.sql            # Schema de la base de datos
│   ├── .env.example            # Variables de entorno (ejemplo)
│   └── package.json            # Dependencias
│
├── README.md                   # Informacion del proyecto
└── .gitignore                  # Archivos que git ignora
```

### Que archivos toca cada equipo

| Equipo | Archivos |
|--------|----------|
| Front HTML/CSS | `front/index.html`, `front/private.html`, `front/account.html`, `front/styles.css` |
| Front JavaScript | `front/scripts.js` |
| Back Express | `back/server.js`, `back/routes.js`, `back/auth.middleware.js` |
| Back SQL | `back/database.sql`, `back/mysql_conn.js` |

---

## 8. Reglas importantes

```
╔══════════════════════════════════════════════════╗
║  1. Rama SIEMPRE desde develop                   ║
║  2. Nombre: feat/descripcion (NO tu nombre)      ║
║  3. PR siempre a develop (NUNCA a main)          ║
║  4. 1 review minimo antes de mergear             ║
║  5. Si hay conflicto, lo resuelves TU            ║
║  6. Commit con formato: feat: descripcion        ║
║  7. Push SIEMPRE antes de irte                   ║
╚══════════════════════════════════════════════════╝
```

---

## 9. Comandos Git - Resumen rapido

| Que quiero hacer | Comando |
|------------------|---------|
| Ver en que rama estoy | `git branch` |
| Cambiar de rama | `git checkout nombre-rama` |
| Crear rama nueva | `git checkout -b feat/mi-tarea` |
| Traer cambios del remoto | `git pull origin develop` |
| Ver que he cambiado | `git status` |
| Ver los cambios en detalle | `git diff` |
| Anadir archivos al commit | `git add archivo.js` |
| Anadir todos los archivos | `git add .` |
| Hacer commit | `git commit -m "feat: descripcion"` |
| Subir mi rama | `git push -u origin feat/mi-tarea` |
| Traer cambios de develop a mi rama | `git merge develop` |

---

## 10. Problemas frecuentes

### "No puedo hacer push"

```bash
# Probablemente tu rama no esta subida aun
git push -u origin feat/mi-rama
```

### "Tengo cambios sin commitear y quiero cambiar de rama"

```bash
# Opcion 1: commitear lo que tengas
git add .
git commit -m "chore: WIP trabajo en progreso"
git checkout otra-rama

# Opcion 2: guardar temporalmente
git stash
git checkout otra-rama
# Cuando vuelvas:
git checkout feat/mi-rama
git stash pop
```

### "He commiteado en la rama equivocada"

Avisar al formador. No intentar arreglarlo solo con `git reset`.

### "Mi codigo no funciona y quiero volver atras"

```bash
# Ver los ultimos commits
git log --oneline -10

# Volver a un commit anterior (sin perder los cambios)
git checkout hash-del-commit -- archivo.js
```

### "El servidor no arranca"

1. ¿Esta XAMPP arrancado con MySQL?
2. ¿Existe el archivo `back/.env`? (copiarlo de `.env.example`)
3. ¿Se han instalado las dependencias? (`cd back && npm install`)
4. ¿El puerto 3000 esta libre?
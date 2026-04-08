# Back — API REST

## Autenticación

Todas las rutas protegidas requieren un JWT en la cookie `accessToken`.

Para probar con Thunder Client, añadir en Headers:
- **Header:** `Cookie`
- **Value:** `accessToken=<tu_token>`

## Endpoints

### Usuarios (`/api/v1`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/signup` | Registro de usuario | No |
| POST | `/signin` | Login (devuelve cookie con JWT) | No |
| POST | `/logout` | Cierra sesión (borra cookie) | No |
| GET | `/me` | Datos del usuario logueado | Sí |

### Tareas (`/api/v1`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/todos` | Listar tareas del usuario | Sí |
| POST | `/todos` | Crear tarea (`{ titulo }` en body) | Sí |
| PUT | `/todos/:id` | Toggle completada de una tarea | Sí |
| DELETE | `/todos/:id` | Eliminar una tarea | Sí |

### Respuestas

**GET /todos** — Array de tareas:
```json
[
  {
    "id": 3,
    "titulo": "ejemplo",
    "completada": 0,
    "createdAt": "2026-04-07T13:45:58.700Z"
  }
]
```

**PUT /todos/:id** — Tarea con estado actualizado:
```json
{
  "id": 3,
  "titulo": "ejemplo",
  "completada": 1,
  "user_id": 11,
  "createdAt": "2026-04-07T13:45:58.700Z"
}
```

**POST /todos** — Tarea creada:
```json
{
  "message": "Tarea creada correctamente",
  "task": {
    "id": 4,
    "titulo": "nueva tarea",
    "completada": 0,
    "user_id": 11
  }
}
```

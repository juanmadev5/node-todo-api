
---

# 📝 NodeJS Basic To-Do API

Una API RESTful básica para gestionar tareas (To-Do list), construida con Node.js sin frameworks. Usa un archivo JSON para persistencia de datos.

## 🚀 Características

* Obtener todas las tareas
* Crear una nueva tarea
* Actualizar una tarea existente
* Eliminar una tarea

---

## 📦 Requisitos

* [Node.js](https://nodejs.org/) instalado

---

## ⚙️ Instalación

1. Clona el repositorio o descarga los archivos.
2. En la terminal, navega al directorio del proyecto.
3. Asegúrate de tener un archivo `tasks.json` en blanco (con un array vacío):

```json
[]
```

4. Ejecuta el servidor:

```bash
npm run start
```

El servidor escuchará en `http://localhost:3000`.

---

## 📬 Endpoints

### `GET /tasks`

Obtiene todas las tareas.

**Respuesta exitosa (200):**

```json
[
  {
    "id": 1748208400749,
    "title": "Aprender Node.js",
    "done": false
  }
]
```

---

### `POST /tasks`

Crea una nueva tarea.

**Body:**

```json
{
  "title": "Aprender Node.js"
}
```

**Respuesta exitosa (201):**

```json
{
  "id": 1748208400749,
  "title": "Aprender Node.js",
  "done": false
}
```

---

### `PUT /tasks/:id`

Actualiza una tarea existente.

**Ejemplo:**

```http
PUT /tasks/1748208400749
```

**Body:**

```json
{
  "done": true
}
```

**Respuesta exitosa (200):**

```json
{
  "id": 1748208400749,
  "title": "Aprender Node.js",
  "done": true
}
```

---

### `DELETE /tasks/:id`

Elimina una tarea por su ID.

**Ejemplo:**

```http
DELETE /tasks/1748208400749
```

**Respuesta exitosa (200):**

```json
{
  "message": "Tarea eliminada correctamente"
}
```

---

## 🛠 Testeo con REST Client (VS Code)

Usa la extensión **REST Client** de VS Code para probar la API fácilmente. Aquí un ejemplo en `methods.http`:

```http
### Crear una tarea
POST http://localhost:3000/tasks 
content-type: application/json

{
    "title": "Aprender Node.js",
    "done" : false
}

### Actualizar una tarea
PUT http://localhost:3000/tasks/ID_AQUI
content-type: application/json

{
    "done": true
}

### Eliminar una tarea
DELETE http://localhost:3000/tasks/ID_AQUI
```

---

## 📁 Estructura

```
.
├── server.js
├── tasks.json
└── methods.http
```

---

## 🧾 Notas

* No usa ningún framework (como Express), ideal para entender los fundamentos de HTTP en Node.js.
* Persistencia de datos usando `fs` sobre `tasks.json`.
* Recuerda mantener `tasks.json` con formato válido.

---

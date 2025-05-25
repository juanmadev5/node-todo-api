const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 3000;
const DATA_FILE = "./tasks.json";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const path = parsedUrl.pathname;

  res.setHeader("Content-Type", "application/json");

  // GET /tasks - obtener todas las tareas
  if (path === "/tasks" && method === "GET") {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Error al leer las tareas" }));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });

    // POST /tasks - crear una nueva tarea
  } else if (path === "/tasks" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const newTask = JSON.parse(body);

        if (!newTask.title) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "La tarea debe tener un título" }));
          return;
        }

        fs.readFile(DATA_FILE, "utf8", (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end(
              JSON.stringify({ error: "No se pudo leer el archivo de tareas" })
            );
            return;
          }

          const tasks = JSON.parse(data);
          const taskWithId = {
            id: Date.now(),
            title: newTask.title,
            done: false,
          };

          tasks.push(taskWithId);

          fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
              res.writeHead(500);
              res.end(JSON.stringify({ error: "No se pudo guardar la tarea" }));
              return;
            }

            res.writeHead(201);
            res.end(JSON.stringify(taskWithId));
          });
        });
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });

    // DELETE /tasks/:id - eliminar una tarea
  } else if (path.startsWith("/tasks/") && method === "DELETE") {
    const id = parseInt(path.split("/")[2]);

    if (isNaN(id)) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "ID inválido" }));
      return;
    }

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(
          JSON.stringify({ error: "No se pudo leer el archivo de tareas" })
        );
        return;
      }

      let tasks = JSON.parse(data);
      const index = tasks.findIndex((task) => task.id === id);

      if (index === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Tarea no encontrada" }));
        return;
      }

      tasks.splice(index, 1);

      fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: "No se pudo eliminar la tarea" }));
          return;
        }

        res.writeHead(200);
        res.end(JSON.stringify({ message: "Tarea eliminada correctamente" }));
      });
    });

    // PUT /tasks/:id - actualizar una tarea
  } else if (path.startsWith("/tasks/") && method === "PUT") {
    const id = parseInt(path.split("/")[2]);

    if (isNaN(id)) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "ID inválido" }));
      return;
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const updatedData = JSON.parse(body);

        fs.readFile(DATA_FILE, "utf8", (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end(
              JSON.stringify({ error: "No se pudo leer el archivo de tareas" })
            );
            return;
          }

          let tasks = JSON.parse(data);
          const task = tasks.find((t) => t.id === id);

          if (!task) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Tarea no encontrada" }));
            return;
          }

          // Actualizar campos
          if (updatedData.title !== undefined) task.title = updatedData.title;
          if (updatedData.done !== undefined) task.done = updatedData.done;

          fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
              res.writeHead(500);
              res.end(
                JSON.stringify({ error: "No se pudo actualizar la tarea" })
              );
              return;
            }

            res.writeHead(200);
            res.end(JSON.stringify(task));
          });
        });
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });

    // Ruta no encontrada
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

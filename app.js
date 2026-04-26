const fs = require("fs");
const readline = require("readline");

class GestorTareas {
  constructor() {
    this.archivo = "tareas.json";
    this.tareas = this.cargar();
  }

  cargar() {
    if (fs.existsSync(this.archivo)) {
      return JSON.parse(fs.readFileSync(this.archivo));
    }
    return [];
  }

  guardar() {
    fs.writeFileSync(this.archivo, JSON.stringify(this.tareas, null, 2));
  }

  agregar(nombre) {
    const tarea = {
      id: Date.now(),
      nombre,
      completada: false
    };
    this.tareas.push(tarea);
    this.guardar();
    console.log("✔ Tarea agregada");
  }

  listar() {
    console.log("\n📋 TAREAS:");
    this.tareas.forEach(t => {
      console.log(`[${t.completada ? "✔" : "❌"}] ${t.id} - ${t.nombre}`);
    });
  }

  completar(id) {
    const tarea = this.tareas.find(t => t.id == id);
    if (tarea) {
      tarea.completada = true;
      this.guardar();
      console.log("✔ Completada");
    } else {
      console.log("❌ No encontrada");
    }
  }

  eliminar(id) {
    this.tareas = this.tareas.filter(t => t.id != id);
    this.guardar();
    console.log("🗑 Eliminada");
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const app = new GestorTareas();

function menu() {
  console.log(`
1. Agregar tarea
2. Listar tareas
3. Completar tarea
4. Eliminar tarea
5. Salir
`);

  rl.question("Elegí una opción: ", (op) => {
    if (op == "1") {
      rl.question("Nombre: ", (nombre) => {
        app.agregar(nombre);
        menu();
      });
    } else if (op == "2") {
      app.listar();
      menu();
    } else if (op == "3") {
      rl.question("ID: ", (id) => {
        app.completar(id);
        menu();
      });
    } else if (op == "4") {
      rl.question("ID: ", (id) => {
        app.eliminar(id);
        menu();
      });
    } else {
      rl.close();
    }
  });
}

menu();
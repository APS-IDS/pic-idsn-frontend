// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { apiEventMatchesSearch, eventMatchesSearch } from "./filter_events.js";

const opciones = {
  proyectos: [{ value: "p1", label: "Salud mental para la paz" }],
  operadores: [{ value: "o1", label: "E.S.E. Hospital San Pedro" }],
};

const evento = {
  description_event: "Prevención del embarazo en la adolescencia",
  indicator_name: "Tasa de fecundidad específica",
  meta_indicator: "30 - TEF 15-19",
  proyecto: "p1",
  operador_pic: "o1",
};

test("sin texto de búsqueda muestra todos los eventos", () => {
  assert.equal(eventMatchesSearch(evento, "   ", opciones), true);
});

test("busca en la descripción sin importar mayúsculas ni tildes", () => {
  assert.equal(eventMatchesSearch(evento, "PREVENCION", opciones), true);
});

test("busca en el nombre del indicador", () => {
  assert.equal(eventMatchesSearch(evento, "fecundidad", opciones), true);
});

test("busca en la meta del indicador", () => {
  assert.equal(eventMatchesSearch(evento, "TEF 15", opciones), true);
});

test("busca por el nombre del proyecto, no por su id", () => {
  assert.equal(eventMatchesSearch(evento, "salud mental", opciones), true);
  assert.equal(eventMatchesSearch(evento, "p1", opciones), false);
});

test("busca por el nombre del operador", () => {
  assert.equal(eventMatchesSearch(evento, "san pedro", opciones), true);
});

test("todas las palabras deben aparecer, aunque sea en campos distintos", () => {
  assert.equal(eventMatchesSearch(evento, "embarazo tasa", opciones), true);
  assert.equal(eventMatchesSearch(evento, "embarazo malaria", opciones), false);
});

test("un evento nuevo con campos vacíos no rompe la búsqueda", () => {
  const vacio = { description_event: "", indicator_name: null, proyecto: "", operador_pic: "" };
  assert.equal(eventMatchesSearch(vacio, "embarazo", opciones), false);
});

// Evento tal como lo devuelve la API (lista de anexos).
const eventoApi = {
  descripcion: "Prevención del embarazo en la adolescencia",
  indicador_evento: "Tasa de fecundidad específica",
  meta_indicador_evento: "30 - TEF 15-19",
  proyectos_idsn: { proyecto: "Salud mental para la paz" },
  operador_pic: { operador_pic: "E.S.E. Hospital San Pedro" },
};

test("en la lista busca en descripción, indicador y meta del evento", () => {
  assert.equal(apiEventMatchesSearch(eventoApi, "prevencion"), true);
  assert.equal(apiEventMatchesSearch(eventoApi, "fecundidad"), true);
  assert.equal(apiEventMatchesSearch(eventoApi, "TEF 15"), true);
});

test("en la lista busca por nombre de proyecto y de operador", () => {
  assert.equal(apiEventMatchesSearch(eventoApi, "salud mental"), true);
  assert.equal(apiEventMatchesSearch(eventoApi, "san pedro"), true);
});

test("en la lista exige todas las palabras y tolera relaciones vacías", () => {
  assert.equal(apiEventMatchesSearch(eventoApi, "embarazo malaria"), false);
  assert.equal(
    apiEventMatchesSearch({ ...eventoApi, proyectos_idsn: null, operador_pic: null }, "embarazo"),
    true,
  );
});

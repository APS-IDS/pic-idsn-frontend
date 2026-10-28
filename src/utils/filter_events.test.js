// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { eventMatchesSearch } from "./filter_events.js";

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

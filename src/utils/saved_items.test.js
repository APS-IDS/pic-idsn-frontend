// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isSavedActivity,
  isSavedEvent,
  isSavedProduct,
  isSavedSoporte,
} from "./saved_items.js";

const soporte = (uuid) => ({ tipo_soporte: "Acta", ...(uuid && { uuid }) });
const actividad = (uuid, soportes = [soporte()]) => ({
  descripcion_actividad: "Concertar agenda",
  array_soportes: soportes,
  ...(uuid && { uuid }),
});
const producto = (uuid) => ({ descripcion_producto: "Producto", ...(uuid && { uuid }) });
const evento = ({ uuid, productos = [producto()], actividades = [[actividad()]] } = {}) => ({
  description_event: "Evento",
  product_data: { producto: productos },
  activities: actividades,
  ...(uuid && { uuid }),
});

test("lo agregado en esta edición, sin uuid, no está guardado", () => {
  assert.equal(isSavedSoporte(soporte()), false);
  assert.equal(isSavedActivity(actividad()), false);
  assert.equal(isSavedProduct(producto(), [actividad()]), false);
  assert.equal(isSavedEvent(evento()), false);
});

test("lo que tiene uuid ya está guardado", () => {
  assert.equal(isSavedSoporte(soporte("s1")), true);
  assert.equal(isSavedActivity(actividad("a1")), true);
  assert.equal(isSavedProduct(producto("p1"), []), true);
  assert.equal(isSavedEvent(evento({ uuid: "e1" })), true);
});

test("un evento o producto guardado antes de tener uuid se reconoce por sus actividades", () => {
  const actividades = [actividad("a1")];

  assert.equal(isSavedProduct(producto(), actividades), true);
  assert.equal(isSavedEvent(evento({ actividades: [actividades] })), true);
});

test("una actividad nueva con un soporte guardado cuenta como guardada", () => {
  assert.equal(isSavedActivity(actividad(undefined, [soporte("s1")])), true);
});

test("un evento con un producto guardado cuenta como guardado", () => {
  assert.equal(isSavedEvent(evento({ productos: [producto("p1")], actividades: [[]] })), true);
});

test("tolera productos sin actividades y eventos sin listas", () => {
  assert.equal(isSavedProduct(producto()), false);
  assert.equal(isSavedEvent({}), false);
});

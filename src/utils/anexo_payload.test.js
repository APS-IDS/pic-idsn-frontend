// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildAnexoPayload } from "./anexo_payload.js";

const soporte = (overrides = {}) => ({
  tipo_soporte: "Acta de Reunión",
  descripcion_soporte: "Actas por municipio",
  cantidad_soporte: 5,
  ...overrides,
});

const actividad = (overrides = {}) => ({
  descripcion_actividad: "Concertar agenda",
  cantidad: "1",
  entorno: [],
  tecnologia: [],
  cursos_vida: [],
  poblacion_sujeto: [],
  codigo_cups: "I10201",
  array_soportes: [soporte()],
  cronograma: [{ mes: "Ene", peso: "100" }],
  ...overrides,
});

const evento = (actividades) => ({
  description_event: "Prevención del embarazo",
  product_data: { producto: [{ descripcion_producto: "Producto 1", indicadores: [] }] },
  activities: [actividades],
});

const primeraActividad = (payload) => payload.data.eventos[0].productos[0].actividades[0];

test("arma soportes y actividades con los campos del formulario", () => {
  const payload = buildAnexoPayload([evento([actividad()])], { anexoYear: "2026-01-01" });

  assert.equal(payload.data.anexo_tecnico_date, "2026-01-01");
  assert.equal(primeraActividad(payload).descripcion, "Concertar agenda");
  assert.deepEqual(primeraActividad(payload).soportes, [
    { tipo: "Acta de Reunión", descripcion: "Actas por municipio", cantidad: 5 },
  ]);
});

test("al crear no envía versión", () => {
  const payload = buildAnexoPayload([evento([actividad()])], { anexoYear: "2026-01-01" });

  assert.equal("version" in payload.data, false);
});

test("al editar envía la versión que se abrió", () => {
  const payload = buildAnexoPayload([evento([actividad()])], {
    anexoYear: "2026-01-01",
    isEdit: true,
    version: 3,
  });

  assert.equal(payload.data.version, 3);
});

test("al editar conserva el uuid de cada actividad y de cada soporte", () => {
  const form = [
    evento([actividad({ uuid: "act-1", array_soportes: [soporte({ uuid: "sop-1" })] })]),
  ];

  const payload = buildAnexoPayload(form, { anexoYear: "2026-01-01", isEdit: true, version: 3 });

  assert.equal(primeraActividad(payload).uuid, "act-1");
  assert.equal(primeraActividad(payload).soportes[0].uuid, "sop-1");
});

test("al editar, lo agregado sin uuid se envía sin uuid para que el backend lo genere", () => {
  const form = [evento([actividad({ array_soportes: [soporte()] })])];

  const payload = buildAnexoPayload(form, { anexoYear: "2026-01-01", isEdit: true, version: 3 });

  assert.equal("uuid" in primeraActividad(payload), false);
  assert.equal("uuid" in primeraActividad(payload).soportes[0], false);
});

test("al crear nunca envía uuid, porque el backend rechaza anexos nuevos con uuid", () => {
  const form = [
    evento([actividad({ uuid: "act-1", array_soportes: [soporte({ uuid: "sop-1" })] })]),
  ];

  const payload = buildAnexoPayload(form, { anexoYear: "2026-01-01" });

  assert.equal("uuid" in primeraActividad(payload), false);
  assert.equal("uuid" in primeraActividad(payload).soportes[0], false);
});

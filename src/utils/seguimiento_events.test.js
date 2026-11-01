// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hasEstadoSoporteChange,
  hasSeguimientoChanges,
  isSeguimientoCerrado,
} from "./seguimiento_events.js";

const seguimiento = (overrides = {}) => ({
  observaciones: {
    observacion_referente: "Bien",
    observacion_operador: "Avance",
    ...overrides.observaciones,
  },
  status: {
    estado_referente: "Actividad con avance",
    estado_operador: "Reporte de avance",
    porcentaje_referente: 50,
    porcentaje_operador: 40,
    ...overrides.status,
  },
});

test("sin cambios no hay nada que guardar", () => {
  assert.equal(hasSeguimientoChanges("referente", seguimiento(), seguimiento()), false);
});

test("cambiar la observación, el porcentaje o el estado del rol habilita el guardado", () => {
  const saved = seguimiento();

  assert.equal(
    hasSeguimientoChanges("operador", saved, seguimiento({ observaciones: { observacion_operador: "Nuevo" } })),
    true,
  );
  assert.equal(
    hasSeguimientoChanges("operador", saved, seguimiento({ status: { porcentaje_operador: 60 } })),
    true,
  );
  assert.equal(
    hasSeguimientoChanges("referente", saved, seguimiento({ status: { estado_referente: "Actividad cerrada" } })),
    true,
  );
});

test("volver al valor guardado deja de contar como cambio", () => {
  const editado = seguimiento({ observaciones: { observacion_referente: "Bien" } });

  assert.equal(hasSeguimientoChanges("referente", seguimiento(), editado), false);
});

test("los cambios del otro rol no cuentan", () => {
  const current = seguimiento({ observaciones: { observacion_operador: "Otro" } });

  assert.equal(hasSeguimientoChanges("referente", seguimiento(), current), false);
});

test("un porcentaje en texto igual al guardado no es un cambio", () => {
  const current = seguimiento({ status: { porcentaje_referente: "50" } });

  assert.equal(hasSeguimientoChanges("referente", seguimiento(), current), false);
});

test("sin rol que edite o antes de cargar no hay nada que guardar", () => {
  const current = seguimiento({ observaciones: { observacion_referente: "Nuevo" } });

  assert.equal(hasSeguimientoChanges(null, seguimiento(), current), false);
  assert.equal(hasSeguimientoChanges("referente", null, current), false);
});

test("el estado de un soporte se puede guardar solo si se eligió uno distinto al guardado", () => {
  const saved = { s1: "Aprobado" };

  assert.equal(hasEstadoSoporteChange(saved, {}, "s1"), false);
  assert.equal(hasEstadoSoporteChange(saved, { s1: "Aprobado" }, "s1"), false);
  assert.equal(hasEstadoSoporteChange(saved, { s1: "No aprobado" }, "s1"), true);
  assert.equal(hasEstadoSoporteChange(saved, { s2: "Aprobado" }, "s2"), true);
});

test("el seguimiento del referente se cierra con Actividad cerrada al 100%", () => {
  assert.equal(isSeguimientoCerrado("Actividad cerrada", 100), true);
  assert.equal(isSeguimientoCerrado("Actividad cerrada", "100"), true);
});

test("el seguimiento sigue abierto por debajo del 100% o con otro estado", () => {
  assert.equal(isSeguimientoCerrado("Actividad cerrada", 95), false);
  assert.equal(isSeguimientoCerrado("Actividad con avance", 100), false);
  assert.equal(isSeguimientoCerrado(undefined, undefined), false);
});

// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { describePendingRemovals } from "./pending_removals.js";

test("lista actividades y soportes con sus registros", () => {
  const html = describePendingRemovals({
    actividades: [{ uuid: "a1", descripcion: "Concertar agenda", observaciones: 2 }],
    soportes: [{ uuid: "s1", tipo: "Acta de Reunión", descripcion: "Actas firmadas", evidencias: 1 }],
  });

  assert.match(html, /Actividad: Concertar agenda — 2 observaciones/);
  assert.match(html, /Soporte Acta de Reunión: Actas firmadas — 1 evidencia</);
});

test("avisa que los registros se borran definitivamente", () => {
  const html = describePendingRemovals({
    actividades: [{ uuid: "a1", descripcion: "Concertar agenda", observaciones: 1 }],
  });

  assert.match(html, /se borrarán definitivamente/);
  assert.match(html, /no se puede deshacer/);
  assert.equal(html.includes("desvinculados"), false);
});

test("un soporte con seguimiento pero sin evidencias se describe como tal", () => {
  const html = describePendingRemovals({
    soportes: [{ uuid: "s1", tipo: "Acta", descripcion: "x", evidencias: 0 }],
  });

  assert.match(html, /seguimiento sin evidencias/);
});

test("escapa el HTML que viene en las descripciones", () => {
  const html = describePendingRemovals({
    soportes: [{ uuid: "s1", tipo: "<b>", descripcion: '<img src=x onerror="alert(1)">', evidencias: 1 }],
  });

  assert.equal(html.includes("<img"), false);
  assert.match(html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
});

test("acorta descripciones largas y normaliza espacios", () => {
  const html = describePendingRemovals({
    actividades: [{ uuid: "a1", descripcion: `Inicio\n\n  ${"x".repeat(300)}`, observaciones: 1 }],
  });

  assert.match(html, /Actividad: Inicio x+… — 1 observación/);
  assert.equal(html.includes("x".repeat(200)), false);
});

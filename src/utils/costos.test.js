// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { sumCostos } from "./costos.js";

test("suma costos directos e indirectos", () => {
  assert.equal(sumCostos("1500000", "250000.5"), "1750000.5");
});

test("con un solo costo, el total es ese costo", () => {
  assert.equal(sumCostos("800000", ""), "800000");
  assert.equal(sumCostos(null, "1200"), "1200");
});

test("sin costos no hay total calculado", () => {
  assert.equal(sumCostos("", ""), null);
  assert.equal(sumCostos(null, undefined), null);
});

test("redondea a dos decimales sin errores de coma flotante", () => {
  assert.equal(sumCostos("0.1", "0.2"), "0.3");
});

test("acepta los números que llegan del servidor al editar", () => {
  assert.equal(sumCostos(1000, "500.25"), "1500.25");
});

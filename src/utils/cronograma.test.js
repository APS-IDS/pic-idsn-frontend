// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { sumCronograma } from "./cronograma.js";

test("suma los porcentajes de todos los meses", () => {
  assert.equal(sumCronograma([{ mes: "Ene", peso: "50" }, { mes: "Feb", peso: "30" }, { mes: "Mar", peso: "20" }]), 100);
});

test("los meses vacíos cuentan como 0", () => {
  assert.equal(sumCronograma([{ mes: "Ene", peso: "" }, { mes: "Feb", peso: null }, { mes: "Mar", peso: "40" }]), 40);
});

test("suma como se guarda: los decimales se descartan", () => {
  assert.equal(sumCronograma([{ mes: "Ene", peso: "33.5" }, { mes: "Feb", peso: "66.5" }]), 99);
});

test("acepta los números que llegan del servidor al editar", () => {
  assert.equal(sumCronograma([{ mes: "Ene", peso: 60 }, { mes: "Feb", peso: 40 }]), 100);
});

test("sin cronograma la suma es 0", () => {
  assert.equal(sumCronograma(undefined), 0);
});

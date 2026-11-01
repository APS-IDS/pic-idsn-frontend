// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { moveItem } from "./move_item.js";

test("mueve un elemento hacia abajo hasta la posición de destino", () => {
  assert.deepEqual(moveItem(["a", "b", "c", "d"], 0, 2), ["b", "c", "a", "d"]);
});

test("mueve un elemento hacia arriba hasta la posición de destino", () => {
  assert.deepEqual(moveItem(["a", "b", "c", "d"], 3, 1), ["a", "d", "b", "c"]);
});

test("soltar en la misma posición no cambia el orden", () => {
  assert.deepEqual(moveItem(["a", "b", "c"], 1, 1), ["a", "b", "c"]);
});

test("no modifica la lista original", () => {
  const list = ["a", "b", "c"];

  moveItem(list, 0, 2);

  assert.deepEqual(list, ["a", "b", "c"]);
});

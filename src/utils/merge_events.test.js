// Ejecutar con: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeEvents, mergeValue, tagEvents } from "./merge_events.js";

const evento = (key, overrides = {}) => ({
  _key: key,
  description_event: `Evento ${key}`,
  subregion: [],
  activities: [],
  product_data: { producto: [] },
  ...overrides,
});

const descripciones = (events) => events.map((e) => e.description_event);

test("conserva un evento que solo cambié yo", () => {
  const base = [evento("a", { description_event: "original" })];
  const mine = [evento("a", { description_event: "mío" })];
  const theirs = [evento("t0", { description_event: "original" })];

  assert.equal(mergeEvents(base, mine, theirs)[0].description_event, "mío");
});

test("toma un evento que solo cambió la otra persona", () => {
  const base = [evento("a", { description_event: "original" })];
  const mine = [evento("a", { description_event: "original" })];
  const theirs = [evento("t0", { description_event: "de ellos" })];

  assert.equal(mergeEvents(base, mine, theirs)[0].description_event, "de ellos");
});

test("si los dos cambiaron el mismo evento, queda mi versión completa del evento", () => {
  const base = [evento("a", { description_event: "original", indicator_name: "x" })];
  const mine = [evento("a", { description_event: "mío", indicator_name: "x" })];
  const theirs = [evento("t0", { description_event: "original", indicator_name: "y" })];

  const [merged] = mergeEvents(base, mine, theirs);
  assert.equal(merged.description_event, "mío");
  assert.equal(merged.indicator_name, "x");
});

test("no mezcla productos ni actividades dentro de un evento", () => {
  const actividad = (descripcion) => ({ descripcion_actividad: descripcion });
  const base = [evento("a", { activities: [[actividad("A1"), actividad("A2")]] })];
  const mine = [evento("a", { activities: [[actividad("A1 mía"), actividad("A2")]] })];
  const theirs = [evento("t0", { activities: [[actividad("A1"), actividad("A2 de ellos")]] })];

  assert.deepEqual(mergeEvents(base, mine, theirs)[0].activities, [
    [actividad("A1 mía"), actividad("A2")],
  ]);
});

test("cambios en eventos distintos se combinan", () => {
  const base = [evento("a"), evento("b")];
  const mine = [evento("a", { description_event: "a mío" }), evento("b")];
  const theirs = [
    evento("t0", { description_event: "Evento a" }),
    evento("t1", { description_event: "b de ellos" }),
  ];

  assert.deepEqual(descripciones(mergeEvents(base, mine, theirs)), ["a mío", "b de ellos"]);
});

test("los eventos que agregué quedan al final, después de los que agregó la otra persona", () => {
  const base = [evento("a")];
  const mine = [evento("a"), evento(undefined, { description_event: "nuevo mío" })];
  const theirs = [evento("t0"), evento("t1", { description_event: "nuevo de ellos" })];

  assert.deepEqual(descripciones(mergeEvents(base, mine, theirs)), [
    "Evento t0",
    "nuevo de ellos",
    "nuevo mío",
  ]);
});

test("un evento que borré no vuelve y no desalinea los demás", () => {
  const base = [evento("a"), evento("b"), evento("c")];
  const mine = [evento("a"), evento("c")];
  const theirs = [
    evento("t0", { description_event: "Evento a" }),
    evento("t1", { description_event: "Evento b" }),
    evento("t2", { description_event: "c editado por ellos" }),
  ];

  assert.deepEqual(descripciones(mergeEvents(base, mine, theirs)), [
    "Evento a",
    "c editado por ellos",
  ]);
});

test("un evento que la otra persona borró pero yo modifiqué no se pierde", () => {
  const base = [evento("a"), evento("b")];
  const mine = [evento("a"), evento("b", { description_event: "b editado por mí" })];
  const theirs = [evento("t0", { description_event: "Evento a" })];

  assert.deepEqual(descripciones(mergeEvents(base, mine, theirs)), [
    "Evento a",
    "b editado por mí",
  ]);
});

test("vacío, null, undefined y número/texto no cuentan como cambio mío", () => {
  const base = [evento("a", { total_hogares: null, poblacion: 200 })];
  const mine = [evento("a", { total_hogares: "", poblacion: "200" })];
  const theirs = [evento("t0", { description_event: "de ellos", total_hogares: null, poblacion: 200 })];

  assert.equal(mergeEvents(base, mine, theirs)[0].description_event, "de ellos");
});

test("los eventos que conservo de mi versión toman la clave de la versión nueva", () => {
  const base = [evento("a", { description_event: "original" })];
  const mine = [evento("a", { description_event: "mío" })];
  const theirs = [evento("t0", { description_event: "de ellos" })];

  assert.equal(mergeEvents(base, mine, theirs)[0]._key, "t0");
});

// Con uuid: base y theirs se emparejan por uuid, no por posición.
const conUuid = (key, uuid, overrides = {}) =>
  evento(key, { uuid, description_event: `Evento ${uuid}`, ...overrides });
const uuids = (events) =>
  events.map((e) => e.uuid + (e.description_event === `Evento ${e.uuid}` ? "" : "'"));

test("con uuid: si la otra persona borró un evento, el que edité no se duplica", () => {
  const base = [conUuid("a", "A"), conUuid("b", "B"), conUuid("c", "C")];
  const mine = [base[0], base[1], { ...base[2], description_event: "C editado" }];
  const theirs = [conUuid("t0", "A"), conUuid("t1", "C")];

  assert.deepEqual(uuids(mergeEvents(base, mine, theirs)), ["A", "C'"]);
});

test("con uuid: si la otra persona borró un evento que yo edité, los demás no se pierden", () => {
  const base = [conUuid("a", "A"), conUuid("b", "B"), conUuid("c", "C")];
  const mine = [base[0], { ...base[1], description_event: "B editado" }, base[2]];
  const theirs = [conUuid("t0", "A"), conUuid("t1", "C")];

  assert.deepEqual(uuids(mergeEvents(base, mine, theirs)), ["A", "C", "B'"]);
});

test("con uuid: lo que borré no revive y lo que borró la otra persona no se pierde de más", () => {
  const base = [conUuid("a", "A"), conUuid("b", "B"), conUuid("c", "C")];
  const mine = [base[0], base[2]];
  const theirs = [conUuid("t0", "B"), conUuid("t1", "C")];

  assert.deepEqual(uuids(mergeEvents(base, mine, theirs)), ["C"]);
});

test("con uuid: se conserva lo que agregó la otra persona y lo que borró pero yo edité", () => {
  const base = [conUuid("a", "A"), conUuid("b", "B")];
  const mine = [{ ...base[0], description_event: "A editado" }, base[1]];
  const theirs = [conUuid("t0", "B"), conUuid("t1", "N")];

  assert.deepEqual(uuids(mergeEvents(base, mine, theirs)), ["B", "N", "A'"]);
});

test("con uuid: el evento que conservo de mi versión toma la clave de la versión nueva", () => {
  const base = [conUuid("a", "A"), conUuid("b", "B")];
  const mine = [base[0], { ...base[1], description_event: "B editado" }];
  const theirs = [conUuid("t0", "B")];

  const [merged] = mergeEvents(base, mine, theirs);
  assert.equal(merged.description_event, "B editado");
  assert.equal(merged._key, "t0");
});

test("con uuid repetidos en la versión cargada se alinea por posición", () => {
  const base = [conUuid("a", "A"), conUuid("b", "A")];
  const mine = [base[0], base[1]];
  const theirs = [
    conUuid("t0", "A", { description_event: "primero de ellos" }),
    conUuid("t1", "A", { description_event: "segundo de ellos" }),
  ];

  assert.deepEqual(descripciones(mergeEvents(base, mine, theirs)), [
    "primero de ellos",
    "segundo de ellos",
  ]);
});

test("mergeValue conserva mi valor solo si lo cambié", () => {
  assert.equal(mergeValue("2025-01-01", "2026-01-01", "2024-01-01"), "2026-01-01");
  assert.equal(mergeValue("2025-01-01", "2025-01-01", "2024-01-01"), "2024-01-01");
});

test("tagEvents asigna claves únicas por generación sin modificar la entrada", () => {
  const events = [{ description_event: "a" }, { description_event: "b" }];

  const tagged = tagEvents(events, 7);

  assert.deepEqual(tagged.map((e) => e._key), ["7-0", "7-1"]);
  assert.equal(events[0]._key, undefined);
});

// Mezcla a nivel de evento para cuando otra persona guardó el anexo mientras
// se editaba: base = lo que se cargó al abrir, mine = el formulario actual,
// theirs = la versión más reciente del servidor. Cada evento se toma completo
// (con sus productos y actividades) de una sola versión: si lo cambié, el mío;
// si no, el de theirs. Los eventos que agregué quedan al final.

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isEmpty = (value) => value === null || value === undefined || value === "";

// Los inputs guardan texto ("200") y el servidor devuelve números (200);
// null, undefined y "" son el mismo campo vacío.
const isEqual = (a, b) => {
  if (isEmpty(a) && isEmpty(b)) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => isEqual(item, b[i]));
  }
  if (isPlainObject(a) || isPlainObject(b)) {
    if (!isPlainObject(a) || !isPlainObject(b)) return false;
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    return [...keys].every((key) => isEqual(a[key], b[key]));
  }
  return String(a) === String(b);
};

export const mergeValue = (base, mine, theirs) => (isEqual(mine, base) ? theirs : mine);

// Posición en theirs de cada evento de base (undefined si la otra persona lo
// borró). Se emparejan por el uuid del evento; si alguno no tiene (anexos
// guardados antes de que los eventos tuvieran uuid) o hay repetidos, por
// posición.
const alignBase = (base, theirs) => {
  const uuids = base.map((evento) => evento.uuid);
  const byUuid = uuids.every(Boolean) && new Set(uuids).size === uuids.length;

  if (!byUuid) return base.map((_, i) => (i < theirs.length ? i : undefined));

  const theirIndexByUuid = new Map();
  theirs.forEach((evento, j) => {
    if (evento.uuid && !theirIndexByUuid.has(evento.uuid)) {
      theirIndexByUuid.set(evento.uuid, j);
    }
  });
  return uuids.map((uuid) => theirIndexByUuid.get(uuid));
};

// mine viene de base y se alinea con él por _key.
export const mergeEvents = (base, mine, theirs) => {
  const baseIndexByKey = new Map(base.map((evento, i) => [evento._key, i]));
  const mineByBaseIndex = new Map();
  const added = [];

  for (const evento of mine) {
    const i = baseIndexByKey.get(evento._key);
    if (i === undefined || mineByBaseIndex.has(i)) added.push(evento);
    else mineByBaseIndex.set(i, evento);
  }

  const theirIndexOfBase = alignBase(base, theirs);
  const baseIndexOfTheirs = new Map(
    theirIndexOfBase
      .map((j, i) => [j, i])
      .filter(([j]) => j !== undefined),
  );

  const result = [];
  theirs.forEach((evento, j) => {
    const i = baseIndexOfTheirs.get(j);
    if (i === undefined) {
      // Lo agregó la otra persona.
      result.push(evento);
    } else if (mineByBaseIndex.has(i)) {
      const mio = mineByBaseIndex.get(i);
      result.push(isEqual(mio, base[i]) ? evento : { ...mio, _key: evento._key });
    }
  });

  // Lo que la otra persona borró pero yo modifiqué no se pierde.
  base.forEach((evento, i) => {
    const mio = mineByBaseIndex.get(i);
    if (theirIndexOfBase[i] === undefined && mio && !isEqual(mio, evento)) {
      result.push(mio);
    }
  });

  return [...result, ...added];
};

// Identidad estable de cada evento mientras se edita, para saber cuáles se
// borraron del formulario. La generación (versión del anexo) evita que claves
// de cargas distintas coincidan.
export const tagEvents = (events, generation) =>
  events.map((event, i) => ({ ...event, _key: `${generation}-${i}` }));

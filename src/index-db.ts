import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm-browser.wasm?url';
import type { Rows } from './search.ts';

// Loads /esdara.sqlite with sql.js once per page (shared by /search/ and the WebMCP tool); a failed load can be retried.
let index: Promise<Rows> | undefined;
export const openIndex = () => (index ??= load().catch((err) => ((index = undefined), Promise.reject(err))));

async function load(): Promise<Rows> {
  const [SQL, bytes] = await Promise.all([
    initSqlJs({ locateFile: () => wasmUrl }),
    fetch('/esdara.sqlite').then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`index: HTTP ${r.status}`)))),
  ]);
  const db = new SQL.Database(new Uint8Array(bytes));
  return (sql, args) => {
    const stmt = db.prepare(sql);
    stmt.bind(args);
    const out = [];
    while (stmt.step()) out.push(stmt.getAsObject());
    stmt.free();
    return out;
  };
}

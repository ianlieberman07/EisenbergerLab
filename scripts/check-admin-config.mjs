/**
 * Fails the build if public/admin/config.yml is broken.
 *
 * This exists because that file is the one thing in the project nothing else
 * checks. Astro copies it to dist/ as an opaque asset — only the CMS running in
 * the client's browser ever parses it. So a syntax error builds green, deploys
 * green, and the first sign of trouble is her opening the admin and finding it
 * dead.
 *
 * The failure mode that actually bites is not a crash — it is silent
 * corruption. An unquoted comma inside a `{ … }` flow mapping ends the value
 * early and turns the rest into a junk key:
 *
 *   { hint: Shown after the name, e.g. "Ph.D.". Leave empty. }
 *
 * parses without complaint as `hint: "Shown after the name"` plus a key called
 * `e.g. "Ph.D.". Leave empty.` — the hint is quietly truncated and nothing
 * anywhere reports it. So this checks for stray keys as well as for syntax.
 *
 * Uses the same JavaScript YAML parser family the CMS itself uses. Python's
 * parser is stricter and rejects things the CMS accepts, so checking with it
 * would raise false alarms.
 *
 * Run by `npm run build` via the prebuild hook.
 */
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const PATH = 'public/admin/config.yml';
const fail = (msg) => {
  console.error(`\n✗ ${PATH}\n  ${msg}\n`);
  process.exit(1);
};

let config;
try {
  config = parse(readFileSync(PATH, 'utf8'));
} catch (error) {
  fail(
    `${error.message}\n\n  A value containing , : ? { } [ ] inside a { … } flow\n` +
      `  mapping must be quoted. Wrap it in single quotes.`
  );
}

if (!config?.backend?.name) fail('No backend is configured.');
if (!config.backend.base_url) {
  fail('backend.base_url is missing — sign-in would fall back to Netlify and fail.');
}
if (!Array.isArray(config.collections) || config.collections.length === 0) {
  fail('No collections are defined, so the admin would show an empty sidebar.');
}

/** Walks nested field lists — `object` and `list` widgets carry their own. */
const eachField = function* (fields, path) {
  for (const field of fields ?? []) {
    yield [field, path];
    if (Array.isArray(field?.fields)) yield* eachField(field.fields, `${path}.${field.name}`);
  }
};

for (const collection of config.collections) {
  const fields = collection.fields ?? collection.files?.flatMap((f) => f.fields ?? []) ?? [];
  if (fields.length === 0) fail(`Collection "${collection.name}" has no fields.`);

  for (const [field, path] of eachField(fields, collection.name)) {
    if (!field?.name) fail(`A field in "${path}" has no name.`);
    if (!field.widget) fail(`Field "${path}.${field.name}" has no widget.`);

    // A real option name is one word. Anything with a space or a sentence in it
    // is the tail of a value that an unquoted comma cut loose.
    for (const key of Object.keys(field)) {
      if (/[\s]/.test(key)) {
        fail(
          `Field "${path}.${field.name}" has a key that looks like runaway text:\n` +
            `    ${JSON.stringify(key)}\n\n` +
            `  An unquoted comma inside a { … } flow mapping ends the value and turns\n` +
            `  the remainder into a key. Wrap the value in single quotes.`
        );
      }
    }
  }
}

const names = config.collections.map((c) => c.name);
console.log(`✓ ${PATH} — ${names.length} collections: ${names.join(', ')}`);

const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { build } = require('./build');

const tests = [
  ['build emits both plugins from repo manifest', () => {
    const manifest = path.join(__dirname, '..', 'manifest.json');
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'agentflow-test-'));
    const { count, skills } = build(manifest, out);
    assert.ok(count >= 8, `expected >= 8 skills, got ${count}`);

    const claude = JSON.parse(fs.readFileSync(path.join(out, '.claude-plugin', 'plugin.json'), 'utf8'));
    const codex = JSON.parse(fs.readFileSync(path.join(out, '.codex-plugin', 'plugin.json'), 'utf8'));
    assert.strictEqual(claude.name, 'agentflow');
    assert.strictEqual(codex.name, 'agentflow');
    assert.strictEqual(codex.skills[0], './pipeline/');
    assert.ok(codex.interface.capabilities.includes('Write'));
    assert.ok(skills.includes('spec') && skills.includes('execute'), `pipeline skills missing: ${skills}`);
    for (const f of ['.claude-plugin/marketplace.json', '.agents/plugins/marketplace.json', '.cursor-plugin/plugin.json']) {
      assert.ok(fs.existsSync(path.join(out, f)), `missing emitted file: ${f}`);
    }
    const mkt = JSON.parse(fs.readFileSync(path.join(out, '.claude-plugin', 'marketplace.json'), 'utf8'));
    assert.strictEqual(mkt.plugins[0].source, './');
    fs.rmSync(out, { recursive: true, force: true });
  }],

  ['skill missing description fails the build', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agentflow-bad-'));
    const skills = path.join(tmp, 'skills', 'bad');
    fs.mkdirSync(skills, { recursive: true });
    fs.writeFileSync(path.join(skills, 'SKILL.md'), '---\nname: bad\n---\nno description\n');
    fs.writeFileSync(path.join(tmp, 'manifest.json'), JSON.stringify({
      name: 'x', version: '0.0.1', description: 'x', author: { name: 't' }, skills: ['./skills/'],
    }));
    assert.throws(() => build(path.join(tmp, 'manifest.json'), tmp), /'name' and 'description'/);
    fs.rmSync(tmp, { recursive: true, force: true });
  }],

  ['manifest missing a required key fails the build', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agentflow-bad-'));
    fs.writeFileSync(path.join(tmp, 'manifest.json'), JSON.stringify({ name: 'x' }));
    assert.throws(() => build(path.join(tmp, 'manifest.json'), tmp), /missing 'version'/);
    fs.rmSync(tmp, { recursive: true, force: true });
  }],
];

let failed = 0;
for (const [name, fn] of tests) {
  try { fn(); console.log(`ok  - ${name}`); }
  catch (e) { failed++; console.error(`FAIL - ${name}\n  ${e.message}`); process.exitCode = 1; }
}
if (failed) process.exit(1);

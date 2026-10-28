#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { build } = require('../compiler/build');

const cmd = process.argv[2];
const here = repo => path.resolve(__dirname, '..', repo);

if (cmd === 'build') {
  const manifest = process.argv[3] || here('manifest.json');
  const { count, skills } = build(manifest, path.dirname(path.resolve(manifest)));
  console.log(`built .claude-plugin + .codex-plugin from ${count} skills: ${skills.join(', ')}`);
} else if (cmd === 'init') {
  const target = process.argv[3];
  if (!target) { console.error('usage: agentflow init <project-dir>'); process.exit(1); }
  const dir = path.resolve(target);
  const agentDir = path.join(dir, '.agentflow');
  fs.mkdirSync(agentDir, { recursive: true });

  const ledger = path.join(agentDir, 'ledger.md');
  if (!fs.existsSync(ledger)) fs.writeFileSync(ledger, fs.readFileSync(here('templates/ledger.md'), 'utf8'));

  const conventions = path.join(agentDir, 'conventions.md');
  if (!fs.existsSync(conventions)) fs.writeFileSync(conventions, fs.readFileSync(here('templates/conventions.md'), 'utf8'));

  const agentsMd = path.join(dir, 'AGENTS.md');
  if (fs.existsSync(agentsMd)) {
    console.error(`refusing to overwrite existing ${agentsMd}; merge templates/AGENTS.md manually`);
    process.exit(1);
  }
  fs.writeFileSync(agentsMd, fs.readFileSync(here('templates/AGENTS.md'), 'utf8'));
  console.log(`scaffolded ${agentDir}/ledger.md and AGENTS.md.
Next: install the agentflow plugin in your harness (Codex /plugins, Claude /plugin)
and edit .agentflow/conventions.md — team standards every stage inherits.`);
} else {
  console.error('usage: agentflow [build | init <project-dir>]');
  process.exit(1);
}

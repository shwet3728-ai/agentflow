const fs = require('fs');
const path = require('path');

// naive frontmatter parse: no YAML dep; skills use flat "key: value" lines
function parseFrontmatter(md) {
  const m = /^---\n([\s\S]*?)\n---/.exec(md);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = /^(\w[\w-]*):\s?(.*)$/.exec(line);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

function readSkills(repos, skillDirs) {
  const skills = [];
  for (const d of skillDirs) {
    const abs = path.resolve(repos, d);
    const entries = fs.readdirSync(abs, { recursive: true });
    for (const rel of entries) {
      if (!rel.endsWith('.md') || path.basename(rel) !== 'SKILL.md') continue;
      const file = path.join(abs, rel);
      const meta = parseFrontmatter(fs.readFileSync(file, 'utf8'));
      if (!meta || !meta.name || !meta.description) {
        throw new Error(`${file}: SKILL.md needs frontmatter with 'name' and 'description'`);
      }
      skills.push({ name: meta.name, description: meta.description, file });
    }
  }
  return skills;
}

function build(manifestPath, outDir) {
  const repo = path.dirname(path.resolve(manifestPath));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const key of ['name', 'version', 'description', 'skills']) {
    if (!manifest[key]) throw new Error(`manifest.json missing '${key}'`);
  }
  const skills = readSkills(repo, manifest.skills);
  if (skills.length === 0) throw new Error('no SKILL.md files found');

  fs.mkdirSync(path.join(outDir, '.claude-plugin'), { recursive: true });
  fs.mkdirSync(path.join(outDir, '.codex-plugin'), { recursive: true });

  // Claude Code plugin manifest
  fs.writeFileSync(
    path.join(outDir, '.claude-plugin', 'plugin.json'),
    JSON.stringify({
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author || { name: manifest.name },
    }, null, 2) + '\n'
  );

  // Codex plugin manifest (mirrors obra/superpowers's .codex-plugin shape)
  fs.writeFileSync(
    path.join(outDir, '.codex-plugin', 'plugin.json'),
    JSON.stringify({
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author || { name: manifest.name },
      skills: manifest.skills,
      hooks: {},
      interface: {
        displayName: (manifest.interface && manifest.interface.displayName) || manifest.name,
        shortDescription: (manifest.interface && manifest.interface.shortDescription) || manifest.description,
        longDescription: (manifest.interface && manifest.interface.longDescription) || manifest.description,
        category: (manifest.interface && manifest.interface.category) || 'Developer Tools',
        capabilities: (manifest.interface && manifest.interface.capabilities) || ['Interactive', 'Read', 'Write'],
      },
    }, null, 2) + '\n'
  );

  return { count: skills.length, skills: skills.map(s => s.name) };
}

module.exports = { parseFrontmatter, readSkills, build };

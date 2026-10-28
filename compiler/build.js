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

function writeFile(rel, data, outDir) {
  const file = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function build(manifestPath, outDir) {
  const repo = path.dirname(path.resolve(manifestPath));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const key of ['name', 'version', 'description', 'skills', 'author']) {
    if (!manifest[key]) throw new Error(`manifest.json missing '${key}'`);
  }
  const skills = readSkills(repo, manifest.skills);
  if (skills.length === 0) throw new Error('no SKILL.md files found');

  // Claude Code plugin + its marketplace register
  writeFile('.claude-plugin/plugin.json', {
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    author: manifest.author,
    keywords: manifest.keywords || [],
  }, outDir);
  writeFile('.claude-plugin/marketplace.json', {
    name: `${manifest.name}-marketplace`,
    description: `Marketplace for ${manifest.name}`,
    owner: manifest.author,
    plugins: [{
      name: manifest.name,
      description: manifest.description,
      version: manifest.version,
      source: './',
      author: manifest.author,
    }],
  }, outDir);

  // Codex plugin manifest (official marketplace format)
  writeFile('.codex-plugin/plugin.json', {
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    author: manifest.author,
    homepage: manifest.homepage || '',
    repository: manifest.repository || '',
    license: 'MIT',
    keywords: manifest.keywords || [],
    skills: manifest.skills,
    hooks: {},
    interface: {
      displayName: (manifest.interface && manifest.interface.displayName) || manifest.name,
      shortDescription: (manifest.interface && manifest.interface.shortDescription) || manifest.description,
      longDescription: (manifest.interface && manifest.interface.longDescription) || manifest.description,
      category: (manifest.interface && manifest.interface.category) || 'Developer Tools',
      capabilities: (manifest.interface && manifest.interface.capabilities) || ['Interactive', 'Read', 'Write'],
    },
  }, outDir);

  // Cross-runtime marketplace register (Codex/Copilot/Gemini alias path)
  writeFile('.agents/plugins/marketplace.json', {
    name: `${manifest.name}-marketplace`,
    interface: { displayName: (manifest.interface && manifest.interface.displayName) || manifest.name },
    plugins: [{
      name: manifest.name,
      source: { source: 'url', url: './' },
      policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' },
      category: (manifest.interface && manifest.interface.category) || 'Developer Tools',
    }],
  }, outDir);

  // Cursor plugin manifest
  writeFile('.cursor-plugin/plugin.json', {
    name: manifest.name,
    displayName: (manifest.interface && manifest.interface.displayName) || manifest.name,
    description: manifest.description,
    version: manifest.version,
    author: manifest.author,
    homepage: manifest.homepage || '',
    repository: manifest.repository || '',
    license: 'MIT',
    keywords: manifest.keywords || [],
    skills: manifest.skills,
    hooks: {},
  }, outDir);

  return { count: skills.length, skills: skills.map(s => s.name) };
}

module.exports = { parseFrontmatter, readSkills, build };

#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

function execSafe(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim();
  } catch (error) {
    return null;
  }
}

function getVersions() {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  const versions = {
    packageJson: pkg.version,
    npmPublished: execSafe('npm view @nskha/n8n-nodes-scrappey version'),
    githubPublished: execSafe('npm view @automations-project/n8n-nodes-scrappey version --registry=https://npm.pkg.github.com'),
    latestGitTag: execSafe('git describe --tags --abbrev=0') || 'none'
  };

  return versions;
}

function main() {
  console.log('🔍 Current Version Status:');
  console.log('========================');

  const versions = getVersions();

  console.log(`📦 Package.json:     ${versions.packageJson}`);
  console.log(`📦 NPM Published:    ${versions.npmPublished || 'Not found'}`);
  console.log(`📦 GitHub Published: ${versions.githubPublished || 'Not found'}`);
  console.log(`🏷️  Latest Git Tag:   ${versions.latestGitTag.replace('v', '') || 'none'}`);

  // Find highest version
  const allVersions = Object.values(versions)
    .filter(v => v && v !== 'none' && v !== 'Not found')
    .map(v => v.replace('v', ''));

  if (allVersions.length > 0) {
    const highest = allVersions.sort((a, b) => {
      const aParts = a.split('.').map(Number);
      const bParts = b.split('.').map(Number);

      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;
        if (aPart !== bPart) return bPart - aPart;
      }
      return 0;
    })[0];

    console.log(`🔍 Highest Version:  ${highest}`);

    // Suggest next version
    const [major, minor, patch] = highest.split('.').map(Number);
    console.log('\n💡 Next Versions:');
    console.log(`   Patch: ${major}.${minor}.${patch + 1}`);
    console.log(`   Minor: ${major}.${minor + 1}.0`);
    console.log(`   Major: ${major + 1}.0.0`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getVersions };

#!/usr/bin/env node

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const workflowDir = '.github/workflows';
const files = [
  'auto-version.yml',
  'release.yml',
  'ci.yml'
];

console.log('🔍 Checking YAML syntax...\n');

let allValid = true;

files.forEach(file => {
  const filePath = path.join(workflowDir, file);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      yaml.load(content);
      console.log(`✅ ${file} - syntax OK`);
    } else {
      console.log(`⚠️  ${file} - file not found`);
    }
  } catch (error) {
    console.log(`❌ ${file} - syntax error:`);
    console.log(`   ${error.message}`);
    allValid = false;
  }
});

console.log('\n' + '='.repeat(40));
if (allValid) {
  console.log('🎉 All workflow files have valid YAML syntax!');
  process.exit(0);
} else {
  console.log('💥 Some workflow files have syntax errors!');
  process.exit(1);
}

#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Run n8n Community Package Scanner
 * This script runs the official n8n scanner against the published package
 */

function printInfo(msg) {
  console.log(`\x1b[36mℹ ${msg}\x1b[0m`);
}

function printSuccess(msg) {
  console.log(`\x1b[32m✅ ${msg}\x1b[0m`);
}

function printError(msg) {
  console.log(`\x1b[31m❌ ${msg}\x1b[0m`);
}

function printWarning(msg) {
  console.log(`\x1b[33m⚠️ ${msg}\x1b[0m`);
}

function execSafe(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return result;
  } catch (error) {
    if (!options.silent) {
      printError(`Command failed: ${command}`);
      printError(error.message);
    }
    throw error;
  }
}

function main() {
  printInfo('🔍 n8n Community Package Scanner');
  printInfo('================================');

  try {
    // Read package.json to get the package name
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const packageName = pkg.name;

    printInfo(`Scanning package: ${packageName}`);
    printInfo(`Current version: ${pkg.version}`);
    printInfo('');

    // Run the scanner directly against the published package
    printInfo('Running n8n security scanner...');
    execSafe(`npx @n8n/scan-community-package ${packageName}`);

    printSuccess('n8n security scan completed successfully!');
    printInfo('Your package passed all security checks ✨');

  } catch (error) {
    printError(`Scanner failed: ${error.message}`);
    printWarning('Common issues:');
    printWarning('- Package not yet published to npm');
    printWarning('- Network connectivity issues');
    printWarning('- Package name typo');
    printWarning('');
    printWarning('If package is not published yet, this is expected.');
    process.exit(1);
  }
}

main();

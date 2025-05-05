#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json version
const pkg = require(path.resolve(__dirname, '../package.json'));
const nodeJsonPath = path.resolve(__dirname, '../nodes/Scrappey/Scrappey.node.json');

try {
	const nodeJson = JSON.parse(fs.readFileSync(nodeJsonPath, 'utf-8'));
	nodeJson.nodeVersion = pkg.version;
	nodeJson.codexVersion = pkg.version;
	fs.writeFileSync(nodeJsonPath, JSON.stringify(nodeJson, null, 2) + '\n', 'utf-8');
	console.log(`↪ Updated Scrappey.node.json to version ${pkg.version}`);
} catch (error) {
	console.error(`❌ Could not update Scrappey.node.json: ${error.message}`);
}

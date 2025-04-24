#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// --- Configuration ---
const GITHUB_REGISTRY_URL = 'https://npm.pkg.github.com';
const NPMRC_FILENAME = '.npmrc';
const PACKAGE_JSON_FILENAME = 'package.json';
const CONFIG_FILENAME = '.PublishKey'; // Configuration file name

// --- Helper Functions ---

function printError(message) {
	console.error(`❌ Error: ${message}`);
}

function printSuccess(message) {
	console.log(`✅ ${message}`);
}

function printInfo(message) {
	console.log(`ℹ️ ${message}`);
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(query) {
	return new Promise((resolve) => rl.question(query, resolve));
}

function hiddenQuestion(query) {
	return new Promise((resolve) => {
		const PWD = Symbol('password');
		rl.stdoutMuted = true;

		rl.query = query;
		rl._writeToOutput = function _writeToOutput(stringToWrite) {
			if (rl.stdoutMuted) {
				if (rl.line.length === 0) {
					rl.output.write(rl.query);
				}
			} else {
				rl.output.write(stringToWrite);
			}
		};

		rl.question(query, (value) => {
			rl[PWD] = value;
			rl.stdoutMuted = false;
			rl._writeToOutput = rl.constructor.prototype._writeToOutput;
			rl.history = rl.history.slice(1);
			rl.output.write('\n');
			resolve(rl[PWD]);
		});
	});
}

function runCommand(command, args) {
	const fullCommand = `${command} ${args.join(' ')}`;
	printInfo(`Running command: ${fullCommand}`);
	try {
		execSync(fullCommand, { stdio: 'inherit' });
		return true;
	} catch (error) {
		printError(`Command failed: ${fullCommand}`);
		return false;
	}
}

/**
 * Reads package.json, updates the name to include or replace the scope if necessary,
 * writes it back, verifies the write, and validates the final name.
 * @param {string} expectedScope - The GitHub organization or username.
 * @returns {boolean | null} True if successful, false on validation/write/verify error, null if file not found/read error.
 */
function updateAndValidatePackageJson(expectedScope) {
	const packageJsonPath = path.resolve(process.cwd(), PACKAGE_JSON_FILENAME);
	let packageData;
	let originalPackageName;
	let needsUpdate = false;
	let finalName = ''; // Store the name we intend to write

	if (!fs.existsSync(packageJsonPath)) {
		printError(`'${PACKAGE_JSON_FILENAME}' not found in the current directory (${process.cwd()}).`);
		return null;
	}

	// Read and Parse
	try {
		const packageContent = fs.readFileSync(packageJsonPath, 'utf-8');
		packageData = JSON.parse(packageContent);
		originalPackageName = packageData.name;

		if (!originalPackageName) {
			printError(`'name' field missing in '${PACKAGE_JSON_FILENAME}'. Cannot proceed.`);
			return false;
		}
	} catch (error) {
		if (error instanceof SyntaxError) {
			printError(`Could not parse '${PACKAGE_JSON_FILENAME}'. Make sure it's valid JSON.`);
		} else {
			printError(`Could not read or parse '${PACKAGE_JSON_FILENAME}': ${error.message}`);
		}
		return null; // Indicate read/parse error
	}

	// Check and Prepare Update
	const requiredPrefix = `@${expectedScope}/`;
	const nameParts = originalPackageName.split('/'); // Split by '/' to check scope and package part
	const currentPackagePart = nameParts.length > 1 ? nameParts[1] : nameParts[0]; // Get the part after potential scope

	if (!originalPackageName.startsWith('@')) {
		// --- Case 1: No scope exists ---
		packageData.name = `${requiredPrefix}${originalPackageName}`;
		needsUpdate = true;
		printInfo(
			`Package name '${originalPackageName}' needs scope. Preparing update to '${packageData.name}'.`,
		);
	} else if (!originalPackageName.startsWith(requiredPrefix)) {
		// --- Case 2: Different scope exists ---
		const oldScope = nameParts[0];
		packageData.name = `${requiredPrefix}${currentPackagePart}`;
		needsUpdate = true;
		printInfo(
			`Package name '${originalPackageName}' has different scope. Preparing update to replace '${oldScope}' with '@${expectedScope}'. New name: '${packageData.name}'.`,
		);
	} else {
		// --- Case 3: Correct scope already exists ---
		printInfo(`Package name '${originalPackageName}' is already correctly scoped.`);
		packageData.name = originalPackageName; // Ensure packageData.name is set even if no update needed
	}
	finalName = packageData.name; // Store the name that should be in the file

	// Write Update if Needed
	if (needsUpdate) {
		try {
			const updatedPackageContent = JSON.stringify(packageData, null, 2); // 2 spaces indentation
			fs.writeFileSync(packageJsonPath, updatedPackageContent + '\n', 'utf-8'); // Add trailing newline
			printSuccess(
				`Attempted to update package name in '${PACKAGE_JSON_FILENAME}' to '${finalName}'.`,
			);

			// *** ADDED VERIFICATION STEP ***
			printInfo(`Verifying write operation for ${PACKAGE_JSON_FILENAME}...`);
			const writtenContent = fs.readFileSync(packageJsonPath, 'utf-8');
			const writtenData = JSON.parse(writtenContent);
			if (writtenData.name === finalName) {
				printSuccess(
					`Verification successful: '${PACKAGE_JSON_FILENAME}' correctly updated on disk.`,
				);
			} else {
				printError(
					`Verification failed: '${PACKAGE_JSON_FILENAME}' content on disk does not match expected name.`,
				);
				printError(`Expected name: ${finalName}`);
				printError(`Found name: ${writtenData.name}`);
				return false; // Indicate verification error
			}
			// *** END VERIFICATION STEP ***
		} catch (writeError) {
			printError(
				`Failed to write updated name to '${PACKAGE_JSON_FILENAME}': ${writeError.message}`,
			);
			return false; // Indicate write error
		}
	}

	// Final Validation (mostly for internal consistency)
	if (finalName !== packageData.name || !finalName.startsWith(requiredPrefix)) {
		printError(`Internal error: Package name validation failed.`);
		printError(`Current packageData.name: ${packageData.name}, Expected finalName: ${finalName}`);
		return false;
	}

	printSuccess(`Validated ${PACKAGE_JSON_FILENAME}: Package name is '${finalName}'.`);
	return true; // Indicate success
}

/**
 * Gets GitHub credentials, either from the config file or by prompting the user.
 * @returns {Promise<{githubScope: string, githubToken: string} | null>} Credentials or null on error.
 */
async function getCredentials() {
	const configPath = path.resolve(process.cwd(), CONFIG_FILENAME);
	let githubScope = '';
	let githubToken = '';

	if (fs.existsSync(configPath)) {
		// Config file exists, read from it
		printInfo(`Reading credentials from existing '${CONFIG_FILENAME}' file...`);
		try {
			const configContent = fs.readFileSync(configPath, 'utf-8');
			const configData = JSON.parse(configContent);
			if (!configData.githubScope || !configData.githubToken) {
				throw new Error(`'${CONFIG_FILENAME}' is missing 'githubScope' or 'githubToken'.`);
			}
			githubScope = configData.githubScope;
			githubToken = configData.githubToken;
			printSuccess(`Credentials loaded successfully from '${CONFIG_FILENAME}'.`);
			return { githubScope, githubToken };
		} catch (error) {
			printError(`Failed to read or parse '${CONFIG_FILENAME}': ${error.message}`);
			printInfo(`Please fix or delete '${CONFIG_FILENAME}' and run the script again.`);
			return null; // Indicate error
		}
	} else {
		// Config file does not exist, prompt user and create it
		printInfo(`'${CONFIG_FILENAME}' not found. Please provide your GitHub credentials.`);
		try {
			githubScope = (
				await question(
					'Enter your GitHub organization name or username (the scope for your package): ',
				)
			).trim();
			if (!githubScope) {
				throw new Error('GitHub scope cannot be empty.');
			}

			printInfo('\nEnter your GitHub Personal Access Token (PAT).');
			printInfo("Ensure it has the 'write:packages' scope.");
			printInfo('Input will be hidden for security.');
			githubToken = (await hiddenQuestion('GitHub PAT: ')).trim();
			if (!githubToken) {
				throw new Error('GitHub PAT cannot be empty.');
			}

			// Save credentials to the config file
			const configData = { githubScope, githubToken };
			const configContent = JSON.stringify(configData, null, 2); // Pretty print JSON
			fs.writeFileSync(configPath, configContent + '\n', 'utf-8');
			printSuccess(`Credentials saved to '${CONFIG_FILENAME}' for future use.`);
			printInfo(
				`IMPORTANT: Add '${CONFIG_FILENAME}' to your .gitignore file to avoid committing your token!`,
			);

			return { githubScope, githubToken };
		} catch (error) {
			printError(`Failed to get or save credentials: ${error.message}`);
			// Clean up potentially partially created file on error? Maybe not necessary.
			return null; // Indicate error
		}
	}
}

// --- Main Script Logic ---
async function main() {
	printInfo('--- GitHub Package Publishing Script (Node.js) ---');

	const npmrcPath = path.resolve(process.cwd(), NPMRC_FILENAME);
	let credentials = null;

	try {
		// 1. Get Credentials (from file or prompt)
		credentials = await getCredentials();
		if (!credentials) {
			throw new Error('Could not obtain GitHub credentials.');
		}
		const { githubScope, githubToken } = credentials;

		// 2. Update and Validate package.json name
		printInfo(`\nUpdating and validating ${PACKAGE_JSON_FILENAME}...`);
		const validationResult = updateAndValidatePackageJson(githubScope);
		if (validationResult === null) {
			// File not found or read error
			throw new Error(`Failed to process ${PACKAGE_JSON_FILENAME}.`);
		} else if (!validationResult) {
			// Validation, write, or verification error
			throw new Error(
				`Invalid ${PACKAGE_JSON_FILENAME} configuration, update failed, or verification failed.`,
			);
		}
		// If validationResult is true, continue

		// 3. Create .npmrc
		const npmrcContent = `@${githubScope}:registry=${GITHUB_REGISTRY_URL}\n//npm.pkg.github.com/:_authToken=${githubToken}\n`;
		printInfo(`\nCreating '${NPMRC_FILENAME}' for authentication...`);
		try {
			// Overwrite if exists, create if not
			fs.writeFileSync(npmrcPath, npmrcContent, { encoding: 'utf-8' });
			printSuccess(`'${NPMRC_FILENAME}' created/updated successfully.`);
		} catch (writeError) {
			throw new Error(`Failed to create/update '${NPMRC_FILENAME}': ${writeError.message}`);
		}

		// 4. Run npm publish
		printInfo('\nAttempting to publish package via npm...');
		const publishSuccess = runCommand('npm', ['publish']);

		if (publishSuccess) {
			printSuccess('\nPackage published successfully to GitHub Packages!');
			printInfo(`The '${NPMRC_FILENAME}' file has been left in the directory.`); // Inform user it's kept
		} else {
			printError(`The '${NPMRC_FILENAME}' file has been left in the directory for debugging.`); // Inform user it's kept on failure
			throw new Error('Package publishing failed.');
		}
	} catch (error) {
		printError(`Script failed: ${error.message}`);
		// .npmrc cleanup is removed from here
		process.exitCode = 1; // Indicate failure
	} finally {
		// .npmrc cleanup is removed from here
		rl.close(); // Close the readline interface
	}
}

main();

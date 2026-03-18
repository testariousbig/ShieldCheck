import type { ParsedPackage } from '../types/osv';

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export interface ParsedPackageWithEcosystem extends ParsedPackage {
  ecosystem?: string;
}

// Common npm packages with their ecosystems
const NPM_PACKAGES = new Set([
  'lodash', 'axios', 'moment', 'express', 'vue', 'react', 'webpack',
  'typescript', 'eslint', 'babel-loader', 'jquery', 'request', 'node-forge',
  'uglify-js', 'babel-core', 'react-dom', 'react-router-dom', 'prop-types',
  '@types/node', '@types/react', '@types/react-dom', '@vitejs/plugin-react'
]);

export function parsePackageJson(jsonString: string): ParsedPackageWithEcosystem[] {
  try {
    const packageJson: PackageJson = JSON.parse(jsonString);
    const packages: ParsedPackageWithEcosystem[] = [];

    // Extract dependencies
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
      ...packageJson.optionalDependencies,
    };

    for (const [name, version] of Object.entries(allDeps)) {
      // Clean version string (remove ^, ~, >=, <=, >, <, *, etc.)
      let cleanVersion = version.replace(/^[\^~>=<]/, '');
      
      // Handle special cases
      if (cleanVersion === '*' || cleanVersion === 'latest' || cleanVersion === '') {
        // Skip invalid versions for OSV API
        continue;
      }
      
      // Remove any git URLs or file paths
      if (cleanVersion.includes('git+') || cleanVersion.includes('file:') || cleanVersion.includes('http')) {
        continue;
      }
      
      // Handle version ranges like "1.x" or "1.*"
      cleanVersion = cleanVersion.replace(/[x*]/g, '0');
      
      // Handle versions like "1.2.x" -> "1.2.0"
      if (cleanVersion.match(/^\d+\.\d+\.x$/)) {
        cleanVersion = cleanVersion.replace(/x$/, '0');
      }
      
      // Skip if version is still not valid
      if (!cleanVersion.match(/^\d+\.\d+\.\d+/) && !cleanVersion.match(/^\d+\.\d+/)) {
        console.warn(`Skipping invalid version format for ${name}: ${version}`);
        continue;
      }
      
      // Determine ecosystem - default to npm for common packages
      let ecosystem = 'npm';
      
      // Check if it's a known npm package
      if (NPM_PACKAGES.has(name) || name.startsWith('@types/') || name.startsWith('@vitejs/')) {
        ecosystem = 'npm';
      }
      
      packages.push({ name, version: cleanVersion, ecosystem });
    }

    return packages;
  } catch (error) {
    throw new Error('Invalid JSON format. Please paste a valid package.json content.');
  }
}

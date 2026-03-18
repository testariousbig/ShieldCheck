import { useState, useCallback } from 'react';
import type { OSVQuery, OSVResponse, PackageInfo } from '../types/osv';
import type { ParsedPackageWithEcosystem } from '../utils/packageParser';

const OSV_API_URL = 'https://api.osv.dev/v1/query';

export const useOSVApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryPackage = useCallback(async (pkg: ParsedPackageWithEcosystem): Promise<PackageInfo> => {
    const query: OSVQuery = {
      package: {
        name: pkg.name,
        version: pkg.version,
        ...(pkg.ecosystem && { ecosystem: pkg.ecosystem }),
      },
    };

    try {
      const response = await fetch(OSV_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        // Try to get more error details
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
        } catch {
          errorDetails = response.statusText;
        }
        
        console.warn(`HTTP ${response.status} for package ${pkg.name}@${pkg.version}: ${errorDetails}`);
        return {
          name: pkg.name,
          version: pkg.version,
          vulnerabilities: [],
        };
      }

      const data: OSVResponse = await response.json();
      
      return {
        name: pkg.name,
        version: pkg.version,
        vulnerabilities: data.vulns || [],
      };
    } catch (err) {
      // Handle network errors gracefully
      console.warn(`Network error querying package ${pkg.name}:`, err);
      return {
        name: pkg.name,
        version: pkg.version,
        vulnerabilities: [],
      };
    }
  }, []);

  const scanPackages = useCallback(async (packages: ParsedPackageWithEcosystem[]): Promise<{
    totalPackages: number;
    vulnerablePackages: number;
    packages: PackageInfo[];
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Query all packages in parallel with better error handling
      const results = await Promise.allSettled(
        packages.map(pkg => queryPackage(pkg))
      );

      // Process results, handling both fulfilled and rejected promises
      const processedResults = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          // Handle rejected promises
          const pkg = packages[index];
          console.warn(`Failed to query package ${pkg.name}:`, result.reason);
          return {
            name: pkg.name,
            version: pkg.version,
            vulnerabilities: [],
          };
        }
      });

      const vulnerablePackages = processedResults.filter(pkg => pkg.vulnerabilities.length > 0);

      return {
        totalPackages: packages.length,
        vulnerablePackages: vulnerablePackages.length,
        packages: processedResults,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [queryPackage]);

  return {
    scanPackages,
    isLoading,
    error,
  };
};

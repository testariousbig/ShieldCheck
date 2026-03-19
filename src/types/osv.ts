export interface OSVQuery {
  package: {
    name: string;
    version: string;
    ecosystem?: string;
  };
}

export interface OSVVulnerability {
  id: string;
  summary?: string;
  severity?: {
    type: string;
    score: string;
  };
  affected: {
    package: {
      name: string;
      ecosystem: string;
    };
    versions: string[];
    ranges: Array<{
      type: string;
      events: Array<{
        introduced?: string;
        fixed?: string;
        last_affected?: string;
        limit?: string;
      }>;
    }>;
  }[];
  published: string;
  modified: string;
  database_specific?: {
    cwe_ids?: string[];
    github_reviewed?: boolean;
    nvd_published_at?: string;
    severity?: string;
  };
}

export interface OSVResponse {
  vulns: OSVVulnerability[];
}

export interface PackageInfo {
  name: string;
  version: string;
  vulnerabilities: OSVVulnerability[];
}

export interface ScanResult {
  totalPackages: number;
  vulnerablePackages: number;
  packages: PackageInfo[];
}

export interface ParsedPackage {
  name: string;
  version: string;
}

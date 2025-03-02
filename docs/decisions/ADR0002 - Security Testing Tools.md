# ADR 0002: Security Testing Tools

## Status
Accepted

## Context
Ensuring the security of our application is paramount. A combination of tools is beneficial to comprehensively address different aspects of security.

## Decision
Utilize both OWASP ZAP (Zed Attack Proxy) for dynamic security testing and SonarQube for static code analysis and vulnerability detection.

## Decision Made
{{CURRENT_DATE}} by {{AUTHOR}}

## Consequences
By combining ZAP and SonarQube, we cover both runtime vulnerabilities and static code vulnerabilities. This multi-layered approach enhances our security stance. Regular scans and code reviews will be essential to detect and address potential threats promptly.

## Other Solutions Considered

### Burp Suite
**Pros**:
- Comprehensive web vulnerability scanner.
- Offers both manual and automated scanning.

**Cons**:
- The free version is limited in functionality.
- Proprietary and can be expensive for the full version.

### Checkmarx
**Pros**:
- Enterprise-grade static application security testing tool.
- Offers source code, byte code, and binary code scanning.

**Cons**:
- Proprietary and can be costly.
- Might overlap with SonarQube's features.

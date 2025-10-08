# Security Policy

[Versão em Português](./SECURITY.md)

## 🔒 Supported Versions

We currently provide security support for the following nfets versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## 🚨 Reporting a Vulnerability

The security of nfets users is our top priority. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please DO NOT report security vulnerabilities through public issues.**

Instead:

1. **Use GitHub's Security Advisories feature**
   - Go to the Security tab of the repository
   - Click "Report a vulnerability"
   - Fill out the form with vulnerability details

2. **Or send an email** (if the above method is not available)
   - To: gustavo@lidani.dev
   - Subject: [SECURITY] Brief description of the vulnerability

### What to Include in Your Report

To help us better understand the nature and scope of the issue, please include as much information as possible:

- Type of vulnerability (e.g., code injection, XSS, etc.)
- Location of affected code (file, line)
- Special configuration needed to reproduce
- Detailed steps to reproduce the vulnerability
- Proof of concept or exploit code (if possible)
- Potential impact of the vulnerability

### What to Expect

- **Acknowledgment**: You'll receive confirmation within 48 hours
- **Analysis**: We'll assess the vulnerability and determine its severity
- **Updates**: We'll keep you informed of progress
- **Fix**: We'll work on a fix as quickly as possible
- **Disclosure**: We'll coordinate with you on public disclosure

## 🛡️ Security Practices

### For Developers

- Always use the latest version of nfets
- Keep your dependencies updated
- Never commit certificates, private keys, or credentials
- Use environment variables for sensitive information
- Validate and sanitize all user inputs

### For Contributors

- Review code for common vulnerabilities
- Follow OWASP practices
- Use static code analysis tools
- Write security tests when appropriate

## 🏆 Responsible Disclosure Policy

We believe in responsible disclosure and follow these practices:

1. You report a vulnerability privately
2. We acknowledge and analyze the report
3. We work on a fix
4. We release the fix
5. We publicly disclose after the fix (credit to discoverer)

## 📜 Known Vulnerabilities

We maintain a record of known and fixed vulnerabilities at:
- [Security Advisories](https://github.com/nfets/nfets/security/advisories)

## 🎖️ Security Hall of Fame

We thank the following security researchers for their responsible contributions:

<!-- List will be updated as reports are received -->

---

Thank you for helping keep nfets and its users safe! 🙏


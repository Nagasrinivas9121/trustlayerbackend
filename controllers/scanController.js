const dns = require('dns').promises;
const https = require('https');
const net = require('net');

// Common ports to check (simulate nmap -F)
const PORTS_TO_CHECK = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 5432, 8080, 27017];

const checkPort = (host, port, timeout = 2000) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
};

const runScan = async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ message: "Domain is required" });
    }

    // 1) Normalize + Validate
    let normalizedDomain = domain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    
    // DNS Lookup
    try {
      await dns.lookup(normalizedDomain);
    } catch (e) {
      return res.status(400).json({ message: "Invalid domain or DNS resolution failed" });
    }

    let score = 100;
    let high = 0, medium = 0, low = 0;
    let findings = [];

    // 2 & 3 & 4) HTTP(S) Fetch, Security Headers, Basic Tech Detection
    let response;
    let protocol = 'https';
    
    try {
      response = await fetch(`https://${normalizedDomain}`, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    } catch (err) {
      try {
        response = await fetch(`http://${normalizedDomain}`, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
        protocol = 'http';
        score -= 20;
        high++;
        findings.push({ title: "No HTTPS Detected", severity: "High", evidence: "Domain does not enforce a valid HTTPS connection. Communication is unencrypted." });
      } catch (e) {
        // Both failed
        return res.status(400).json({ message: "Domain is unreachable" });
      }
    }

    if (protocol === 'https') {
      findings.push({ title: "HTTPS Enforced", severity: "Low", evidence: "Secure HTTPS protocol detected." });
    }

    // Evaluate Headers using response.headers.get()
    const getHeader = (key) => response && response.headers && typeof response.headers.get === 'function' ? response.headers.get(key) : null;

    if (!getHeader('strict-transport-security')) {
      score -= 8;
      medium++;
      findings.push({ title: "Missing HSTS", severity: "Medium", evidence: "Strict-Transport-Security header not present" });
    }
    if (!getHeader('content-security-policy')) {
      score -= 6;
      medium++;
      findings.push({ title: "No Content Security Policy", severity: "Medium", evidence: "Content-Security-Policy header missing" });
    }
    if (!getHeader('x-frame-options')) {
      score -= 4;
      low++;
      findings.push({ title: "Missing X-Frame-Options", severity: "Low", evidence: "X-Frame-Options header missing (Risk of Clickjacking)" });
    }
    if (!getHeader('x-content-type-options')) {
      score -= 2;
      low++;
      findings.push({ title: "Missing X-Content-Type-Options", severity: "Low", evidence: "X-Content-Type-Options header missing" });
    }

    // Tech Detection (Information Disclosure)
    const server = getHeader('server');
    const poweredBy = getHeader('x-powered-by');
    if (server) {
      score -= 2;
      low++;
      findings.push({ title: "Server Information Disclosure", severity: "Low", evidence: `Server: ${server}` });
    }
    if (poweredBy) {
      score -= 2;
      low++;
      findings.push({ title: "Framework Information Disclosure", severity: "Low", evidence: `X-Powered-By: ${poweredBy}` });
    }

    // Cookies check
    const setCookie = getHeader('set-cookie');
    if (setCookie) {
      const cookieStr = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;
      if (!cookieStr.toLowerCase().includes('httponly')) {
        score -= 5;
        medium++;
        findings.push({ title: "Missing HttpOnly Cookie Flag", severity: "Medium", evidence: "Session cookies may be accessible via JavaScript (XSS risk)" });
      }
      if (!cookieStr.toLowerCase().includes('secure')) {
        score -= 5;
        medium++;
        findings.push({ title: "Missing Secure Cookie Flag", severity: "Medium", evidence: "Cookies may be transmitted over unencrypted connections" });
      }
    }

    // 5) Port Scan
    const portResults = await Promise.all(PORTS_TO_CHECK.map(p => checkPort(normalizedDomain, p, 1500)));
    const openPorts = PORTS_TO_CHECK.filter((_, i) => portResults[i]);

    openPorts.forEach(port => {
      if (![80, 443].includes(port)) {
        score -= 5;
        let severity = port === 22 || port === 3306 || port === 27017 ? "High" : "Medium";
        if (severity === "High") high++;
        else medium++;
        
        findings.push({ title: `Open Port ${port}`, severity, evidence: `Port ${port}/tcp open and exposed to the internet.` });
      }
    });

    // 7 & 8) Score Calculation & Severity Buckets
    score = Math.max(40, score);
    let risk = "Low";
    if (score < 50 || high > 0) risk = "High";
    else if (score <= 75) risk = "Medium";

    // Split findings into preview (first 3) and full
    // Sort findings by severity (High -> Medium -> Low)
    const severityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    const preview_findings = findings.slice(0, 3);

    res.status(200).json({
      success: true,
      domain: normalizedDomain,
      score,
      risk,
      summary: { high, medium, low },
      preview_findings,
      full_findings: findings, // Storing full findings for later, though client only sees preview initially in UI (we'll just send both, and frontend hides it until unlocked)
      locked: true
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  runScan,
};

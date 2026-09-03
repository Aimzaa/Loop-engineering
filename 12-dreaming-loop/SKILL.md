---
name: risk-scan
description: scan-target/payments.js ko risky patterns ke liye scan karo. Har raat scan; har subah insaan ek missed pattern add karta hai.
---

# Risk Scan - Skill (Day 2)

## Morning note
Day 2: Missed the SQL injection on day 1. Added a string-concat-in-query pattern.

## Patterns (id | regex | name)
- secret | sk_live_\w+ | hard-coded secret / API key
- eval | \beval\s*\( | eval() on a runtime string
- weak-random | Math\.random\s*\( | Math.random() used for a token/key
- sql-concat | \.query\(\s*["'][^"']*["']\s*\+ | SQL built by string concatenation (injection)

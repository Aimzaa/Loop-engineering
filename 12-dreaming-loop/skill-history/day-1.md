---
name: risk-scan
description: scan-target/payments.js ko risky patterns ke liye scan karo. Har raat scan; har subah insaan ek missed pattern add karta hai.
---

# Risk Scan - Skill (Day 1)

## Morning note
Day 1: Starting set. Deliberately small - it will miss most of payments.js.

## Patterns (id | regex | name)
- secret | sk_live_\w+ | hard-coded secret / API key
- eval | \beval\s*\( | eval() on a runtime string
- weak-random | Math\.random\s*\( | Math.random() used for a token/key

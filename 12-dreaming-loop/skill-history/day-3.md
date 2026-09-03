---
name: risk-scan
description: scan-target/payments.js ko risky patterns ke liye scan karo. Har raat scan; har subah insaan ek missed pattern add karta hai.
---

# Risk Scan - Skill (Day 3)

## Morning note
Day 3: Missed the empty catch that swallows a failed charge. Added it.

## Patterns (id | regex | name)
- secret | sk_live_\w+ | hard-coded secret / API key
- eval | \beval\s*\( | eval() on a runtime string
- weak-random | Math\.random\s*\( | Math.random() used for a token/key
- sql-concat | \.query\(\s*["'][^"']*["']\s*\+ | SQL built by string concatenation (injection)
- empty-catch | catch\s*\([^)]*\)\s*\{\s*\} | empty catch block swallows errors

---
name: risk-scan
description: scan-target/payments.js ko risky patterns ke liye scan karo. Har raat scan; har subah insaan ek missed pattern add karta hai.
---

# Risk Scan - Skill (Day 4)

## Morning note
Day 4: Missed the await-in-for-loop (serial charges). Added it.

## Patterns (id | regex | name)
- secret | sk_live_\w+ | hard-coded secret / API key
- eval | \beval\s*\( | eval() on a runtime string
- weak-random | Math\.random\s*\( | Math.random() used for a token/key
- sql-concat | \.query\(\s*["'][^"']*["']\s*\+ | SQL built by string concatenation (injection)
- empty-catch | catch\s*\([^)]*\)\s*\{\s*\} | empty catch block swallows errors
- await-loop | for\s*\([^)]*\)\s*\{[\s\S]{0,80}?await\s | await inside a for-loop (sequential)

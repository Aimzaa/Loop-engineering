---
name: risk-scan
description: scan-target/payments.js ko risky patterns ke liye scan karo. Har raat scan; har subah insaan ek missed pattern add karta hai.
---

# Risk Scan - Skill (Day 7)

## Morning note
Day 7: Missed audit() logging the full payload. Added console.log(JSON.stringify). Skill now complete.

## Patterns (id | regex | name)
- secret | sk_live_\w+ | hard-coded secret / API key
- eval | \beval\s*\( | eval() on a runtime string
- weak-random | Math\.random\s*\( | Math.random() used for a token/key
- sql-concat | \.query\(\s*["'][^"']*["']\s*\+ | SQL built by string concatenation (injection)
- empty-catch | catch\s*\([^)]*\)\s*\{\s*\} | empty catch block swallows errors
- await-loop | for\s*\([^)]*\)\s*\{[\s\S]{0,80}?await\s | await inside a for-loop (sequential)
- no-timeout | fetch\((?:(?!signal)[\s\S])*?\}\s*\) | network call with no timeout / AbortSignal
- loose-eq | [^=!<>]==[^=] | == instead of === on user input
- log-pii | console\.log\([^)]*JSON\.stringify | logging a full payload (possible PII)

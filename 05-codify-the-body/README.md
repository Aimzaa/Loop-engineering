# Project 5 — Codify the Body (Dynamic Workflows)

**Course goal:** Turn-by-turn orchestration ki jagah ek saved, dobara-chalne-wali script banao.
**Heartbeat:** Conditional (workflow ke andar)
**"Done" ka matlab:** Workflow script kamiyabi se subagents ko delegate kare, quality patterns lagaye
(jaise independent reviewers ek doosre ko check karte hue), aur guardrails hit hone par ruk jaye.

## Claude Code ka tareeqa
- Plain language mein workflow maango: `"use a workflow to [task description]"`
- Ya `ultracode` keyword se trigger karo (purana `workflow` trigger deprecated hai).
- Built-in example ke liye `/deep-research` se shuru karo.
- `/workflows` view mein `s` dabao — reusable `/command` ke tor par save ho jata hai.

## Safety guardrails (course)
- Agent count capped (~16 concurrent, 1000 per run).
- Fail hone wale subagents thodi retries ke baad ruk jate hain.
- Memory sirf usi ek run ke andar zinda rehti hai.

## Kab use karo
- Complex orchestration jo tum bilkul waisi dobara chalana chaho.
- One-off kaam ke liye mat use karo.

## Is folder mein
- `workflow-brief.md` — ek chhota, asli kaam jise tum workflow bana kar codify karoge
  (example: "is repo ke changed files ko 3 dimensions par review karo, phir har finding ko
  ek alag agent se verify karwao"). Ye maker-checker + fan-out dono sikhata hai.

## Practice steps
1. `workflow-brief.md` parho.
2. Claude Code mein: `ultracode <brief ka kaam>` — ya `use a workflow to <kaam>`.
3. Workflow chalne do; `/workflows` mein live progress dekho.
4. Result theek lage to `/workflows` view mein `s` se save karo (naam do, e.g. `/review-dims`).
5. Ab wahi `/review-dims` dobara chala kar dekho — bilkul same steps.

## Kya seekhna hai
- "Body" (orchestration steps) ab script mein likhe hain, har baar tum nahi likhte.
- Reviewers ek doosre ko grade karte hain (maker-checker fan-out).
- Guardrails (agent cap, retry cap) automatic stopping condition ka kaam karte hain.

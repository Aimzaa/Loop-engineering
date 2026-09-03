# Routine Prompt to Rehearse

Chhota, deterministic-ish kaam chuno taake "sahi/ghalat" saaf ho. Misaal:

> Read the 3 newest open issues in `<OWNER/REPO>`. For each, output one line:
> `#<num> | <title, 60 chars> | <P0/P1/P2 guess> | <one suggested next action>`.
> Then a final line: `count=<n>, generated_at=<UTC ISO time>`.
> Do not open, comment on, or modify anything. Output only those lines.

## Rehearsal checklist
- [ ] One-off #1 (`/schedule in 2 minutes, run this`): saari 3 lines aayin? time field UTC ISO hai?
- [ ] One-off #2 (kal alag waqt): kya same 3 issues? kya output #1 ke identical hai (nahi hona chahiye agar issues badle)?
- [ ] One-off #3 (prompt mein "3 newest" ko "5 newest" karo): ab 5 lines aayin?
- [ ] Teenon saaf -> recurring `/schedule every weekday at 9am, run this`

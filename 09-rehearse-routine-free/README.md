# Project 9 — Rehearse a Routine for Free

**Course goal:** Sabit karo ke ek Routine kaam karti hai — is se pehle ke wo rozana run quota jalaye.
**Heartbeat:** Scheduled (one-off, recurring nahi)
**"Done" ka matlab:** Wahi prompt bina clock ke 3 dafa chalao, har output sahi ho, phir recurring schedule enable karo.

## Course ke steps
1. Apna Routine prompt ek skill file mein likho.
2. Ek one-off firao: `/schedule in 2 minutes, run [skill-name]`
3. Output check karo; zaroorat ho to prompt adjust karo.
4. Doosra one-off kal alag waqt par firao.
5. Outputs compare karo — independent hone chahiye (runs ke beech koi memory nahi).
6. Do saaf runs ke baad hi recurring schedule set karo.
7. Teenon outputs ek decision file mein document karo — taake bata sako tumne bharosa kyun kiya.

## Three-Run Validation (appendix se)
1. **Pehla one-off:** foran firao. Har output field ghor se dekho.
2. **Doosra one-off:** same prompt, alag time window. Confirm outputs independent hain, cached nahi.
3. **Teesra one-off:** prompt mein chhoti tabdeeli. Confirm Routine ne edit maani.
4. Teenon pass -> tab recurring enable.

## Kyun one-offs quota bachate hain
- 15 runs/day (Max plan).
- 3 one-offs se validate = 3 muft test runs (daily total se nahi katte).
- Phir 12 runs asli kaam ke liye bachte hain.
- Bina rehearsal, tooti Routine quota jalati hai aur kuch sikhati nahi.

## Logs
- `claude.ai/settings/usage` -> Routine ke naam se run counts. One-off runs alag dikhte hain, daily total kam nahi karte.

## Is folder mein
- `routine-prompt.md` — wo prompt/skill jise tum rehearse karoge.
- `decision.md` — 3 outputs + "maine bharosa kyun kiya" (bharo).

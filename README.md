# ArtConnect (Projekt PROGI)

Projekt iz kolegija Programsko inženjerstvo (FER, 2026./2027.): web aplikacija u kojoj mladi umjetnici vode portfolio i prijavljuju se na prilike (natječaje, izložbe, radionice) koje objavljuju organizatori.

- **Zadaci:** [Issues](https://github.com/LD-FER/Projekt-PROGI/issues), faze kao [Milestones](https://github.com/LD-FER/Projekt-PROGI/milestones)
- **Ploča:** [ArtConnect - razvoj](https://github.com/users/LD-FER/projects/5); pogled „Za preuzimanje” prikazuje slobodne zadatke redom rada

## Kako čitati ID zadatka

`EPIC-01` je epik (područje sustava). `AUTH-02` je funkcionalnost, a `AUTH-02-BE`, `AUTH-02-DES`, `AUTH-02-FE`, `AUTH-02-TEST` su njezini podzadaci po ulogama. Zadatak samo jedne uloge nema kod na kraju (npr. `FND-01`). Kodovi uloga: `DB` Database, `BE` Backend, `DES` UI Designer, `FE` Frontend, `TEST` Testing, `OPS` DevOps, `DOC` Documentation.

## Automatizacija

Workflow [Osvježi Ready](.github/workflows/refresh-ready.yml) nakon zatvaranja ili ponovnog otvaranja issuea prebacuje zadatke iz Backlog u Ready kad su zatvoreni svi zadaci iz njihovog retka „Ovisi o” (i obrnuto). Treba tajnu repozitorija `PROJECT_TOKEN`: classic token s pravom `project`.

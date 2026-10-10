# Baza podataka i Liquibase

Shemu baze **ne mijenjamo ručno ni SQL-om u bazi**. Svaka promjena je Liquibase *changeset* u repozitoriju: backend ih pri pokretanju sam primjeni, redom, na svaku bazu (lokalnu, testnu, EC2). Tako svi imaju istu shemu, a promjene prolaze kroz PR.

Stvarni changelog je u backendu:

```
backend/src/main/resources/db/changelog/
├── db.changelog-master.yaml      # popis što se primjenjuje i kojim redom
└── changes/                      # po jedna datoteka za svaki zadatak
    └── 001-....yaml
```

> **Važno o kontekstima:** lokalno se primjenjuju **svi** changeseti, i oni s `context: dev` (demo podaci). Na EC2 se `dev` preskače jer `docker-compose.prod.yml` postavlja `SPRING_LIQUIBASE_CONTEXTS=prod`. Više pri kraju dokumenta.

Trenutno je `db.changelog-master.yaml` prazan (`databaseChangeLog: []`). Ovaj dokument je samo upute i primjer; ništa od niže navedenog nije dio stvarnog changelog.

## Pravila

1. **Jedna datoteka po zadatku**: `changes/NNN-kratak-opis.yaml` (npr. `002-create-artist.yaml`), NNN redom.
2. **Jedan changeset = jedna logična promjena** (npr. jedna tablica ili jedan indeks).
3. `id` mora biti jedinstven, preporuka: kod zadatka + opis, npr. `AUTH-01-DB-create-account`. `author`: vaše GitHub ime.
4. **Primijenjeni changeset se nikad ne mijenja.** Liquibase pamti checksum; izmjena = greška pri pokretanju. Za promjenu napišite *novi* changeset (npr. `addColumn`).
5. Uvijek napišite `rollback`.
6. Seed/demo podatke stavljajte u zasebne changesete s `context: dev` (na EC2 se ne primjenjuju).
7. Novu datoteku dodajte u `db.changelog-master.yaml` (`include`), redoslijed u masteru je redoslijed primjene.

## Primjer

Datoteka `backend/src/main/resources/db/changelog/changes/001-create-example.yaml`:

```yaml
databaseChangeLog:
  - changeSet:
      id: EXAMPLE-01-DB-create-example
      author: ime-prezime
      comment: Primjer tablice (samo ilustracija)
      changes:
        - createTable:
            tableName: example
            columns:
              - column:
                  name: id
                  type: bigint
                  autoIncrement: true
                  constraints:
                    primaryKey: true
                    nullable: false
              - column:
                  name: name
                  type: varchar(100)
                  constraints:
                    nullable: false
              - column:
                  name: created_at
                  type: timestamptz
                  defaultValueComputed: now()
                  constraints:
                    nullable: false
      rollback:
        - dropTable:
            tableName: example

  - changeSet:
      id: EXAMPLE-01-DB-index-example-name
      author: ime-prezime
      changes:
        - createIndex:
            tableName: example
            indexName: idx_example_name
            columns:
              - column:
                  name: name
      rollback:
        - dropIndex:
            tableName: example
            indexName: idx_example_name
```

Demo podaci, zasebna datoteka `changes/001-seed-example.yaml` (samo kontekst `dev`):

```yaml
databaseChangeLog:
  - changeSet:
      id: EXAMPLE-01-DB-seed-example
      author: ime-prezime
      context: dev
      changes:
        - insert:
            tableName: example
            columns:
              - column: { name: name, value: Primjer 1 }
        - insert:
            tableName: example
            columns:
              - column: { name: name, value: Primjer 2 }
      rollback:
        - delete:
            tableName: example
```

Izmjena kasnije (novi changeset u novoj datoteci, ne uređivanje stare):

```yaml
databaseChangeLog:
  - changeSet:
      id: EXAMPLE-02-DB-example-add-description
      author: ime-prezime
      changes:
        - addColumn:
            tableName: example
            columns:
              - column:
                  name: description
                  type: text
      rollback:
        - dropColumn:
            tableName: example
            columnName: description
```

Uključivanje u `db.changelog-master.yaml`:

```yaml
databaseChangeLog:
  - include:
      file: changes/001-create-example.yaml
      relativeToChangelogFile: true
  - include:
      file: changes/001-seed-example.yaml
      relativeToChangelogFile: true
```

## Kako provjeriti

```bash
docker compose up -d                 # baza
cd backend && ./mvnw spring-boot:run # Liquibase primijeni changesete pri startu
docker compose exec db psql -U artconnect artconnect -c '\dt'
docker compose exec db psql -U artconnect artconnect -c 'select id, author, filename from databasechangelog'
```

Tablica `databasechangelog` bilježi što je već primijenjeno. Ako ste pogriješili u changesetu koji još nije u `master`u, najlakše je `docker compose down -v` i ponovno pokretanje (briše lokalnu bazu).

## Konteksti

- Changeset bez `context` primjenjuje se svugdje.
- `context: dev` primjenjuje se lokalno (bez postavljenih konteksta Liquibase primjenjuje sve), a na EC2 se preskače jer `docker-compose.prod.yml` postavlja `SPRING_LIQUIBASE_CONTEXTS=prod`.

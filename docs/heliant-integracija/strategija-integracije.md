# Strategija integracije — Kućno lečenje ↔ Heliant

Princip: **manji rizik prvo, TEST pre PRODUKCIJE, čitanje pre pisanja.** Ne
gradimo sve odjednom — puštamo tok po tok i svaki potvrdimo na TEST okruženju.

## Arhitektura (najvažnija odluka)
- **Ne zovi Heliant REST direktno iz browsera/aplikacije.** Zdravstveni podaci i
  kredencijali ne smeju u frontend (bezbednost, CORS, revizija). Uvedi
  **backend/proxy sloj** (npr. mala Node servis ili edge funkcija) koji:
  - čuva Heliant kredencijale/sertifikat,
  - izlaže aplikaciji samo bezbedne, ograničene rute,
  - loguje pristup.
- Lokalnu bazu drži kao **keš + red čekanja (offline-first)**: na terenu često
  nema mreže, pa se termin/realizacija prvo upiše lokalno pa sinhronizuje sa
  Heliant-om kad ima veze. Idempotency ključ sprečava duple upise.

## Faze
| Faza | Cilj | Zavisi od Heliant-a |
|---|---|---|
| **0. Uspostavljanje** | TEST pristup, dokumentacija, kredencijali, kontakt | Base URL (TEST), auth, Swagger |
| **1. Identifikacija pacijenta** (read-only) | Pretraga po LBO/JMBG, prikaz osnovnih podataka | `GET /pacijent` |
| **2. Šifarnici** | Povuci i mapiraj usluge, MKB-10, ustanove | `GET /sifarnik/*` |
| **3. Zakazivanje kućne posete** (write, TEST) | Kreiranje termina sa adresom i izvršiocem | `POST /termin` |
| **4. Status + realizacija** | Promena statusa i upis izvršene usluge | `PATCH /termin/{id}`, `POST /realizacija` |
| **5. Bezbednost + PRODUKCIJA** | Saglasnost, ugovor o obradi, go-live | ugovor, produkcioni kredencijali |

## Šta blokira, a šta ne
- **Blokira sve:** autentikacija i Base URL (Faza 0). Bez toga nema ni čitanja.
- **Ne blokira, radi se paralelno:** UI aplikacije, lokalni model podataka,
  mapiranje šifarnika (možemo pripremiti čim dobijemo liste).

## Definicija „gotovo" po fazi
Svaka faza je gotova kad na **TEST** okruženju prođe realan scenario
(npr. Faza 1: uneseš LBO → dobiješ tačnog pacijenta) i kad je zabeležen u logu
proxy sloja.

## Sledeći korak
1. Pošalji mail (vidi `email-za-heliant.md`) i traži TEST pristup.
2. Čim stigne Swagger — mapiraj šifarnike (Faza 2 se priprema bez čekanja).
3. Postavi proxy sloj i pusti Fazu 1 (identifikacija pacijenta).

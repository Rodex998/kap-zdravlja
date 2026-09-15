# Zajednički jezik — Kućno lečenje ↔ Heliant ZIS

Cilj: da mi i Heliant pod istim pojmom podrazumevamo istu stvar, i da unapred
znamo koji REST resurs očekujemo za svaki pojam. Ovu tabelu nosiš na sastanak /
šalješ uz mail — njome se izbegava 90% nesporazuma.

## Skraćenice
- **ZIS** — Zdravstveni informacioni sistem (Heliant).
- **LBO** — Lični broj osiguranika (identifikator pacijenta u zdravstvenom sistemu).
- **JMBG** — Jedinstveni matični broj građana.
- **MKB-10** — Međunarodna klasifikacija bolesti (dijagnoze).
- **RFZO** — Republički fond za zdravstveno osiguranje.
- **IZJZ / eZdravlje** — nadređene sabirnice/sistemi kroz koje integracija ponekad mora da ide.
- **Šifarnik** — zvanična kodna lista (usluge, dijagnoze, ustanove…).

## Mapiranje pojmova
| Naš pojam (kućno lečenje) | Heliant / ZIS pojam | Očekivani REST resurs | Napomena |
|---|---|---|---|
| Pacijent (ime, telefon) | Pacijent identifikovan po **LBO/JMBG** | `GET /pacijent?lbo=…` / `?jmbg=…` | Heliant traži LBO/JMBG kao ključ, ne ime. Ime/telefon su kod nas, LBO je „most". |
| Usluga (npr. infuzija, previjanje) | Usluga/procedura iz **šifarnika usluga** | `GET /sifarnik/usluge` | Svaku našu uslugu vežemo za jednu Heliant šifru. |
| Termin / zakazivanje | Termin (`vremeZakazivanja`, `vremeDolaska`) | `POST /termin`, `GET /termin/{id}` | Vraća ID termina koji čuvamo kod sebe kao vezu. |
| Kućna poseta (adresa) | Kućna poseta / poseta na terenu | polje `adresa` u terminu | Ključna razlika u odnosu na ambulantu — adresa i izvršilac na terenu. |
| Izvršilac | Radnik (npr. **RR1672**) | `radnikId` u terminu/realizaciji | Ko je izveo uslugu na terenu. |
| Status: Zakazano / Realizovano / Otkazano | Status termina | `PATCH /termin/{id}/status` | Uskladiti naše statuse sa Heliant vrednostima. |
| Realizacija usluge (ko/kada/šta) | Evidencija izvršene usluge / susret | `POST /realizacija` | Upis nakon posete; opciono nalaz i utrošeni materijal. |
| Saglasnost pacijenta | Saglasnost / pristanak | polje/servis za saglasnost | Mi je već beležimo; dogovoriti kako se prosleđuje u ZIS. |
| Napomena / anamneza | Napomena / anamneza | polje `napomena` | Slobodan tekst uz termin/realizaciju. |
| Dijagnoza | **MKB-10** šifra | `GET /sifarnik/mkb10` | Za slučaj da vezujemo uslugu za dijagnozu. |

## Otvorena pitanja koja definišu „jezik"
1. Da li je ključ pacijenta **LBO** ili **JMBG** (ili oba)?
2. Da li Heliant ima poseban tip **kućne posete** ili je to običan termin sa adresom?
3. Koje **statusne vrednosti** postoje i kako se zovu (Zakazano/Realizovano/Otkazano/Odloženo)?
4. Da li realizacija ide kao zaseban resurs ili kao izmena termina?
5. Da li saglasnost mora da se čuva u ZIS-u ili je dovoljno kod nas?

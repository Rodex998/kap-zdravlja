# Heliant integracija — Kućno lečenje

Materijal za povezivanje **zasebnog projekta kućnog lečenja** sa **Heliant
Zdravstvenim informacionim sistemom (ZIS)** preko REST web servisa.

> Napomena: ovo je nezavisan projekat kućnog lečenja. Nije povezan sa drugim
> aplikacijama u ovom repozitorijumu — dokumenti su ovde jer je ovo grana
> namenjena Heliant integraciji.

## Fajlovi
- **`email-za-heliant.md`** — gotov mail za Heliant: tačan spisak šta nam treba
  od njih (dokumentacija, pristup, servisi, bezbednost, komercijala).
- **`zajednicki-jezik.md`** — pojmovnik i mapiranje „naš pojam ↔ Heliant pojam ↔
  očekivani REST resurs"; da govorimo istim jezikom.
- **`strategija-integracije.md`** — fazni plan (TEST → PRODUKCIJA) i ključna
  arhitektonska odluka (proxy sloj, offline-first).

## Kontekst (činjenice)
- Heliant ZIS **v8.4**, publisher **Heliant d.o.o.**
- Ustanova u kojoj je korisnik registrovan: **Dom zdravlja Subotica**.
- Korisnik/radnik: **gligorije.rodic (Gligorije Rodić), šifra RR1672**.
- Heliant sistem barata pojmovima: LBO, JMBG, uput, dijagnoza (MKB-10), karton,
  zakazivanje, termin, usluga, šifarnik.

## Šta još treba od tebe
1. Tačan kontakt (mail) Heliant-a za integracije/podršku.
2. Da li projekat ide kroz DZ Subotica (tvoj RR1672 nalog) ili kao privatno
   pravno lice — od toga zavisi ko potpisuje ugovor o obradi podataka.
3. Spisak konkretnih usluga kućnog lečenja koje nudiš (za mapiranje na šifarnik).

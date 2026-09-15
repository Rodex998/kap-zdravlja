# E-mail za Heliant — zahtev za pristup REST servisima (projekat: Kućno lečenje)

> Ovo je zaseban projekat **kućnog lečenja** — nije povezan ni sa jednom drugom
> aplikacijom. Dole je gotov tekst za slanje; popuni polja u uglastim zagradama
> `[...]`. Red o radniku RR1672 / DZ Subotica ostavi ako projekat ide kroz tvoj
> nalog u toj ustanovi; obriši ga ako je privatni poduhvat van DZ Subotica.

---

**Za:** `[integracije@heliant.rs / podrska@heliant.rs — proveriti tačnu adresu]`
**Cc:** `[po potrebi: IT služba ustanove]`
**Naslov:** Zahtev za pristup REST web servisima — integracija aplikacije za kućno lečenje

Poštovani,

razvijam aplikaciju za **kućno lečenje** (evidencija i zakazivanje kućnih poseta,
usluga na terenu i realizacije) i želim da je povežem sa **Heliant Zdravstvenim
informacionim sistemom** preko vaših **REST web servisa**, kako bismo radili nad
istim podacima umesto da vodimo paralelnu evidenciju.

`[Opciono, ako ide kroz ustanovu:]` Vaš sistem već koristim kao registrovani
radnik u ustanovi **Dom zdravlja Subotica** (ZIS v8.4), korisnik
**gligorije.rodic (Gligorije Rodić), šifra radnika RR1672**.

Da bismo „govorili istim jezikom" i krenuli sa integracijom, molim vas za sledeće:

## 1. Dokumentacija i pristup
1. Tehnička specifikacija REST servisa — **OpenAPI/Swagger** (ili WSDL ako je SOAP).
2. **Base URL** za TEST i za PRODUKCIJU.
3. Način **autentikacije/autorizacije** (OAuth2 / API ključ / token / mTLS klijentski sertifikat) i postupak dobijanja kredencijala.
4. Mrežni preduslovi: **VPN, IP whitelist, portovi, sertifikati**.
5. Verzionisanje API-ja i verzija ZIS-a na koju se povezujemo.
6. Ograničenja: rate-limit, paginacija, timeout, maksimalan broj poziva.

## 2. Servisi koji su nam potrebni (funkcionalno, redom kako ih zovemo)
1. **Identifikacija pacijenta** — pretraga/validacija po **LBO** i/ili **JMBG**; povratni podaci: ime, prezime, pol, datum rođenja, izabrani lekar, matična filijala.
2. **Šifarnik usluga/procedura** — da naše usluge kućnog lečenja `[npr. previjanje, davanje injekcije/infuzije, uzimanje uzoraka, kontrola vitalnih parametara, nega]` mapiramo na vaše **šifre usluga**.
3. **Zakazivanje kućne posete / termina** — kreiranje termina u ZIS-u sa poljima: pacijent (LBO/JMBG), datum, vreme, usluga, **adresa kućne posete**, izvršilac, napomena; povratna vrednost: ID termina i status.
4. **Promena statusa termina** — Zakazano → Realizovano / Otkazano / Odloženo.
5. **Evidencija realizovane usluge** — upis izvršene usluge na terenu (ko, kada, koja usluga), po potrebi kratak nalaz/napomena i utrošeni materijal.
6. **Osnovni medicinski podaci uz saglasnost** (opciono) — alergije, tekuća terapija, hronične bolesti/relevantne dijagnoze (bitno za bezbednost na terenu).
7. **Šifarnici (read-only)** — MKB-10 dijagnoze, usluge, organizacione jedinice/ustanove, izabrani lekari — radi mapiranja.
8. **Sinhronizacija** — kako sprečiti duple termine (idempotency / eksterna referenca) i kako povlačiti izmene (webhook ili polling).

## 3. Bezbednost i pravni okvir
1. Obrada podataka o ličnosti i zdravstvenih podataka (ZZPL / GDPR) i **ugovor o obradi**.
2. Kako se prosleđuje i čuva **saglasnost pacijenta**.
3. Logovanje i revizija pristupa; pod kojim nalogom/ulogom radi integracija.

## 4. Organizaciono i komercijalno
1. Da li integracija ide **direktno preko Heliant-a** ili preko nadređene sabirnice (IZJZ / RFZO / eZdravlje).
2. **Uslovi korišćenja i cena** pristupa servisima (jednokratno + održavanje).
3. Kontakt tehničke osobe kod vas i predlog kratkog uvodnog sastanka.

Aplikacija je u izradi i spremna da se prilagodi vašem modelu podataka i
šifarnicima. Za početak nam je dovoljno **TEST** okruženje i dokumentacija, pa
možemo prvo da pustimo najjednostavniji tok (identifikacija pacijenta) i dalje
gradimo.

Unapred hvala i srdačan pozdrav,
**Gligorije Rodić**
`[naziv projekta / prakse]`
`[PIB / matični broj — ako postoji pravno lice]`
`[telefon]` · `gilerodic998@gmail.com`

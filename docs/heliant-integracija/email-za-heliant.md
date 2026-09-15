# Mejl za Heliant — opis procesa + zahtev za povezivanje (kućno lečenje)

> Gotov tekst za slanje. Popuni polja u uglastim zagradama `[...]` i pošalji na
> tačnu adresu Heliant-a. Bez podataka pacijenata — opisana su samo polja naloga.

---

**Za:** `[kontakt osoba u Heliant-u — integracije/podrška]`
**Naslov:** Kućno lečenje — opis procesa i zahtev za povezivanje sa Heliant ZIS-om

Poštovani,

kao što ste tražili, u nastavku je opis kako trenutno funkcioniše naš proces
kućnog lečenja, šta bismo želeli da automatizujemo i pitanja za vas.

## Kako proces funkcioniše (trenutno stanje)

1. **Prijem naloga.** Medicinska sestra u ambulanti kreira dokument „PRIJAVA TERENA" i šalje ga kao **poruku unutar Helianta** na zajednički nalog **„PRIJAVA TERENA KL" (korisnik prijava.terena)**, ogranak 6. Nalog je u prilogu kao Word dokument (.docx).

2. **Sadržaj naloga.** Dokument sadrži: pacijent (ime i prezime, adresa, JMBG, telefon, partija), lekar, dijagnoze (MKB šifre), terapiju (lek, doza i dinamika — npr. ujutru/uveče), period primene (od–do / ukupno dana), da li je lek donet iz bolnice ili se kupuje, i napomenu (npr. na teret RFZO).

3. **Dispečer.** Dispečer preuzima nalog iz Heliant poruke i raspoređuje medicinske tehničare po adresama na terenu.

4. **Teren.** Medicinski tehničar odlazi na adresu pacijenta i daje terapiju prema rasporedu (često više dana zaredom, više puta dnevno).

5. **Zatvaranje terena.** Tehničar po završetku evidentira da je teren obavljen i koju je terapiju dao.

6. **Povratni upis u Heliant.** Realizovana terapija se trenutno **ručno prekucava** nazad u Heliant.

**Napomena o okruženju:** Heliant kod nas radi u okviru **interne mreže** ustanove.

## Šta želimo da automatizujemo
- Automatsko **preuzimanje naloga** iz Heliant poruka (umesto ručnog skidanja .docx priloga).
- Automatski **upis realizovane terapije** nazad u Heliant karton (umesto ručnog prekucavanja).

## Pitanja za vas
1. Da li nudite **REST web servise** za: (a) čitanje poruka/naloga radnika i (b) upis realizovane usluge/terapije u karton?
2. Pošto Heliant radi na internoj mreži — kako predlažete **„online" povezivanje** (VPN, gateway/most, ili hosting kod vas)?
3. Šta vam je potrebno od nas (tehnički i formalno) da bismo ovo omogućili?
4. **Uslovi i cena** pristupa servisima, i predlog kratkog uvodnog sastanka.

Hvala unapred. Stojimo na raspolaganju za sva dodatna pojašnjenja.

Srdačan pozdrav,
**Gligorije Rodić**
`[naziv projekta / ordinacije]`
`[telefon]` · gilerodic998@gmail.com
*(korisnik Heliant ZIS-a, Dom zdravlja Subotica)*

# Polityka prywatności — notatka źródłowa

Tekst dla strony `privacy-policy` (`/polityka-prywatnosci/`, `/en/privacy-policy/`, pole
`legal.body`).

**To standardowy wzór pod RODO i prawo polskie, nie porada prawna.** Przed publikacją niech
przejrzy to prawnik — odpowiedzialność za treść leży po stronie administratora danych.

Tekst nie jest przepisany z cudzego wzoru — jest napisany pod ten serwis i **sprawdzony
punkt po punkcie względem art. 13 RODO**, którego pełne polskie brzmienie pobrałem z
EUR-Lex. Mapa „wymóg → sekcja" i lista źródeł są na końcu pliku.

## Do uzupełnienia przed wklejeniem

- `[[NAZWA FIRMY]]` — pełna nazwa działalności (Bartłomiej Antonik, `[[NAZWA]]`?)
- `[[NIP]]` — wciąż nieustalony; to samo pole, które czeka puste na stronie Kontakt
- `[[E-MAIL KONTAKTOWY]]` — do rozstrzygnięcia: `biuro@wykonczymy.com.pl` (tak jest na żywej
  stronie) czy `bartekantonik@gmail.com` (tak jest w seedzie stopki)
- **Sekcja 6** (odbiorcy) zakłada, że zgłoszenia z formularza trafiają do osobnej aplikacji obsługi
  leadów. Na dziś `submitContactForm` nie ma jeszcze żadnego odbiornika — zaktualizuj tę
  sekcję, kiedy sink powstanie, i dopisz, czy aplikacja leadów jest osobnym administratorem,
  czy podmiotem przetwarzającym.
- **Sekcja 10** (cookies) opisuje stan faktyczny, który sprawdziłem w kodzie: zero cookies po naszej
  stronie (brak GA, Vercel Analytics i jakiegokolwiek zewnętrznego skryptu), język wynika z
  adresu URL, a niewysłana treść formularza siedzi w `sessionStorage` przeglądarki i nigdzie
  nie jest wysyłana. **Cookies są w planach** — w momencie, w którym wejdzie analityka albo
  piksel, ta sekcja jest nieprawdziwa: trzeba ją przepisać, wymienić konkretne narzędzia i
  okresy przechowywania, dołożyć baner zgody, a do §2 i §3 dopisać dane zbierane
  automatycznie wraz z podstawą (zgoda — art. 6 ust. 1 lit. a RODO).

---

**Treść polityki żyje w `scripts/seed/data/legal.ts`** (PL i EN), skąd `pnpm seed` wpisuje ją
do pola `legal.body` strony. Ten plik nie powtarza tekstu — trzyma to, czego seed nie unosi:
listę niezweryfikowanych faktów i źródła, z których tekst powstał.

## Źródła i weryfikacja

### Źródło pierwotne — art. 13 RODO

Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679, **art. 13 „Informacje podawane
w przypadku zbierania danych od osoby, której dane dotyczą"** — pełny tekst polski z
EUR-Lex, CELEX `32016R0679`:
<https://eur-lex.europa.eu/legal-content/PL/TXT/HTML/?uri=CELEX:32016R0679>

To jest lista kontrolna dla tego dokumentu: art. 13 ust. 1 i 2 wylicza, co administrator
**musi** podać, gdy zbiera dane wprost od osoby — a formularz kontaktowy to dokładnie ten
przypadek. Każdy wymóg ma tu swoją sekcję:

| Wymóg RODO | Treść wymogu | Sekcja |
| --- | --- | --- |
| art. 13 ust. 1 lit. a | tożsamość i dane kontaktowe administratora | §1 |
| art. 13 ust. 1 lit. b | dane kontaktowe inspektora ochrony danych, *gdy ma to zastosowanie* | §1 (nie powołano IOD) |
| art. 13 ust. 1 lit. c | cele przetwarzania oraz podstawa prawna | §3 |
| art. 13 ust. 1 lit. d | przy art. 6 ust. 1 lit. f — **nazwanie** prawnie uzasadnionego interesu | §3 (obrona roszczeń) |
| art. 13 ust. 1 lit. e | odbiorcy lub kategorie odbiorców | §6 |
| art. 13 ust. 1 lit. f | zamiar przekazania do państwa trzeciego + zabezpieczenia + jak uzyskać kopię | §7 |
| art. 13 ust. 2 lit. a | okres przechowywania albo kryteria jego ustalania | §5 |
| art. 13 ust. 2 lit. b | prawa: dostęp, sprostowanie, usunięcie, ograniczenie, sprzeciw, przenoszenie | §8 |
| art. 13 ust. 2 lit. c | prawo cofnięcia zgody — **tylko** przy podstawie art. 6 ust. 1 lit. a | **brak, celowo** — dziś nic nie opiera się na zgodzie. Wejdzie razem z cookies. |
| art. 13 ust. 2 lit. d | prawo skargi do organu nadzorczego | §8 (PUODO) |
| art. 13 ust. 2 lit. e | czy podanie danych jest wymogiem i jakie są skutki niepodania | §4 |
| art. 13 ust. 2 lit. f | zautomatyzowane podejmowanie decyzji i profilowanie | §9 |

Art. 13 ust. 1 wymaga też, by informacja była podana **w momencie pozyskiwania danych** —
czyli link do tej polityki musi być widoczny przy samym formularzu, nie tylko w stopce.

### Źródła pomocnicze

- UODO, dział **Obowiązek informacyjny** — <https://uodo.gov.pl/324>
- UODO, przykładowa klauzula informacyjna (PDF) — <https://uodo.gov.pl/pl/file/4372>
- Biznes.gov.pl, portal **RODO** dla przedsiębiorców — <https://www.biznes.gov.pl/pl/portal/02158>
- Biznes.gov.pl: *Zasady ogólne przetwarzania danych osobowych wg RODO* —
  <https://biznes.gov.pl/pl/publikacje/3461-zasady-ogolne-przetwarzania-danych-osobowych-wg-rodo>

UODO nie publikuje gotowego wzoru polityki prywatności dla firmowej strony — publikuje
wytyczne i przykładowe klauzule dla konkretnych sytuacji. Nie ma więc czegoś takiego jak
„oficjalny wzór do wklejenia"; jest lista wymogów, którą ten dokument realizuje.

### Czego **nie** zweryfikowałem

**Okresy przedawnienia w §5 to jedyna część bez potwierdzonego źródła.** Sejmowe API
(`api.sejm.gov.pl/eli/acts/DU/1964/93/text.html`) oddaje pierwotny tekst Kodeksu cywilnego
z 1964 r., a nie tekst jednolity — art. 118 w tej wersji mówi jeszcze o „jednostkach
gospodarki uspołecznionej". Nie mam więc potwierdzenia aktualnego brzmienia. Do sprawdzenia
przez prawnika:

- **art. 118 k.c.** — ogólny termin przedawnienia i krótszy termin dla roszczeń związanych z
  prowadzeniem działalności gospodarczej,
- **art. 646 k.c.** — roszczenia z umowy o dzieło, liczone od dnia oddania dzieła; przy
  pracach wykończeniowych to może być termin właściwy zamiast ogólnego,
- **art. 86 § 1 Ordynacji podatkowej** — okres przechowywania ksiąg i dokumentów.

To ma znaczenie praktyczne: w §5 zadeklarowany okres przechowywania musi się zgadzać z
terminem, który realnie chroni was przed roszczeniem — deklaracja „6 lat" przy roszczeniu
przedawniającym się po 2 latach to trzymanie danych dłużej, niż jest do czego.

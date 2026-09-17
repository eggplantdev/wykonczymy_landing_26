import type { LocalizedT } from '../types'

/**
 * The policy is markdown rather than a Lexical tree because it is prose an editor will keep
 * rewriting: the seed converts it with Payload's own markdown converter, so what lands in the
 * database is exactly what typing this into the admin would produce.
 *
 * Starts at `##` — the page renders its own title as the h1, and `legal-prose` styles no h1.
 *
 * The [[...]] slots are unverified facts, not copy: the company's registered name, its tax id,
 * the contact address and the retention periods still need the owner's and a lawyer's answer.
 * They are left visible so an unresolved one cannot be published silently.
 */
export const legalBodySeeds: LocalizedT<string> = {
  pl: `Kiedy piszesz do nas przez formularz na tej stronie, zostawiasz nam swoje dane. Poniżej opisujemy, co z nimi robimy, jak długo je trzymamy i co możesz nam kazać z nimi zrobić.

## 1. Kto jest administratorem Twoich danych

Administratorem danych osobowych jest [[NAZWA FIRMY]], ul. Terespolska 2, 03-813 Warszawa, NIP [[NIP]].

We wszystkich sprawach dotyczących danych osobowych możesz się z nami skontaktować:

- e-mailem: [[E-MAIL KONTAKTOWY]]
- listownie: na adres wskazany powyżej

Nie powołaliśmy inspektora ochrony danych.

## 2. Jakie dane zbieramy

Zbieramy wyłącznie dane, które sam nam podasz w formularzu kontaktowym:

- imię lub nazwę,
- adres e-mail,
- numer telefonu,
- zakres i powierzchnię planowanych prac,
- treść wiadomości,
- załączniki, jeśli je dodasz — projekt, rzut, zdjęcia — wraz ze wszystkim, co się w nich znajduje.

Nie zbieramy danych szczególnych kategorii, czyli tak zwanych danych wrażliwych, i prosimy, żebyś nie umieszczał ich w wiadomości ani w załącznikach.

## 3. Po co przetwarzamy Twoje dane i na jakiej podstawie

**Żeby odpowiedzieć na Twoje zapytanie, przygotować wycenę i uzgodnić zakres prac** — art. 6 ust. 1 lit. b RODO, czyli działania podejmowane na Twoje żądanie, zanim zawrzemy umowę.

**Żeby wykonać umowę, jeśli ją zawrzemy** — art. 6 ust. 1 lit. b RODO.

**Żeby wystawić i przechować dokumenty księgowe** — art. 6 ust. 1 lit. c RODO, czyli obowiązek, który nakładają na nas przepisy podatkowe.

**Żeby ustalić, dochodzić lub bronić się przed roszczeniami** — art. 6 ust. 1 lit. f RODO. Naszym prawnie uzasadnionym interesem jest w tym wypadku możliwość wykazania, na co się umówiliśmy i co zostało zrobione.

## 4. Czy podanie danych jest obowiązkowe

Podanie danych jest dobrowolne, ale bez adresu e-mail nie mamy jak Ci odpowiedzieć, a bez opisu prac — przygotować wyceny. Pozostałe pola możesz zostawić puste.

## 5. Jak długo przechowujemy dane

- Zapytania, które nie skończyły się umową — przez czas potrzebny na odpowiedź i dalszą korespondencję, nie dłużej niż [[LICZBA]] miesięcy od ostatniego kontaktu.
- Dane związane z zawartą umową — przez czas jej trwania, a po zakończeniu przez okres przedawnienia roszczeń, czyli [[LICZBA]] lat.
- Dokumenty księgowe — [[LICZBA]] lat, licząc od końca roku kalendarzowego, w którym upłynął termin płatności podatku.

## 6. Komu przekazujemy dane

Twoje dane mogą trafić do podmiotów, które świadczą dla nas usługi i przetwarzają dane na nasze polecenie, na podstawie umów powierzenia:

- dostawcy hostingu i infrastruktury, na której działa ta strona oraz baza danych,
- dostawcy poczty elektronicznej,
- biura rachunkowego,
- podwykonawców, jeśli realizacja zlecenia tego wymaga — wyłącznie w zakresie niezbędnym do wykonania prac,
- kancelarii prawnej lub firmy windykacyjnej, jeśli będziemy dochodzić roszczeń.

Nie sprzedajemy Twoich danych i nie udostępniamy ich nikomu w celach marketingowych.

## 7. Przekazywanie danych poza Europejski Obszar Gospodarczy

Strona jest hostowana przez Vercel Inc. z siedzibą w Stanach Zjednoczonych, więc Twoje dane mogą być przetwarzane poza Europejskim Obszarem Gospodarczym. Przekazanie odbywa się na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję Europejską oraz uczestnictwa dostawcy w programie Data Privacy Framework. Kopię tych zabezpieczeń możesz uzyskać, pisząc do nas.

## 8. Twoje prawa

Masz prawo do:

- dostępu do swoich danych i otrzymania ich kopii,
- sprostowania danych, które są nieprawidłowe lub niekompletne,
- usunięcia danych,
- ograniczenia przetwarzania,
- przenoszenia danych,
- sprzeciwu wobec przetwarzania, które opieramy na naszym prawnie uzasadnionym interesie.

Żeby skorzystać z któregokolwiek z tych praw, napisz na [[E-MAIL KONTAKTOWY]].

Masz również prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa, jeśli uznasz, że przetwarzamy Twoje dane niezgodnie z prawem.

## 9. Zautomatyzowane decyzje i profilowanie

Nie podejmujemy wobec Ciebie decyzji w sposób wyłącznie zautomatyzowany i nie profilujemy Twoich danych.

## 10. Pliki cookies i pamięć przeglądarki

Nie używamy cookies analitycznych, marketingowych ani śledzących. Nie korzystamy z Google Analytics ani z żadnego innego narzędzia, które śledziłoby Twoje zachowanie na stronie.

Treść formularza, którą wpisałeś, a jeszcze nie wysłałeś, zapisujemy w pamięci Twojej przeglądarki, żebyś nie stracił jej przy odświeżeniu strony. Te dane nie opuszczają Twojego urządzenia i znikają po zamknięciu karty. Możesz je w każdej chwili usunąć, czyszcząc dane strony w ustawieniach przeglądarki.

## 11. Zmiany polityki

Jeśli zmienimy sposób przetwarzania danych, zaktualizujemy tę politykę i opublikujemy nową wersję pod tym samym adresem.

Ostatnia aktualizacja: [[DATA]].`,

  en: `When you write to us through the form on this site, you leave us your personal data. Below we explain what we do with it, how long we keep it, and what you can tell us to do with it.

## 1. Who controls your data

The controller of your personal data is [[NAZWA FIRMY]], ul. Terespolska 2, 03-813 Warsaw, Poland, tax id (NIP) [[NIP]].

You can reach us about anything concerning personal data:

- by e-mail: [[E-MAIL KONTAKTOWY]]
- by post: at the address above

We have not appointed a data protection officer.

## 2. What data we collect

We collect only what you give us in the contact form:

- your name or company name,
- your e-mail address,
- your phone number,
- the scope and area of the planned work,
- the content of your message,
- attachments, if you add any — a design, a floor plan, photos — including everything they contain.

We do not collect special categories of data, and we ask that you not put any into your message or attachments.

## 3. Why we process your data, and on what basis

**To answer your enquiry, prepare a quote and agree the scope of work** — art. 6(1)(b) GDPR: steps taken at your request before entering into a contract.

**To perform the contract, if we enter into one** — art. 6(1)(b) GDPR.

**To issue and keep accounting records** — art. 6(1)(c) GDPR: an obligation imposed on us by tax law.

**To establish, pursue or defend against claims** — art. 6(1)(f) GDPR. Our legitimate interest here is being able to show what was agreed and what was done.

## 4. Is giving us your data mandatory

Giving us your data is voluntary, but without an e-mail address we have no way to reply, and without a description of the work we cannot prepare a quote. The remaining fields you can leave empty.

## 5. How long we keep your data

- Enquiries that did not lead to a contract — for as long as the reply and any follow-up correspondence require, and no longer than [[LICZBA]] months from the last contact.
- Data relating to a contract we entered into — for its duration, and after it ends for the limitation period for claims, that is [[LICZBA]] years.
- Accounting records — [[LICZBA]] years, counted from the end of the calendar year in which the tax payment deadline fell.

## 6. Who we share your data with

Your data may reach parties that provide services to us and process data on our instructions, under data processing agreements:

- the providers of the hosting and infrastructure this site and its database run on,
- our e-mail provider,
- our accounting office,
- subcontractors, where carrying out the job requires it — only to the extent needed to perform the work,
- a law firm or debt collection agency, if we pursue claims.

We do not sell your data and we do not share it with anyone for marketing purposes.

## 7. Transfers outside the European Economic Area

This site is hosted by Vercel Inc., based in the United States, so your data may be processed outside the European Economic Area. The transfer relies on the standard contractual clauses approved by the European Commission and on the provider's participation in the Data Privacy Framework. You can obtain a copy of these safeguards by writing to us.

## 8. Your rights

You have the right to:

- access your data and receive a copy of it,
- have inaccurate or incomplete data corrected,
- have your data erased,
- restrict processing,
- data portability,
- object to processing we base on our legitimate interest.

To exercise any of these rights, write to [[E-MAIL KONTAKTOWY]].

You also have the right to lodge a complaint with the President of the Personal Data Protection Office (Prezes Urzędu Ochrony Danych Osobowych), ul. Stawki 2, 00-193 Warsaw, Poland, if you believe we process your data unlawfully.

## 9. Automated decisions and profiling

We do not make decisions about you by purely automated means and we do not profile your data.

## 10. Cookies and browser storage

We use no analytics, marketing or tracking cookies. We do not use Google Analytics or any other tool that would track your behaviour on this site.

What you have typed into the form but not yet sent is kept in your browser's own storage, so that a page refresh does not lose it. That data never leaves your device and is discarded when you close the tab. You can remove it at any time by clearing this site's data in your browser settings.

## 11. Changes to this policy

If we change how we process data, we will update this policy and publish the new version at the same address.

Last updated: [[DATA]].`,
}

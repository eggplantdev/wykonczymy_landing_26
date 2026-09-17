import type { LocalizedT } from '../types'

type SectionCopyT = { sectionTitle: string; ctaLabel: string }

export type HomeCopyT = {
  hero: { title: string; ctaLabel: string }
  intro: string
  services: { sectionTitle: string; cards: { title: string; text: string }[] }
  projects: SectionCopyT
  numbers: { sectionTitle: string; cards: { unit: string; description: string }[] }
  // One entry per paragraph — the field is rich text, so the seed builds the Lexical tree.
  testimonials: {
    sectionTitle: string
    quotes: { quote: string[]; name: string; role: string }[]
  }
  interiorStyles: SectionCopyT
}

// The parts of the home group that do not translate: which page each button opens and the
// figures on the numbers cards. Their row order is what pairs the figures with the copy.
export const homeShared = {
  heroCtaLink: 'contact',
  projectsCtaLink: 'completed-works',
  interiorStylesCtaLink: 'interior-styles',
  introPosition: 'left',
  numberValues: [16, 70, 120, 250],
} as const

export const homeCopy: LocalizedT<HomeCopyT> = {
  pl: {
    hero: {
      title: 'Twój dom, nasze wykończenie',
      ctaLabel: 'Umów bezpłatną wycenę',
    },
    intro:
      'Solidne wykończenia i remonty w rozsądnej cenie, dopasowane do każdego budżetu. Gwarantujemy jakość wykonania i zadowolenie klienta, a nasza ekipa pomoże niezależnie od skali zlecenia. Zajmujemy się też drobiazgami, bo zależy nam na kliencie na każdym etapie prac.',
    services: {
      sectionTitle: 'Czym się zajmujemy',
      cards: [
        {
          title: 'Remonty',
          text: 'Kompleksowe remonty mieszkań, domów, biur i lokali usługowych — od jednego pokoju po wykończenie pod klucz, wycenione pozycja po pozycji przed startem.',
        },
        {
          title: 'Instalacje',
          text: 'Elektryka, instalacje wodno-kanalizacyjne, centralne ogrzewanie i klimatyzacja — zaprojektowane, wykonane i sprawdzone przez naszą ekipę.',
        },
        {
          title: 'Wykończenia',
          text: 'Malowanie, podłogi, tynki dekoracyjne i usługi projektowe. Etap, na którym plac budowy zaczyna wreszcie wyglądać jak miejsce do życia.',
        },
      ],
    },
    projects: {
      sectionTitle: 'Ostatnie realizacje',
      ctaLabel: 'Zobacz wszystkie realizacje',
    },
    numbers: {
      sectionTitle: 'Od ilu zaczynają się nasze ceny',
      cards: [
        { unit: 'zł / m²', description: 'Malowanie wnętrz' },
        { unit: 'zł / m²', description: 'Wylewka samopoziomująca' },
        { unit: 'zł / m²', description: 'Układanie płytek' },
        { unit: 'zł / m²', description: 'Mikrocement' },
      ],
    },
    testimonials: {
      sectionTitle: 'Co mówią klienci',
      quotes: [
        {
          quote: [
            'W maju br. firma P. Bartosza wykonywała remont mieszkania po zalaniu. Trzeba było wymienić podłogi, naprawić odpadające sufity i wykonać wiele, wiele innych prac. Wszystko zostało wykonane sprawnie i fachowo. Kontakt z wykonawcami podczas remontu był na bieżąco, co pozwalało na bardzo dobrą koordynację działań. Kosztorys w pliku Excel zawierał poszczególne wydatki i szczegółowo prezentował, za co i ile płacę. Wszystkie sprawy i pomysły były przedstawiane na bieżąco przez grupę na WhatsAppie. Po wykonanej pracy mieszkanie zostało sprzątnięte przez ekipę.',
            'Firma pomogła mi również z kosztorysem dla ubezpieczalni, gdyż ubezpieczyciel nieakceptowalnie zaniżył koszty remontu. Na podstawie kosztorysu od rzeczoznawcy poleconego przez firmę P. Bartosza ubiegam się o realne odszkodowanie. Polecam usługi tej ekipy!',
          ],
          name: 'Kamil',
          role: 'Warszawa',
        },
        {
          quote: [
            'Profesjonalne podejście, dobry kontakt i przede wszystkim duża elastyczność. Bartek zna się na rzeczy, doradza najlepsze rozwiązania i efektem jest świetny remont. Wszystko ładnie rozliczone, wycena przejrzysta, a dobór terminów, szczególnie w przypadku „szybkich" prac – zapewnił płynność prac. Polecam!',
          ],
          name: 'Maria',
          role: 'Warszawa',
        },
        {
          quote: [
            'Współpraca z firmą była świetna od pierwszego kontaktu aż do zakończenia prac. Wszystko wykonane bardzo szybko, dokładnie i zgodnie z ustalonym wcześniej planem. Ekipa trzymała się terminów, była pomocna na każdym etapie i dbała o detale — efekt końcowy przerósł moje oczekiwania.',
            'Zdecydowanie polecam każdemu, kto szuka rzetelnej firmy remontowej.',
          ],
          name: 'Tomasz',
          role: 'Warszawa',
        },
        {
          quote: [
            'Remont mieszkania wykonany ekspresowo. Deklarowany termin umowny zakończenia prac to 4 tygodnie – Panowie skończyli prace w niecałe 3 tygodnie, dzięki czemu zyskaliśmy dodatkowy czas na wykończenie mieszkania przed porodem Żony. Kontakt z ekipą bardzo dobry, fachowcy znający się na robocie – totalnie bezproblemowi i co ważne bez nałogów. […] Same plusy! Polecam z całego serca.',
          ],
          name: 'Damian',
          role: 'Kobyłka',
        },
        {
          quote: [
            'Jesteśmy bardzo zadowoleni z pracy ekipy wykończeniowej. Ze wszystkimi wyzwaniami poradzili sobie bez problemu, wykazując się dużym doświadczeniem i profesjonalizmem. Prace zostały wykonane dokładnie, estetycznie i z dbałością o każdy detal. Dodatkowo wszystko przebiegło sprawnie i terminowo, co bardzo doceniamy.',
          ],
          name: 'Bartosz',
          role: 'Warszawa',
        },
        {
          quote: [
            'Generalny remont dwóch łazienek i kuchni oraz odświeżenie reszty domu (ok. 140 m²), wszystko od projektu, przez realizację, aż po wykończenie i stolarkę kuchenną.',
            'Prace wykonane kompleksowo i zgodnie z ustaleniami. Dobry kontakt na każdym etapie oraz sprawna koordynacja całości.',
            'Efekt końcowy spełnił nasze oczekiwania. Polecam firmę osobom szukającym rzetelnej obsługi remontowej.',
          ],
          name: 'Krzysztof',
          role: 'Warszawa',
        },
        {
          quote: [
            'Najlepsza firma w branży! Świetna, bezproblemowa współpraca w zakresie kompletnej adaptacji mieszkania ze stanu deweloperskiego. Efekt końcowy rewelacyjny, a po drodze same pozytywne wrażenia; fachowcy bardzo kompetentni i sumienni, podpowiadający optymalne rozwiązania techniczne. Również etap kosztorysowania i projektowania oceniam bardzo wysoko. Gorąco polecam!',
          ],
          name: 'Wojciech',
          role: 'Warszawa',
        },
      ],
    },
    interiorStyles: {
      sectionTitle: 'Style wnętrz',
      ctaLabel: 'Zobacz wszystkie style wnętrz',
    },
  },
  en: {
    hero: {
      title: 'Your home, our finishing touch',
      ctaLabel: 'Schedule a free estimate',
    },
    intro:
      'Quality finishing, affordable renovations for every budget. We guarantee top-quality workmanship and customer satisfaction, and our team is here to help no matter the size of the project. We handle even the small things, because we care about our clients at every stage of the job.',
    services: {
      sectionTitle: 'What we do',
      cards: [
        {
          title: 'Renovations',
          text: 'Comprehensive renovations of apartments, houses, offices and commercial premises — from a single room to turnkey finishing, priced line by line before we start.',
        },
        {
          title: 'Installations',
          text: 'Electrical work, water and sewage networks, central heating and air conditioning — designed, fitted and tested by our own team.',
        },
        {
          title: 'Finishing',
          text: 'Painting, floors, decorative plaster and design services. The stage where a building site finally starts looking like somewhere you live.',
        },
      ],
    },
    projects: {
      sectionTitle: 'Recent work',
      ctaLabel: 'See all projects',
    },
    numbers: {
      sectionTitle: 'Where our prices start',
      cards: [
        { unit: 'PLN / m²', description: 'Interior painting' },
        { unit: 'PLN / m²', description: 'Self-levelling compound' },
        { unit: 'PLN / m²', description: 'Tile installation' },
        { unit: 'PLN / m²', description: 'Microcement' },
      ],
    },
    testimonials: {
      sectionTitle: 'What clients say',
      quotes: [
        {
          quote: [
            'In May this year Bartosz and his firm renovated my flat after a flood. The floors had to be replaced, the ceilings were coming down and needed repairing, and there was a great deal of other work besides. All of it was done efficiently and expertly. Contact with the tradesmen ran throughout the job, which made coordinating everything very easy. The estimate came as an Excel file itemising each cost, so I could see exactly what I was paying for. Every question and idea was raised as it came up on a WhatsApp group. When the work was finished the team cleaned the flat.',
            'They also helped me with an estimate for the insurer, who had put the cost of the repairs unacceptably low; on the strength of an assessment from a surveyor they recommended, I am now claiming what the job actually cost. I recommend this team!',
          ],
          name: 'Kamil',
          role: 'Warsaw',
        },
        {
          quote: [
            'A professional approach, easy to reach, and above all very flexible. Bartek knows his trade, advises the best solutions, and the result is an excellent renovation. Everything accounted for properly, a transparent estimate, and the scheduling — especially for the rush jobs — kept the work flowing. Recommended!',
          ],
          name: 'Maria',
          role: 'Warsaw',
        },
        {
          quote: [
            'Working with them was excellent from the first contact right through to the end of the job. Everything was done quickly, carefully and exactly to the plan we had agreed beforehand. The team kept to the dates, were helpful at every stage and paid attention to the details — the end result went beyond what I had expected.',
            'I would definitely recommend them to anyone looking for a renovation firm they can rely on.',
          ],
          name: 'Tomasz',
          role: 'Warsaw',
        },
        {
          quote: [
            'The flat was renovated at express pace. The contract gave them 4 weeks — they finished in under 3, which bought us extra time to furnish the place before my wife gave birth. Very easy to deal with, tradesmen who know the job — completely trouble-free and, importantly, no bad habits. […] Nothing but positives! I recommend them wholeheartedly.',
          ],
          name: 'Damian',
          role: 'Kobyłka',
        },
        {
          quote: [
            'We are very happy with the finishing team. They handled every challenge without trouble, with a lot of experience and professionalism behind them. The work was done carefully, neatly and with attention to every detail. On top of that it all ran smoothly and on schedule, which we appreciate greatly.',
          ],
          name: 'Bartosz',
          role: 'Warsaw',
        },
        {
          quote: [
            'A full refit of two bathrooms and the kitchen plus a refresh of the rest of the house (around 140 m²) — all of it from the design, through the build, to the finishing and the fitted kitchen.',
            'The work was done end to end and exactly as agreed. Easy to reach at every stage, and the whole thing was well coordinated.',
            'The end result met our expectations. I recommend them to anyone looking for a renovation firm they can count on.',
          ],
          name: 'Krzysztof',
          role: 'Warsaw',
        },
        {
          quote: [
            'The best firm in the trade! A great, trouble-free job fitting out a flat from developer-standard shell to finished. The end result is superb and the whole process left nothing but good impressions; the tradesmen are very competent and conscientious, and they suggest the best technical solutions. The estimating and design stage was just as strong. I recommend them warmly!',
          ],
          name: 'Wojciech',
          role: 'Warsaw',
        },
      ],
    },
    interiorStyles: {
      sectionTitle: 'Interior styles',
      ctaLabel: 'See all interior styles',
    },
  },
}

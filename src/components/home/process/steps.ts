import type { ServiceIconKeyT } from '@/lib/service-icons'

export type ProcessStepT = {
  id: string
  /** The same closed set the services cards draw from, so one select field serves both. */
  icon: ServiceIconKeyT
  title: string
  text: string
}

export type ProcessSectionT = {
  sectionTitle: string
  steps: ProcessStepT[]
}

// TEST CONTENT. Not modelled in Payload yet, because the layout is still being chosen.
export const processPlaceholder: ProcessSectionT = {
  sectionTitle: 'Jak wygląda współpraca',
  steps: [
    {
      id: 'wycena',
      icon: 'ruler-combined',
      title: 'Rozmowa i wycena',
      text: 'Oglądamy mieszkanie, spisujemy zakres prac i przygotowujemy bezpłatną wycenę — pozycja po pozycji, bez widełek.',
    },
    {
      id: 'projekt',
      icon: 'compass-drafting',
      title: 'Projekt i harmonogram',
      text: 'Ustalamy materiały, kolejność prac i termin zakończenia. Wszystko trafia do umowy, żeby na budowie nie było niespodzianek.',
    },
    {
      id: 'realizacja',
      icon: 'hammer',
      title: 'Realizacja',
      text: 'Jedna ekipa od wyburzeń po malowanie. Kierownik budowy jest pod telefonem i raz w tygodniu wysyła zdjęcia z postępu prac.',
    },
    {
      id: 'wykonczenia',
      icon: 'paint-roller',
      title: 'Wykończenia',
      text: 'Malowanie, montaż drzwi, białego montażu i oświetlenia — etap, na którym mieszkanie zaczyna wyglądać jak na wizualizacji.',
    },
    {
      id: 'sprzatanie',
      icon: 'brush',
      title: 'Sprzątanie po remoncie',
      text: 'Wywozimy gruz i zostawiamy mieszkanie gotowe do wniesienia mebli, bez pyłu po szlifowaniu gładzi.',
    },
    {
      id: 'odbior',
      icon: 'house-chimney',
      title: 'Odbiór i gwarancja',
      text: 'Sprzątamy po sobie, przechodzimy odbiór punkt po punkcie i poprawiamy usterki. Na wykonane prace dajemy gwarancję.',
    },
  ],
}

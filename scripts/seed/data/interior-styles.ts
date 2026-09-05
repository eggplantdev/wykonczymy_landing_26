import type { LocalizedT } from '../types'

export type StyleCopyT = {
  title: string
  slug: string
  /** Card blurb. The style's own page opens with the same sentence, in full. */
  text: string
  body: string[]
}

// The twelve styles the live site publishes under /wykonczenia/. Photos are added in the
// admin — the seed only writes copy.
export const interiorStyleSeeds: LocalizedT<StyleCopyT>[] = [
  {
    pl: {
      title: 'Boho',
      slug: 'boho',
      text: 'Styl boho we wnętrzach to wyraz wolności, kreatywności i życia według własnych zasad.',
      body: [
        'Styl boho we wnętrzach to wyraz wolności, kreatywności i życia według własnych zasad. Wyrósł z dziewiętnastowiecznej paryskiej bohemy i wnosi do domu swobodę, indywidualność oraz pewną nieoczywistość, tworząc przestrzenie pełne koloru, historii i osobistych śladów.',
        'Boho łączy kolor z naturalnymi materiałami — drewno, rattan, tkaniny plecione, len, bawełna i wełna dają ciepło i związek z naturą. Meble często mają własną przeszłość: odnowiona komoda, stół czy krzesło nadają wnętrzu autentyczność. Styl dopuszcza przemyślany eklektyzm, w którym narzuty patchwork, wzory etniczne, dzianiny i frędzle składają się na jedną opowieść o mieszkańcach.',
        'Atmosfera liczy się tu tak samo jak przedmioty. Pojemne sofy i fotele, miękkie poduszki, koce i niskie, ciepłe światło sprawiają, że w przestrzeni łatwo odpocząć, a rośliny ożywiają wnętrze i podkreślają jego organiczny charakter.',
        'Każde pomieszczenie się do tego nadaje. Sypialnia staje się spokojnym schronieniem w łagodnych barwach i miękkich tkaninach, salon miesza formy i faktury, a kuchnia z jadalnią zachęcają, żeby zostać dłużej przy stole. Taras albo balkon przenosi tę samą ideę na zewnątrz, między rośliny i wygodne meble.',
        'Przede wszystkim boho pozwala wnętrzu opowiedzieć historię ludzi, którzy w nim mieszkają — ich podróży, wspomnień i planów. Kultura, natura, kolor i historia spotykają się w domu pełnym energii i artystycznego wyrazu, gdzie po prostu można być sobą.',
      ],
    },
    en: {
      title: 'Boho',
      slug: 'boho',
      text: 'Boho style in interior design expresses freedom, creativity, and a love of living by your own rules.',
      body: [
        'Boho style in interior design expresses freedom, creativity, and a love of living by your own rules. Rooted in nineteenth-century Parisian bohemia, it brings ease, individuality and a certain unconventionality into the home, creating spaces full of colour, history and personal touches.',
        'Boho pairs colour with natural materials — wood, rattan, woven textiles, linen, cotton and wool bring warmth and a connection to nature. The furniture often has a past of its own: a restored cabinet, table or chair gives a room its authenticity. The style allows for considered eclecticism, where patchwork throws, ethnic patterns, knits and fringing add up to one story about the people who live there.',
        'Atmosphere matters as much as objects. Generous sofas and armchairs, soft cushions, blankets and low, warm lighting make the space easy to relax in, and plants bring it to life while underlining the organic character of the interior.',
        'Every room takes to it. A bedroom becomes a calm retreat in gentle colours and soft fabrics, a living room mixes forms and textures, and the kitchen and dining area invite people to linger at the table. A terrace or balcony extends the same idea outdoors, among plants and comfortable furniture.',
        'Above all it lets the interior tell the story of the people in it — their travels, memories and plans. Culture, nature, colour and history meet in a home full of energy and artistic expression, where you can simply be yourself.',
      ],
    },
  },
  {
    pl: {
      title: 'Glamour',
      slug: 'glamour',
      text: 'Styl glamour to połączenie elegancji, luksusu i spektakularnego blasku, inspirowane złotą erą Hollywood.',
      body: [
        'Styl glamour to połączenie elegancji, luksusu i spektakularnego blasku, inspirowane złotą erą Hollywood. Działa na kontraście: głębokie, nasycone kolory — czerń, bordo czy fiolet — zestawione z bielą, beżami i pastelami, a złoto, srebro i lustrzane powierzchnie podkreślają wyrafinowanie wnętrza.',
        'Meble mają być widoczne. Pikowane sofy i fotele w aksamitnych obiciach, marmurowe stoliki, komody i konsole z lustrzanymi lub złoconymi detalami budują luksus. Klasyczne formy łączy się z nowoczesną powściągliwością, dzięki czemu kontrast pozostaje atrakcyjny, a nie przytłaczający. Kryształowe żyrandole, lustra w dekoracyjnych ramach, eleganckie wazony i aksamitne poduszki dopełniają całość.',
        'W salonie centrum stanowi zwykle szeroka sofa, a wokół niej wyrazisty stolik i dekoracyjne oświetlenie. Sypialnia opiera się na luksusowym łóżku, aksamitnych poduszkach i subtelnych narzutach. Kuchnia równoważy gładkie jasne fronty wypolerowanym detalem, a łazienka zamienia się w prywatne spa dzięki marmurowi, wolnostojącej wannie i dużym lustrom.',
        'Glamour łączy wyrafinowanie z komfortem, a luksus z wygodą codziennego życia. Pasuje każdemu, kto chce, żeby dom był miejscem odpoczynku i jednocześnie sceną dla odrobiny hollywoodzkiego przepychu.',
      ],
    },
    en: {
      title: 'Glamour',
      slug: 'glamour',
      text: 'Glamour style is a blend of elegance, luxury, and spectacular shine, inspired by Hollywood’s golden era.',
      body: [
        'Glamour style is a blend of elegance, luxury and spectacular shine, inspired by the golden era of Hollywood. It works through contrast: deep, saturated colours such as black, burgundy or violet set against whites, beiges and pastels, with gold, silver and mirrored surfaces underlining the refinement of the room.',
        'The furniture is meant to be seen. Quilted sofas and armchairs in velvet upholstery, marble side tables, chests and consoles with mirrored or gilded detailing establish the luxury. Classic forms are combined with modern restraint, which keeps the contrast attractive rather than heavy. Crystal chandeliers, mirrors in decorative frames, elegant vases and velvet cushions complete it.',
        'In the living room a broad sofa is usually the centre, with a statement table and decorative lighting around it. The bedroom turns on a luxurious bed, velvet cushions and subtle throws. The kitchen balances plain light fronts with polished detail, and the bathroom becomes a private spa through marble, a freestanding bath and generous mirrors.',
        'Glamour combines refinement with comfort and luxury with liveability. It suits anyone who wants a home to be somewhere to rest and, at the same time, a stage for a little everyday Hollywood splendour.',
      ],
    },
  },
  {
    pl: {
      title: 'Hampton',
      slug: 'hampton',
      text: 'Styl Hampton to esencja nadmorskiego luksusu, w którym elegancja spotyka się z komfortem i beztroskim nastrojem.',
      body: [
        'Styl Hampton to esencja nadmorskiego luksusu, w którym elegancja spotyka się z komfortem i beztroskim nastrojem. Wywodzi się z ekskluzywnych kurortów Long Island, gdzie domy urządzano wokół morskiego klimatu. Wnętrza są spokojne, jasne i przestronne, z wakacyjnym charakterem.',
        'W palecie dominuje biel, uzupełniona błękitami, beżami i naturalnym drewnem. Błękit pojawia się w tkaninach, dodatkach i porcelanie, dzięki czemu całość pozostaje lekka i świeża. Meble są wygodne i praktyczne — duże sofy i fotele w lnie lub bawełnie, obłożone poduszkami i narzutami w stonowanych odcieniach. Drewniane i wiklinowe elementy oraz pojedyncze antyki dodają klasycznej elegancji, nie zamieniając wnętrza w muzeum.',
        'Morskie akcenty — muszle, latarnie, pasiaste koce — niosą wakacyjny charakter. Salon buduje się wokół stref siedzenia, sypialnie pozostają jasne, z wygodnymi łóżkami i lnianą pościelą, a łazienki trzymają klasyczne formy z płytkami w jodełkę. Tarasy i balkony przedłużają wnętrze przez lekkie meble, poduszki i zieleń.',
        'Współczesne odczytanie Hampton dodaje delikatnych akcentów art déco i cieplejszych kolorów — lawendy, musztardowej żółci, czekoladowego brązu — zachowując lekkość. Efektem jest połączenie ponadczasowej elegancji z wygodą: przestrzeń do odpoczynku, luksusu i naturalnej swobody.',
      ],
    },
    en: {
      title: 'Hampton',
      slug: 'hampton',
      text: 'Hampton style is the essence of coastal luxury, where elegance meets comfort and a carefree mood.',
      body: [
        'Hampton style is the essence of coastal luxury, where elegance meets comfort and a carefree mood. It comes from the exclusive resorts of Long Island, where houses were arranged around a maritime climate. The interiors are calm, bright and spacious, with a holiday feeling to them.',
        'White dominates the palette, harmonised with blues, beiges and natural wood. The blues arrive in fabrics, accessories and porcelain, keeping everything light and fresh. Furniture is comfortable and practical — large sofas and armchairs in linen or cotton, layered with cushions and throws in muted shades. Wooden and wicker elements and the occasional antique add classic elegance without turning the room into a museum.',
        'Maritime touches — shells, lanterns, striped blankets — carry the holiday character. The living room is built around seating groups, bedrooms stay pale with comfortable beds and linen bedding, and bathrooms keep classic forms with herringbone tiling. Terraces and balconies extend the interior through light furniture, cushions and greenery.',
        'The contemporary reading of Hampton adds gentle art deco accents and warmer colours — lavender, mustard yellow, chocolate brown — while keeping the lightness intact. The result joins timeless polish with comfort: a space for relaxation, luxury and natural ease.',
      ],
    },
  },
  {
    pl: {
      title: 'Industrialny (loft)',
      slug: 'industrialny',
      text: 'Styl industrialny, nazywany też loftowym, narodził się z adaptacji dawnych przestrzeni fabrycznych w miastach takich jak Nowy Jork czy Berlin.',
      body: [
        'Styl industrialny, nazywany też loftowym, narodził się z adaptacji dawnych przestrzeni fabrycznych w miastach takich jak Nowy Jork czy Berlin. Jego charakter opiera się na surowości i funkcji jednocześnie — odsłonięta cegła, betonowe podłogi, wysokie sufity i metalowe elementy tworzą oszczędną, ale klimatyczną przestrzeń. Loft nie musi być zimny: odpowiednie meble i dodatki dają mu ciepło i osobowość.',
        'Podstawą są proste, solidne meble z drewna, metalu i skóry, zestawione z surowymi powierzchniami. Prowadzą stonowane kolory — szarości, czerń, brązy i biel — z mocniejszymi akcentami dla ruchu. Otwarty układ, duże okna i wysokie sufity przepuszczają światło i powietrze.',
        'W salonie szerokie sofy i stoliki na stalowych nogach wyznaczają strefy funkcjonalne wokół siebie. Industrialna dekoracja — lampy, regały, plakaty, neony — nadaje ton, a dywany, poduszki, rośliny i pojedyncze designerskie obiekty sprawiają, że surowe materiały stają się przyjazne.',
        'Loftowe kuchnie są otwarte, często z wyspą i przemysłowym oświetleniem. Wysokie wnętrza pozwalają na antresolę z sypialnią, biurem czy biblioteką, bez naruszania charakteru dolnej części. Rośliny wnoszą świeżość, a jaśniejsza paleta z kilkoma odsłoniętymi elementami przemysłowymi przenosi tę ideę także do mniejszych mieszkań.',
      ],
    },
    en: {
      title: 'Industrial (loft)',
      slug: 'industrial',
      text: 'Industrial style, also called loft style, emerged from converting former factory spaces in cities like New York or Berlin.',
      body: [
        'Industrial style, also called loft style, emerged from converting former factory spaces in cities such as New York and Berlin. Its character rests on rawness and function together — exposed brick, concrete floors, high ceilings and metal elements make a minimal but atmospheric space. A loft is not a cold place: the right furniture and accessories give it warmth and personality.',
        'The basis is simple, substantial furniture in wood, metal and leather, set against the raw surfaces. Muted colours lead — greys, black, browns and white — with stronger accents for movement. Open plans, large windows and high ceilings let light and air move through.',
        'In the living room, broad sofas and steel-legged tables anchor the functional zones around them. Industrial decoration — lamps, shelving, prints, neon — sets the tone, while rugs, cushions, plants and designer pieces keep the raw materials companionable.',
        'Loft kitchens are open, often with an island and industrial lighting. Tall rooms allow mezzanines for a bedroom, office or library without disturbing the character below. Plants bring freshness, and a lighter palette with a few exposed industrial elements carries the idea into smaller spaces as well.',
      ],
    },
  },
  {
    pl: {
      title: 'Japandi',
      slug: 'japandi',
      text: 'Styl japandi to harmonijne połączenie japońskiej prostoty i nordyckiej przytulności, dające wnętrza spokojne, wyważone i pełne naturalnego piękna.',
      body: [
        'Japandi to harmonijne połączenie japońskiej prostoty i nordyckiej przytulności, dające wnętrza spokojne, wyważone i pełne naturalnego piękna. U jego podstaw leży minimalizm oparty na funkcji, ale pozbawiony chłodu — ciepło drewna, miękkie tkaniny i subtelny detal budują codzienne poczucie spokoju.',
        'Paleta jest neutralna i stonowana: beże, odcienie piasku, złamana biel, ciepła szarość, przydymiona czerń. Te barwy są cichym tłem dla naturalnych materiałów — jasnego i ciemnego drewna, bambusa, ceramiki, kamienia i lnu. Formy są proste, niskie i wizualnie lekkie, a każdy przedmiot ma swoją rolę, dzięki czemu we wnętrzu nie ma przypadkowej dekoracji.',
        'Meble mają miękkie, organiczne linie i powstają z naturalnych materiałów: drewniane stoły i ławy, niskie łóżka, lekkie regały, tkaniny o wyraźnej naturalnej fakturze. Zamiast głośnego ornamentu pojawiają się pojedyncze, świadome akcenty — minimalistyczna ceramika, ręcznie robiony wazon, gałąź, powściągliwa grafika.',
        'Wiele zależy od światła. Lampy z papieru ryżowego, lniane abażury i miękkie oświetlenie budują atmosferę cichego domu. Rośliny pojawiają się oszczędnie, częściej jako jeden wyrazisty okaz niż kolekcja, w nawiązaniu do japońskiej sztuki układania natury.',
        'Japandi sprawdza się zarówno w dużych nowoczesnych wnętrzach, jak i w małych mieszkaniach, bo jego założeniem są funkcja, umiar i równowaga. Pasuje każdemu, kto chce przestrzeni minimalistycznej, ale ciepłej, uporządkowanej, ale nie sterylnej, eleganckiej bez nadmiaru.',
      ],
    },
    en: {
      title: 'Japandi',
      slug: 'japandi',
      text: 'Japandi style is a harmonious combination of Japanese simplicity and Nordic coziness, creating interiors that are calm, balanced, and full of natural beauty.',
      body: [
        'Japandi is a harmonious combination of Japanese simplicity and Nordic cosiness, producing interiors that are calm, balanced and full of natural beauty. At its core is a minimalism built on function but without any coldness — the warmth of wood, soft textiles and subtle detail create an everyday sense of calm.',
        'The palette is neutral and muted: beiges, sand tones, off-white, warm grey, smoked black. Those shades are a quiet background for natural materials — pale and dark wood, bamboo, ceramics, stone and linen. Forms are simple, low and visually light, and every object has a role, which keeps the room free of accidental decoration.',
        'Furniture has soft, organic lines and is made from natural materials: wooden tables and benches, low beds, light shelving, textiles with a pronounced natural texture. Instead of loud ornament there are single deliberate accents — minimal ceramics, a handmade vase, a branch, a restrained print.',
        'Light does a great deal of the work. Rice-paper lamps, linen shades and soft lighting build the atmosphere of a quiet home. Plants appear sparingly, more often as one striking specimen than a collection, echoing the Japanese art of arranging nature.',
        'Japandi works in generous modern interiors and in small flats alike, because its premise is function, moderation and balance. It suits anyone who wants a space that is minimal but warm, ordered but not sterile, elegant without excess.',
      ],
    },
  },
  {
    pl: {
      title: 'Klasyczny',
      slug: 'klasyczny',
      text: 'Styl klasyczny to synonim ponadczasowej elegancji, harmonii i dobrego rzemiosła.',
      body: [
        'Styl klasyczny to synonim ponadczasowej elegancji, harmonii i dobrego rzemiosła. Jego źródłem są europejskie pałace i rezydencje, co widać w dbałości o proporcje, symetrię i jakość wykonania. Prowadzą jasne, stonowane kolory — kremy, beże, złamane biele i ciepłe szarości — przełamane głębokimi akcentami granatu, bordo czy butelkowej zieleni.',
        'Meble są solidne, masywne i bogato wykończone. Drewniane komody, witryny, konsole i stoliki mają profile, snycerkę i dekoracyjne uchwyty, a tapicerowane sofy i fotele zachowują miękkie, zaokrąglone formy. Aksamit, żakard i dobry len dodają dostojeństwa, podobnie jak marmur, naturalne drewno, kryształ i porcelana.',
        'Detal architektoniczny jest tu rozpoznawalnym znakiem: sztukateria na ścianach i sufitach, listwy przypodłogowe, eleganckie ramy luster i klasyczne boazerie. Podłogi to zwykle drewniany parkiet, często w jodełkę, co podkreśla ciepło i tradycyjny charakter wnętrz.',
        'Dekoracja jest dobierana oszczędnie, ale z dużą uwagą na jakość. Obrazy w złoconych ramach, porcelanowe wazony, kryształowe świeczniki, antyki, długie zasłony z ciężkiej tkaniny i lampy z abażurami dopełniają kompozycję, która nie potrzebuje ostentacji, żeby robić wrażenie.',
        'Sprawdza się w przestronnym salonie z kominkiem, reprezentacyjnej jadalni wokół solidnego stołu, sypialni z tapicerowanym łóżkiem czy gabinecie wyłożonym książkami — we wnętrzach, które nie wychodzą z mody i z wiekiem stają się tylko dostojniejsze.',
      ],
    },
    en: {
      title: 'Classic',
      slug: 'classic',
      text: 'Classic style is synonymous with timeless elegance, harmony, and fine craftsmanship.',
      body: [
        'Classic style is synonymous with timeless elegance, harmony and fine craftsmanship. Its sources are European palaces and residences, which shows in the care given to proportion, symmetry and quality of execution. Light muted colours lead — creams, beiges, off-whites and warm greys — broken by deep accents of navy, burgundy or bottle green.',
        'The furniture is substantial, solid and richly finished. Wooden chests, display cabinets, consoles and side tables carry mouldings, carving and decorative handles, while upholstered sofas and armchairs keep soft, rounded forms. Velvet, jacquard and good linen add dignity, as do marble, natural wood, crystal and porcelain.',
        'Architectural detail is the giveaway: stucco on walls and ceilings, skirting, elegant mirror frames and classic panelling. Floors are usually wooden parquet, often herringbone, which underlines the warmth and traditional character of the rooms.',
        'Decoration is chosen sparingly but with great attention to quality. Paintings in gilded frames, porcelain vases, crystal candlesticks, antiques, tall curtains in heavy fabric and lamps with shades complete a composition that does not need ostentation to impress.',
        'It suits a spacious living room with a fireplace, a formal dining room around a substantial table, a bedroom with an upholstered bed, a study lined with books — interiors that never go out of fashion and grow more distinguished with age.',
      ],
    },
  },
  {
    pl: {
      title: 'Minimalistyczny',
      slug: 'minimalistyczny',
      text: 'Styl minimalistyczny to esencja prostoty, harmonii i funkcjonalności.',
      body: [
        'Styl minimalistyczny to esencja prostoty, harmonii i funkcji. Inspirowany filozofią zen i japońską estetyką, redukuje nadmiar i zostawia tylko to, co potrzebne i co ma swoje zadanie. Efektem jest wnętrze uporządkowane, przestronne i spokojne, w którym każdy detal ma znaczenie, bo nic z nim nie konkuruje.',
        'Centralne miejsce zajmują proste, geometryczne meble bez zbędnego ornamentu, wykonane z dobrych materiałów — drewna, kamienia, lnu, bawełny, skóry. Paleta jest stonowana: biel, szarości i beże, czasem podbite subtelnym akcentem, który nadaje wnętrzu elegancji i charakteru. Minimalizm dopuszcza dodatki, ale wyłącznie starannie wybrane, żeby równowaga się utrzymała.',
        'Decydującą rolę odgrywa światło — zarówno dzienne, jak i proste, dobrze dobrane lampy, które wydobywają głębię przestrzeni. W salonie sofa i stolik wyznaczają strefy funkcjonalne, a przestrzeń wokół nich pozostaje otwarta. Kuchnia i sypialnia idą tą samą zasadą prostoty i wygody: blaty są puste, a meble i dodatki zachowują oszczędną, ponadczasową formę.',
      ],
    },
    en: {
      title: 'Minimalist',
      slug: 'minimalist',
      text: 'Minimalist style is the essence of simplicity, harmony, and functionality.',
      body: [
        'Minimalist style is the essence of simplicity, harmony and function. Inspired by zen philosophy and Japanese aesthetics, it reduces excess and keeps only what is needed and does a job. The result is ordered, spacious and calm, and every detail carries weight because there is nothing competing with it.',
        'Simple geometric furniture without superfluous ornament takes the central place, made from good materials — wood, stone, linen, cotton, leather. The palette is muted: white, greys and beiges, occasionally lifted by a subtle accent that gives the room elegance and character. Minimalism allows accessories, but only carefully selected ones, so the balance holds.',
        'Light plays a decisive role, both daylight and simple, well-chosen lamps that draw out the depth of the space. In the living room a sofa and table anchor the functional zones while the space around them stays open. The kitchen and bedroom follow the same rule of simplicity and comfort: worktops stay clear, and furniture and accessories keep a spare, timeless form.',
      ],
    },
  },
  {
    pl: {
      title: 'Modern Classic',
      slug: 'modern-classic',
      text: 'Modern classic to elegancka mieszanka elementów klasycznych i współczesnych, dająca wnętrza luksusowe, przytulne i funkcjonalne.',
      body: [
        'Modern classic to elegancka mieszanka elementów klasycznych i współczesnych, dająca wnętrza luksusowe, wygodne i praktyczne. Opiera się na jasnej, stonowanej palecie — bieli, beżach, szarościach — uzupełnionej wyrafinowanymi akcentami granatu, bordo czy butelkowej zieleni, które dają przestrzeni spokój i ponadczasowy charakter.',
        'Te wnętrza celebrują dobre materiały: aksamit, welur, boucle, marmur, drewno i metal. Meble nawiązują do klasycznych form odczytanych na nowo — zaokrąglone kontury, subtelne detale, eleganckie proporcje i wygodne siedziska sprawiają, że przestrzeń jest zarazem stylowa i łatwa w życiu. Sofy, fotele, komody i konsole łączą funkcję z luksusem, a designerskie lampy, żyrandole i dodatki dodają świeżości.',
        'Charakter buduje detal dekoracyjny: sztukateria, parkiet w jodełkę, lustra w bogato zdobionych ramach, zasłony z ciężkiej, miękkiej tkaniny, porcelana i kryształy za szkłem. Nowoczesne udogodnienia wchodzą po cichu — ukryta elektronika, praktyczne schowki, designerski akcent — nie naruszając lekkości wnętrza.',
        'Styl sprawdza się wszędzie: wygodna sofa i elegancki stolik w salonie, luksusowe łóżko z pikowanym wezgłowiem w sypialni, klasyczna zabudowa z nowoczesnym sprzętem w kuchni. Tradycja i współczesna estetyka współistnieją, dając wnętrza eleganckie, ciepłe i cicho rozświetlone.',
      ],
    },
    en: {
      title: 'Modern Classic',
      slug: 'modern-classic',
      text: 'Modern Classic is an elegant blend of classic and contemporary elements, creating interiors that are luxurious, cozy, and functional.',
      body: [
        'Modern classic is an elegant blend of classic and contemporary elements, producing interiors that are luxurious, comfortable and practical. It builds on a light muted palette — whites, beiges, greys — completed by refined accents of navy, burgundy or bottle green, which give the space calm and a timeless character.',
        'These interiors celebrate good materials: velvet, velour, bouclé, marble, wood and metal. The furniture refers to classic forms reinterpreted in a modern spirit — rounded contours, subtle detailing, elegant proportions and comfortable seating make the space both stylish and easy to live in. Sofas, armchairs, sideboards and consoles combine function with luxury, while designer lamps, chandeliers and accessories add freshness.',
        'Decorative detail sets the character: stucco, herringbone parquet, mirrors in richly decorated frames, curtains in heavy soft fabric, porcelain and crystal behind glass. Modern conveniences enter quietly — concealed electronics, practical storage, a designer accent — without disturbing the lightness of the room.',
        'The style works everywhere: a comfortable sofa and elegant table in the living room, a luxurious bed with a quilted headboard in the bedroom, classic cabinetry with modern appliances in the kitchen. Tradition and contemporary aesthetics sit together, giving interiors that are elegant, warm and quietly bright.',
      ],
    },
  },
  {
    pl: {
      title: 'Mid Century Modern',
      slug: 'mid-century-modern',
      text: 'Styl mid-century modern to elegancja i funkcjonalność zakorzenione w połowie XX wieku, zwłaszcza w latach 50.',
      body: [
        'Mid-century modern to elegancja i funkcja zakorzenione w połowie XX wieku, zwłaszcza w latach 50. Wnętrza są jasne i otwarte, a proste formy łączą praktyczność z ponadczasowym językiem projektowym. Duże okna wpuszczają światło dzienne, a łagodne przejścia między pomieszczeniami wzmacniają wrażenie przestrzeni.',
        'Meble są charakterystyczne: proste, geometryczne bryły z drewna, skóry i metalu. Designerskie formy, od zaokrąglonych sof po pomysłowe krzesła, dają wnętrzu lekkość i osobowość. Kolory pozostają stonowane, z subtelnymi akcentami — ciepłym drewnem, zielenią, musztardową żółcią czy pomarańczem — które przywołują epokę powojenną.',
        'Materiały takie jak drewno, kamień, skóra i metal budują przestrzeń jednocześnie wygodną i nowoczesną. Każdy element jest funkcjonalny, a dekoracja ogranicza się do starannie wybranych detali wzmacniających charakter wnętrza.',
        'Styl sprawdza się w salonach, sypialniach i gabinetach, gdzie designerskie meble, harmonijna paleta i naturalne materiały dają efekt elegancki, ciepły i praktyczny — ponadczasową alternatywę dla surowego minimalizmu czy industrialnych aranżacji, zachowującą ducha lat 50. i 60. obok świeżej, współczesnej estetyki.',
      ],
    },
    en: {
      title: 'Mid Century Modern',
      slug: 'mid-century-modern',
      text: 'Mid-Century Modern style is elegance and functionality rooted in the mid-20th century, especially the 1950s.',
      body: [
        'Mid-century modern is elegance and function rooted in the middle of the twentieth century, particularly the 1950s. The interiors are light and open, with simple forms that join practicality to a timeless design language. Large windows let daylight in, and easy transitions between rooms reinforce the sense of space.',
        'The furniture is characteristic: simple geometric shapes in wood, leather and metal. Designer forms, from rounded sofas to inventive chairs, give a room lightness and personality. Colours stay muted, with subtle accents — warm wood, green, mustard yellow or orange — that recall the post-war era.',
        'Materials such as wood, stone, leather and metal make a space that is comfortable and modern at once. Every piece is functional, and decoration is limited to carefully chosen details that reinforce the character of the room.',
        'It suits living rooms, bedrooms and studies alike, where designer furniture, a harmonious palette and natural materials produce something elegant, warm and workable — a timeless alternative to austere minimalism or industrial schemes that keeps the spirit of the fifties and sixties alongside a fresh contemporary aesthetic.',
      ],
    },
  },
  {
    pl: {
      title: 'Modern Retro',
      slug: 'modern-retro',
      text: 'Modern retro to wyważone połączenie współczesnej funkcjonalności i odważnej estetyki minionych dekad — głównie lat 50., 60. i 70.',
      body: [
        'Modern retro to wyważone połączenie współczesnej funkcji i odważnej estetyki minionych dekad, głównie lat 50., 60. i 70. Sięga po rozpoznawalne retro formy — zaokrąglone sofy, smukłe fotele na toczonych nogach, niskie komody, designerskie lampy — i zestawia je z prostotą nowoczesnej aranżacji. Przestrzeń pozostaje świeża i praktyczna, zyskując wyrazistą, nostalgiczną atmosferę.',
        'Paleta łączy stonowaną bazę bieli, beżu i szarości z mocniejszymi, energetycznymi akcentami. Musztardowa żółć, butelkowa zieleń, turkus, terakota czy pudrowy róż pojawiają się na tapicerce, poduszkach lub detalach, dając wnętrzu ruch i pogodny charakter. Wzory geometryczne i inspirowane epoką — pasy, romby, stylizowane motywy roślinne — stosuje się oszczędnie, żeby czytały się jako akcent, a nie motyw przewodni.',
        'Materiały łączą naturalność z nutą elegancji: drewno w ciepłych tonach, welur, aksamit, skóra oraz wykończenia w złocie i mosiądzu. Meble zachowują lekką formę z wymownymi detalami — zaokrąglonymi kształtami, cienkimi nogami, profilowanymi oparciami — obok współczesnych rozwiązań, takich jak gładkie blaty, płaskie fronty i minimalistyczne dodatki utrzymujące porządek. Ważne jest oświetlenie: kuliste klosze, geometryczne oprawy czy nawiązania do ikonicznych projektów połowy wieku budują nastrój.',
        'Sprawdza się szczególnie w salonach, gdzie designerska sofa albo fotel uszak staje się centrum aranżacji; w sypialniach dzięki miękkim tkaninom i ciepłym kolorom; oraz w kuchniach, z pastelowymi frontami, zaokrąglonym sprzętem i detalami z dawnych wzorników. Efekt jest ciepły, pogodny i pełen osobowości, a nostalgia spotyka się z wygodą współczesnego życia.',
      ],
    },
    en: {
      title: 'Modern Retro',
      slug: 'modern-retro',
      text: 'Modern retro is a balanced combination of modern functionality and the bold aesthetics of past decades — mainly the 1950s, 60s, and 70s.',
      body: [
        'Modern retro is a balanced combination of contemporary function and the bold aesthetics of past decades, chiefly the 1950s, 60s and 70s. It draws on recognisable retro forms — rounded sofas, slim armchairs on turned legs, low sideboards, designer lamps — and sets them against the plainness of modern arrangement. The space stays fresh and practical while gaining a distinct, nostalgic atmosphere.',
        'The palette pairs a muted base of white, beige and grey with stronger, energetic accents. Mustard yellow, bottle green, turquoise, terracotta or powder pink appear on upholstery, cushions or decorative details, giving the room movement and a cheerful character. Geometric and period-inspired patterns — stripes, diamonds, stylised botanicals — are used sparingly, so they read as an accent rather than a theme.',
        'Materials combine the natural with a note of elegance: warm-toned wood, velour, velvet, leather, and gold or brass finishes. Furniture keeps a light form with telling details — rounded shapes, thin legs, profiled backs — next to contemporary solutions such as plain worktops, smooth cabinet fronts and minimal accessories that keep the room orderly. Lighting matters: globe shades, geometric fittings or references to iconic mid-century designs build the mood.',
        'It works particularly well in living rooms, where a designer sofa or a wing chair becomes the centre of the arrangement; in bedrooms, through soft fabrics and warm colours; and in kitchens, with pastel fronts, rounded appliances and details borrowed from older pattern books. The result is warm, cheerful and full of personality, where nostalgia meets the comfort of contemporary life.',
      ],
    },
  },
  {
    pl: {
      title: 'Postmodernistyczny',
      slug: 'postmodernistyczny',
      text: 'Styl postmodernistyczny we wnętrzach to twórcza gra formą, kolorem i ironią, łamiąca sztywne reguły modernizmu.',
      body: [
        'Styl postmodernistyczny we wnętrzach to twórcza gra formą, kolorem i ironią, łamiąca sztywne reguły modernizmu. Pozornie niepasujące do siebie elementy zestawia się tak, żeby powstała przestrzeń pełna energii, humoru i artystycznego wyrazu. Postmodernizm odrzuca minimalizm na rzecz eklektycznych połączeń, kontrastu i odważnych decyzji.',
        'Paleta jest różnorodna i dobitna: nasycone czerwienie, turkus i pomarańcz obok pasteli i stonowanych beży, które równoważą całość. Kolor podkreśla geometryczne i organiczne meble, często przypominające rzeźby — łuki, asymetrię, nietypowe proporcje, pomysłowy detal. Przedmioty traktuje się jednocześnie jako użytkowe i dekoracyjne, nadając im niemal symboliczny charakter.',
        'Materiały łączy się z nerwem: beton z marmurem, stal z kolorowym lakierem, matowe powierzchnie z błyszczącą tkaniną. Ta różnorodność tworzy głębię i warstwowość, jednocześnie wprost pokazując estetyczną swobodę stylu. Dekoracja jest tu kluczowa — grafiki inspirowane pop-artem, rzeźby, nietypowe lustra i lampy o artystycznych formach stają się punktami centralnymi.',
        'Postmodernizm pasuje do salonów, jadalni i gabinetów, gdzie designerski fotel, eklektyczna komoda albo geometryczna lampa potrafią zdefiniować całą aranżację. Wnosi lekkość, przekorę i indywidualność — styl wyrazisty i świadomie skonstruowany, dla każdego, kto lubi łamać schemat.',
      ],
    },
    en: {
      title: 'Postmodern',
      slug: 'postmodern',
      text: 'Postmodern style in interiors is a creative play with form, colour, and irony that breaks the rigid rules of modernism.',
      body: [
        'Postmodern style in interiors is a creative play with form, colour and irony that breaks the rigid rules of modernism. Apparently mismatched elements are brought together to make a space full of energy, humour and artistic expression. Postmodernism rejects minimalism in favour of eclectic combinations, contrast and bold decisions.',
        'The palette is varied and emphatic: saturated reds, turquoise and orange next to pastels and muted beiges that balance the whole. Colour underlines geometric and organic furniture that often resembles sculpture — arcs, asymmetry, unusual proportions, inventive detail. Objects are treated as useful and decorative at once, and given an almost symbolic character.',
        'Materials are mixed with nerve: concrete against marble, steel against coloured lacquer, matte surfaces against glossy fabric. That variety creates depth and layering while making the aesthetic freedom of the style explicit. Decoration is central — pop-art-inspired prints, sculpture, unusual mirrors and lamps in artistic forms become the focal points.',
        'Postmodern belongs in living rooms, dining rooms and studies, where a designer armchair, an eclectic chest or a geometric lamp can define the entire arrangement. It brings lightness, playfulness and individuality — a style that is expressive and deliberately constructed, for anyone who enjoys breaking the pattern.',
      ],
    },
  },
  {
    pl: {
      title: 'Rustykalny',
      slug: 'rustykalny',
      text: 'Styl rustykalny wnosi do współczesnych wnętrz sielski, wiejski urok i podkreśla bliskość natury.',
      body: [
        'Styl rustykalny wnosi do współczesnych wnętrz sielski, wiejski urok i podkreśla bliskość natury. Prowadzą naturalne materiały — drewno, kamień, len i bawełna — a meble często zostawia się lekko postarzone, z widocznym słojem i sękami, co daje wnętrzu autentyczny, przyjazny charakter. Nastrój budują proste formy, funkcja i nierówna faktura.',
        'Paleta jest jasna i neutralna: biel, krem, beże i ciepłe tony drewna tworzą bazę, uzupełnioną subtelnymi akcentami pastelowego błękitu, limonkowej zieleni czy żółci. Rustykalne wnętrza są wygodne — miękkie tkaniny, narzuty, poduszki, dywany z juty i wiklinowe kosze budują przyjazny, rodzinny klimat.',
        'Styl pasuje do każdego pomieszczenia. W salonie prowadzą drewniane meble, kominek i klasyczna sofa, a obok nich rattanowe krzesło albo lustro w drewnianej ramie. Sypialnia daje spokój, a kuchnia i jadalnia zyskują charakter dzięki drewnianym stołom, porcelanie i praktycznym dodatkom. Tradycja i nowoczesność współistnieją: antyki obok współczesnego sprzętu, klasyczne wzory obok prostych form.',
        'Efektem jest harmonijna przestrzeń pełna naturalnych materiałów, spokojnego koloru i prostoty, łącząca funkcję z ciepłem — dom, w którym łatwo odpocząć.',
      ],
    },
    en: {
      title: 'Rustic',
      slug: 'rustic',
      text: 'Rustic style brings a pastoral, countryside charm into modern interiors, emphasizing closeness to nature.',
      body: [
        'Rustic style brings a pastoral, countryside charm into contemporary interiors, emphasising closeness to nature. Natural materials lead — wood, stone, linen and cotton — and furniture is often left lightly aged, with the grain and knots visible, which gives a room its authentic, welcoming character. Simple forms, function and uneven texture make the atmosphere.',
        'The palette is light and neutral: white, cream, beiges and warm wood tones form the base, completed by subtle accents such as pastel blue, lime green or yellow. Rustic interiors are comfortable — soft textiles, throws, cushions, jute rugs and wicker baskets create a friendly, family climate.',
        'It suits every room. The living room is led by wooden furniture, a fireplace and a classic sofa, with a rattan chair or a wood-framed mirror alongside. The bedroom offers calm, while the kitchen and dining room gain character from wooden tables, porcelain and practical accessories. Tradition and modernity coexist: antiques next to modern appliances, classic patterns next to simple forms.',
        'The result is a harmonious space full of natural materials, quiet colour and simplicity, combining function with warmth — a home that is easy to rest in.',
      ],
    },
  },
]

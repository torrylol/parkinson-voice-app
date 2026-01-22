export const categories = [
  {
    slug: 'innstillinger',
    title: 'Innstillinger på enheten',
    description: 'Tilgjengelighetsfunksjoner innebygd i telefon og PC',
    icon: '⚙️',
    subcategories: ['iphone', 'android', 'windows', 'mac']
  },
  {
    slug: 'apper',
    title: 'Apper og programvare',
    description: 'Nyttige apper for tastatur, tale og mer',
    icon: '📱',
    subcategories: ['tastatur', 'tale', 'tremor-sporing', 'medisin']
  },
  {
    slug: 'nettleser',
    title: 'Nettlesertillegg',
    description: 'Utvidelser som gjør nettlesing enklere',
    icon: '🌐',
    subcategories: []
  },
  {
    slug: 'smarthjem',
    title: 'Smarthjem og stemmeassistenter',
    description: 'Styr hjemmet ditt med stemmen',
    icon: '🏠',
    subcategories: []
  },
  {
    slug: 'tips',
    title: 'Praktiske tips',
    description: 'Råd for passord, skriving og mer',
    icon: '💡',
    subcategories: ['passord', 'skriving', 'mus', 'alternativer']
  },
  {
    slug: 'vare-verktoy',
    title: 'Våre verktøy',
    description: 'Verktøy vi har laget for deg',
    icon: '🛠️',
    subcategories: []
  }
]

export const resources = [
  // Innstillinger - iPhone
  {
    slug: 'iphone-tilgjengelighet',
    category: 'innstillinger',
    subcategory: 'iphone',
    title: 'iPhone tilgjengelighetsinnstillinger',
    description: 'Slik tilpasser du iPhone for enklere bruk med Parkinson',
    forCaregivers: false,
    content: `
## Berøringsinnstillinger (Touch Accommodations)

Gå til **Innstillinger > Tilgjengelighet > Berøring > Berøringsinnstillinger**

### Hold-varighet
Øk tiden skjermen må holdes før den reagerer. Dette hjelper mot utilsiktede trykk fra tremor.

### Ignorer gjentakelser
Sett telefonen til å ignorere flere raske trykk på samme sted.

### Slå av "Rist for å angre"
Hvis tremor får telefonen til å angre handlinger, slå av denne funksjonen under Tilgjengelighet > Berøring.

## Stemmekontroll

Gå til **Innstillinger > Tilgjengelighet > Stemmekontroll**

Styr telefonen helt med stemmen din. Si kommandoer som:
- "Åpne Safari"
- "Bla ned"
- "Trykk på [knappnavn]"

## Assistive Access

Gå til **Innstillinger > Tilgjengelighet > Assistive Access**

En forenklet versjon av iOS med store knapper og færre valg. Perfekt for de som synes vanlig iOS er overveldende.
    `
  },
  {
    slug: 'android-tilgjengelighet',
    category: 'innstillinger',
    subcategory: 'android',
    title: 'Android tilgjengelighetsinnstillinger',
    description: 'Slik tilpasser du Android for enklere bruk',
    forCaregivers: false,
    content: `
## Berøringsinnstillinger

Gå til **Innstillinger > Tilgjengelighet > Interaksjon og fingerferdighet**

### Berøring og hold-forsinkelse
Velg hvor lenge du må holde fingeren på skjermen før den reagerer. Velg "Lang" for å unngå utilsiktede trykk.

### Ignorer gjentatte berøringer
Hjelper mot flere utilsiktede trykk fra tremor.

## Tastaturinnstillinger

### Langsomme taster (Slow Keys)
Velg hvor lenge en tast må holdes før den registreres.

### Sprett-taster (Bounce Keys)
Ignorerer raske gjentatte tastetrykk.

## Stemmekontroll

Si "Hey Google" eller "OK Google" for å styre telefonen med stemmen.
    `
  },
  {
    slug: 'windows-tilgjengelighet',
    category: 'innstillinger',
    subcategory: 'windows',
    title: 'Windows tilgjengelighetsinnstillinger',
    description: 'Slik tilpasser du Windows PC for enklere bruk',
    forCaregivers: false,
    content: `
## Tastaturinnstillinger

Gå til **Innstillinger > Tilgjengelighet > Tastatur**

### Filtertaster
- **Sprett-taster**: Ignorerer raske gjentatte tastetrykk
- **Langsomme taster**: Setter forsinkelse før tastetrykk registreres

## Musinnstillinger

Gå til **Innstillinger > Enheter > Mus**

- Reduser musehastighet for bedre kontroll
- Gjør markøren større og mer synlig

## Talegjenkjenning

Gå til **Innstillinger > Tid og språk > Tale**

Windows har innebygd talegjenkjenning som lar deg diktere tekst og styre datamaskinen.
    `
  },
  {
    slug: 'mac-tilgjengelighet',
    category: 'innstillinger',
    subcategory: 'mac',
    title: 'Mac tilgjengelighetsinnstillinger',
    description: 'Slik tilpasser du Mac for enklere bruk',
    forCaregivers: false,
    content: `
## Tastaturinnstillinger

Gå til **Systemvalg > Tilgjengelighet > Tastatur**

### Langsomme taster
Aktiverer forsinkelse før tastetrykk registreres.

## Markørinnstillinger

Gå til **Systemvalg > Tilgjengelighet > Markørkontroll**

### Dvele-klikk
Klikker automatisk hvis markøren holdes på samme sted i en viss tid. Perfekt for de som synes det er vanskelig å klikke.

### Musehastighet
Reduser hastigheten for bedre kontroll.

## Stemmekontroll

Gå til **Systemvalg > Tilgjengelighet > Stemmekontroll**

Styr Mac-en helt med stemmen din.
    `
  },

  // Apper
  {
    slug: 'tastatur-apper',
    category: 'apper',
    subcategory: 'tastatur',
    title: 'Tastatur-apper for tremor',
    description: 'Apper med store taster og smart tilpasning',
    forCaregivers: false,
    content: `
## ParkinsonKey

**Plattform:** iOS og Android

Et tastatur laget spesielt for personer med Parkinson. Store taster og smart tilpasning til din skrivemåte.

## Store fysiske tastaturer

For datamaskiner kan store tastaturer gjøre skrivingen mye enklere:

- **BigBlu Kinderboard**: Taster på 2,5 cm
- **VisionBoard Large Key**: Trådløst tastatur med store taster

Spør hjelpemiddelsentralen om du kan få støtte til innkjøp.
    `
  },
  {
    slug: 'tale-apper',
    category: 'apper',
    subcategory: 'tale',
    title: 'Apper for tale og kommunikasjon',
    description: 'Verktøy når stemmen er svak eller uklar',
    forCaregivers: false,
    content: `
## SpeechVive

En enhet designet spesielt for Parkinson. Hjelper deg automatisk å snakke høyere, langsommere og tydeligere.

## Speak Up For Parkinson's

**Plattform:** iOS

Treningsapp for stemmen. Øvelser som hjelper deg å opprettholde taleklarhet og volum.

## Bærbar stemmeforsterker

En liten enhet du kan ha i lommen som forsterker stemmen din. Nyttig i støyende omgivelser eller når stemmen er svak.
    `
  },
  {
    slug: 'tremor-sporing-apper',
    category: 'apper',
    subcategory: 'tremor-sporing',
    title: 'Apper for tremor-sporing',
    description: 'Hold oversikt over symptomer over tid',
    forCaregivers: false,
    content: `
## StudyMyTremor

**Plattform:** iOS

Bruker telefonens sensorer til å måle tremor. Registrerer frekvens, kraft og amplitude. Nyttig for å se endringer over tid og dele med legen.

## Lift Pulse

**Plattform:** iOS og Android

En enkel app som måler tremorens styrke med telefonens innebygde sensorer.

## Strive PD

**Plattform:** iOS

**Gratis** og FDA-godkjent. Samler data om tremor og dyskinesi automatisk gjennom dagen.
    `
  },
  {
    slug: 'medisin-apper',
    category: 'apper',
    subcategory: 'medisin',
    title: 'Apper for medisinpåminnelser',
    description: 'Aldri glem en dose igjen',
    forCaregivers: true,
    content: `
## Neptune Care

Kobler til en Garmin smartwatch for automatisk symptomsporing. Inkluderer medisinpåminnelser og AI-innsikt.

## Parkinson's ON

**Plattform:** iOS og Android (fra Parkinson's UK)

- Medisinpåminnelser
- Symptomsporing
- Trenings- og søvnlogg
- Humørdagbok

## Tips for pårørende

Du kan sette opp påminnelser på personens telefon og få varsler selv hvis en dose blir glemt. Snakk med legen om hvordan dere best kan organisere medisinrutinene.
    `
  },

  // Nettlesertillegg
  {
    slug: 'nettleser-tillegg',
    category: 'nettleser',
    subcategory: null,
    title: 'Nettlesertillegg for enklere surfing',
    description: 'Utvidelser som hjelper med tremor og lesing',
    forCaregivers: false,
    content: `
## Staybl Browser

En spesialisert nettleser som kompenserer for tremor i sanntid. Bruker virtuelle motbevegelser for å stabilisere det du ser på skjermen.

**Funksjoner:**
- Tremor-kompensasjon
- Høykontrastdesign
- Lesbar skrifttype
- Brukervennlige innstillinger

**Nettside:** staybl.app

## SteadyMouse

Programvare for Windows som stabiliserer musemarkøren og låser den på mål. Gjør det mulig å bruke datamaskinen når tremor gjør normal musekontroll vanskelig.

**Nettside:** steadymouse.com
    `
  },

  // Smarthjem
  {
    slug: 'smarthjem-stemmeassistenter',
    category: 'smarthjem',
    subcategory: null,
    title: 'Smarthjem og stemmeassistenter',
    description: 'Styr hjemmet med stemmen',
    forCaregivers: true,
    content: `
## Hvorfor stemmeassistenter hjelper

- **Styr hjemmet med stemmen**: Lys, varme, dører - uten å bruke hendene
- **Taletrening**: Å snakke med assistenten kan være god øvelse for å opprettholde taleklarhet

## Amazon Alexa

Si "Alexa, slå på lyset" eller "Alexa, hva er klokka?". Kan kobles til smarte lyspærer, termostater og mer.

## Google Home / Google Assistant

Si "Hey Google" for å starte. Fungerer godt med Google-produkter og mange smarthjem-enheter.

## Apple Siri

Innebygd i iPhone, iPad og Mac. Si "Hei Siri" for å aktivere.

## Tips for pårørende

Sett opp smarthjem-enheter slik at personen med Parkinson kan:
- Slå av og på lys uten å reise seg
- Ringe til familiemedlemmer med stemmekommando
- Sette påminnelser og alarmer
    `
  },

  // Praktiske tips
  {
    slug: 'passord-tips',
    category: 'tips',
    subcategory: 'passord',
    title: 'Passord og innlogging med tremor',
    description: 'Slik unngår du frustrasjon med passord',
    forCaregivers: true,
    content: `
## Biometrisk pålogging

Den beste løsningen er å bruke biometrisk pålogging:
- **Fingeravtrykk** (Touch ID på iPhone, fingeravtrykkleser på Android/PC)
- **Ansiktsgjenkjenning** (Face ID på iPhone, Windows Hello)

Slik slipper du å taste inn passord med tremor.

## Passordbehandlere

Apper som husker alle passordene dine:
- **LastPass**
- **1Password**
- **Bitwarden** (gratis)

Du logger inn med fingeravtrykk eller ansikt, og appen fyller ut passordet automatisk.

## Tips for pårørende

Hjelp til med å sette opp:
1. Biometrisk pålogging på alle enheter
2. En passordbehandler
3. Enkle PIN-koder der biometri ikke fungerer

Skriv ned viktige passord på et trygt sted i tilfelle noe går galt.
    `
  },
  {
    slug: 'skriving-tips',
    category: 'tips',
    subcategory: 'skriving',
    title: 'Tips for skriving med tremor',
    description: 'Gjør tastaturbruk enklere',
    forCaregivers: false,
    content: `
## Aktiver hjelpefunksjoner

### Langsomme taster (Slow Keys)
Setter en forsinkelse før tastetrykk registreres. Gir deg tid til å løfte fingeren fra feil tast.

### Sprett-taster (Bounce Keys)
Ignorerer raske gjentatte tastetrykk. Perfekt mot utilsiktet dobbelttrykk.

## Store tastaturer

Fysiske tastaturer med større taster gjør skrivingen enklere. Se etter tastaturer med taster på minst 2 cm.

## Dvele-klikk

Programvare som klikker automatisk når markøren holdes stille. Tilgjengelig på:
- **Windows**: Dwell Clicker 2
- **Mac**: Innebygd i Tilgjengelighet

## Bruk tale-til-tekst

Vår Tale-app lar deg diktere tekst med stemmen. Perfekt når tastaturet blir for vanskelig.
    `
  },
  {
    slug: 'mus-tips',
    category: 'tips',
    subcategory: 'mus',
    title: 'Tips for musekontroll',
    description: 'Alternativer og innstillinger for enklere bruk',
    forCaregivers: false,
    content: `
## Reduser musehastighet

Gå til datamaskinens innstillinger og reduser musehastigheten. Dette gir deg mer kontroll.

## Trackball-mus

En trackball-mus lar deg styre markøren med en ball i stedet for å flytte hele musen. Krever mindre presise bevegelser.

**Anbefalte modeller:**
- Logitech ERGO M575
- Kensington Expert Mouse

## SteadyMouse (Windows)

Programvare som stabiliserer musemarkøren og kompenserer for tremor. Last ned fra steadymouse.com.

## Stor markør

Gjør markøren større og lettere å se:
- **Windows**: Innstillinger > Tilgjengelighet > Musepeker
- **Mac**: Systemvalg > Tilgjengelighet > Skjerm > Markør
    `
  },
  {
    slug: 'alternativer-mus-tastatur',
    category: 'tips',
    subcategory: 'alternativer',
    title: 'Alternativer til mus og tastatur',
    description: 'Når vanlig utstyr ikke fungerer',
    forCaregivers: true,
    content: `
## Øyestyring (Eye Tracking)

Styr markøren med øynene. Kameraer følger blikket ditt og flytter markøren dit du ser.

**Merk:** Kan være slitsomt ved langvarig bruk.

## Hodestyring (Head Tracking)

Styr markøren ved å bevege hodet. Mindre presist enn øyestyring, men mindre slitsomt.

## Bryterkontroll (Switch Access)

Bruk en eller flere store knapper/brytere til å styre enheten. Markøren skanner over skjermen og du trykker for å velge.

## Stemmekommandoer

Både Windows, Mac, iPhone og Android har innebygd stemmekontroll. Se våre guider under "Innstillinger på enheten".

## Kontakt hjelpemiddelsentralen

Hjelpemiddelsentralen kan:
- Evaluere dine behov
- Låne ut utstyr til utprøving
- Gi opplæring
- Søke om støtte til innkjøp

Ring hjelpemiddelsentralen i ditt fylke for en vurdering.
    `
  },

  // Våre verktøy
  {
    slug: 'tale-appen',
    category: 'vare-verktoy',
    subcategory: null,
    title: 'Tale-appen',
    description: 'Vår app for tale-til-tekst',
    forCaregivers: false,
    content: `
## Hva er Tale-appen?

En app vi har laget spesielt for personer med Parkinson. Snakk inn i mikrofonen, og appen skriver det du sier.

## Hvordan bruke den

1. **Trykk og hold** den store grønne knappen
2. **Snakk** det du vil skrive
3. **Slipp** knappen når du er ferdig

Appen forstår norsk og håndterer svak eller uklar tale bedre enn vanlige tale-til-tekst-løsninger.

## Stemmekommandoer

Slå på "Kommando-modus" for å bruke stemmen til å redigere teksten:
- "Slett siste ord"
- "Ny linje"
- "Punktum"
- "Fiks tekst" (retter grammatikk automatisk)

## Prøv det nå

Gå til Tale-appen fra hovedmenyen eller forsiden.
    `
  }
]

// Helper function to get resources by category
export function getResourcesByCategory(categorySlug) {
  return resources.filter(r => r.category === categorySlug)
}

// Helper function to get a single resource
export function getResource(slug) {
  return resources.find(r => r.slug === slug)
}

// Helper function to get category info
export function getCategory(slug) {
  return categories.find(c => c.slug === slug)
}

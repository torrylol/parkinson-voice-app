# Parkinson Tale-app

En tilgjengelig tale-til-tekst web-app designet spesielt for personer med Parkinsons sykdom. Appen støtter norsk tale og talekommandoer for enkel tekstredigering.

## Funksjoner

### Tale-til-tekst
- Hold inne opptaksknappen for å ta opp tale
- Automatisk transkribering med OpenAI Whisper (norsk språk)
- Teksten legges til i tekstfeltet

### Kommando-modus
- Slå på kommando-modus med toggle-knappen
- Støttede kommandoer:
  - **"slett siste ord"** - Fjerner det siste ordet
  - **"slett siste setning"** - Fjerner til forrige punktum
  - **"ny linje"** - Legger til linjeskift
  - **"erstatt X med Y"** - Erstatter første forekomst av X med Y
  - **"fiks avsnitt"** / **"fiks tekst"** - Forbedrer teksten med AI

### Tekstforbedring
- Klikk "Fiks tekst" for å forbedre grammatikk og tegnsetting
- Bruker GPT-4o til å rydde opp i teksten
- Fjerner fyllord og unødvendige gjentagelser

### Tilgjengelighet
- **Store klikkbare elementer**: Minimum 48x48px, opptaksknapp 100x100px
- **Stor tekst**: 18px+ skriftstørrelse overalt
- **Høy kontrast**: Tydelige farger og visuell feedback
- **Enkel layout**: Fokus på brukervennlighet
- **PWA-støtte**: Installer på hjemskjerm

## Teknisk stack

- **Frontend**: React med Vite
- **API**: Vercel serverless functions
- **Transkribering**: OpenAI Whisper API (norsk språk)
- **AI-redigering**: OpenAI GPT-4o
- **PWA**: Service worker for offline-støtte

## Installasjon og oppsett

### Forutsetninger
- Node.js 18+
- OpenAI API-nøkkel

### Lokalt oppsett

1. **Klon repositoriet**
   ```bash
   git clone https://github.com/torrylol/parkinson-voice-app.git
   cd parkinson-voice-app
   ```

2. **Installer avhengigheter**
   ```bash
   npm install
   ```

3. **Konfigurer miljøvariabler**
   - Kopier `.env.example` til `.env`
   - Legg til din OpenAI API-nøkkel:
     ```
     OPENAI_API_KEY=din_api_nøkkel_her
     ```

4. **Start utviklingsserver**
   ```bash
   npm run dev
   ```

5. **Åpne appen**
   - Gå til `http://localhost:5173`

### Deployment til Vercel

1. **Installer Vercel CLI** (valgfritt)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Konfigurer miljøvariabler i Vercel**
   - Gå til Vercel Dashboard → Settings → Environment Variables
   - Legg til `OPENAI_API_KEY` med din API-nøkkel
   - Gjelder for Production, Preview, og Development

4. **Redeploy**
   - Push til GitHub for automatisk deployment
   - Eller kjør `vercel --prod`

## Prosjektstruktur

```
parkinson-voice-app/
├── api/                      # Vercel serverless functions
│   ├── transcribe.js        # Whisper API for transkribering
│   └── fix-text.js          # GPT-4o for tekstforbedring
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service worker
│   └── icons/               # App-ikoner (192x192, 512x512)
├── src/
│   ├── components/          # React-komponenter
│   │   ├── RecordButton.jsx
│   │   ├── CommandToggle.jsx
│   │   ├── TextEditor.jsx
│   │   └── CopyButton.jsx
│   ├── utils/
│   │   └── commandParser.js # Norsk kommandoparsing
│   ├── App.jsx              # Hovedkomponent
│   ├── App.css
│   └── index.css
├── .env.example             # Mal for miljøvariabler
├── vercel.json              # Vercel-konfigurasjon
└── package.json
```

## API-endepunkter

### POST /api/transcribe
Transkriberer lydfil til norsk tekst.

**Request**: Audio blob (webm)
**Response**: `{ text: "transkribert tekst" }` eller `{ error: "feilmelding" }`

### POST /api/fix-text
Forbedrer norsk tekst med AI.

**Request**: `{ text: "tekst å forbedre" }`
**Response**: `{ text: "forbedret tekst" }` eller `{ error: "feilmelding" }`

## Brukerveiledning

1. **Start opptaket**: Hold inne den store grønne knappen
2. **Snakk**: Si din tekst tydelig
3. **Slipp knappen**: Teksten blir transkribert og lagt til
4. **Kommandoer**: Slå på kommando-modus for å bruke talekommandoer
5. **Fiks tekst**: Klikk "Fiks tekst" for AI-forbedring
6. **Kopier**: Klikk "Kopier tekst" for å kopiere til utklippstavlen

## Tilgjengelighetsegenskaper

- Alle knapper er minst 48x48px (opptaksknapp: 100x100px)
- Tekststørrelse minimum 18px
- Høykontrast-farger for bedre synlighet
- Tydelig visuell feedback ved interaksjon
- Touch-vennlig for mobil og nettbrett
- Keyboard navigation-støtte
- ARIA-labels for skjermlesere

## Lisens

MIT

## Bidrag

Bidrag er velkomne! Vennligst åpne en issue eller pull request.

## Support

For spørsmål eller problemer, åpne en issue på GitHub.

// ui/rulesModal.js
export function showRulesModal() {
    const modal = document.getElementById('rules-modal')
    if (!modal) return
    modal.classList.remove('hidden')
    setTimeout(() => modal.classList.add('active'), 10)
    document.body.classList.add('modal-open')   // disable canvas clicks
}

export function closeRulesModal() {
    const modal = document.getElementById('rules-modal')
    if (!modal) return
    modal.classList.remove('active')
    setTimeout(() => {
        modal.classList.add('hidden')
        document.body.classList.remove('modal-open')  // re-enable canvas
    }, 300)
}

// Populate content – call once on page load
export function initRulesModal() {
    const contentContainer = document.getElementById('rules-content')
    if (!contentContainer) return

    // Clear any existing content
    contentContainer.innerHTML = ''

    // Add title
    const title = document.createElement('h2')
    title.textContent = 'Spelregels'
    title.style.textAlign = 'center'
    title.style.marginBottom = '20px'
    title.style.fontSize = '2rem'
    title.style.background = 'linear-gradient(135deg, #db88ff, #9418ca)'
    title.style.backgroundClip = 'text'
    title.style.webkitBackgroundClip = 'text'
    title.style.color = 'transparent'
    contentContainer.appendChild(title)

    // Color list (replaces first image)
    const colorListDiv = document.createElement('div')
    colorListDiv.innerHTML = `
        <p style="font-size:1.2rem; line-height:1.8; margin:10px 0;">
        <strong>Categorieën:</strong><br><br>
        <span style="color:#ffd966;">Positief: Geel</span><br>
        <span style="color:#4ade80;">Toekomstgericht: Groen</span><br>
        <span style="color:#60a5fa;">Reflecterend: Blauw</span><br>
        <span style="color:#f87171;">Competitief: Rood</span>
        </p>
    `
    contentContainer.appendChild(colorListDiv)


    // Gameplay text (same as before)
    const gameplayTexts = [
        `<p>
        <strong>Voorbereiding:</strong><br><br>
        Elke speler krijgt willekeurig 5 kaarten van de stapel. Vervolgens wordt er één kaart van de stapel (de bovenste) omgedraaid neergelegd om de kleur en het symbool te bepalen, en het spel begint.<br><br>
        <strong>Regels:</strong><br><br>
        De jongste speler mag beginnen. Spelers moeten een kaart uit hun hand op tafel leggen die OF het symbool OF de kleur matched van de laatste gespeelde kaart op de tafel. De kleur van de kaart die wordt neergelegd bepaalt welke categorie van vragen op de tablet geselecteerd moet worden.<br><br>
        De willekeurig gekozen vraag moet worden beantwoord door de speler. Andere spelers mogen ook antwoorden of erover praten als ze willen. Het doel van het spel is namelijk is dat de groep elkaar leert kennen en samen praten, bijna vergetend dat het spel er is.<br><br>
        Als een speler een willekeurige vraag niet wil antwoorden, mag deze eenmalig een "Andere vraag" selecteren op de tablet. Dit mag eenmaal per beurt, dus niet twee keer achter elkaar. Mocht de speler deze vraag alsnog niet willen antwoorden, moet de speler een nieuwe kaart van de stapel pakken. Hiermee eindigt dan ook de beurt.<br><br>
        <strong>Doel:</strong><br><br>
        Zoals eerder benoemd is het doel van dit spel om elkaar beter te leren kennen. Het is dus niet de bedoeling dat je probeert zo snel mogelijk van je kaarten af te komen.<br>
        Succes!
        </p>`
    ]

    gameplayTexts.forEach(html => {
        const div = document.createElement('div')
        div.innerHTML = html
        div.classList.add('rules-text')
        contentContainer.appendChild(div)
    })
}
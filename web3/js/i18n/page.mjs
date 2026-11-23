export const en = {
  hotkey: {
    title: "Hot-Key Hints",
    show: "Show Hot-Key Hints",
    hide: "Hide Hot-Key Hints",
    body: [
      'Navigation "-" and "+" hot-keys (keyboard or numpad) moves page backward and forward, respectively',
      'Navigation "[" and "]" hot-keys moves focused question backward and forward, respectively (When page is first loaded, no question is focused)',
      'Focused question is highlighted in pale yellow and numeric options identified by a number in square brackets (e.g.: "[1]")',
      'Numeric hot-keys "1" through "9" and "0" (numpad not included) will do the following based on the question type which is currently focused:',
      [
        "List: the option will be toggled (off to on, or on to off) - if extra details are required then the input box will automatically be given focus",
        "Number/String/Text: the input box is focused",
        "Date/Time: the date/time picker will show",
      ],
      "Holding down the SHIFT key will allow selection of items 11 through 20",
      "When an input box has focus the enter key must be pressed to leave focus and re-activate hot-keys",
      "All hot-keys are deactivated when no question is focused, or when focus is in an input box",
      "Hot-Keys are disabled when questionnaire is launched via a web-link (directly by the participant and not through Sabretooth or Beartooth)",
    ],
  },
  language: {
    en: "English",
    fr: "French",
  },
};

export const fr = {
  hotkey: {
    title: "Raccourcis clavier",
    show: "Afficher les raccourcis clavier",
    hide: "Masquer les raccourcis clavier",
    body: [
      "Les touches de raccourci « - » et « + » (clavier ou pavé numérique) permettent de passer respectivement à la page précédente et à la page suivante.",
      "Les touches de raccourci « [ » et « ] » permettent de se déplacer à la question mise en évidence précédente et suivante, respectivement. (Lorsque la page est chargée pour la première fois, aucune question n’est mise en évidence.)",
      "Une question mise en évidence est surlignée en jaune pâle et les raccourcis numériques sont identifiés par un nombre entre crochets, p. ex. [1].",
      "Les touches de raccourci numériques « 1 » à « 9 » et « 0 » (pavé numérique non inclus) effectueront les opérations suivantes en fonction du type de question actif :",
      [
        "Liste : basculer entre les options (désactivée à activée ou activée à désactivée). Si de l’information supplémentaire est requise, la zone de saisie sera automatiquement mise en évidence",
        "Nombre/chaîne/texte : la zone de saisie sera mise en évidence",
        "Date : le sélecteur de date s’affichera",
      ],
      "Maintenez la touche Majuscule enfoncée pour permettre la sélection des éléments 11 à 20.",
      "Lorsqu’une zone de saisie est mise en évidence, vous devrez enfoncer la touche Entrée pour quitter la mise en évidence et réactiver les touches de raccourci.",
      "Tous les raccourcis clavier sont désactivés lorsqu’aucune question n’est mise en évidence ou lorsqu’une zone de saisie est mise en évidence.",
      "Les raccourcis clavier sont désactivés lorsque le questionnaire est lancé via un lien Web (directement par le participant et non via Sabretooth ou Beartooth).",
    ],
  },
  language: {
    en: "Anglais",
    fr: "Français",
  },
};

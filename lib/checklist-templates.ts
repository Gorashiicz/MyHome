export type ChecklistTemplate = {
  key: string;
  title: string;
  description: string;
  items: string[];
};

export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    key: "before_covering",
    title: "Před zaklopením rozvodů",
    description:
      "Zkontrolujte a zdokumentujte vše, co se brzy zakryje — fotky, zkoušky, trasy.",
    items: [
      "Fotky rozvodů ze všech místností",
      "Tlakové zkoušky (voda / topení)",
      "Kontrola tras a průchodů",
      "Popisky okruhů a rozvaděčů",
      "Souhlas stavebního dozoru",
    ],
  },
  {
    key: "before_concrete",
    title: "Před betonáží",
    description: "Kontrola před litím betonu — výztuž, bednění, prostupy.",
    items: [
      "Kontrola výztuže a krytí",
      "Prostupy a kanalizace",
      "Bednění a rozměry",
      "Fotodokumentace",
      "Objednávka betonu a pumpy",
    ],
  },
  {
    key: "before_payment",
    title: "Před platbou dodavateli",
    description: "Ověření před uvolněním platby za práce nebo materiál.",
    items: [
      "Faktura odpovídá nabídce / smlouvě",
      "Práce převzata a zkontrolována",
      "Vady zapsány (pokud jsou)",
      "Záruky a dokumenty předány",
      "Fotky uloženy v projektu",
    ],
  },
  {
    key: "before_finish",
    title: "Před dokončením",
    description: "Dokumentace a revize před kolaudací a předáním.",
    items: [
      "Revize (elektro, TZB, komín…)",
      "Návody k zařízení",
      "Záruční listy",
      "Dokumentace skutečného provedení",
      "Kolaudace / kolaudační souhlas",
    ],
  },
  {
    key: "before_start",
    title: "Před zahájením stavby",
    description: "Příprava dokumentace a smluv před výkopem.",
    items: [
      "Projektová dokumentace",
      "Povolení / oznámení stavebnímu úřadu",
      "Stavební dozor domluven",
      "Zařízení staveniště",
      "Smlouvy a nabídky",
      "Pojištění stavby",
    ],
  },
];

export function getChecklistTemplate(key: string) {
  return CHECKLIST_TEMPLATES.find((t) => t.key === key);
}

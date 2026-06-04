/** Terminologie v UI: rozpočet = odhad položky, náklady = zaplacené výdaje. */

export const BUDGET_REFERENCE_INTRO =
  "Nahoře je celkový rozpočet a všechny náklady. " +
  "Sekce „Položky s výdaji“ porovnává plánovaný rozpočet jen u položek, kde už evidujete výdaje, se skutečností — " +
  "to je srovnání, které hledáte u rozjeté nebo hotové práce.";

export const BUDGET_LABELS = {
  /** @deprecated použijte planned */
  reference: "Rozpočet",
  /** @deprecated použijte plannedTotal */
  referenceTotal: "Rozpočet celkem",
  /** @deprecated použijte plannedAmount */
  referenceAmount: "Rozpočet (odhad)",
  /** @deprecated použijte spent */
  actual: "Náklady",
  /** @deprecated použijte spentTotal */
  actualTotal: "Náklady celkem",
  /** @deprecated */
  deviation: "Rozdíl",
  /** @deprecated */
  underReference: "Pod rozpočtem",
  /** @deprecated */
  overReference: "Nad rozpočtem",
  planned: "Rozpočet",
  plannedAmount: "Rozpočet (odhad)",
  plannedTotal: "Rozpočet celkem",
  spent: "Skutečné náklady",
  spentTotal: "Skutečné náklady celkem",
  activePlanned: "Plán dle rozpočtu (položky s výdaji)",
  activeSpent: "Skutečné náklady (položky s výdaji)",
  activeDiff: "Rozdíl plán × skutečnost",
  closedPlanned: "Plán dle rozpočtu (hotové položky)",
  closedSpent: "Skutečné náklady (hotové položky)",
  closedDiff: "Rozdíl u hotových",
  sectionWholeProject: "Celý projekt",
  sectionActiveItems: "Položky s výdaji",
  sectionClosedItems: "Hotové položky (✓ vyřešeno)",
  sectionLimit: "Vůči limitu stavby",
  remaining: "Zbývá z rozpočtu",
  remainingTotal: "Zbývá celkem",
  overBudget: "Přečerpáno",
  overBudgetTotal: "Přečerpáno celkem",
  percentUsed: "Vyčerpáno",
  projectLimit: "Limit stavby",
  remainingFromLimitPlanned: "Zbývá z limitu (rozpočet položek)",
  remainingFromLimitSpent: "Zbývá z limitu (skutečné náklady)",
  overLimitPlanned: "Rozpočet položek nad limitem",
  overLimitSpent: "Náklady nad limitem stavby",
  /** @deprecated */
  remainingFromLimit: "Zbývá z limitu stavby",
  overLimit: "Přes limit stavby",
  itemsVsSpent: "Rozdíl položek a nákladů",
} as const;

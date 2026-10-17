export default defineI18nConfig(() => ({
  pluralRules: {
    // Montenegrin: 2–4 (but not 12–14) take "godine", everything else "godina"
    me: (choice: number) => {
      const mod10 = choice % 10
      const mod100 = choice % 100
      return mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 0 : 1
    }
  }
}))

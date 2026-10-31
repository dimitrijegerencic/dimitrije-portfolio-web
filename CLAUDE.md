# CLAUDE.md

## Git

- Commit messages must not include a `Co-Authored-By` trailer (no Claude co-author line).
- Work happens on `feature/portfolio-vX.Y` branches cut from `main`; `main` is what Vercel deploys.

## Content

- Recommendations for the Reviews section live in `app/data/recommendations.ts`. Quotes stay in the language they were written in; only the relation line is translated, under `reviews.relations` in `i18n/locales/*.json`.

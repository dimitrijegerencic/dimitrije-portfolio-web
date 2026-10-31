// Recommendations shown in the Reviews carousel, newest first.
// Text is quoted exactly as written, so it stays in its original language on every
// version of the site.
// To add one, append an entry; `action` defaults to an approval.

export interface Recommendation {
  name: string
  // Their title, as they put it
  role: string
  // Square photo under public/reviews/, around 160px; initials are shown without one
  photo?: string
  // A blank line starts a new paragraph
  text: string
  // Like on GitHub: most reviewers approve, some just leave a comment
  action?: 'approved' | 'commented'
}

export const recommendations: Recommendation[] = [
  {
    name: 'Luka Milikic',
    role: 'Full Stack Developer',
    photo: '/reviews/luka-milikic.jpg',
    text: 'Dimitrije is the kind of frontend developer who notices what everyone else misses. Spacing, states, transitions, edge cases: he sweats all of it, and it shows. Every app he touches ends up feeling like a reliable, expensive product.\n\nHis UX instincts are outstanding. He thinks about how people actually use an interface, not just how it looks in a design file, and he handles complex frontend problems in Vue.js and React without cutting corners.\n\nAny team that cares about product quality should want him.'
  }
]

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
    name: 'Omar Đečević',
    role: 'PHP Developer',
    photo: '/reviews/omar-decevic.jpg',
    text: 'I had the chance to work with Dimitrije on some pretty challenging projects, and it was always a pleasure working with him.\n\nHe\'s a great frontend developer, very detail-oriented and responsible, and someone you can always count on. I especially appreciated the fact that no matter how busy he was, he was always happy to answer questions, help out, or share his thoughts on something.\n\nOn top of all that, he\'s just a great guy to work with, and I\'d be happy to work with him again. I\'d definitely recommend him to any team!'
  },
  {
    name: 'Miljan Golubovic',
    role: 'Cybersecurity Engineer',
    photo: '/reviews/miljan-golubovic.jpg',
    text: 'I\'ve known Dimitrije for a long time, and he has helped me on a few personal projects: the frontend for internal tools and a portal for client-facing reports.\n\nWith work like that, the interface is half the job. There is a lot of data, and it has to be shown so that people find their way around without anyone explaining it. Dimitrije has a real feel for that and knows how to build an interface where clients get around on their own, without questions or wandering, which is harder than it looks.\n\nNothing unnecessary, everything in its place, and he always watches for the small details most people skip.'
  },
  {
    name: 'Luka Milikic',
    role: 'Full Stack Developer',
    photo: '/reviews/luka-milikic.jpg',
    text: 'Dimitrije is the kind of frontend developer who notices what everyone else misses. Spacing, states, transitions, edge cases: he sweats all of it, and it shows. Every app he touches ends up feeling like a reliable, expensive product.\n\nHis UX instincts are outstanding. He thinks about how people actually use an interface, not just how it looks in a design file, and he handles complex frontend problems in Vue.js and React without cutting corners.\n\nAny team that cares about product quality should want him.'
  }
]

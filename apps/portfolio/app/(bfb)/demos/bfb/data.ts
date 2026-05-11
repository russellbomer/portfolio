export interface BFBPost {
  id: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  url: string;
  duration?: string;
  isPaywalled?: boolean;
  isPinned?: boolean;
  date: string;
  author: string;
}

const BASE = "https://www.brownsfilmbreakdown.com/p";

// Hero posts — ordered to match the magazine-5 layout on the live site:
// [0] top-left  [1] bottom-left  [2] center/featured  [3] top-right  [4] bottom-right
export const HERO_POSTS: BFBPost[] = [
  // [0] top-left — pin + lock
  {
    id: "196997901",
    title: "Rookie Minicamp Day 1 Recap, and Spencer/ Logan Fano Draft Introduction Series",
    excerpt: "All the takeaways from the first day for the Browns new draft class and keen insights on the Fano brothers.",
    thumbnailUrl: "/images/bfb/thumb-hero-0.png",
    url: `${BASE}/rookie-minicamp-day-1-recap-and-spencer`,
    date: "May 9",
    author: "Jake Burns",
    isPinned: true,
    isPaywalled: true,
  },
  // [1] bottom-left — pin
  {
    id: "196856123",
    title: "All Eyez On Cleveland Replay - Cedric Tillman's Future With Browns, Brendan Sorsby, and Does AB Deserve The Praise",
    excerpt: "The guys examine Cedric Tillman's value to the Browns, The Brendan Sorsby situation and whether or not Andrew Berry deserves all the national praise.",
    thumbnailUrl: "/images/bfb/thumb-all-eyez-replay.png",
    url: `${BASE}/all-eyez-on-cleveland-replay-cedric`,
    date: "May 8",
    author: "Brad Ward",
    isPinned: true,
  },
  // [2] center — featured — pin
  {
    id: "197025752",
    title: "The Opening Drive 5/9: Browns Rookie Minicamp Day One - News, Notes and More",
    excerpt: "With rookie minicamp underway we look at the pertinent information from day one.",
    thumbnailUrl: "/images/bfb/thumb-hero-2.png",
    url: `${BASE}/the-opening-drive-59-browns-rookie`,
    date: "May 9",
    author: "Brad Ward",
    isPinned: true,
  },
  // [3] top-right — pin
  {
    id: "196841387",
    title: "The Opening Drive 5/8: Contemplating Cedric Tillman's Future with the Browns",
    excerpt: "With the addition of two rookies some theorized a trade scenario for the Tennessee-product, but is that really the best idea?",
    thumbnailUrl: "/images/bfb/thumb-hero-3.png",
    url: `${BASE}/the-opening-drive-58-contemplating`,
    date: "May 8",
    author: "Brad Ward",
    isPinned: true,
  },
  // [4] bottom-right — pin + lock
  {
    id: "196737155-od",
    title: "The Opening Drive 5/7: No Team Knows the Supplemental Draft Quite Like Cleveland",
    excerpt: "The Browns built an entire era of football on a loophole. Now, with another talented quarterback's eligibility in jeopardy, they're being asked the same question they've answered before.",
    thumbnailUrl: "/images/bfb/thumb-hero-4.png",
    url: `${BASE}/the-opening-drive-56-no-team-knows`,
    date: "May 7",
    author: "Jake Burns",
    isPinned: true,
    isPaywalled: true,
  },
];

export const SECTION_POSTS: BFBPost[] = [
  // [0] — lock
  {
    id: "196997901-s",
    title: "Rookie Minicamp Day 1 Recap, and Spencer/ Logan Fano Draft Introduction Series",
    excerpt: "All the takeaways from the first day for the Browns new draft class and keen insights on the Fano brothers.",
    thumbnailUrl: "/images/bfb/thumb-hero-0.png",
    url: `${BASE}/rookie-minicamp-day-1-recap-and-spencer`,
    date: "May 9",
    author: "Jake Burns",
    isPaywalled: true,
  },
  // [1] — none
  {
    id: "196856123-s",
    title: "All Eyez On Cleveland Replay - Cedric Tillman's Future With Browns, Brendan Sorsby, and Does AB Deserve The Praise",
    excerpt: "The guys examine Cedric Tillman's value to the Browns, The Brendan Sorsby situation and whether or not Andrew Berry deserves all the national praise.",
    thumbnailUrl: "/images/bfb/thumb-all-eyez-replay.png",
    url: `${BASE}/all-eyez-on-cleveland-replay-cedric`,
    date: "May 8",
    author: "Brad Ward",
  },
  // [2] — lock
  {
    id: "196737155-s",
    title: "The Opening Drive 5/7: No Team Knows the Supplemental Draft Quite Like Cleveland",
    excerpt: "The Browns built an entire era of football on a loophole. Now, with another talented quarterback's eligibility in jeopardy, they're being asked the same question they've answered before.",
    thumbnailUrl: "/images/bfb/thumb-hero-4.png",
    url: `${BASE}/the-opening-drive-56-no-team-knows`,
    date: "May 7",
    author: "Jake Burns",
    isPaywalled: true,
  },
  // [3] — lock
  {
    id: "196737155",
    title: "Brendan Sorsby Debate, Myles and the NFL's Active Hall of Fame Candidates, and Austin Barber Draft Introduction Series",
    excerpt: "The Browns might have to think about a quarterback in the supplemental draft but it comes with caution.",
    thumbnailUrl: "/images/bfb/thumb-brendan-sorsby.png",
    url: `${BASE}/brendan-sorsby-debate-myles-and-the`,
    date: "May 7",
    author: "Jake Burns, Brad Ward",
    isPaywalled: true,
  },
];

export const RECENT_POSTS: BFBPost[] = [
  {
    id: "196737155-r",
    title: "Brendan Sorsby Debate, Myles and the NFL's Active Hall of Fame Candidates, and Austin Barber Draft Introduction Series",
    excerpt: "The Browns might have to think about a quarterback in the supplemental draft but it comes with caution.",
    thumbnailUrl: "/images/bfb/thumb-brendan-sorsby.png",
    url: `${BASE}/brendan-sorsby-debate-myles-and-the`,
    date: "May 7",
    author: "Jake Burns, Brad Ward",
    isPaywalled: true,
  },
  {
    id: "196657321",
    title: "The Opening Drive 5/6: The Browns Pursuit of Positionless Safety Play",
    excerpt: "Emmanuel McNeil-Warren is the type of move that can create chaos for opposing offenses.",
    thumbnailUrl: "/images/bfb/thumb-emw.png",
    url: `${BASE}/the-opening-drive-56-the-browns-pursuit`,
    date: "May 6",
    author: "Jake Burns",
    isPaywalled: true,
  },
  {
    id: "196568571",
    title: "FILM ROOM: Denzel Boston's Draft Pick Profile and Scouting Report",
    excerpt: "All the film details on how the Huskies used the receiver and how he translates in Cleveland.",
    thumbnailUrl: "/images/bfb/thumb-denzel-boston.png",
    url: `${BASE}/film-room-denzel-bostons-draft-pick`,
    date: "May 5",
    author: "Jake Burns",
    isPaywalled: true,
  },
];

/**
 * Welland 2026 ward councillor races and certified results.
 * Candidates: City of Welland, Registered Candidates (retrieved 2026-10-16).
 * Results: City of Welland, 2026 Election Results, certified by the City Clerk
 * (retrieved 2026-11-06). Two councillors elected per ward; winners flagged.
 * Incumbency is deliberately omitted: the City list does not flag incumbents.
 */
export const WARD_RACES_SOURCE = 'https://www.welland.ca/city-hall/municipal-elections/registered-candidates/'
export const WARD_RACES_RETRIEVED = '2026-10-16'
export const WARD_RESULTS_SOURCE = 'https://www.welland.ca/city-hall/municipal-elections/2026-election-results/'
export const WARD_RESULTS_RETRIEVED = '2026-11-06'
export const ELECTION_DATE = '2026-10-26'

export const wellandWardRaces = [
  {
    "ward": 1,
    "slug": "ward-1",
    "seats": 2,
    "candidates": [
      {
        "name": "Kiron Bondale",
        "site": "https://votekiron.wordpress.com",
        "votes": 475,
        "elected": false
      },
      {
        "name": "Jessica LaHay",
        "site": "https://votejessicaward1.ca",
        "votes": 1285,
        "elected": true
      },
      {
        "name": "Adam Moote",
        "site": null,
        "votes": 1672,
        "elected": true
      },
      {
        "name": "Josh Sawatsky",
        "site": null,
        "votes": 549,
        "elected": false
      },
      {
        "name": "Brad Ulch",
        "site": null,
        "votes": 748,
        "elected": false
      }
    ]
  },
  {
    "ward": 2,
    "slug": "ward-2",
    "seats": 2,
    "candidates": [
      {
        "name": "Nick Albano",
        "site": "https://www.nickforward2.ca",
        "votes": 1180,
        "elected": true
      },
      {
        "name": "Vince DiMauro",
        "site": null,
        "votes": 206,
        "elected": false
      },
      {
        "name": "Carolyn Fast",
        "site": "https://sites.google.com/view/october262026/home",
        "votes": 825,
        "elected": false
      },
      {
        "name": "Aldo Parrotta",
        "site": "https://votealdoparrotta.ca",
        "votes": 963,
        "elected": true
      },
      {
        "name": "Leo Van Vliet",
        "site": "https://leovanvliet.ca",
        "votes": 866,
        "elected": false
      },
      {
        "name": "Steve Yochim",
        "site": "https://www.steveyochim.com",
        "votes": 858,
        "elected": false
      }
    ]
  },
  {
    "ward": 3,
    "slug": "ward-3",
    "seats": 2,
    "candidates": [
      {
        "name": "John Braimoh",
        "site": "https://johnbraimoh.ca",
        "votes": 468,
        "elected": false
      },
      {
        "name": "John Chiocchio",
        "site": null,
        "votes": 1802,
        "elected": true
      },
      {
        "name": "Sharmila Setaram",
        "site": "https://sharmila.ca",
        "votes": 1295,
        "elected": true
      },
      {
        "name": "Steve Soos",
        "site": null,
        "votes": 659,
        "elected": false
      },
      {
        "name": "James Takeo",
        "site": "https://jamestakeotattoos.com/blog",
        "votes": 687,
        "elected": false
      }
    ]
  },
  {
    "ward": 4,
    "slug": "ward-4",
    "seats": 2,
    "candidates": [
      {
        "name": "David Alexander",
        "site": "https://davidalexander.ca",
        "votes": 890,
        "elected": true
      },
      {
        "name": "Safdar Ali",
        "site": null,
        "votes": 62,
        "elected": false
      },
      {
        "name": "Tia DeAgazio",
        "site": null,
        "votes": 344,
        "elected": false
      },
      {
        "name": "Tony DiMarco",
        "site": null,
        "votes": 530,
        "elected": false
      },
      {
        "name": "Bryan Green",
        "site": "https://www.bryangreen4ward4.ca",
        "votes": 976,
        "elected": true
      },
      {
        "name": "Tissa Ratnayake",
        "site": "https://votetissa.ca",
        "votes": 103,
        "elected": false
      },
      {
        "name": "Terry Zorgel",
        "site": "https://vote4terryz.ca",
        "votes": 795,
        "elected": false
      }
    ]
  },
  {
    "ward": 5,
    "slug": "ward-5",
    "seats": 2,
    "candidates": [
      {
        "name": "Aaron Albano",
        "site": "https://aaronalbano.ca",
        "votes": 906,
        "elected": true
      },
      {
        "name": "Mark Dzugan",
        "site": null,
        "votes": 746,
        "elected": false
      },
      {
        "name": "Michelle Febers",
        "site": null,
        "votes": 198,
        "elected": false
      },
      {
        "name": "Connie McCutcheon",
        "site": "https://conniemccutcheon.com",
        "votes": 855,
        "elected": false
      },
      {
        "name": "Luca Mele",
        "site": "https://lucamele.ca",
        "votes": 574,
        "elected": false
      },
      {
        "name": "Claudette Richard",
        "site": null,
        "votes": 1217,
        "elected": true
      }
    ]
  },
  {
    "ward": 6,
    "slug": "ward-6",
    "seats": 2,
    "candidates": [
      {
        "name": "Steve Falusi",
        "site": "https://stevefalusiwellandward6.com",
        "votes": 361,
        "elected": false
      },
      {
        "name": "Bonnie Fokkens",
        "site": "https://bonniefokkens.ca",
        "votes": 993,
        "elected": true
      },
      {
        "name": "Jim Larouche",
        "site": "https://electjimlarouche.ca",
        "votes": 935,
        "elected": true
      },
      {
        "name": "Jamie Lee",
        "site": "https://www.jamieleeward6.ca",
        "votes": 736,
        "elected": false
      },
      {
        "name": "Kevin Muller",
        "site": null,
        "votes": 128,
        "elected": false
      },
      {
        "name": "Cheryl Rowe",
        "site": null,
        "votes": 316,
        "elected": false
      },
      {
        "name": "Sean Vout",
        "site": null,
        "votes": 120,
        "elected": false
      }
    ]
  }
]

export function getWardRace(slug) {
  return wellandWardRaces.find((w) => w.slug === slug) || null
}

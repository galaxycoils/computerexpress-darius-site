/**
 * Welland 2026 ward councillor races.
 * Source: City of Welland, Registered Candidates (retrieved 2026-10-16).
 * Only names and candidate-supplied websites are recorded. Incumbency and
 * voting records are deliberately omitted: councilData.js has no per-member
 * votes, and the City list does not flag incumbents.
 */
export const WARD_RACES_SOURCE = 'https://www.welland.ca/city-hall/municipal-elections/registered-candidates/'
export const WARD_RACES_RETRIEVED = '2026-10-16'
export const ELECTION_DATE = '2026-10-26'

export const wellandWardRaces = [
  {
    "ward": 1,
    "slug": "ward-1",
    "seats": 2,
    "candidates": [
      {
        "name": "Kiron Bondale",
        "site": "https://votekiron.wordpress.com"
      },
      {
        "name": "Jessica LaHay",
        "site": "https://votejessicaward1.ca"
      },
      {
        "name": "Adam Moote",
        "site": null
      },
      {
        "name": "Josh Sawatsky",
        "site": null
      },
      {
        "name": "Brad Ulch",
        "site": null
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
        "site": "https://www.nickforward2.ca"
      },
      {
        "name": "Vince DiMauro",
        "site": null
      },
      {
        "name": "Carolyn Fast",
        "site": "https://sites.google.com/view/october262026/home"
      },
      {
        "name": "Aldo Parrotta",
        "site": "https://votealdoparrotta.ca"
      },
      {
        "name": "Leo Van Vliet",
        "site": "https://leovanvliet.ca"
      },
      {
        "name": "Steve Yochim",
        "site": "https://www.steveyochim.com"
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
        "site": "https://johnbraimoh.ca"
      },
      {
        "name": "John Chiocchio",
        "site": null
      },
      {
        "name": "Sharmila Setaram",
        "site": "https://sharmila.ca"
      },
      {
        "name": "Steve Soos",
        "site": null
      },
      {
        "name": "James Takeo",
        "site": "https://jamestakeotattoos.com/blog"
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
        "site": "https://davidalexander.ca"
      },
      {
        "name": "Safdar Ali",
        "site": null
      },
      {
        "name": "Tia DeAgazio",
        "site": null
      },
      {
        "name": "Tony DiMarco",
        "site": null
      },
      {
        "name": "Bryan Green",
        "site": "https://www.bryangreen4ward4.ca"
      },
      {
        "name": "Tissa Ratnayake",
        "site": "https://votetissa.ca"
      },
      {
        "name": "Terry Zorgel",
        "site": "https://vote4terryz.ca"
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
        "site": "https://aaronalbano.ca"
      },
      {
        "name": "Mark Dzugan",
        "site": null
      },
      {
        "name": "Michelle Febers",
        "site": null
      },
      {
        "name": "Connie McCutcheon",
        "site": "https://conniemccutcheon.com"
      },
      {
        "name": "Luca Mele",
        "site": "https://lucamele.ca"
      },
      {
        "name": "Claudette Richard",
        "site": null
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
        "site": "https://stevefalusiwellandward6.com"
      },
      {
        "name": "Bonnie Fokkens",
        "site": "https://bonniefokkens.ca"
      },
      {
        "name": "Jim Larouche",
        "site": "https://electjimlarouche.ca"
      },
      {
        "name": "Jamie Lee",
        "site": "https://www.jamieleeward6.ca"
      },
      {
        "name": "Kevin Muller",
        "site": null
      },
      {
        "name": "Cheryl Rowe",
        "site": null
      },
      {
        "name": "Sean Vout",
        "site": null
      }
    ]
  }
]

export function getWardRace(slug) {
  return wellandWardRaces.find((w) => w.slug === slug) || null
}

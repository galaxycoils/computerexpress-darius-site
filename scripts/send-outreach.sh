#!/bin/bash
# Send outreach emails via AgentMail API: POST /v0/inboxes/{id}/messages/send
# Reads prospect list from inline here-doc, excludes bounced + secondary targets

API_KEY="am_us_e2dff04ad1c5617970a33ce48a7f9f7f5a0f0b059f4720dae9a73e8ec4c4f99f"
INBOX="stcatharines-digital@agentmail.to"
BASE="https://api.agentmail.to/v0/inboxes/${INBOX}/messages/send"

# Excluded: RE/MAX (bounced), Right at Home (secondary/non-primary)
PROSPECTS=(
  "nick@suklawpc.com|Suk Law"
  "info@gncc.ca|Greater Niagara Chamber of Commerce"
  "GeneralInquiries@minto.com|Minto Group"
  "info_gtalowrise@mattamycorp.com|Mattamy Homes"
  "[email protected]|Bosley Real Estate McGarr"
  "contact@kwcomplete.com|Keller Williams Complete Niagara"
  "info@soldierrealestate.ca|Soldier Real Estate"
  "katherine.milian@exprealty.net|eXp Realty Ontario"
  "sales@greatgulf.com|Great Gulf Homes"
  "info@dufferinconstruction.com|Dufferin Construction"
  "info@reidsheritage.com|Reid's Heritage Homes"
  "info@simcoemountainhomes.com|Simcoe Mountain Homes"
  "info@orchardparkhomes.com|Orchard Park Homes"
  "info@impressionhomes.net|Impression Homes"
  "niagara@cbre.com|CBRE Niagara"
  "niagara@jll.com|JLL Niagara"
  "info@redmanconstruction.ca|Redman Construction"
  "info@norcar.ca|Norcar Construction"
  "info@bondfield.ca|Bondfield Construction"
  "info@bacontracting.ca|B&A Contracting"
  "info@delconstruction.ca|DelConstruction"
  "info@niagaraconstruction.org|Niagara Construction Association"
  "info@sullivanmahoney.com|Sullivan Mahoney LLP"
  "info@chownlaw.com|Chown Cairns LLP"
  "info@dww.com|Deeth Williams Acton LLP"
  "info@stcatharinesengineering.ca|St. Catharines Engineering"
  "info@stcatharineschamber.ca|St. Catharines Chamber of Commerce"
)

SUCCESS=0
FAIL=0
TOTAL=${#PROSPECTS[@]}

for entry in "${PROSPECTS[@]}"; do
  email="${entry%%|*}"
  name="${entry##*|}"
  ts=$(date +%s)
  
  resp=$(curl -s -X POST "$BASE" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"to\":\"$email\",\"subject\":\"Planning notices for your Niagara clients\",\"text\":\"Hi,\n\nI'm reaching out from St. Catharines Digital, a local news site covering official municipal planning notices, council decisions, and police releases for St. Catharines, Welland, Thorold, and Niagara Region.\n\nWhat's on the site right now:\n- 11 active planning notices from 4 municipalities (post Sep 18 scan)\n- Daily NRPS police releases\n- Council coverage from all 3 cities\n- A Planning Tracker that's been live\n\nWhy this matters: if your clients are buying, selling, developing, or investing in Niagara properties, they need to know about zoning changes, development applications, and planning approvals before they hit the mainstream. Our site tracks everything from official municipal sources.\n\nWe're currently offering a founding sponsor package at \$300/month for 90 days. This includes a weekly digest email with all the planning notices and police releases, plus your logo/link on the site.\n\nI'd be happy to send you a sample digest or walk you through the site.\n\nBest,\nSt. Catharines Digital\"}")
  
  msgid=$(echo "$resp" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('message_id','FAILED')[:24])" 2>/dev/null)
  threadid=$(echo "$resp" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('thread_id','FAILED')[:24])" 2>/dev/null)
  
  if [ "$msgid" = "FAILED" ] || [ -z "$msgid" ]; then
    echo "FAIL | $email | $name | resp: $(echo "$resp" | head -c 80)"
    FAIL=$((FAIL + 1))
  else
    echo "OK   | $email | $name | msg: $msgid | thread: $threadid"
    SUCCESS=$((SUCCESS + 1))
  fi
done

echo ""
echo "=== RESULTS: $SUCCESS sent, $FAIL failed, $TOTAL total ==="

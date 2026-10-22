// Hurley app content. Venue/info details researched 2026-10-22 from official sites, CAMRA and council
// listings: check on the ground and correct here.
const VERSION = '0.10.0';

// RULE (Michael, 2026-10-22): accommodation listings get NO links, phone numbers or call buttons until
// commercial terms are agreed with each venue, one by one. Venue pages use noContact:true.

// Who you are in Hurley: one is required (with a name) before posting or suggesting
const ROLES = ['Resident', 'Visitor', 'Work in Village', 'HRP Owner'];

// 24px line icons, drawn with currentColor
const ICONS = {
  news:'<path d="M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2h-1M7 9h7M7 12.5h7M7 16h4"/>',
  board:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  oldebell:'<path d="M12 3a1.5 1.5 0 0 1 1.5 1.5v.6A6 6 0 0 1 18 11v4l2 2.5H4L6 15v-4a6 6 0 0 1 4.5-5.9v-.6A1.5 1.5 0 0 1 12 3zM10 20.5a2 2 0 0 0 4 0"/>',
  risingsun:'<path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0M12 6.5V9M5.5 9.5l1.6 1.6M18.5 9.5l-1.6 1.6M2.5 14.5h2M19.5 14.5h2"/>',
  shop:'<path d="M4 9h16l-1.5-4h-13zM5 9v11h14V9M9.5 20v-6h5v6"/>',
  church:'<path d="M12 2.5v4M10 4.5h4M7 21V11l5-4.5 5 4.5v10M4 21h16M10.5 21v-4a1.5 1.5 0 0 1 3 0v4"/>',
  stay:'<path d="M3 11l9-7 9 7M5 9.5V20h14V9.5"/><path d="M8.5 20v-4.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1V20M8.5 15.5h7"/>',
  holidays:'<path d="M4 8h16v11H4zM9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M4 13h16"/>',
  hurleyford:'<path d="M3 7h13a3 3 0 0 1 3 3v6H3zM19 13h2.5M7 16v2.5M12 16v2.5M6 10h3v3H6zM12 10h3v3h-3z"/>',
  riverside:'<path d="M3 19l7-13 7 13zM10 6v13M2 22c2-1.3 4-1.3 6 0s4 1.3 6 0 4-1.3 6 0"/>',
  property:'<path d="M3 11l9-7 9 7M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/><path d="M15.5 4.5h3v4"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  diary:'<path d="M4 6h16v14H4zM4 10.5h16M8 3.5v4M16 3.5v4M8 14.5h3"/>',
  trades:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.6 17.2a1.9 1.9 0 0 0 2.7 2.7l5.7-5.7a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.3-.5-.5-2.3z"/>',
  yourway:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'
};
const svg = (k, cls) => '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') +
  ' fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICONS[k] + '</svg>';

// Home grid order: 2 columns x 4 rows, "Your App, your way" bottom-right.
// type: venue = a place with details; list = a list of entries; yourway = request/vote panel
const PLACES = [
  {id:'news', name:'News', type:'news'},
  {id:'board', name:'Message Board', type:'board', intro:'Notices, lost & found, offers of help and things for sale.'},
  {id:'diary', name:'Diary', type:'diary'},
  {id:'oldebell', name:'Olde Bell', type:'venue', kind:'Historic inn: restaurant, Garden Bar & rooms',
    about:'Dating back to 1135 and often called one of the oldest inns in the world. Restaurant, Garden Bar and boutique rooms on the High Street.',
    hours:'Open daily',
    noContact:true, address:'High Street, Hurley SL6 5LX'},
  {id:'risingsun', name:'Rising Sun', type:'venue', kind:'Village pub',
    about:'Hurley\u2019s village pub on the High Street, reopened under new management in January 2026 and open seven days a week.',
    hours:'Mon\u2013Thu & Sun 12\u201310pm \u00b7 Fri & Sat 12\u201311pm',
    noContact:true, address:'High Street, Hurley SL6 5LT'},
  {id:'shop', name:'Village Shop', type:'venue', kind:'Shop, caf\u00e9 & Post Office',
    about:'Serving Hurley for more than 70 years: everyday groceries and essentials, a caf\u00e9, and a Post Office counter.',
    hours:'Open daily until 6pm \u00b7 Post Office counter Tue & Thu 9.30am\u201312pm',
    phone:'', web:'', address:'High Street, Hurley', map:'Hurley Village Shop, High Street, Hurley'},
  // Home tile 6: three big buttons, each opening its own page
  {id:'stay', name:'Where to stay in Hurley', type:'list', intro:'Hotels, an ancient inn and riverside holiday parks.',
    links:[{id:'holidays', t:'Holidays and short stays', d:'Hotels and holiday parks to book for a night or a week'},
           {id:'riverside', t:'Hurley Riverside Park', d:'Holiday park by the Thames: touring, tents and holiday homes'},
           {id:'hurleyford', t:'Hurleyford Farm Caravan Park', d:'Child-free park of holiday homes on Mill Lane'}]},
  {id:'riverside', name:'Hurley Riverside Park', type:'venue', kind:'Holiday park by the Thames', hidden:true, parent:'stay',
    about:'Family-run holiday park beside the River Thames between Henley and Marlow: touring pitches for caravans, motorhomes and tents, plus holiday homes, a park shop and riverside walks.',
    hours:'Reception 8am\u20137.30pm \u00b7 Park shop 8.15am\u20137.30pm \u00b7 Touring season roughly March to October',
    noContact:true, address:'Hurley, Maidenhead SL6 5NE'},
  // Reached from Useful Info. Source: burchettsgreenparish.org/hurley + its ChurchSuite calendar (2026-10-22)
  {id:'church', name:'St Mary the Virgin', type:'list', hidden:true, parent:'info',
    intro:'Hurley\u2019s parish church, by the river at the end of the High Street.',
    items:[{t:'Visiting', b:'The church is open every day, 8am\u20134pm. St Mary the Virgin, Hurley SL6 5NB.'},
           {t:'Sunday services', b:'Every Sunday at 10.30am (except fifth Sundays). First Sunday: God Through Music. Third Sunday: God in Quiet. Second and fourth Sundays: Holy Communion.',
            u:'place.html?p=diary', ut:'See the dates in the Diary', own:true},
           {t:'A thousand years of history', b:'There has probably been a church here since about 700 AD. In 1086 the rebuilt church was dedicated as a Benedictine priory, a cell of Westminster Abbey. After the Dissolution in 1536 its eastern end was pulled down and the stone reused for Ladye Place. The bell turret and largest bell date from around 1600, the east end was rebuilt in 1852, and the Priory Room was added in 1987.'},
           {t:'Parish of Burchetts Green', b:'St Mary\u2019s is one of three churches in the parish, with St James\u2019s, Stubbings and St John\u2019s, Littlewick Green. Parish office 01628 820077 \u00b7 office@burchettsgreenparish.org (Mon, Tue & Thu 9.30\u201311.30am) for baptisms, weddings, funerals and general enquiries.',
            u:'https://www.burchettsgreenparish.org/hurley', ut:'Parish website'}]},
  {id:'holidays', name:'Holidays and short stays', type:'list', hidden:true, parent:'stay',
    intro:'Places to book a night or a week in Hurley.',
    items:[{t:'The Olde Bell', d:'Historic inn \u00b7 High Street', b:'Boutique rooms in an inn dating back to 1135, with a restaurant and Garden Bar.'},
           {t:'Gable End Annexe', d:'Self-catering annexe \u00b7 sleeps 2', b:'A stylish one-bedroom annexe with a kitchen, patio and balcony. Free private parking, an EV charger and free WiFi.'},
           {t:'The Fox: Country Rooms', d:'Guest rooms', b:'Luxurious country rooms in Hurley, handy for Windsor Castle and Legoland Windsor (about 11 miles).'},
           {t:'Hurley House Hotel', d:'Boutique hotel \u00b7 Henley Road', b:'Ten bedroom suites with a restaurant, bar and garden pavilion.'},
           {t:'Hurley Riverside Park', d:'Holiday park \u00b7 by the Thames', b:'Touring pitches for caravans, motorhomes and tents, plus holiday homes, roughly March to October.',
            u:'place.html?p=riverside', ut:'More about the park', own:true}]},
  {id:'hurleyford', name:'Hurleyford Farm Caravan Park', type:'venue', kind:'Child-free holiday home park', hidden:true, parent:'stay',
    about:'A family-run park of privately owned holiday homes on the south bank of the Thames, run by the Burfitt family for over 90 years. Child-free, set in mature parkland with its own wildlife. Four-star Visit England rated.',
    hours:'Holiday homes open 1 March to 31 January', hoursLabel:'Season',
    noContact:true, address:'Mill Lane, Hurley SL6 5ND'},
  {id:'info', name:'Useful info & trusted tradespeople', type:'list', intro:'Handy numbers, links and contacts for Hurley.',
    links:[{id:'trades', t:'Trusted Tradespeople', d:'Recommended by Hurley residents and Riverside Park owners'},
           {id:'church', t:'St Mary the Virgin', d:'Hurley\u2019s parish church: services, visiting and history'}],
    // u = link, ut = link text
    items:[{t:'Bin collections', b:'Thursdays: recycling every week, rubbish every other week. They’re in the Diary, and you’ll get a reminder at 7pm the night before if notifications are on. Days can differ by street, so check your own address.',
            u:'https://www.rbwm.gov.uk/environment-and-waste/recycling-and-rubbish/find-your-bin-collection-day', ut:'Find your bin day'},
           {t:'Bus times', b:'Route 228 (Thames Valley) Maidenhead \u2013 Hurley \u2013 Henley, Monday to Saturday, about four or five buses a day each way. Stops at Shepherds Close and Hurley Riverside Park. No Sunday service.',
            u:'https://bustimes.org/services/228-maidenhead-henley-via-hurley', ut:'Live timetable'},
           {t:'Doctors', b:'There\u2019s no surgery in Hurley. Find the practices that cover your address on the NHS website. Out of hours, call 111.',
            u:'https://www.nhs.uk/service-search/find-a-gp', ut:'Find a GP'},
           {t:'Parish council', b:'Hurley Parish Council meets on the third Thursday of each month. Clerk: clerk@hurleyparish.org.uk \u00b7 07799 302998',
            u:'https://hurleyparish.org.uk/', ut:'hurleyparish.org.uk'},
           {t:'Village Hall & Village Association', b:'Hurley Village Hall, High Street SL6 5LT. The Hurley Village Association runs the hall and village events: chair@hurleyvillage.co.uk · 07901 297223',
            u:'https://www.hurleyvillage.co.uk/', ut:'hurleyvillage.co.uk'},
           {t:'Emergencies', b:'999 \u00b7 non-emergency police 101 \u00b7 NHS 111'}]},
  // Properties for sale: weekly AI draft from the agents' own websites, approved by the admin before it shows.
  // Info-only for now; a paid listing tier (agents / sellers) is the monetising plan. Same as Willian.
  {id:'property', name:'Properties for sale', type:'digest', kind:'properties', intro:'Homes for sale in Hurley, updated weekly.',
    empty:'No homes listed this week. Check back soon.'},
  {id:'yourway', name:'Your App, your way', type:'yourway'},
  // Not on the home grid: reached from Useful Info
  {id:'trades', name:'Trusted Tradespeople', type:'trades', hidden:true, parent:'info'}
];

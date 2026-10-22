// Hurley app content. Venue/info details researched 2026-10-22 from official sites, CAMRA and council
// listings: check on the ground and correct here.
const VERSION = '0.9.0';

// Who you are in Hurley: one is required (with a name) before posting or suggesting
const ROLES = ['Resident', 'Visitor', 'Work in Village', 'HRP Owner'];

// 24px line icons, drawn with currentColor
const ICONS = {
  news:'<path d="M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2h-1M7 9h7M7 12.5h7M7 16h4"/>',
  board:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  oldebell:'<path d="M12 3a1.5 1.5 0 0 1 1.5 1.5v.6A6 6 0 0 1 18 11v4l2 2.5H4L6 15v-4a6 6 0 0 1 4.5-5.9v-.6A1.5 1.5 0 0 1 12 3zM10 20.5a2 2 0 0 0 4 0"/>',
  risingsun:'<path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0M12 6.5V9M5.5 9.5l1.6 1.6M18.5 9.5l-1.6 1.6M2.5 14.5h2M19.5 14.5h2"/>',
  shop:'<path d="M4 9h16l-1.5-4h-13zM5 9v11h14V9M9.5 20v-6h5v6"/>',
  riverside:'<path d="M3 19l7-13 7 13zM10 6v13M2 22c2-1.3 4-1.3 6 0s4 1.3 6 0 4-1.3 6 0"/>',
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
    hours:'Open daily. Call or see the website for restaurant and bar times.',
    phone:'01628 969790', web:'https://www.theoldebell.co.uk/', address:'High Street, Hurley SL6 5LX', map:'The Olde Bell, High Street, Hurley SL6 5LX'},
  {id:'risingsun', name:'Rising Sun', type:'venue', kind:'Village pub',
    about:'Hurley\u2019s village pub on the High Street, reopened under new management in January 2026 and open seven days a week.',
    hours:'Mon\u2013Thu & Sun 12\u201310pm \u00b7 Fri & Sat 12\u201311pm',
    phone:'01628 769192', web:'', address:'High Street, Hurley SL6 5LT', map:'Rising Sun, High Street, Hurley SL6 5LT'},
  {id:'shop', name:'Village Shop', type:'venue', kind:'Shop, caf\u00e9 & Post Office',
    about:'Serving Hurley for more than 70 years: everyday groceries and essentials, a caf\u00e9, and a Post Office counter.',
    hours:'Open daily until 6pm \u00b7 Post Office counter Tue & Thu 9.30am\u201312pm',
    phone:'', web:'', address:'High Street, Hurley', map:'Hurley Village Shop, High Street, Hurley'},
  {id:'riverside', name:'Hurley Riverside Park', type:'venue', kind:'Holiday park by the Thames',
    about:'Family-run holiday park beside the River Thames between Henley and Marlow: touring pitches for caravans, motorhomes and tents, plus holiday homes, a park shop and riverside walks.',
    hours:'Reception 8am\u20137.30pm \u00b7 Park shop 8.15am\u20137.30pm \u00b7 Touring season roughly March to October',
    phone:'01628 824493', web:'https://www.hurleyriversidepark.co.uk/', address:'Hurley, Maidenhead SL6 5NE', map:'Hurley Riverside Park, Hurley SL6 5NE'},
  {id:'info', name:'Useful info & trusted tradespeople', type:'list', intro:'Handy numbers, links and contacts for Hurley.',
    links:[{id:'trades', t:'Trusted Tradespeople', d:'Recommended by Hurley residents and Riverside Park owners'}],
    // u = link, ut = link text
    items:[{t:'Bin collections', b:'Bins are collected by the Royal Borough of Windsor & Maidenhead. Enter your postcode to see your days for rubbish, recycling, food and garden waste.',
            u:'https://www.rbwm.gov.uk/environment-and-waste/recycling-and-rubbish/find-your-bin-collection-day', ut:'Find your bin day'},
           {t:'Bus times', b:'Route 228 (Thames Valley) Maidenhead \u2013 Hurley \u2013 Henley, Monday to Saturday, about four or five buses a day each way. Stops at Shepherds Close and Hurley Riverside Park. No Sunday service.',
            u:'https://bustimes.org/services/228-maidenhead-henley-via-hurley', ut:'Live timetable'},
           {t:'Doctors', b:'There\u2019s no surgery in Hurley. Find the practices that cover your address on the NHS website. Out of hours, call 111.',
            u:'https://www.nhs.uk/service-search/find-a-gp', ut:'Find a GP'},
           {t:'Parish council', b:'Hurley Parish Council meets on the third Thursday of each month. Clerk: clerk@hurleyparish.org.uk \u00b7 07799 302998',
            u:'https://hurleyparish.org.uk/', ut:'hurleyparish.org.uk'},
           {t:'Church', b:'St Mary the Virgin, by the river at the end of the High Street: once a Benedictine priory, now the parish church. Part of the Parish of Burchetts Green. Parish office 01628 820077.',
            u:'https://www.burchettsgreenparish.org/services', ut:'Service times'},
           {t:'Emergencies', b:'999 \u00b7 non-emergency police 101 \u00b7 NHS 111'}]},
  {id:'yourway', name:'Your App, your way', type:'yourway'},
  // Not on the home grid: reached from Useful Info
  {id:'trades', name:'Trusted Tradespeople', type:'trades', hidden:true, parent:'info'}
];

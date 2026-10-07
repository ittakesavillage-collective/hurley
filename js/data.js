// Hurley app content. Placeholders (xxx) are filled in as real details arrive.
const VERSION = '0.6.0';

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
  yourway:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'
};
const svg = (k, cls) => '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') +
  ' fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICONS[k] + '</svg>';

// Home grid order: 2 columns x 4 rows, "Your App, your way" bottom-right.
// type: venue = a place with details; list = a list of entries; yourway = request/vote panel
const PLACES = [
  {id:'news', name:'News', type:'list', intro:'What\u2019s happening in Hurley.',
    items:[{t:'xxx headline', d:'xxx date', b:'xxx summary of the story.'},
           {t:'xxx headline', d:'xxx date', b:'xxx summary of the story.'},
           {t:'xxx headline', d:'xxx date', b:'xxx summary of the story.'}]},
  {id:'board', name:'Message Board', type:'board', intro:'Notices, lost & found, offers of help and things for sale.'},
  {id:'oldebell', name:'Olde Bell', type:'venue', kind:'Hotel, restaurant & bar',
    about:'xxx short description of the Olde Bell.', hours:'xxx', phone:'xxx', web:'', map:'Ye Olde Bell, Hurley'},
  {id:'risingsun', name:'Rising Sun', type:'venue', kind:'Pub',
    about:'xxx short description of the Rising Sun.', hours:'xxx', phone:'xxx', web:'', map:'Rising Sun, Hurley'},
  {id:'shop', name:'Village Shop', type:'venue', kind:'Shop',
    about:'xxx short description of the village shop.', hours:'xxx', phone:'xxx', web:'', map:'Hurley village shop'},
  {id:'riverside', name:'Hurley Riverside Park', type:'venue', kind:'Caravan & camping park',
    about:'xxx short description of Hurley Riverside Park.', hours:'xxx', phone:'xxx', web:'', map:'Hurley Riverside Park'},
  {id:'info', name:'Useful Info', type:'list', intro:'Handy numbers and dates for Hurley.',
    items:[{t:'Bin collections', b:'xxx'}, {t:'Doctor\u2019s surgery', b:'xxx'}, {t:'Bus times', b:'xxx'},
           {t:'Parish council', b:'xxx'}, {t:'Church', b:'xxx'}, {t:'Emergencies', b:'999 \u00b7 non-emergency police 101 \u00b7 NHS 111'}]},
  {id:'yourway', name:'Your App, your way', type:'yourway'}
];

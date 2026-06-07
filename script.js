/* ══════════════════════════════════════════
   AGE CALCULATOR — SCRIPT.JS
══════════════════════════════════════════ */

'use strict';

// ── DOM REFERENCES ──
const inpDay    = document.getElementById('inp-day');
const inpMonth  = document.getElementById('inp-month');
const inpYear   = document.getElementById('inp-year');
const errorMsg  = document.getElementById('error-msg');
const resultPanel = document.getElementById('result-panel');

// Result elements
const resYears      = document.getElementById('res-years');
const resMonths     = document.getElementById('res-months');
const resDays       = document.getElementById('res-days');
const resTotalDays  = document.getElementById('res-total-days');
const resTotalWeeks = document.getElementById('res-total-weeks');
const resHours      = document.getElementById('res-hours');
const resNextBday   = document.getElementById('res-next-bday');
const resBornDay    = document.getElementById('res-born-day');
const resZodiac     = document.getElementById('res-zodiac');
const lifePercent   = document.getElementById('life-percent');
const lifeBarFill   = document.getElementById('life-bar-fill');

// ── CONSTANTS ──
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS_FULL = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// ── ZODIAC ──
function getZodiac(month, day) {
  const signs = [
    { sign: '♑ Capricorn',   end: [1, 19] },
    { sign: '♒ Aquarius',    end: [2, 18] },
    { sign: '♓ Pisces',      end: [3, 20] },
    { sign: '♈ Aries',       end: [4, 19] },
    { sign: '♉ Taurus',      end: [5, 20] },
    { sign: '♊ Gemini',      end: [6, 20] },
    { sign: '♋ Cancer',      end: [7, 22] },
    { sign: '♌ Leo',         end: [8, 22] },
    { sign: '♍ Virgo',       end: [9, 22] },
    { sign: '♎ Libra',       end: [10, 22] },
    { sign: '♏ Scorpio',     end: [11, 21] },
    { sign: '♐ Sagittarius', end: [12, 21] },
    { sign: '♑ Capricorn',   end: [12, 31] },
  ];
  for (const { sign, end } of signs) {
    if (month < end[0] || (month === end[0] && day <= end[1])) return sign;
  }
  return '♑ Capricorn';
}

// ── VALIDATION ──
function showError(msg) {
  errorMsg.textContent = '⚠ ' + msg;
  errorMsg.classList.add('show');
  resultPanel.classList.remove('visible');
  [inpDay, inpMonth, inpYear].forEach(el => el.style.borderColor = '');
}

function clearError() {
  errorMsg.textContent = '';
  errorMsg.classList.remove('show');
}

// ── FORMAT NUMBERS ──
function fmt(n) { return Number(n).toLocaleString(); }

// ── MAIN CALCULATE ──
function calculateAge() {
  clearError();

  const day   = parseInt(inpDay.value);
  const month = parseInt(inpMonth.value);
  const year  = parseInt(inpYear.value);

  // Basic presence check
  if (!inpDay.value || !inpMonth.value || !inpYear.value) {
    return showError('Please fill in all three fields.');
  }

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return showError('Please enter valid numbers.');
  }

  // Range checks
  if (month < 1 || month > 12) return showError('Month must be between 1 and 12.');
  if (day < 1 || day > 31)     return showError('Day must be between 1 and 31.');
  if (year < 1900 || year > new Date().getFullYear()) return showError('Year must be between 1900 and ' + new Date().getFullYear() + '.');

  // Build DOB
  const dob = new Date(year, month - 1, day);

  // Check if date is real (e.g., Feb 30 rolls over)
  if (
    dob.getFullYear() !== year ||
    dob.getMonth() !== month - 1 ||
    dob.getDate() !== day
  ) {
    return showError('That date doesn\'t exist. Check the day for the selected month.');
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (dob > now) return showError('Date of birth cannot be in the future.');
  if (dob.getTime() === now.getTime()) return showError('You were born today! 🎉');

  // ── AGE CALCULATION ──
  let years  = now.getFullYear() - year;
  let months = now.getMonth() - (month - 1);
  let days   = now.getDate() - day;

  if (days < 0) {
    months--;
    // Days in previous month
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // ── TOTALS ──
  const msPerDay   = 86400000;
  const totalDays  = Math.floor((now - dob) / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // ── NEXT BIRTHDAY ──
  let nextBday = new Date(now.getFullYear(), month - 1, day);
  if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1);
  const daysToNext = Math.ceil((nextBday - now) / msPerDay);
  const nextBdayStr = daysToNext === 0
    ? '🎉 Today!'
    : daysToNext === 1
    ? 'Tomorrow!'
    : `in ${daysToNext} days`;

  // ── LIFE BAR ──
  const lifeProgressPct = Math.min(Math.round((years / 80) * 100), 100);

  // ── UPDATE DOM ──
  resYears.textContent      = years;
  resMonths.textContent     = months;
  resDays.textContent       = days;
  resTotalDays.textContent  = fmt(totalDays) + ' days';
  resTotalWeeks.textContent = fmt(totalWeeks) + ' wks';
  resHours.textContent      = fmt(totalHours) + ' hrs';
  resNextBday.textContent   = nextBdayStr;
  resBornDay.textContent    = WEEKDAYS[dob.getDay()];
  resZodiac.textContent     = getZodiac(month, day);
  lifePercent.textContent   = lifeProgressPct + '%';

  // Animate life bar after a brief delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      lifeBarFill.style.width = lifeProgressPct + '%';
    });
  });

  // Show result
  resultPanel.classList.add('visible');

  // Smooth scroll to result
  setTimeout(() => {
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// ── KEYBOARD SUPPORT ──
[inpDay, inpMonth, inpYear].forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') calculateAge();
  });
  // Auto-advance on 2-digit fill
  el.addEventListener('input', () => {
    if (el === inpDay && el.value.length === 2) inpMonth.focus();
    if (el === inpMonth && el.value.length === 2) inpYear.focus();
  });
});
// src/voice/timeEngine.js
// ─────────────────────────────────────────────────────────────────────────────
// Real-Time Campus Context Engine for Mo (Halalholic AI Avatar)
//
// Dynamically calculates the exact local time, day of the week, campus meal slot,
// student lifestyle vibe, budget hacks, and realistic campus location pools
// (dorms, sports courts, studios, labs, campus jobs, student centers, or some other place)
// with deep psychological variation, proactive humor, and pranky boy energy.
// ─────────────────────────────────────────────────────────────────────────────

export const TIME_SLOTS = {
  EARLY_MORNING: 'EARLY_MORNING',       // 05:00 - 10:29
  LUNCH_RUSH: 'LUNCH_RUSH',             // 10:30 - 14:29
  AFTERNOON_SLUMP: 'AFTERNOON_SLUMP',   // 14:30 - 17:29
  DINNER_RUSH: 'DINNER_RUSH',           // 17:30 - 21:29
  LATE_NIGHT_CRAMMING: 'LATE_NIGHT',     // 21:30 - 01:59
  GRAVEYARD_2AM: 'GRAVEYARD_2AM',       // 02:00 - 04:59
};

/**
 * Returns comprehensive real-time context for Mo to use during conversation.
 * @param {Date} [date] Optional date instance for testing/simulation.
 */
export function getCampusTimeContext(date = new Date()) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const dayIndex = date.getDay(); // 0 = Sun, 6 = Sat
  const isWeekend = dayIndex === 0 || dayIndex === 6;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[dayIndex];

  // 12-hour formatted time string (e.g., "5:50 PM")
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const padMin = String(minute).padStart(2, '0');
  const formattedTime = `${hour12}:${padMin} ${ampm}`;

  const timeDec = hour + minute / 60;

  let slot = TIME_SLOTS.AFTERNOON_SLUMP;
  let slotName = 'Mid-Afternoon Study Slump';
  let campusVibe = 'Afternoon lecture burnout, design studio deadlines, basketball court runs, caffeine crash.';
  let recommendedPick = 'Crispy Seasoned Waffle Fries ($3.99) or 6-Piece Wings ($9.99) with Extra White Sauce to reboot your brain.';
  let budgetHack = '$2.99 Combo Upgrade: add fries and a drink to any item for under three bucks — highest ROI on Marshall St.';
  let realisticLocations = ['design studio', 'sports field / courts', 'afternoon lab', 'dorm nap', 'campus job', 'or some other place'];
  let greetingHooks = [];

  if (timeDec >= 5 && timeDec < 10.5) {
    slot = TIME_SLOTS.EARLY_MORNING;
    slotName = 'Early Morning & 8 AM Lecture Survival';
    campusVibe = 'Freezing campus trek, dragging feet out of the dorm, early morning gym, craving warm fuel before lecture.';
    recommendedPick = 'Lamb or Chicken Gyro Wrap ($7.99) — one-handed, zero-utensils, sprint-to-class aerodynamic.';
    budgetHack = '$7.99 Gyro Wrap is the most portable protein bomb under eight bucks.';
    realisticLocations = ['dorm / hostel bed', 'early morning gym lift', 'campus job shift', 'freezing walk up University Ave', 'or some other place'];
    greetingHooks = [
      `It's ${formattedTime} morning on ${dayOfWeek}. You're Mo. Greet them in 3 SHORT, breathable human lines (max 4-8 words per line): Line 1: "Yo! Look who's up early." Line 2: "That Syracuse wind is freezing today." Line 3: "Did you just walk in from class, the dorms, or somewhere else?" Keep it light, conscious, and warm without over-guessing!`,
      `Morning check-in at ${formattedTime}! You're Mo. Speak in 3 SHORT, touchy sentences: Line 1: "Ayy, morning warrior!" Line 2: "Hope you got some coffee in you." Line 3: "Where'd you just walk over from — dorms, a morning lift, or some other place?" Light and friendly!`,
      `It's ${formattedTime} morning. Greet them in 3 SHORT, human sentences: Line 1: "Look who survived the cold!" Line 2: "Welcome back to the warm zone." Line 3: "Did you just come from an 8 AM, the dorms, or somewhere else?"`,
      `Early morning arrival at ${formattedTime}. Speak in 3 SHORT lines: Line 1: "Yo habibi! Good to see you." Line 2: "You made it through the morning freeze." Line 3: "Where are you coming from today — campus, work, or somewhere else?"`,
    ];
  } else if (timeDec >= 10.5 && timeDec < 14.5) {
    slot = TIME_SLOTS.LUNCH_RUSH;
    slotName = 'Peak Campus Lunch Rush';
    campusVibe = '15-minute gap between classes, pickup games at the courts, campus hub buzzing, speed-running lunch.';
    recommendedPick = 'Chicken or Mix Combo Platter ($9.99) or Gyro Wrap ($7.99) ready in 2 minutes.';
    budgetHack = 'The $9.99 Platter Two-Meal Hack: eat half for lunch, save half in foil for late study session = $5 per meal.';
    realisticLocations = ['lecture hall', 'basketball pickup courts', 'Schine student center', 'library', 'campus job', 'or some other place'];
    greetingHooks = [
      `It is ${formattedTime} on ${dayOfWeek}. You're Mo. Open in 3 SHORT, crisp human lines: Line 1: "Yo! Look who made it in." Line 2: "Midday campus rush is wild right now." Line 3: "Did you just finish class, the gym, or some other place?" Friendly and conscious, zero over-guessing!`,
      `Midday check-in at ${formattedTime}! You're Mo. Speak in 3 SHORT lines: Line 1: "Ayy, what's good, habibi!" Line 2: "Campus is buzzing today." Line 3: "Where did you just walk over from — lecture, the courts, or somewhere else?"`,
      `It's ${formattedTime} midday. Greet in 3 SHORT sentences: Line 1: "Look who made time for lunch!" Line 2: "You look like you've been grinding hard." Line 3: "Did you just escape class, the library, or some other place?"`,
      `Lunch hour arrival at ${formattedTime}. Open in 3 SHORT, touchy lines: Line 1: "Yo! Good to see you, my friend." Line 2: "You survived the morning lectures." Line 3: "Where'd you just come from — class, dorms, or somewhere else?"`,
    ];
  } else if (timeDec >= 14.5 && timeDec < 17.5) {
    slot = TIME_SLOTS.AFTERNOON_SLUMP;
    slotName = 'Mid-Afternoon Study Slump';
    campusVibe = 'Afternoon lecture burnout, sports playground games, studio deadlines, 3-hour dorm nap aftermath.';
    recommendedPick = 'Crispy Sauced Wings ($9.99) or Chicken Dose Platter ($9.99) with Extra White Sauce.';
    budgetHack = 'Upgrade any order with +$2.99 Combo for seasoned waffle fries and soda to power through the afternoon.';
    realisticLocations = ['architecture / art studio', 'playground / sports turf', 'afternoon lab', 'dorm nap', 'campus bookstore job', 'or some other place'];
    greetingHooks = [
      `It is ${formattedTime} afternoon on ${dayOfWeek}. You're Mo. Open in 3 SHORT, breathable human lines: Line 1: "Yo! Look who made it in." Line 2: "You look like you need a real recharge, bro." Line 3: "Where did you just walk over from — studio, classes, or somewhere else?" Warm, light, zero over-guessing!`,
      `Afternoon check-in at ${formattedTime}! Speak in 3 SHORT lines: Line 1: "Ayy, what's good, habibi!" Line 2: "That 3 PM slump hits everyone." Line 3: "Did you just crawl out of the dorms, a lab, or some other place?"`,
      `It's ${formattedTime} afternoon. Open in 3 SHORT lines: Line 1: "Look who made it out alive!" Line 2: "Afternoon labs are brutal today." Line 3: "Where are you coming from — campus, the courts, or somewhere else?"`,
      `Afternoon arrival at ${formattedTime}. Speak in 3 SHORT, friendly lines: Line 1: "Yo! Welcome back to the recharge spot." Line 2: "How's your day treating you so far?" Line 3: "Did you just come from classes, dorms, or some other place?"`,
    ];
  } else if (timeDec >= 17.5 && timeDec < 21.5) {
    slot = TIME_SLOTS.DINNER_RUSH;
    slotName = 'Prime Dinner Rush & Squad Feast';
    campusVibe = isWeekend
      ? 'Weekend night starting, sports fields emptying, squad meeting up, zero study stress.'
      : 'Classes finished, gym workout or sports practice done, student club meetings, off-campus house dinner.';
    recommendedPick = 'The Legendary HolicBucket ($15.99) for the crew or Mix Combo Platter ($9.99) with double meat.';
    budgetHack = 'The $15.99 HolicBucket Squad Hack: feeds 3 students with 4 pitas and a mountain of fries & rice = $5.33 per person, crushing dining hall prices.';
    realisticLocations = ['sports practice / gym workout', 'frat / sorority house', 'Euclid Ave apartment', 'campus club meeting', 'late lecture', 'or some other place'];
    greetingHooks = [
      `It is ${formattedTime} evening on ${dayOfWeek}. You're Mo. Open in 3 SHORT, crisp sentences: Line 1: "Yo! Look who made it in." Line 2: "Classes are finally done for the day." Line 3: "Did you just wrap up from the gym, dorms, or somewhere else?" Light, touchy, friendly!`,
      `Evening check-in at ${formattedTime}! Speak in 3 SHORT lines: Line 1: "What's good, my friend!" Line 2: "Welcome back to the warm food zone." Line 3: "Where'd you just walk over from — practice, the house, or some other place?"`,
      `It's ${formattedTime} dinner hour. Open in 3 SHORT lines: Line 1: "Ayy, habibi! Good to see you." Line 2: "It's freezing out on Marshall Street." Line 3: "Did you just finish at Barnes, classes, or somewhere else?"`,
      `Evening arrival at ${formattedTime}. Speak in 3 SHORT lines: Line 1: "Yo! Welcome to dinner time." Line 2: "How was your day out there?" Line 3: "Did you just come from the library, dorms, or some other place?"`,
    ];
  } else if (timeDec >= 21.5 || timeDec < 2) {
    slot = TIME_SLOTS.LATE_NIGHT_CRAMMING;
    slotName = 'Late-Night Cramming & Midnight Munchies';
    campusVibe = isWeekend
      ? 'Late night weekend party vibes, campus crew wandering Marshall St, gaming marathons in the dorm.'
      : 'Bird Library basement all-nighters, coding hackathons, late-night gym session, desperate midnight study.';
    recommendedPick = 'Loaded Chicken Dose Platter ($9.99) with Extra Holic (+$3.00) or 12 Pieces Wings ($15.99).';
    budgetHack = 'Late-night calorie efficiency: The $9.99 loaded platter delivers basmati rice, protein, fries, and salad to power an all-nighter till sunrise.';
    realisticLocations = ['dorm gaming lounge', 'Bird Library basement', 'late-night Barnes Center lift', 'campus party / hangout', 'Euclid Ave porch', 'or some other place'];
    greetingHooks = [
      `It is ${formattedTime} late night on ${dayOfWeek}. You're Mo. Open in 3 SHORT, breathable sentences: Line 1: "Yo, late-night warrior!" Line 2: "Still out here on campus tonight, huh?" Line 3: "Did you just wander in from the library, dorms, or somewhere else?" Warm, touchy, friendly!`,
      `Late-night arrival at ${formattedTime}! Speak in 3 SHORT lines: Line 1: "Ayy, look who's still awake!" Line 2: "Welcome back to the warm lights." Line 3: "Where'd you just walk over from — study session, dorms, or some other place?"`,
      `It's ${formattedTime} night. Open in 3 SHORT lines: Line 1: "Yo habibi! Still grinding tonight?" Line 2: "Marshall Street is quiet right now." Line 3: "Did you just come from Bird Library, gaming, or somewhere else?"`,
      `Midnight check-in at ${formattedTime}. Speak in 3 SHORT lines: Line 1: "Look who made the midnight run!" Line 2: "Good food hits different at this hour." Line 3: "Where did you just walk in from — dorms, library, or some other place?"`,
    ];
  } else {
    // 02:00 - 05:00
    slot = TIME_SLOTS.GRAVEYARD_2AM;
    slotName = 'The 2 AM Graveyard Shift & All-Nighter Trenches';
    campusVibe = 'True night owl survivors, dorm gaming, thesis crisis, existential hunger, empty dorm fridge sadness.';
    recommendedPick = 'Warm Gyro Wrap ($7.99) or Chicken Platter ($9.99) with extra garlic white sauce.';
    budgetHack = 'Save your wallet from $25 third-party delivery apps: get real hot halal food on Marshall St for eight bucks.';
    realisticLocations = ['dorm room desk', '2 AM campus walk', 'thesis panic in library', 'night gaming session', 'or some other place'];
    greetingHooks = [
      `It is ${formattedTime} in the dead of night on ${dayOfWeek}. You're Mo. Open in 3 SHORT lines: Line 1: "Yo! Look at you awake at 2 AM." Line 2: "We are in the late-night trenches." Line 3: "Did you just emerge from studying, gaming, or somewhere else?" Friendly and light!`,
      `Graveyard shift check-in at ${formattedTime}! Speak in 3 SHORT lines: Line 1: "Ayy, night owl! Good to see you." Line 2: "Real warriors are out at this hour." Line 3: "Where'd you just wander in from — dorm desk, library, or some other place?"`,
    ];
  }

  return {
    rawDate: date,
    hour,
    minute,
    formattedTime,
    dayOfWeek,
    isWeekend,
    slot,
    slotName,
    campusVibe,
    recommendedPick,
    budgetHack,
    realisticLocations,
    greetingHooks,
  };
}

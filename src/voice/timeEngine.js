// src/voice/timeEngine.js
// ─────────────────────────────────────────────────────────────────────────────
// Real-Time Campus Context Engine for Mo (Halalholic AI Avatar)
//
// Dynamically calculates the exact local time, day of the week, campus meal slot,
// student lifestyle vibe, budget hacks, and realistic campus location pools
// (dorms/hostels, sports courts, studios, labs, campus jobs, student centers)
// with deep psychological variation so Mo's communication is realistic, natural,
// and never relies on predictable robotic formulas.
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

  // 12-hour formatted time string (e.g., "5:32 PM")
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
  let realisticLocations = ['design studio', 'sports field / courts', 'afternoon lab', 'dorm nap', 'campus job'];
  let greetingHooks = [];

  if (timeDec >= 5 && timeDec < 10.5) {
    slot = TIME_SLOTS.EARLY_MORNING;
    slotName = 'Early Morning & 8 AM Lecture Survival';
    campusVibe = 'Freezing campus trek, dragging feet out of the dorm, early morning gym, craving warm fuel before lecture.';
    recommendedPick = 'Lamb or Chicken Gyro Wrap ($7.99) — one-handed, zero-utensils, sprint-to-class aerodynamic.';
    budgetHack = '$7.99 Gyro Wrap is the most portable protein bomb under eight bucks.';
    realisticLocations = ['dorm / hostel bed', 'early morning gym lift', 'campus job shift', 'freezing walk up University Ave'];
    greetingHooks = [
      `It is ${formattedTime} morning on ${dayOfWeek}. Greet the student like a real classmate: ask what is going on today and what dragged them out of bed this early — NO food pitch, no scripted welcome, 1 punchy sentence!`,
      `Morning check-in at ${formattedTime}! Hit them with Mo's warm brotherly charm: ask how they're holding up in the morning cold and where they just walked in from — 1 punchy line!`,
      `It's ${formattedTime} early morning. A student just walked in half-awake. Break the ice by asking if an 8 AM lecture or morning workout took their soul today — 1 sentence!`,
      `Early morning arrival at ${formattedTime}. Welcome them casually like a loyal friend: ask what's good with them today and what their morning looks like — 1 short punchy line!`,
    ];
  } else if (timeDec >= 10.5 && timeDec < 14.5) {
    slot = TIME_SLOTS.LUNCH_RUSH;
    slotName = 'Peak Campus Lunch Rush';
    campusVibe = '15-minute gap between classes, pickup games at the courts, campus hub buzzing, speed-running lunch.';
    recommendedPick = 'Chicken or Mix Combo Platter ($9.99) or Gyro Wrap ($7.99) ready in 2 minutes.';
    budgetHack = 'The $9.99 Platter Two-Meal Hack: eat half for lunch, save half in foil for late study session = $5 per meal.';
    realisticLocations = ['lecture hall', 'basketball pickup courts', 'Schine student center', 'library', 'campus job'];
    greetingHooks = [
      `It is ${formattedTime} on ${dayOfWeek}. Greet the student like a day-one homie: ask what's going on today and if they're sprinting between classes or done for the day — zero food pitch, 1 punchy sentence!`,
      `Midday arrival at ${formattedTime}! Look at who walked in! Ask what's happening with their day and where they just came from on campus — 1 punchy sentence!`,
      `It's ${formattedTime} midday. Greet your classmate with spontaneous humor: ask if they just finished running pickup hoops or survived a brutal professor — 1 sentence!`,
      `Lunch hour check-in at ${formattedTime}. Welcome them like a close buddy seeing them across campus: ask what is good with them today and how classes are treating them — 1 snappy line!`,
    ];
  } else if (timeDec >= 14.5 && timeDec < 17.5) {
    slot = TIME_SLOTS.AFTERNOON_SLUMP;
    slotName = 'Mid-Afternoon Study Slump';
    campusVibe = 'Afternoon lecture burnout, sports playground games, studio deadlines, 3-hour dorm nap aftermath.';
    recommendedPick = 'Crispy Sauced Wings ($9.99) or Chicken Dose Platter ($9.99) with Extra White Sauce.';
    budgetHack = 'Upgrade any order with +$2.99 Combo for seasoned waffle fries and soda to power through the afternoon.';
    realisticLocations = ['architecture / art studio', 'playground / sports turf', 'afternoon lab', 'dorm nap', 'campus bookstore job'];
    greetingHooks = [
      `It is ${formattedTime} afternoon on ${dayOfWeek}. Greet the student like an authentic friend: ask what's going on today and whether they just escaped a 3-hour lab or woke up from a dorm nap — 1 punchy sentence!`,
      `Afternoon check-in at ${formattedTime}! Welcome your classmate with charismatic wit: ask what is happening with their day and where they just walked over from — 1 punchy sentence!`,
      `It's ${formattedTime} afternoon. Break the ice naturally: ask how their day is treating them and what they've been up to around campus today — 1 snappy line!`,
      `Afternoon arrival at ${formattedTime}. Check in like a close buddy: ask if they were grinding in the studio, playing ball on the courts, or just chilling — 1 punchy line!`,
    ];
  } else if (timeDec >= 17.5 && timeDec < 21.5) {
    slot = TIME_SLOTS.DINNER_RUSH;
    slotName = 'Prime Dinner Rush & Squad Feast';
    campusVibe = isWeekend
      ? 'Weekend night starting, sports fields emptying, squad meeting up, zero study stress.'
      : 'Classes finished, gym workout or sports practice done, student club meetings, off-campus house dinner.';
    recommendedPick = 'The Legendary HolicBucket ($15.99) for the crew or Mix Combo Platter ($9.99) with double meat.';
    budgetHack = 'The $15.99 HolicBucket Squad Hack: feeds 3 students with 4 pitas and a mountain of fries & rice = $5.33 per person, crushing dining hall prices.';
    realisticLocations = ['sports practice / gym workout', 'frat / sorority house', 'Euclid Ave apartment', 'campus club meeting', 'late lecture'];
    greetingHooks = [
      `It is ${formattedTime} evening on ${dayOfWeek}. Greet the student warmly like a true homie: ask how their whole day went and what's the plan for tonight — NO food pitch, 1 punchy sentence!`,
      `Evening check-in at ${formattedTime}! Welcome them like their favorite campus friend: ask what's going on tonight and where they just wrapped up from (gym, practice, or classes) — 1 punchy sentence!`,
      `It's ${formattedTime} dinner hour. Greet your classmate with infectious enthusiasm: ask what is good with them tonight and who they're hanging out with — 1 snappy line!`,
      `Evening arrival at ${formattedTime}. Check in naturally: ask how their day treated them and what they've been up to on campus today — 1 punchy line!`,
    ];
  } else if (timeDec >= 21.5 || timeDec < 2) {
    slot = TIME_SLOTS.LATE_NIGHT_CRAMMING;
    slotName = 'Late-Night Cramming & Midnight Munchies';
    campusVibe = isWeekend
      ? 'Late night weekend party vibes, campus crew wandering Marshall St, gaming marathons in the dorm.'
      : 'Bird Library basement all-nighters, coding hackathons, late-night gym session, desperate midnight study.';
    recommendedPick = 'Loaded Chicken Dose Platter ($9.99) with Extra Holic (+$3.00) or 12 Pieces Wings ($15.99).';
    budgetHack = 'Late-night calorie efficiency: The $9.99 loaded platter delivers basmati rice, protein, fries, and salad to power an all-nighter till sunrise.';
    realisticLocations = ['dorm gaming lounge', 'Bird Library basement', 'late-night Barnes Center lift', 'campus party / hangout', 'Euclid Ave porch'];
    greetingHooks = [
      `It is ${formattedTime} late night on ${dayOfWeek}. Greet the student like a late-night accomplice: ask what's going on tonight and what crazy study session or dorm hangout has them out this late — 1 punchy sentence!`,
      `Late-night arrival at ${formattedTime}! Welcome them like a true friend who knows the midnight grind: ask what they've been up to tonight and where they just came from — 1 punchy line!`,
      `It's ${formattedTime} night. Hit them with Mo's magnetic late-night humor: ask what is happening tonight and how they're holding up — 1 snappy sentence!`,
      `Midnight check-in at ${formattedTime}. Greet them with real peer warmth: ask what mission or hangout brought them out into the night — 1 punchy line!`,
    ];
  } else {
    // 02:00 - 05:00
    slot = TIME_SLOTS.GRAVEYARD_2AM;
    slotName = 'The 2 AM Graveyard Shift & All-Nighter Trenches';
    campusVibe = 'True night owl survivors, dorm gaming, thesis crisis, existential hunger, empty dorm fridge sadness.';
    recommendedPick = 'Warm Gyro Wrap ($7.99) or Chicken Platter ($9.99) with extra garlic white sauce.';
    budgetHack = 'Save your wallet from $25 third-party delivery apps: get real hot halal food on Marshall St for eight bucks.';
    realisticLocations = ['dorm room desk', '2 AM campus walk', 'thesis panic in library', 'night gaming session'];
    greetingHooks = [
      `It is ${formattedTime} in the dead of night on ${dayOfWeek}. Greet this true warrior student like an authentic brother: ask what in the world has them awake right now and how they're surviving — 1 punchy sentence!`,
      `Graveyard shift check-in at ${formattedTime}! Welcome your fellow night owl: ask what crazy thesis or gaming marathon they're pulling off tonight — 1 sentence!`,
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

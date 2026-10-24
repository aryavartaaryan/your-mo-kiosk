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
      `It is ${formattedTime} morning on ${dayOfWeek}. Greet the student like a funny, pranky classmate: ask what is going on today and where they just crawled in from (an 8 AM lecture, morning gym workout, dorm bunk, or some other place?) — 1 punchy sentence, no food pitch!`,
      `Morning check-in at ${formattedTime}! Crack a quick laugh with Mo's pranky charm: ask how they're surviving the cold morning and where they just walked in from (dorm, gym, shift, or somewhere else?) — 1 punchy line!`,
      `It's ${formattedTime} morning. Hit them with Mo's warm brotherly humor: ask what dragged them out of bed so early and where they just came from (class, workout, bed, or some other place?) — 1 sentence!`,
      `Early morning arrival at ${formattedTime}. Check in like a close friend: ask what's good today and where they just made their way from (dorm, lecture, campus job, or some other place?) — 1 snappy line!`,
    ];
  } else if (timeDec >= 10.5 && timeDec < 14.5) {
    slot = TIME_SLOTS.LUNCH_RUSH;
    slotName = 'Peak Campus Lunch Rush';
    campusVibe = '15-minute gap between classes, pickup games at the courts, campus hub buzzing, speed-running lunch.';
    recommendedPick = 'Chicken or Mix Combo Platter ($9.99) or Gyro Wrap ($7.99) ready in 2 minutes.';
    budgetHack = 'The $9.99 Platter Two-Meal Hack: eat half for lunch, save half in foil for late study session = $5 per meal.';
    realisticLocations = ['lecture hall', 'basketball pickup courts', 'Schine student center', 'library', 'campus job', 'or some other place'];
    greetingHooks = [
      `It is ${formattedTime} on ${dayOfWeek}. Greet the student like a funny, pranky classmate: ask what's going on today and where they just came from (sprinting from a lecture, pickup hoops at the courts, library, or some other place?) — 1 punchy sentence!`,
      `Midday arrival at ${formattedTime}! Look who made it! Break the ice with funny classmate energy: ask where they just walked in from (class, the courts, dorm, or somewhere else?) — 1 punchy sentence!`,
      `It's ${formattedTime} midday. Greet your classmate with spontaneous humor: ask what's happening with their day and where they just escaped from (a professor, the gym, student center, or some other place?) — 1 sentence!`,
      `Lunch hour check-in at ${formattedTime}. Welcome them with charismatic peer wit: ask what is good with them today and where they just came from (classes, courts, work, or some other place?) — 1 snappy line!`,
    ];
  } else if (timeDec >= 14.5 && timeDec < 17.5) {
    slot = TIME_SLOTS.AFTERNOON_SLUMP;
    slotName = 'Mid-Afternoon Study Slump';
    campusVibe = 'Afternoon lecture burnout, sports playground games, studio deadlines, 3-hour dorm nap aftermath.';
    recommendedPick = 'Crispy Sauced Wings ($9.99) or Chicken Dose Platter ($9.99) with Extra White Sauce.';
    budgetHack = 'Upgrade any order with +$2.99 Combo for seasoned waffle fries and soda to power through the afternoon.';
    realisticLocations = ['architecture / art studio', 'playground / sports turf', 'afternoon lab', 'dorm nap', 'campus bookstore job', 'or some other place'];
    greetingHooks = [
      `It is ${formattedTime} afternoon on ${dayOfWeek}. Greet the student like a funny, pranky classmate: ask what is going on today and where they just came from (a 3-hour lab, design studio, turf fields, waking from a nap, or some other place?) — 1 punchy sentence!`,
      `Afternoon check-in at ${formattedTime}! Welcome your classmate with humorous charm: ask how their day is going and where they just walked over from (studio, the courts, classes, or somewhere else?) — 1 punchy sentence!`,
      `It's ${formattedTime} afternoon. Break the ice naturally: ask what's happening with them today and where they just escaped from (lecture, dorm hibernation, gym, or some other place?) — 1 snappy line!`,
      `Afternoon arrival at ${formattedTime}. Check in like a close buddy with funny boy energy: ask where they just came from (sports courts, studio grind, library, or some other place?) — 1 punchy line!`,
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
      `It is ${formattedTime} evening on ${dayOfWeek}. Greet the student with pranky, charismatic warmth: ask how their whole day went and where they just walked in from (gym lift, sports practice, Euclid house, or some other place?) — 1 punchy sentence!`,
      `Evening check-in at ${formattedTime}! Welcome them like their favorite funny friend: ask what's going on tonight and where they just wrapped up from (Barnes Center, student club, dorm, or somewhere else?) — 1 punchy sentence!`,
      `It's ${formattedTime} dinner hour. Greet your classmate with infectious humor: ask what is good with them tonight and where they just came from (practice, classes, hangout, or some other place?) — 1 snappy line!`,
      `Evening arrival at ${formattedTime}. Check in with brotherly humor: ask what's the plan tonight and where they just came over from (dorm, gym, library, or some other place?) — 1 punchy line!`,
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
      `It is ${formattedTime} late night on ${dayOfWeek}. Greet the student like a funny late-night accomplice: ask what's going on tonight and where they just wandered in from (dorm gaming session, Bird Library basement, late gym lift, or some other place?) — 1 punchy sentence!`,
      `Late-night arrival at ${formattedTime}! Welcome them with pranky, magnetic wit: ask what crazy mission has them out this late and where they came from (the library, a party, dorm, or somewhere else?) — 1 punchy line!`,
      `It's ${formattedTime} night. Hit them with Mo's funny late-night humor: ask what's happening tonight and where they just came from (hackathon, dorm hangout, gym, or some other place?) — 1 snappy sentence!`,
      `Midnight check-in at ${formattedTime}. Greet them with real peer humor: ask what brought them out into the Syracuse night and where they just walked in from (dorm, library, or some other place?) — 1 punchy line!`,
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
      `It is ${formattedTime} in the dead of night on ${dayOfWeek}. Greet this warrior student with pranky brotherly humor: ask what crazy thesis, gaming session, or other place has them out at this wild hour — 1 punchy sentence!`,
      `Graveyard shift check-in at ${formattedTime}! Welcome your fellow night owl: ask where they just emerged from (dorm desk, library basement, 2 AM walk, or somewhere else?) — 1 sentence!`,
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

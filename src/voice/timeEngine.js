// src/voice/timeEngine.js
// ─────────────────────────────────────────────────────────────────────────────
// Real-Time Campus Context Engine for Mo (Halalholic AI Avatar)
//
// Dynamically calculates the exact local time, day of the week, campus meal slot,
// student lifestyle vibe, budget hacks, and realistic campus location pools
// (dorms/hostels, sports courts, studios, labs, campus jobs, student centers)
// so Mo's communication is realistic, hyper-varied, and never robotic.
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

  // 12-hour formatted time string (e.g., "4:54 PM")
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
      `It is ${formattedTime} morning on ${dayOfWeek}. Welcome them warmly to Halalholic as the best place to recharge, and ask like a real friend what's going on and where they just walked in from (crawling out of the dorm, morning gym, or an 8 AM lecture) — NO food pitch yet, 1 punchy sentence!`,
      `Morning check-in at ${formattedTime}! Welcome your classmate to the recharge zone, ask how their morning is starting, and ask if they just rolled out of bed or came from an early shift — 1 punchy sentence!`,
      `It's ${formattedTime} on campus. Greet them with Mo's warm brotherly charm, welcome them to Halalholic to recharge, and ask what gave them the strength to brave the cold morning — 1 sentence!`,
      `Early morning welcome at ${formattedTime}! Tell them welcome to Halalholic where they can recharge their soul, and ask where they're heading from right now — 1 snappy line!`,
    ];
  } else if (timeDec >= 10.5 && timeDec < 14.5) {
    slot = TIME_SLOTS.LUNCH_RUSH;
    slotName = 'Peak Campus Lunch Rush';
    campusVibe = '15-minute gap between classes, pickup games at the courts, campus hub buzzing, speed-running lunch.';
    recommendedPick = 'Chicken or Mix Combo Platter ($9.99) or Gyro Wrap ($7.99) ready in 2 minutes.';
    budgetHack = 'The $9.99 Platter Two-Meal Hack: eat half for lunch, save half in foil for late study session = $5 per meal.';
    realisticLocations = ['lecture hall', 'basketball pickup courts', 'Schine student center', 'library', 'campus job'];
    greetingHooks = [
      `It is ${formattedTime} on ${dayOfWeek}. Welcome the student to Halalholic as the best place to recharge, ask what's going on today, and ask where they just came from (lecture hall, basketball court, or student center) — DO NOT pitch food yet, 1 punchy sentence!`,
      `Midday check-in at ${formattedTime}! Give a high-energy welcome to the Halalholic recharge sanctuary, and ask what they've been up to on campus today — 1 punchy sentence!`,
      `It's ${formattedTime} lunch hour. Welcome your classmate to Halalholic to recharge their battery, and ask if they just escaped a brutal professor or finished running the courts — 1 punchy line!`,
      `Welcome your fellow student to Halalholic at ${formattedTime}! Tell them they're in the right spot to recharge, and ask where they just walked in from — 1 fresh, snappy sentence!`,
    ];
  } else if (timeDec >= 14.5 && timeDec < 17.5) {
    slot = TIME_SLOTS.AFTERNOON_SLUMP;
    slotName = 'Mid-Afternoon Study Slump';
    campusVibe = 'Afternoon lecture burnout, sports playground games, studio deadlines, 3-hour dorm nap aftermath.';
    recommendedPick = 'Crispy Sauced Wings ($9.99) or Chicken Dose Platter ($9.99) with Extra White Sauce.';
    budgetHack = 'Upgrade any order with +$2.99 Combo for seasoned waffle fries and soda to power through the afternoon.';
    realisticLocations = ['architecture / art studio', 'playground / sports turf', 'afternoon lab', 'dorm nap', 'campus bookstore job'];
    greetingHooks = [
      `It is ${formattedTime} afternoon on ${dayOfWeek}. Welcome them warmly to Halalholic — the best place on campus to recharge! Ask what's going on and where they just walked over from (studio project, playground courts, or waking from a nap) — zero food talk yet, 1 punchy sentence!`,
      `Afternoon check-in at ${formattedTime}! Welcome your classmate to the recharge zone, ask what's happening with their day, and ask what they just wrapped up — 1 punchy sentence!`,
      `It's ${formattedTime} in the afternoon. Hit them with Mo's magnetic charm: welcome them to Halalholic to recharge, and ask if they just finished playing sports, classes, or working a campus shift — 1 sentence!`,
      `Welcome to Halalholic at ${formattedTime}! Tell them you're hyped they stopped by the recharge sanctuary, and ask where they just walked in from — 1 punchy line!`,
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
      `It is ${formattedTime} evening on ${dayOfWeek}. Welcome the student to Halalholic — the best place in Syracuse to recharge! Ask what is going on tonight and where they just came from (sports practice, the gym, club meeting, or their dorm) — DO NOT pitch food yet, 1 punchy sentence!`,
      `Evening welcome at ${formattedTime}! Tell them welcome to Halalholic to recharge after a long day, and ask how their day treated them — 1 punchy sentence!`,
      `It's ${formattedTime} dinner time. Welcome your campus buddy to the flavor recharge sanctuary, and ask where they just walked in from tonight — 1 sentence!`,
      `Dinner hour welcome at ${formattedTime}! Welcome them warmly to Halalholic, the number-one spot to recharge, and ask what's good with them tonight — 1 fresh, funny line!`,
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
      `It is ${formattedTime} late night on ${dayOfWeek}. Welcome the student to Halalholic — the best spot in Syracuse to recharge! Ask what's going on tonight and where they just came from (dorm gaming session, library basement, or late workout) — zero food pitch yet, 1 punchy sentence!`,
      `Late-night check-in at ${formattedTime}! Welcome them to the Halalholic midnight recharge sanctuary, and ask what crazy mission or hangout has them out this late — 1 punchy sentence!`,
      `It's ${formattedTime} night. Welcome your fellow student to Halalholic to recharge their battery, and ask where they just walked over from — 1 snappy line!`,
      `Midnight welcome at ${formattedTime}! Tell them welcome to Halalholic, the best place on Marshall St to recharge, and ask what's happening with them tonight — 1 punchy line!`,
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
      `It is ${formattedTime} in the dead of night on ${dayOfWeek}. Welcome this warrior student to Halalholic — the absolute best place to recharge! Ask what is going on tonight and what brought them out at this insane hour — DO NOT pitch food yet, 1 punchy sentence!`,
      `Graveyard shift check-in at ${formattedTime}! Welcome your fellow night owl to the Halalholic recharge sanctuary, and ask what they've been working on or where they came from — 1 sentence!`,
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

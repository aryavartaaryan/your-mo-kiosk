// src/voice/timeEngine.js
// ─────────────────────────────────────────────────────────────────────────────
// Real-Time Campus Context Engine for Mo (Halalholic AI Avatar)
//
// Dynamically calculates the exact local time, day of the week, campus meal slot,
// student lifestyle vibe, and budget hacks so Mo can speak like a hyper-aware,
// charismatic, multi-billion-dollar modern AI companion.
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
  let campusVibe = 'Brain fried from consecutive lectures, Bird Library exhaustion, caffeine crash.';
  let recommendedPick = 'Crispy Seasoned Waffle Fries ($3.99) or 6-Piece Wings ($9.99) with Extra White Sauce to reboot your brain.';
  let budgetHack = '$2.99 Combo Upgrade: add fries and a drink to any item for under three bucks — highest ROI on Marshall St.';
  let greetingHooks = [];

  if (timeDec >= 5 && timeDec < 10.5) {
    slot = TIME_SLOTS.EARLY_MORNING;
    slotName = 'Early Morning & 8 AM Lecture Survival';
    campusVibe = 'Freezing campus trek, dragging feet, surviving attendance, craving warm fuel before lecture.';
    recommendedPick = 'Lamb or Chicken Gyro Wrap ($7.99) — one-handed, zero-utensils, sprint-to-class aerodynamic.';
    budgetHack = '$7.99 Gyro Wrap is the most portable protein bomb under eight bucks.';
    greetingHooks = [
      `It is ${formattedTime} on a ${dayOfWeek}. Greet the student asking what brutal morning class they're surviving today in Mo's punchy 1-sentence wit!`,
      `It's ${formattedTime} morning. A student just walked up half-asleep. Give a warm, hilarious classmate greeting asking if an 8 AM lecture took their soul!`,
      `Morning rush at ${formattedTime}! Welcome your fellow student asking what major has them awake this early and what hot wrap can rescue them in 1 sentence!`,
    ];
  } else if (timeDec >= 10.5 && timeDec < 14.5) {
    slot = TIME_SLOTS.LUNCH_RUSH;
    slotName = 'Peak Campus Lunch Rush';
    campusVibe = '15-minute gap between classes, packed counter, hunger peaking, speed-running lunch.';
    recommendedPick = 'Chicken or Mix Combo Platter ($9.99) or Gyro Wrap ($7.99) ready in 2 minutes.';
    budgetHack = 'The $9.99 Platter Two-Meal Hack: eat half for lunch, save half in foil for late study session = $5 per meal.';
    greetingHooks = [
      `It is ${formattedTime} lunch rush on a ${dayOfWeek}! Greet the student asking if they're sprinting between classes and what major they're in — 1 punchy sentence!`,
      `Peak lunch at ${formattedTime}! Welcome your classmate with fast-talking Mo charm asking what class they just escaped from — 1 sentence!`,
      `It's ${formattedTime}. Ask what they're studying on campus and whether they need a speed-run gyro or a loaded rice platter today!`,
    ];
  } else if (timeDec >= 14.5 && timeDec < 17.5) {
    slot = TIME_SLOTS.AFTERNOON_SLUMP;
    slotName = 'Mid-Afternoon Study Slump';
    campusVibe = 'Afternoon lecture burnout, Bird Library basement fatigue, caffeine wearing off.';
    recommendedPick = 'Crispy Sauced Wings ($9.99) or Chicken Dose Platter ($9.99) with Extra White Sauce.';
    budgetHack = 'Upgrade any order with +$2.99 Combo for seasoned waffle fries and soda to power through the afternoon.';
    greetingHooks = [
      `It is ${formattedTime} in the afternoon on ${dayOfWeek}. Greet the student asking what lecture or lab just melted their brain — 1 punchy sentence!`,
      `Afternoon study slump at ${formattedTime}! Welcome your fellow student with Mo's witty charm asking what major they're grinding in!`,
      `It's ${formattedTime}. Hit them with a quick laugh about surviving afternoon classes and ask what fuel they need to reboot their brain!`,
    ];
  } else if (timeDec >= 17.5 && timeDec < 21.5) {
    slot = TIME_SLOTS.DINNER_RUSH;
    slotName = 'Prime Dinner Rush & Squad Feast';
    campusVibe = isWeekend
      ? 'Weekend night starting, squad meeting up, hungry for big feast, zero study stress.'
      : 'Classes done for the day, library crew unwinding, roommate dinners, debating who pays.';
    recommendedPick = 'The Legendary HolicBucket ($15.99) for the crew or Mix Combo Platter ($9.99) with double meat.';
    budgetHack = 'The $15.99 HolicBucket Squad Hack: feeds 3 students with 4 pitas and a mountain of fries & rice = $5.33 per person, crushing dining hall prices.';
    greetingHooks = [
      `It is ${formattedTime} dinner time on ${dayOfWeek}! Greet the student warmly asking if they're rolling solo or with the squad — 1 punchy sentence!`,
      `Dinner rush at ${formattedTime}! Welcome your fellow classmate asking what major they conquered today and what feast they earned!`,
      `It's ${formattedTime} evening. Greet them like a true campus homie asking if they're ready for loaded rice platters or wings tonight!`,
    ];
  } else if (timeDec >= 21.5 || timeDec < 2) {
    slot = TIME_SLOTS.LATE_NIGHT_CRAMMING;
    slotName = 'Late-Night Cramming & Midnight Munchies';
    campusVibe = isWeekend
      ? 'Late night weekend vibes, post-party hunger, campus crew craving hot white sauce.'
      : 'Finals week cramming, Bird Library all-nighters, coding hackathons, desperate midnight cravings.';
    recommendedPick = 'Loaded Chicken Dose Platter ($9.99) with Extra Holic (+$3.00) or 12 Pieces Wings ($15.99).';
    budgetHack = 'Late-night calorie efficiency: The $9.99 loaded platter delivers basmati rice, protein, fries, and salad to power an all-nighter till sunrise.';
    greetingHooks = [
      `It is ${formattedTime} late night on ${dayOfWeek}! Greet the student asking what crazy exam or project has them up, or if they have midnight cravings — 1 punchy sentence!`,
      `Midnight munchies at ${formattedTime}! Welcome your classmate with fast Mo humor asking what major keeps them grinding this late!`,
      `It's ${formattedTime} night. Hit them with Mo's late-night energy: ask what class took their sleep and offer comfort carbs!`,
    ];
  } else {
    // 02:00 - 05:00
    slot = TIME_SLOTS.GRAVEYARD_2AM;
    slotName = 'The 2 AM Graveyard Shift & All-Nighter Trenches';
    campusVibe = 'True night owl survivors, thesis panic, existential hunger, empty dorm fridge sadness.';
    recommendedPick = 'Warm Gyro Wrap ($7.99) or Chicken Platter ($9.99) with extra garlic white sauce.';
    budgetHack = 'Save your wallet from $25 third-party delivery apps: get real hot halal food on Marshall St for eight bucks.';
    greetingHooks = [
      `It is ${formattedTime} in the dead of night on ${dayOfWeek}! Greet this true warrior student with Mo's brotherly humor asking what all-nighter they're surviving — 1 punchy sentence!`,
      `Graveyard shift at ${formattedTime}! Welcome your fellow night owl asking what major or thesis is keeping them awake in 1 sentence!`,
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
    greetingHooks,
  };
}

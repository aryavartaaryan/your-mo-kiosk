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
      `It is ${formattedTime} on a ${dayOfWeek}. Greet the student warmly like a real friend, ask what is going on today, and ask where they just came from this early (lecture, morning gym workout, or dorm) — DO NOT pitch food yet, 1 punchy sentence!`,
      `Morning check-in at ${formattedTime}! Welcome them like an authentic campus classmate, ask what's going on, and ask where they just walked in from right now — 1 punchy sentence!`,
      `It's ${formattedTime} morning. Hit them with Mo's warm brotherly charm: ask what's going on with them and where they just survived walking from — 1 sentence!`,
    ];
  } else if (timeDec >= 10.5 && timeDec < 14.5) {
    slot = TIME_SLOTS.LUNCH_RUSH;
    slotName = 'Peak Campus Lunch Rush';
    campusVibe = '15-minute gap between classes, packed counter, hunger peaking, speed-running lunch.';
    recommendedPick = 'Chicken or Mix Combo Platter ($9.99) or Gyro Wrap ($7.99) ready in 2 minutes.';
    budgetHack = 'The $9.99 Platter Two-Meal Hack: eat half for lunch, save half in foil for late study session = $5 per meal.';
    greetingHooks = [
      `It is ${formattedTime} on ${dayOfWeek}. Greet the student like a true homie, ask what's going on, and ask factually where they just walked in from (lecture hall, gym, or library) — DO NOT pitch food yet, 1 punchy sentence!`,
      `Midday check-in at ${formattedTime}! Welcome your classmate with fast-talking Mo warmth, ask what is happening with their day, and ask where they just escaped from — 1 punchy sentence!`,
      `It's ${formattedTime}. Greet them like a real friend asking what's good today and where they just walked over from on campus — 1 punchy sentence!`,
    ];
  } else if (timeDec >= 14.5 && timeDec < 17.5) {
    slot = TIME_SLOTS.AFTERNOON_SLUMP;
    slotName = 'Mid-Afternoon Study Slump';
    campusVibe = 'Afternoon lecture burnout, Bird Library basement fatigue, caffeine wearing off.';
    recommendedPick = 'Crispy Sauced Wings ($9.99) or Chicken Dose Platter ($9.99) with Extra White Sauce.';
    budgetHack = 'Upgrade any order with +$2.99 Combo for seasoned waffle fries and soda to power through the afternoon.';
    greetingHooks = [
      `It is ${formattedTime} in the afternoon on ${dayOfWeek}. Greet the student like their favorite friend, ask what's going on, and ask where they just came from right now (classes, the gym, or the library) — zero food talk yet, 1 punchy sentence!`,
      `Afternoon check-in at ${formattedTime}! Break the ice with genuine friend banter, ask what is going on today and where they just walked in from — 1 punchy sentence!`,
      `It's ${formattedTime} afternoon. Welcome your fellow student like a real classmate: ask what's happening and what they've been up to today — 1 sentence!`,
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
      `It is ${formattedTime} evening on ${dayOfWeek}. Greet the student like a day-one friend, ask what's going on tonight, and ask where they just came from (lecture wrap-up, gym, or dorm) — DO NOT pitch food yet, 1 punchy sentence!`,
      `Evening welcome at ${formattedTime}! Greet them warmly like their campus buddy, ask how their day went and what's happening right now — 1 punchy sentence!`,
      `It's ${formattedTime} dinner time. Check in with real friend energy: ask what is going on with them tonight and where they just walked in from — 1 sentence!`,
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
      `It is ${formattedTime} late night on ${dayOfWeek}. Greet the student like a real homie, ask what's going on tonight, and ask where they just walked in from (Bird Library, late gym lift, or dorm) — zero food pitch yet, 1 punchy sentence!`,
      `Late-night check-in at ${formattedTime}! Welcome them like their favorite companion, ask what is happening tonight and where they just came from — 1 punchy sentence!`,
      `It's ${formattedTime} night. Hit them with Mo's late-night friend energy: ask what's going on and what they've been grinding on tonight — 1 sentence!`,
    ];
  } else {
    // 02:00 - 05:00
    slot = TIME_SLOTS.GRAVEYARD_2AM;
    slotName = 'The 2 AM Graveyard Shift & All-Nighter Trenches';
    campusVibe = 'True night owl survivors, thesis panic, existential hunger, empty dorm fridge sadness.';
    recommendedPick = 'Warm Gyro Wrap ($7.99) or Chicken Platter ($9.99) with extra garlic white sauce.';
    budgetHack = 'Save your wallet from $25 third-party delivery apps: get real hot halal food on Marshall St for eight bucks.';
    greetingHooks = [
      `It is ${formattedTime} in the dead of night on ${dayOfWeek}. Greet this fellow student like a true companion, ask what is going on, and ask where they've been or what they're working on — DO NOT pitch food yet, 1 punchy sentence!`,
      `Graveyard shift check-in at ${formattedTime}! Welcome your fellow night owl asking what's going on tonight and where they just walked in from — 1 sentence!`,
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

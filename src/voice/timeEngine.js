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
      `It is ${formattedTime} on ${dayOfWeek}. A classmate just walked up half-asleep. Greet them like a funny friend asking what brutal morning class took their soul — NO food pitch, 1 punchy sentence!`,
      `Morning at ${formattedTime}! Welcome the student like a campus buddy asking what major had them dragging their feet in the cold this early — 1 funny sentence, no food talk yet!`,
      `It's ${formattedTime} morning. Hit them with a warm laugh asking if they're actually awake or sleepwalking from an 8 AM lecture — 1 punchy line, zero food pitch!`,
    ];
  } else if (timeDec >= 10.5 && timeDec < 14.5) {
    slot = TIME_SLOTS.LUNCH_RUSH;
    slotName = 'Peak Campus Lunch Rush';
    campusVibe = '15-minute gap between classes, packed counter, hunger peaking, speed-running lunch.';
    recommendedPick = 'Chicken or Mix Combo Platter ($9.99) or Gyro Wrap ($7.99) ready in 2 minutes.';
    budgetHack = 'The $9.99 Platter Two-Meal Hack: eat half for lunch, save half in foil for late study session = $5 per meal.';
    greetingHooks = [
      `It is ${formattedTime} lunch time on ${dayOfWeek}. A student walked up. Greet them like a real friend asking what craziness is going on between classes today — 1 punchy sentence, no food talk yet!`,
      `Midday rush at ${formattedTime}! Welcome your classmate with fast Mo charm asking what professor gave a surprise pop quiz or what's going on — 1 punchy sentence, zero food pitch!`,
      `It's ${formattedTime}. Greet them like your favorite campus homie asking what major they're grinding in and how their day is going — 1 funny line, no food talk!`,
    ];
  } else if (timeDec >= 14.5 && timeDec < 17.5) {
    slot = TIME_SLOTS.AFTERNOON_SLUMP;
    slotName = 'Mid-Afternoon Study Slump';
    campusVibe = 'Afternoon lecture burnout, Bird Library basement fatigue, caffeine wearing off.';
    recommendedPick = 'Crispy Sauced Wings ($9.99) or Chicken Dose Platter ($9.99) with Extra White Sauce.';
    budgetHack = 'Upgrade any order with +$2.99 Combo for seasoned waffle fries and soda to power through the afternoon.';
    greetingHooks = [
      `It is ${formattedTime} in the afternoon on ${dayOfWeek}. Greet the student like a true friend asking what lecture or lab just melted their brain — 1 punchy line, zero food pitch!`,
      `Afternoon slump at ${formattedTime}! Welcome your classmate asking what is going on with them and whether they just escaped from Bird Library — 1 funny sentence, no food talk!`,
      `It's ${formattedTime}. Hit them with Mo's witty charm asking how their day was and what campus chaos went down today — 1 punchy line, zero food talk!`,
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
      `It is ${formattedTime} evening on ${dayOfWeek}. Greet the student like a close friend asking what's the move tonight and what's going on with the squad — 1 punchy sentence, no food pitch!`,
      `Dinner time at ${formattedTime}! Welcome your classmate asking how they survived classes today and what's the latest story — 1 funny sentence, zero food talk!`,
      `It's ${formattedTime}. Greet them like a campus homie asking what is going on and if they finally escaped the lecture halls — 1 punchy line, no food pitch!`,
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
      `It is ${formattedTime} late night on ${dayOfWeek}. Greet the student with brotherly hype asking what crazy homework or project crisis has them up right now — 1 punchy sentence, no food pitch!`,
      `Late night at ${formattedTime}! Welcome your classmate asking what is going on and what insane deadline they're battling tonight — 1 funny sentence, zero food talk!`,
      `It's ${formattedTime} night. Hit them with Mo's witty energy asking what professor had the audacity to assign work due at midnight — 1 punchy line, zero food pitch!`,
    ];
  } else {
    // 02:00 - 05:00
    slot = TIME_SLOTS.GRAVEYARD_2AM;
    slotName = 'The 2 AM Graveyard Shift & All-Nighter Trenches';
    campusVibe = 'True night owl survivors, thesis panic, existential hunger, empty dorm fridge sadness.';
    recommendedPick = 'Warm Gyro Wrap ($7.99) or Chicken Platter ($9.99) with extra garlic white sauce.';
    budgetHack = 'Save your wallet from $25 third-party delivery apps: get real hot halal food on Marshall St for eight bucks.';
    greetingHooks = [
      `It is ${formattedTime} in the dead of night on ${dayOfWeek}. Salute this fellow student warrior asking what crazy all-nighter or thesis drama is going on — 1 punchy sentence, no food pitch!`,
      `Graveyard shift at ${formattedTime}! Greet your fellow night owl asking what's going on and what crisis kept them awake till now — 1 funny line, zero food talk!`,
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

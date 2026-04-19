"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ChevronDown,
  Dumbbell,
  Flame,
  RotateCcw,
  ShoppingBag,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

type Goal = "lose" | "maintain" | "gain" | "muscle";
type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
type Gender = "male" | "female";
type Unit = "metric" | "imperial";

interface Results {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  servings: number;
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const ACTIVITY_LABELS: Record<
  ActivityLevel,
  { label: string; desc: string }
> = {
  sedentary: { label: "Sedentary", desc: "Little or no exercise" },
  light: { label: "Light", desc: "1-3 days/week" },
  moderate: { label: "Moderate", desc: "3-5 days/week" },
  active: { label: "Active", desc: "6-7 days/week" },
  very_active: { label: "Very Active", desc: "Twice daily / hard training" },
};

const GOALS: {
  key: Goal;
  label: string;
  icon: typeof Flame;
  desc: string;
  color: string;
}[] = [
  {
    key: "lose",
    label: "Lose Fat",
    icon: Flame,
    desc: "Cut while preserving muscle",
    color: "#3b82f6",
  },
  {
    key: "maintain",
    label: "Maintain",
    icon: Activity,
    desc: "Stay at current weight",
    color: "#10b981",
  },
  {
    key: "gain",
    label: "Lean Gain",
    icon: TrendingUp,
    desc: "Slow bulk, minimal fat",
    color: "#f59e0b",
  },
  {
    key: "muscle",
    label: "Maximize Muscle",
    icon: Dumbbell,
    desc: "Aggressive muscle building",
    color: "#ea580c",
  },
];

function calculate(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activity: ActivityLevel,
  goal: Goal
): Results {
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];

  const calMap: Record<Goal, number> = {
    lose: tdee - 500,
    maintain: tdee,
    gain: tdee + 300,
    muscle: tdee + 500,
  };

  const protMap: Record<Goal, number> = {
    lose: 2.4,
    maintain: 1.8,
    gain: 2,
    muscle: 2.6,
  };

  const calories = Math.round(calMap[goal]);
  const protein = Math.round(weight * protMap[goal]);
  const fat = Math.round((calories * 0.28) / 9);
  const proteinCals = protein * 4;
  const fatCals = fat * 9;
  const carbs = Math.round((calories - proteinCals - fatCals) / 4);
  const servings = Math.ceil(protein / 25);

  return { protein, calories, carbs, fat, servings };
}

function AnimatedNumber({
  value,
  unit = "",
}: {
  value: number;
  unit?: string;
}) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prev.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {display.toLocaleString()}
      {unit}
    </span>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm font-medium text-white transition-all backdrop-blur-sm hover:border-white/20 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-neutral-900 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-white/40"
      />
    </div>
  );
}

function MacroBar({
  label,
  grams,
  calories,
  color,
  pct,
}: {
  label: string;
  grams: number;
  calories: number;
  color: string;
  pct: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-white/70">{label}</span>
        <span className="font-bold text-white">
          {grams}g
          <span className="ml-1 text-xs font-normal text-white/40">
            ({calories} kcal)
          </span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function ProteinCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState(25);
  const [weightKg, setWeightKg] = useState(75);
  const [weightLb, setWeightLb] = useState(165);
  const [heightCm, setHeightCm] = useState(175);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("muscle");
  const [results, setResults] = useState<Results | null>(null);
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    const weight = unit === "metric" ? weightKg : weightLb * 0.453592;
    const height =
      unit === "metric" ? heightCm : heightFt * 30.48 + heightIn * 2.54;

    setResults(calculate(weight, height, age, gender, activity, goal));
    setCalculated(true);
  };

  const handleReset = () => {
    setResults(null);
    setCalculated(false);
  };

  const selectedGoal = GOALS.find((item) => item.key === goal)!;

  return (
    <section
      id="protein-calculator"
      className="relative overflow-hidden bg-neutral-950 py-24 scroll-mt-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-orange-900/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[2px] text-orange-400">
            <Zap size={12} className="fill-orange-400" /> Precision Nutrition
            Tool
          </div>
          <h2 className="mb-3 text-5xl font-black leading-none tracking-tight md:text-7xl">
            PROTEIN{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              CALCULATOR
            </span>
          </h2>
          <p className="mx-auto max-w-lg text-base text-white/45">
            Get your personalized daily protein, calorie, and macro targets
            based on your body and goals.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1">
              {(["metric", "imperial"] as Unit[]).map((currentUnit) => (
                <button
                  key={currentUnit}
                  onClick={() => setUnit(currentUnit)}
                  className={`flex-1 rounded-lg py-2 text-sm font-bold capitalize transition-all duration-200 ${
                    unit === currentUnit
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-900/40"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {currentUnit}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm">
              <label className="mb-3 block text-xs font-bold uppercase tracking-[2px] text-white/40">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["male", "female"] as Gender[]).map((currentGender) => (
                  <button
                    key={currentGender}
                    onClick={() => setGender(currentGender)}
                    className={`rounded-xl border py-3 text-sm font-bold capitalize transition-all duration-200 ${
                      gender === currentGender
                        ? "border-orange-500/50 bg-orange-500/15 text-orange-400"
                        : "border-white/10 bg-transparent text-white/50 hover:border-white/20 hover:text-white/70"
                    }`}
                  >
                    {currentGender}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm">
              <label className="mb-4 block text-xs font-bold uppercase tracking-[2px] text-white/40">
                Body Stats
              </label>
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-white/60">Age</span>
                    <span className="font-bold text-orange-400">{age} yrs</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={80}
                    value={age}
                    onChange={(event) => setAge(Number(event.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>

                {unit === "metric" ? (
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium text-white/60">Weight</span>
                      <span className="font-bold text-orange-400">
                        {weightKg} kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={180}
                      value={weightKg}
                      onChange={(event) =>
                        setWeightKg(Number(event.target.value))
                      }
                      className="w-full accent-orange-500"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium text-white/60">Weight</span>
                      <span className="font-bold text-orange-400">
                        {weightLb} lbs
                      </span>
                    </div>
                    <input
                      type="range"
                      min={88}
                      max={400}
                      value={weightLb}
                      onChange={(event) =>
                        setWeightLb(Number(event.target.value))
                      }
                      className="w-full accent-orange-500"
                    />
                  </div>
                )}

                {unit === "metric" ? (
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium text-white/60">Height</span>
                      <span className="font-bold text-orange-400">
                        {heightCm} cm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={140}
                      max={220}
                      value={heightCm}
                      onChange={(event) =>
                        setHeightCm(Number(event.target.value))
                      }
                      className="w-full accent-orange-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="font-medium text-white/60">
                          Height (ft)
                        </span>
                        <span className="font-bold text-orange-400">
                          {heightFt} ft
                        </span>
                      </div>
                      <input
                        type="range"
                        min={4}
                        max={7}
                        value={heightFt}
                        onChange={(event) =>
                          setHeightFt(Number(event.target.value))
                        }
                        className="w-full accent-orange-500"
                      />
                    </div>
                    <div>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="font-medium text-white/60">
                          Height (in)
                        </span>
                        <span className="font-bold text-orange-400">
                          {heightIn} in
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={11}
                        value={heightIn}
                        onChange={(event) =>
                          setHeightIn(Number(event.target.value))
                        }
                        className="w-full accent-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm">
              <label className="mb-3 block text-xs font-bold uppercase tracking-[2px] text-white/40">
                Activity Level
              </label>
              <Select
                value={activity}
                onChange={(value) => setActivity(value as ActivityLevel)}
                options={Object.entries(ACTIVITY_LABELS).map(([key, item]) => ({
                  value: key,
                  label: `${item.label} - ${item.desc}`,
                }))}
              />
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm">
              <label className="mb-3 block text-xs font-bold uppercase tracking-[2px] text-white/40">
                Your Goal
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {GOALS.map(({ key, label, icon: Icon, desc, color }) => (
                  <button
                    key={key}
                    onClick={() => setGoal(key)}
                    className={`group relative flex flex-col items-start gap-1 overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ${
                      goal === key
                        ? "border-transparent text-white"
                        : "border-white/10 bg-transparent text-white/50 hover:border-white/20 hover:text-white/70"
                    }`}
                    style={
                      goal === key
                        ? { backgroundColor: `${color}18`, borderColor: `${color}50` }
                        : {}
                    }
                  >
                    <Icon
                      size={16}
                      style={{ color: goal === key ? color : undefined }}
                      className={goal === key ? "" : "text-white/30"}
                    />
                    <span className="text-sm font-bold leading-tight">
                      {label}
                    </span>
                    <span className="text-[11px] leading-tight text-white/40">
                      {desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCalculate}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 py-4 text-base font-black tracking-wide text-white shadow-lg shadow-orange-900/30 transition-all hover:from-orange-500 hover:to-red-500"
            >
              <Target size={20} />
              CALCULATE MY TARGETS
            </motion.button>
          </motion.div>

          <div className="space-y-5">
            <AnimatePresence mode="wait">
              {!calculated ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[400px] h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
                    <Target size={28} className="text-orange-500/60" />
                  </div>
                  <p className="text-sm font-medium text-white/30">
                    Fill in your details and hit
                    <br />
                    <span className="text-orange-500/60">Calculate</span> to see
                    your targets
                  </p>
                </motion.div>
              ) : results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
                    style={{
                      backgroundColor: `${selectedGoal.color}15`,
                      color: selectedGoal.color,
                      border: `1px solid ${selectedGoal.color}30`,
                    }}
                  >
                    <selectedGoal.icon size={14} />
                    {selectedGoal.label} Plan
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-900/5 p-6">
                    <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl" />
                    <p className="mb-1 text-xs font-bold uppercase tracking-[2px] text-orange-400/70">
                      Daily Protein Target
                    </p>
                    <div className="flex items-end gap-2">
                      <span className="text-6xl font-black leading-none text-white">
                        <AnimatedNumber value={results.protein} />
                      </span>
                      <span className="mb-1 text-2xl font-black text-orange-400">
                        g
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/40">
                      &#8776;{" "}
                      <span className="font-bold text-white/70">
                        {results.servings} scoops
                      </span>{" "}
                      of Front Runner Whey per day
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: "Calories",
                        value: results.calories,
                        unit: "",
                        color: "#f59e0b",
                      },
                      {
                        label: "Carbs",
                        value: results.carbs,
                        unit: "g",
                        color: "#10b981",
                      },
                      {
                        label: "Fat",
                        value: results.fat,
                        unit: "g",
                        color: "#3b82f6",
                      },
                    ].map(({ label, value, unit: currentUnit, color }) => (
                      <div
                        key={label}
                        className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-center"
                      >
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/35">
                          {label}
                        </p>
                        <p className="text-2xl font-black" style={{ color }}>
                          <AnimatedNumber value={value} unit={currentUnit} />
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                    <p className="text-xs font-bold uppercase tracking-[2px] text-white/40">
                      Macro Breakdown
                    </p>
                    <MacroBar
                      label="Protein"
                      grams={results.protein}
                      calories={results.protein * 4}
                      color="#ea580c"
                      pct={Math.round(
                        ((results.protein * 4) / results.calories) * 100
                      )}
                    />
                    <MacroBar
                      label="Carbohydrates"
                      grams={results.carbs}
                      calories={results.carbs * 4}
                      color="#10b981"
                      pct={Math.round(
                        ((results.carbs * 4) / results.calories) * 100
                      )}
                    />
                    <MacroBar
                      label="Fat"
                      grams={results.fat}
                      calories={results.fat * 9}
                      color="#3b82f6"
                      pct={Math.round(
                        ((results.fat * 9) / results.calories) * 100
                      )}
                    />
                    <div className="flex flex-wrap gap-3 pt-1">
                      {[
                        {
                          label: "Protein",
                          pct: Math.round(
                            ((results.protein * 4) / results.calories) * 100
                          ),
                          color: "#ea580c",
                        },
                        {
                          label: "Carbs",
                          pct: Math.round(
                            ((results.carbs * 4) / results.calories) * 100
                          ),
                          color: "#10b981",
                        },
                        {
                          label: "Fat",
                          pct: Math.round(
                            ((results.fat * 9) / results.calories) * 100
                          ),
                          color: "#3b82f6",
                        },
                      ].map(({ label, pct, color }) => (
                        <div
                          key={label}
                          className="flex items-center gap-1.5 text-xs text-white/40"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          {label} {pct}%
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[2px] text-white/40">
                      Protein Timing Tips
                    </p>
                    <div className="space-y-2">
                      {[
                        {
                          time: "Morning",
                          tip: `${Math.round(results.protein * 0.25)}g - start the day strong`,
                          emoji: "🌅",
                        },
                        {
                          time: "Pre-Workout",
                          tip: `${Math.round(results.protein * 0.2)}g - 30-60 min before`,
                          emoji: "⚡",
                        },
                        {
                          time: "Post-Workout",
                          tip: `${Math.round(results.protein * 0.3)}g - within 30 min`,
                          emoji: "💪",
                        },
                        {
                          time: "Evening",
                          tip: `${Math.round(results.protein * 0.25)}g - slow-digesting`,
                          emoji: "🌙",
                        },
                      ].map(({ time, tip, emoji }) => (
                        <div key={time} className="flex items-center gap-3 text-sm">
                          <span className="w-4 text-base">{emoji}</span>
                          <span className="w-24 font-semibold text-white/60">
                            {time}
                          </span>
                          <span className="text-white/40">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
                    <p className="mb-1 text-sm font-bold text-white">
                      You need{" "}
                      <span className="text-orange-400">
                        {results.servings} scoops/day
                      </span>
                    </p>
                    <p className="mb-4 text-xs text-white/40">
                      Front Runner Whey Isolate - 25g protein per scoop, zero
                      sugar, third-party tested.
                    </p>
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-black text-white transition-all hover:bg-orange-500 active:scale-[0.98]">
                      <ShoppingBag size={16} />
                      SHOP WHEY PROTEIN
                    </button>
                  </div>

                  <button
                    onClick={handleReset}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-white/40 transition-all hover:border-white/20 hover:text-white/60"
                  >
                    <RotateCcw size={14} /> Recalculate
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-white/20">
          Results are estimates based on the Mifflin-St Jeor equation. Consult a
          registered dietitian for personalized medical nutrition advice.
        </p>
      </div>
    </section>
  );
}

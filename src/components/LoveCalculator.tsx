import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Heart, Sparkles, Calendar } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CelebrationEffect } from "./animations/CelebrationEffect";
import { AnimatedScore } from "./animations/AnimatedScore";
import { AnimatedBar } from "./animations/AnimatedBar";

interface Person {
  name: string;
  birthDate: string;
}

interface CompatibilityResult {
  score: number;
  message: JSX.Element;
  person1Sign: string;
  person2Sign: string;
}

const zodiacSigns = [
  { name: "Aries", start: [3, 21], end: [4, 19] },
  { name: "Taurus", start: [4, 20], end: [5, 20] },
  { name: "Gemini", start: [5, 21], end: [6, 20] },
  { name: "Cancer", start: [6, 21], end: [7, 22] },
  { name: "Leo", start: [7, 23], end: [8, 22] },
  { name: "Virgo", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  { name: "Capricorn", start: [12, 22], end: [1, 19] },
  { name: "Aquarius", start: [1, 20], end: [2, 18] },
  { name: "Pisces", start: [2, 19], end: [3, 20] },
];

const compatibilityMatrix: Record<string, Record<string, number>> = {
  Aries: {
    Aries: 85,
    Taurus: 60,
    Gemini: 88,
    Cancer: 55,
    Leo: 95,
    Virgo: 45,
    Libra: 82,
    Scorpio: 78,
    Sagittarius: 92,
    Capricorn: 58,
    Aquarius: 85,
    Pisces: 68,
  },
  Taurus: {
    Aries: 60,
    Taurus: 75,
    Gemini: 52,
    Cancer: 88,
    Leo: 65,
    Virgo: 90,
    Libra: 70,
    Scorpio: 85,
    Sagittarius: 48,
    Capricorn: 92,
    Aquarius: 55,
    Pisces: 82,
  },
  Gemini: {
    Aries: 88,
    Taurus: 52,
    Gemini: 80,
    Cancer: 62,
    Leo: 85,
    Virgo: 58,
    Libra: 95,
    Scorpio: 68,
    Sagittarius: 88,
    Capricorn: 55,
    Aquarius: 92,
    Pisces: 65,
  },
  Cancer: {
    Aries: 55,
    Taurus: 88,
    Gemini: 62,
    Cancer: 85,
    Leo: 78,
    Virgo: 82,
    Libra: 68,
    Scorpio: 95,
    Sagittarius: 52,
    Capricorn: 75,
    Aquarius: 48,
    Pisces: 92,
  },
  Leo: {
    Aries: 95,
    Taurus: 65,
    Gemini: 85,
    Cancer: 78,
    Leo: 88,
    Virgo: 62,
    Libra: 85,
    Scorpio: 75,
    Sagittarius: 95,
    Capricorn: 68,
    Aquarius: 82,
    Pisces: 72,
  },
  Virgo: {
    Aries: 45,
    Taurus: 90,
    Gemini: 58,
    Cancer: 82,
    Leo: 62,
    Virgo: 85,
    Libra: 78,
    Scorpio: 88,
    Sagittarius: 55,
    Capricorn: 95,
    Aquarius: 62,
    Pisces: 78,
  },
  Libra: {
    Aries: 82,
    Taurus: 70,
    Gemini: 95,
    Cancer: 68,
    Leo: 85,
    Virgo: 78,
    Libra: 82,
    Scorpio: 75,
    Sagittarius: 82,
    Capricorn: 65,
    Aquarius: 95,
    Pisces: 78,
  },
  Scorpio: {
    Aries: 78,
    Taurus: 85,
    Gemini: 68,
    Cancer: 95,
    Leo: 75,
    Virgo: 88,
    Libra: 75,
    Scorpio: 90,
    Sagittarius: 65,
    Capricorn: 82,
    Aquarius: 72,
    Pisces: 95,
  },
  Sagittarius: {
    Aries: 92,
    Taurus: 48,
    Gemini: 88,
    Cancer: 52,
    Leo: 95,
    Virgo: 55,
    Libra: 82,
    Scorpio: 65,
    Sagittarius: 85,
    Capricorn: 62,
    Aquarius: 88,
    Pisces: 68,
  },
  Capricorn: {
    Aries: 58,
    Taurus: 92,
    Gemini: 55,
    Cancer: 75,
    Leo: 68,
    Virgo: 95,
    Libra: 65,
    Scorpio: 82,
    Sagittarius: 62,
    Capricorn: 88,
    Aquarius: 58,
    Pisces: 78,
  },
  Aquarius: {
    Aries: 85,
    Taurus: 55,
    Gemini: 92,
    Cancer: 48,
    Leo: 82,
    Virgo: 62,
    Libra: 95,
    Scorpio: 72,
    Sagittarius: 88,
    Capricorn: 58,
    Aquarius: 85,
    Pisces: 75,
  },
  Pisces: {
    Aries: 68,
    Taurus: 82,
    Gemini: 65,
    Cancer: 92,
    Leo: 72,
    Virgo: 78,
    Libra: 78,
    Scorpio: 95,
    Sagittarius: 68,
    Capricorn: 78,
    Aquarius: 75,
    Pisces: 88,
  },
};

const getZodiacSign = (birthDate: string): string => {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) {
        return sign.name;
      }
    } else {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return sign.name;
      }
    }
  }
  return "Unknown";
};

const calculateNumerology = (name: string): number => {
  return (
    name
      .toLowerCase()
      .split("")
      .reduce((sum, char) => {
        const charCode = char.charCodeAt(0);
        if (charCode >= 97 && charCode <= 122) {
          return sum + (charCode - 96);
        }
        return sum;
      }, 0) % 9 || 9
  );
};

const generateMessage = (
  score: number,
  sign1: string,
  sign2: string
): JSX.Element => {
  if (score >= 90) {
    return (
      <div className="text-left space-y-3">
        <p>
          🔥 <strong>Incredible match!</strong> {sign1} and {sign2} create pure
          magic together. Your souls are perfectly aligned, and you share an
          intuitive understanding that feels almost telepathic. This is the kind
          of love that inspires poetry and makes others believe in true love.
        </p>
        <p className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
          <strong>💡 Tips for success:</strong> Trust your instincts together,
          embrace your shared dreams, and never take this rare connection for
          granted. Celebrate your similarities while giving each other space to
          grow individually.
        </p>
      </div>
    );
  } else if (score >= 80) {
    return (
      <div className="text-left space-y-3">
        <p>
          💕 <strong>Amazing connection!</strong> {sign1} and {sign2} complement
          each other beautifully. You bring out the best in each other and have
          natural chemistry that makes everything feel effortless. Your
          relationship has the potential to be both passionate and deeply
          fulfilling.
        </p>
        <p className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
          <strong>💡 Tips for success:</strong> Communicate openly about your
          feelings, plan exciting adventures together, and support each other's
          goals. Your natural harmony is a gift - nurture it with quality time
          and genuine appreciation.
        </p>
      </div>
    );
  } else if (score >= 70) {
    return (
      <div className="text-left space-y-3">
        <p>
          ✨ <strong>Great potential!</strong> {sign1} and {sign2} share
          wonderful chemistry with exciting possibilities ahead. You have a
          strong foundation for love, though it may require some patience and
          understanding to fully bloom. The attraction is definitely there!
        </p>
        <p className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
          <strong>💡 Tips for success:</strong> Focus on building trust
          gradually, share new experiences together, and be patient with
          differences. Your connection grows stronger with time - invest in deep
          conversations and create meaningful memories together.
        </p>
      </div>
    );
  } else if (score >= 60) {
    return (
      <div className="text-left space-y-3">
        <p>
          💫 <strong>Good compatibility!</strong> {sign1} and {sign2} have sweet
          harmony with room for beautiful growth. You enjoy each other's company
          and share enough common ground to build something lasting. Friendship
          forms a solid foundation for deeper love.
        </p>
        <p className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
          <strong>💡 Tips for success:</strong> Start as friends and let romance
          develop naturally, find common interests to bond over, and practice
          active listening. Small gestures of kindness and consistent effort
          will strengthen your connection over time.
        </p>
      </div>
    );
  } else if (score >= 50) {
    return (
      <div className="text-left space-y-3">
        <p>
          🌟 <strong>Moderate match!</strong> {sign1} and {sign2} can learn
          valuable lessons from each other. While you may have different
          approaches to life, these differences can create balance and help you
          both grow. Love often surprises us in unexpected ways.
        </p>
        <p className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
          <strong>💡 Tips for success:</strong> Embrace your differences as
          learning opportunities, compromise when needed, and focus on what you
          admire about each other. Patience and understanding will be key to
          making this relationship thrive.
        </p>
      </div>
    );
  } else {
    return (
      <div className="text-left space-y-3">
        <p>
          💭 <strong>Challenging but intriguing!</strong> {sign1} and {sign2}{" "}
          are quite different, but sometimes opposites create the most
          passionate and transformative relationships. Your differences could be
          your greatest strength if you approach them with curiosity rather than
          frustration.
        </p>
        <p className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
          <strong>💡 Tips for success:</strong> Practice extra patience and
          empathy, celebrate what makes you unique, and find creative ways to
          bridge your differences. Focus on shared values rather than similar
          personalities - sometimes contrast creates the most beautiful harmony.
        </p>
      </div>
    );
  }
};

// Add zodiac sign details
const zodiacDetails: Record<
  string,
  {
    traits: string;
    strengths: string;
    weaknesses: string;
    love: string;
  }
> = {
  Aries: {
    traits: "Courageous, energetic, willful, commanding, leading.",
    strengths: "Adventurous, confident, passionate, determined.",
    weaknesses: "Impulsive, impatient, short-tempered, aggressive.",
    love: "Aries are passionate lovers who enjoy the thrill of the chase and value honesty in relationships.",
  },
  Taurus: {
    traits: "Reliable, patient, practical, devoted, responsible.",
    strengths: "Dependable, patient, persistent, loyal.",
    weaknesses: "Stubborn, possessive, uncompromising.",
    love: "Taurus seeks stability and comfort, offering loyalty and sensuality in love.",
  },
  Gemini: {
    traits: "Versatile, expressive, curious, kind, communicative.",
    strengths: "Adaptable, outgoing, intelligent, witty.",
    weaknesses: "Indecisive, nervous, inconsistent, superficial.",
    love: "Geminis crave intellectual stimulation and fun, thriving on communication in relationships.",
  },
  Cancer: {
    traits: "Intuitive, sentimental, compassionate, protective.",
    strengths: "Loyal, empathetic, caring, imaginative.",
    weaknesses: "Moody, pessimistic, suspicious, insecure.",
    love: "Cancer values emotional security and deep bonds, nurturing their partners with care.",
  },
  Leo: {
    traits: "Dramatic, outgoing, fiery, self-assured, charismatic.",
    strengths: "Generous, warm-hearted, cheerful, creative.",
    weaknesses: "Arrogant, stubborn, self-centered, inflexible.",
    love: "Leos love grand gestures and loyalty, seeking admiration and romance in love.",
  },
  Virgo: {
    traits: "Practical, loyal, gentle, analytical, kind.",
    strengths: "Hardworking, analytical, reliable, modest.",
    weaknesses: "Overly critical, worrier, perfectionist, shy.",
    love: "Virgos show love through helpfulness and attention to detail, valuing sincerity and trust.",
  },
  Libra: {
    traits: "Diplomatic, artistic, intelligent, kind, peaceful.",
    strengths: "Charming, fair-minded, social, cooperative.",
    weaknesses: "Indecisive, avoids confrontations, self-pitying.",
    love: "Libras seek harmony and partnership, thriving in balanced and romantic relationships.",
  },
  Scorpio: {
    traits: "Passionate, stubborn, resourceful, brave, secretive.",
    strengths: "Loyal, determined, brave, intuitive.",
    weaknesses: "Jealous, secretive, resentful, controlling.",
    love: "Scorpios love deeply and intensely, valuing loyalty and emotional honesty.",
  },
  Sagittarius: {
    traits: "Optimistic, freedom-loving, funny, fair-minded, honest.",
    strengths: "Adventurous, optimistic, independent, philosophical.",
    weaknesses: "Impatient, tactless, inconsistent, overconfident.",
    love: "Sagittarius seeks adventure and honesty, bringing fun and openness to relationships.",
  },
  Capricorn: {
    traits: "Disciplined, patient, ambitious, reserved, practical.",
    strengths: "Responsible, disciplined, self-controlled, wise.",
    weaknesses: "Pessimistic, stubborn, unforgiving, condescending.",
    love: "Capricorns are loyal and committed, valuing stability and long-term growth in love.",
  },
  Aquarius: {
    traits: "Progressive, original, independent, humanitarian.",
    strengths: "Innovative, open-minded, friendly, intelligent.",
    weaknesses: "Aloof, rebellious, unpredictable, detached.",
    love: "Aquarius values intellectual connection and freedom, bringing uniqueness to relationships.",
  },
  Pisces: {
    traits: "Compassionate, artistic, intuitive, gentle, wise.",
    strengths: "Empathetic, creative, gentle, wise.",
    weaknesses: "Fearful, overly trusting, sad, escapist.",
    love: "Pisces are romantic and empathetic, seeking deep emotional and spiritual bonds.",
  },
};

// Add zodiac sign date ideas and communication tips
const zodiacSuggestions: Record<
  string,
  { dateIdeas: string[]; communicationTips: string[] }
> = {
  Aries: {
    dateIdeas: [
      "Go-kart racing or an adventure sport",
      "Spontaneous road trip",
      "Try a new fitness class together",
    ],
    communicationTips: [
      "Be direct and honest",
      "Show enthusiasm for their ideas",
      "Avoid being overly critical",
    ],
  },
  Taurus: {
    dateIdeas: [
      "Picnic in a beautiful park",
      "Cooking a gourmet meal together",
      "Visit a botanical garden",
    ],
    communicationTips: [
      "Be patient and gentle",
      "Express appreciation for their loyalty",
      "Avoid rushing important conversations",
    ],
  },
  Gemini: {
    dateIdeas: [
      "Trivia night or board games",
      "Attend a comedy show",
      "Explore a new neighborhood or cafe",
    ],
    communicationTips: [
      "Keep conversations lively and varied",
      "Be open to new topics",
      "Listen actively and avoid interrupting",
    ],
  },
  Cancer: {
    dateIdeas: [
      "Home movie night with comfort food",
      "Visit an aquarium or art exhibit",
      "Cook a family recipe together",
    ],
    communicationTips: [
      "Be empathetic and nurturing",
      "Share your feelings openly",
      "Offer reassurance and support",
    ],
  },
  Leo: {
    dateIdeas: [
      "Attend a live concert or theater show",
      "Dress up for a fancy dinner",
      "Plan a creative photo shoot together",
    ],
    communicationTips: [
      "Give sincere compliments",
      "Let them shine in conversations",
      "Avoid ignoring their efforts",
    ],
  },
  Virgo: {
    dateIdeas: [
      "Visit a farmer's market",
      "Take a pottery or craft class",
      "Organize a home project together",
    ],
    communicationTips: [
      "Be clear and thoughtful",
      "Show appreciation for their help",
      "Avoid being overly critical",
    ],
  },
  Libra: {
    dateIdeas: [
      "Art gallery or museum date",
      "Wine tasting or elegant dinner",
      "Go dancing together",
    ],
    communicationTips: [
      "Be fair and diplomatic",
      "Encourage open dialogue",
      "Avoid confrontational tones",
    ],
  },
  Scorpio: {
    dateIdeas: [
      "Escape room adventure",
      "Stargazing night",
      "Cook a mysterious or exotic meal",
    ],
    communicationTips: [
      "Be honest and loyal",
      "Respect their privacy",
      "Avoid superficial conversations",
    ],
  },
  Sagittarius: {
    dateIdeas: [
      "Outdoor hiking or camping",
      "Plan a travel adventure",
      "Try an international cuisine restaurant",
    ],
    communicationTips: [
      "Be open-minded and optimistic",
      "Share your dreams and plans",
      "Avoid being clingy or possessive",
    ],
  },
  Capricorn: {
    dateIdeas: [
      "Visit a historical site or museum",
      "Plan a goal-setting night",
      "Attend a classical music concert",
    ],
    communicationTips: [
      "Be respectful and reliable",
      "Show appreciation for their hard work",
      "Avoid being too casual about commitments",
    ],
  },
  Aquarius: {
    dateIdeas: [
      "Science museum or tech expo",
      "Volunteer together for a cause",
      "Attend a quirky or unique event",
    ],
    communicationTips: [
      "Be open to unconventional ideas",
      "Encourage intellectual discussions",
      "Avoid being overly emotional or possessive",
    ],
  },
  Pisces: {
    dateIdeas: [
      "Beach walk at sunset",
      "Paint or create art together",
      "Listen to live music in a cozy venue",
    ],
    communicationTips: [
      "Be gentle and compassionate",
      "Share your dreams and feelings",
      "Avoid harsh criticism or insensitivity",
    ],
  },
};

// Pair-specific insights for Zodiac section
const pairInsights: Record<string, string> = {
  "Aries-Taurus":
    "Aries brings excitement, Taurus brings stability. Together, you create a passionate yet grounded relationship.",
  "Gemini-Libra":
    "Both air signs, you thrive on communication and shared adventures.",
  "Cancer-Leo":
    "Cancer nurtures, Leo inspires. Your bond is warm and protective.",
  "Pisces-Scorpio":
    "Deeply intuitive and emotional, you connect on a soul level.",
  // ...add more pairs as desired
};
function getPairKey(sign1: string, sign2: string) {
  return [sign1, sign2].sort().join("-");
}
const zodiacEmojis: Record<string, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};
const signElements: Record<string, string> = {
  Aries: "fire",
  Leo: "fire",
  Sagittarius: "fire",
  Taurus: "earth",
  Virgo: "earth",
  Capricorn: "earth",
  Gemini: "air",
  Libra: "air",
  Aquarius: "air",
  Cancer: "water",
  Scorpio: "water",
  Pisces: "water",
};
const elementColors: Record<string, string> = {
  fire: "from-pink-200 to-pink-100",
  earth: "from-yellow-100 to-green-100",
  air: "from-blue-100 to-indigo-100",
  water: "from-cyan-100 to-blue-200",
};
function getDominantElement(sign1: string, sign2: string) {
  const e1 = signElements[sign1];
  const e2 = signElements[sign2];
  if (e1 === e2) return e1;
  // If different, pick the one with higher score (or just sign1 for simplicity)
  return e1 || "fire";
}
// Pair-specific dynamic certificate quotes
const certificateQuotes: Record<string, string> = {
  "Aries-Taurus": "May your passion and stability create a love that lasts.",
  "Gemini-Libra": "May your shared curiosity and harmony bring endless joy.",
  "Cancer-Leo": "May your warmth and care light up your journey together.",
  "Pisces-Scorpio": "May your deep connection inspire a magical love story.",
};

// Chinese Zodiac logic
const chineseZodiacs = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];
const chineseZodiacEmojis: Record<string, string> = {
  Rat: "🐀",
  Ox: "🐂",
  Tiger: "🐅",
  Rabbit: "🐇",
  Dragon: "🐉",
  Snake: "🐍",
  Horse: "🐎",
  Goat: "🐐",
  Monkey: "🐒",
  Rooster: "🐓",
  Dog: "🐕",
  Pig: "🐖",
};
function getChineseZodiac(birthDate: string) {
  if (!birthDate) return "";
  const year = new Date(birthDate).getFullYear();
  if (!year) return "";
  const index = (year - 4) % 12;
  return chineseZodiacs[index < 0 ? index + 12 : index];
}
// Enhanced Chinese Zodiac compatibility logic
const chineseTrines = [
  ["Rat", "Dragon", "Monkey"],
  ["Ox", "Snake", "Rooster"],
  ["Tiger", "Horse", "Dog"],
  ["Rabbit", "Goat", "Pig"],
];
const chineseSixHarmonies = [
  ["Rat", "Ox"],
  ["Tiger", "Pig"],
  ["Rabbit", "Dog"],
  ["Dragon", "Rooster"],
  ["Snake", "Monkey"],
  ["Horse", "Goat"],
];
const chineseSixConflicts = [
  ["Rat", "Horse"],
  ["Ox", "Goat"],
  ["Tiger", "Monkey"],
  ["Rabbit", "Rooster"],
  ["Dragon", "Dog"],
  ["Snake", "Pig"],
];
const chineseOpposites = [
  ["Rat", "Goat"],
  ["Ox", "Horse"],
  ["Tiger", "Snake"],
  ["Rabbit", "Dragon"],
  ["Monkey", "Pig"],
  ["Rooster", "Dog"],
];
function getChineseZodiacCategory(z1: string, z2: string) {
  if (z1 === z2)
    return {
      category: "Best Match",
      score: 95,
      detail: "Same sign: deep understanding and harmony.",
    };
  if (chineseTrines.some((trine) => trine.includes(z1) && trine.includes(z2)))
    return {
      category: "Best Match (Trine)",
      score: 95,
      detail:
        "You belong to the same trine, a classic sign of harmony and mutual support.",
    };
  if (
    chineseSixHarmonies.some(
      (pair) =>
        (pair[0] === z1 && pair[1] === z2) || (pair[1] === z1 && pair[0] === z2)
    )
  )
    return {
      category: "Good Match (Six Harmonies)",
      score: 90,
      detail:
        "This is a Six Harmonies pair, known for strong partnership and balance.",
    };
  if (
    chineseSixConflicts.some(
      (pair) =>
        (pair[0] === z1 && pair[1] === z2) || (pair[1] === z1 && pair[0] === z2)
    )
  )
    return {
      category: "Challenging (Six Conflicts)",
      score: 60,
      detail:
        "This is a Six Conflicts pair, which may face challenges but can grow through understanding.",
    };
  if (
    chineseOpposites.some(
      (pair) =>
        (pair[0] === z1 && pair[1] === z2) || (pair[1] === z1 && pair[0] === z2)
    )
  )
    return {
      category: "Opposite",
      score: 65,
      detail:
        "You are opposite signs, which can create both attraction and friction.",
    };
  return {
    category: "Neutral",
    score: 75,
    detail:
      "This pairing is considered neutral—neither especially harmonious nor especially challenging.",
  };
}

export const LoveCalculator = () => {
  const [person1, setPerson1] = useState<Person>({ name: "", birthDate: "" });
  const [person2, setPerson2] = useState<Person>({ name: "", birthDate: "" });
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  // Add modal state for zodiac info
  const [openZodiac, setOpenZodiac] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setResult(null);
      setPerson1({ name: "", birthDate: "" });
      setPerson2({ name: "", birthDate: "" });
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  // New: compute zodiac sign immediately on DOB input
  const person1Sign = person1.birthDate ? getZodiacSign(person1.birthDate) : "";
  const person2Sign = person2.birthDate ? getZodiacSign(person2.birthDate) : "";

  const calculateCompatibility = async () => {
    if (
      !person1.name ||
      !person1.birthDate ||
      !person2.name ||
      !person2.birthDate
    ) {
      return;
    }

    setIsCalculating(true);

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const sign1 = getZodiacSign(person1.birthDate);
    const sign2 = getZodiacSign(person2.birthDate);

    const zodiacScore = compatibilityMatrix[sign1]?.[sign2] || 50;
    const numerology1 = calculateNumerology(person1.name);
    const numerology2 = calculateNumerology(person2.name);
    const numerologyScore = Math.max(
      0,
      100 - Math.abs(numerology1 - numerology2) * 10
    );

    const finalScore = Math.round(zodiacScore * 0.7 + numerologyScore * 0.3);
    const message = generateMessage(finalScore, sign1, sign2);

    setResult({
      score: finalScore,
      message,
      person1Sign: sign1,
      person2Sign: sign2,
    });

    setIsCalculating(false);
  };

  const resetCalculator = () => {
    setResult(null);
    setPerson1({ name: "", birthDate: "" });
    setPerson2({ name: "", birthDate: "" });
  };

  if (result) {
    // Dynamic values for banners
    const numerologyScore = Math.round(
      Math.max(
        0,
        100 -
          Math.abs(
            calculateNumerology(person1.name) -
              calculateNumerology(person2.name)
          ) *
            10
      )
    );
    const zodiacScore =
      compatibilityMatrix[result.person1Sign]?.[result.person2Sign] || 50;
    const finalScore = result.score;
    // Weighted for demo: emotional resonance and communication flow
    const emotionalScore = Math.round(
      numerologyScore * 0.4 + zodiacScore * 0.6
    );
    const communicationScore = Math.round(
      numerologyScore * 0.6 + zodiacScore * 0.4
    );

    // Dynamic summary title and highlights
    let summaryTitle = "Exceptional Romantic Harmony ✨";
    let summaryHighlights = [
      "Strong emotional compatibility",
      "Complementary personality traits",
      "Shared interests and goals",
      "Natural romantic chemistry",
    ];
    let summaryDesc = `The universe has woven a beautiful tapestry of connection between ${
      person1.name || "Person 1"
    } and ${
      person2.name || "Person 2"
    }. Your compatibility shines through multiple dimensions - from the mystical realm of numerology to the celestial dance of your zodiac signs. This is a relationship built on solid cosmic foundations.`;
    if (finalScore < 70) {
      summaryTitle = "Promising Connection with Growth Potential ✨";
      summaryHighlights = [
        "Opportunities for deeper understanding",
        "Room for growth and learning",
        "Unique perspectives to share",
        "Potential for strong partnership",
      ];
      summaryDesc = `There is a special spark between ${
        person1.name || "Person 1"
      } and ${
        person2.name || "Person 2"
      }. While your compatibility has both strengths and differences, every relationship is a journey. Embrace your unique qualities and let your connection grow over time.`;
    } else if (finalScore < 85) {
      summaryTitle = "Great Compatibility & Natural Affinity ✨";
      summaryHighlights = [
        "Natural rapport and understanding",
        "Balanced personalities",
        "Mutual respect and support",
        "Shared values and dreams",
      ];
      summaryDesc = `A harmonious connection exists between ${
        person1.name || "Person 1"
      } and ${
        person2.name || "Person 2"
      }. Your compatibility is built on a strong foundation of shared values and mutual respect, making your relationship both joyful and resilient.`;
    }

    // Dynamic breakdown card texts
    const numerologyDesc =
      numerologyScore >= 80
        ? "Excellent vibrational harmony and name synergy."
        : numerologyScore >= 60
        ? "Good name compatibility with some differences."
        : "Some vibrational differences, but potential for growth.";
    const zodiacDesc =
      zodiacScore >= 80
        ? `Astrological analysis of ${result.person1Sign} and ${result.person2Sign} reveals strong cosmic alignment.`
        : zodiacScore >= 60
        ? `Astrological analysis of ${result.person1Sign} and ${result.person2Sign} shows good potential with some contrasts.`
        : `Astrological analysis of ${result.person1Sign} and ${result.person2Sign} suggests unique differences to explore.`;
    const emotionalDesc =
      emotionalScore >= 80
        ? "Deep emotional connection and intuitive understanding."
        : emotionalScore >= 60
        ? "Good emotional rapport with opportunities to deepen your bond."
        : "Emotional connection may require extra nurturing and patience.";
    const communicationDesc =
      communicationScore >= 80
        ? "Effortless communication and natural understanding."
        : communicationScore >= 60
        ? "Good communication flow with room for improvement."
        : "Communication styles may differ, but can be bridged with effort.";

    // Dynamic key points for each section
    const numerologyPoints =
      numerologyScore >= 80
        ? [
            `Name vibration harmony between ${person1.name || "Person 1"} and ${
              person2.name || "Person 2"
            }`,
            "Destiny number synergy",
            "Shared life path direction",
            "Soul urge resonance",
          ]
        : numerologyScore >= 60
        ? [
            `Some name vibration alignment between ${
              person1.name || "Person 1"
            } and ${person2.name || "Person 2"}`,
            "Potential for destiny number growth",
            "Different life path perspectives",
            "Room for soul urge connection",
          ]
        : [
            `Unique name vibrations for ${person1.name || "Person 1"} and ${
              person2.name || "Person 2"
            }`,
            "Learning from destiny number contrasts",
            "Different life path energies",
            "Potential for soul urge discovery",
          ];
    const zodiacPoints =
      zodiacScore >= 80
        ? [
            `Elemental harmony between ${result.person1Sign} and ${result.person2Sign}`,
            "Planetary influences in sync",
            "Cosmic energy flow",
            "Soul sign resonance",
          ]
        : zodiacScore >= 60
        ? [
            `Some elemental compatibility between ${result.person1Sign} and ${result.person2Sign}`,
            "Planetary influences to balance",
            "Potential for cosmic energy growth",
            "Learning from soul sign contrasts",
          ]
        : [
            `Contrasting elemental energies: ${result.person1Sign} & ${result.person2Sign}`,
            "Unique planetary influences",
            "Different cosmic energy flows",
            "Exploring soul sign differences",
          ];
    const emotionalPoints =
      emotionalScore >= 80
        ? [
            `Empathic connection between ${person1.name || "Person 1"} and ${
              person2.name || "Person 2"
            }`,
            "Emotional support capacity",
            "Intuitive understanding",
            "Shared emotional language",
          ]
        : emotionalScore >= 60
        ? [
            `Growing empathic bond between ${person1.name || "Person 1"} and ${
              person2.name || "Person 2"
            }`,
            "Potential for emotional support",
            "Learning intuitive cues",
            "Building shared emotional language",
          ]
        : [
            `Developing empathic awareness for ${
              person1.name || "Person 1"
            } and ${person2.name || "Person 2"}`,
            "Opportunities for emotional support",
            "Learning intuitive understanding",
            "Exploring emotional expression",
          ];
    const communicationPoints =
      communicationScore >= 80
        ? [
            `Conversation harmony between ${person1.name || "Person 1"} and ${
              person2.name || "Person 2"
            }`,
            "Conflict resolution style",
            "Expression compatibility",
            "Listening synchronization",
          ]
        : communicationScore >= 60
        ? [
            `Good conversation flow for ${person1.name || "Person 1"} and ${
              person2.name || "Person 2"
            }`,
            "Learning conflict resolution",
            "Building expression compatibility",
            "Improving listening skills",
          ]
        : [
            `Different conversation styles: ${person1.name || "Person 1"} & ${
              person2.name || "Person 2"
            }`,
            "Opportunities for conflict resolution",
            "Exploring expression compatibility",
            "Developing listening synchronization",
          ];

    // Dynamic combined date ideas
    function getCombinedDateIdeas(sign1: string, sign2: string) {
      if (sign1 === sign2) return zodiacSuggestions[sign1]?.dateIdeas || [];
      const ideas1 = zodiacSuggestions[sign1]?.dateIdeas || [];
      const ideas2 = zodiacSuggestions[sign2]?.dateIdeas || [];
      // Pick one from each, then combine
      return [
        ideas1[0],
        ideas2[0],
        `Try blending your interests: ${ideas1[1]} & ${ideas2[1]}`,
      ];
    }

    // Share and certificate handlers
    const handleShareImage = async () => {
      const card = document.getElementById("result-card-main");
      if (!card) return;
      const canvas = await html2canvas(card, {
        backgroundColor: null,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [new File([dataUrl], "compatibility.png")],
        })
      ) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "compatibility.png", {
          type: "image/png",
        });
        navigator.share({ files: [file], title: "Love Compatibility Result" });
      } else {
        // fallback: download image
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "compatibility-result.png";
        link.click();
      }
    };

    const handleDownloadCertificate = async () => {
      const cert = document.getElementById("certificate-section");
      if (!cert) return;
      const canvas = await html2canvas(cert, {
        backgroundColor: null,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      // Optionally, use jsPDF for PDF
      // const pdf = new jsPDF({ orientation: "landscape" });
      // pdf.addImage(dataUrl, "PNG", 10, 10, 270, 180);
      // pdf.save("compatibility-certificate.pdf");
      // For now, just download as image
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "compatibility-certificate.png";
      link.click();
    };

    // Get Chinese zodiac signs and score
    const cz1 = getChineseZodiac(person1.birthDate);
    const cz2 = getChineseZodiac(person2.birthDate);
    const chineseZodiacResult =
      cz1 && cz2 ? getChineseZodiacCategory(cz1, cz2) : null;

    return (
      <div className="min-h-screen w-full bg-gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
        {/* Restore celebration confetti/stars effect */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <CelebrationEffect count={28} />
        </div>
        <Card
          id="result-card-main"
          className="w-full max-w-6xl bg-white/80 shadow-card rounded-lg border-0 animate-fade-in-up px-4 sm:px-12 mt-8 relative z-10 p-8"
        >
          <div className="p-8 text-center">
            <div className="mb-6">
              <Heart className="w-16 h-16 mx-auto text-primary animate-heart-pulse mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Love Compatibility
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>{result.person1Sign}</span>
                <Heart className="w-4 h-4 text-primary" />
                <span>{result.person2Sign}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <AnimatedScore value={result.score} size={128} color="#ec4899" />
              </div>
              <div className="text-foreground leading-relaxed">
                {result.message}
              </div>
            </div>

            {/* Compatibility Breakdown Banner */}
            <div className="mb-8 rounded-lg bg-white/80 shadow-card p-6 animate-fade-in-up text-left">
              <h3 className="text-xl font-bold text-primary mb-1 text-center">
                Compatibility Breakdown {zodiacEmojis[result.person1Sign]}{" "}
                {zodiacEmojis[result.person2Sign]}
              </h3>
              <div className="text-muted-foreground text-center mb-6 text-base">
                Detailed analysis of your romantic connection factors
              </div>
              <div className="flex flex-col gap-5">
                {/* Numerology Analysis */}
                <Card className="bg-white/80 border-0 shadow-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pink-600">#</span>
                    <span className="font-semibold text-foreground">
                      Numerology Analysis
                    </span>
                    <span className="ml-auto text-primary font-bold text-lg">
                      {numerologyScore}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {numerologyDesc}
                  </div>
                  <AnimatedBar value={numerologyScore} color="#ec4899" height={8} />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                    {numerologyPoints.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-pink-600"
                      >
                        •<span className="text-foreground">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                {/* Zodiac Compatibility */}
                <Card className="bg-white/80 border-0 shadow-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pink-600">★</span>
                    <span className="font-semibold text-foreground">
                      Zodiac Compatibility
                    </span>
                    <span className="ml-auto text-primary font-bold text-lg">
                      {zodiacScore}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {zodiacDesc}
                  </div>
                  <div className="text-xs text-pink-600 mb-2 italic">
                    {pairInsights[
                      getPairKey(result.person1Sign, result.person2Sign)
                    ] ||
                      "Your unique combination brings new opportunities for growth and love."}
                  </div>
                  <AnimatedBar value={zodiacScore} color="#fbbf24" height={8} />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                    {zodiacPoints.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-pink-600"
                      >
                        •<span className="text-foreground">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                {/* Emotional Resonance */}
                <Card className="bg-white/80 border-0 shadow-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pink-600">♡</span>
                    <span className="font-semibold text-foreground">
                      Emotional Resonance
                    </span>
                    <span className="ml-auto text-primary font-bold text-lg">
                      {emotionalScore}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {emotionalDesc}
                  </div>
                  <AnimatedBar value={emotionalScore} color="#38bdf8" height={8} />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                    {emotionalPoints.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-pink-600"
                      >
                        •<span className="text-foreground">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                {/* Communication Flow */}
                <Card className="bg-white/80 border-0 shadow-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pink-600">💬</span>
                    <span className="font-semibold text-foreground">
                      Communication Flow
                    </span>
                    <span className="ml-auto text-primary font-bold text-lg">
                      {communicationScore}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {communicationDesc}
                  </div>
                  <AnimatedBar value={communicationScore} color="#a78bfa" height={8} />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                    {communicationPoints.map((point, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-pink-600"
                      >
                        •<span className="text-foreground">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              {/* Overall Compatibility */}
              <div className="mt-6 rounded-xl bg-pink-100/60 p-4 flex items-center justify-between">
                <div className="font-semibold text-foreground">
                  Overall Compatibility
                </div>
                <div className="text-primary font-bold text-2xl">
                  {finalScore}%
                </div>
                <div className="text-xs text-muted-foreground ml-2">
                  Combined cosmic analysis result
                </div>
              </div>
            </div>

            {/* Compatibility Summary Banner */}
            <div className="mb-8 rounded-lg bg-white/80 shadow-card p-6 animate-fade-in-up text-left">
              <h3 className="text-2xl font-bold text-primary text-center mb-2 flex items-center justify-center gap-2">
                {summaryTitle}
              </h3>
              <div className="flex justify-center mb-4">
                <span className="w-16 h-1 bg-primary/40 rounded-full"></span>
              </div>
              <p className="text-muted-foreground text-center mb-6">
                {summaryDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Card className="flex-1 bg-pink-100/60 border-0 shadow-none p-4 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pink-600">#</span>
                    <span className="font-semibold text-foreground">
                      Numerology Score
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {numerologyScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on name vibrations
                  </div>
                </Card>
                <Card className="flex-1 bg-pink-100/60 border-0 shadow-none p-4 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pink-600">★</span>
                    <span className="font-semibold text-foreground">
                      Zodiac Score
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {zodiacScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on astrological signs
                  </div>
                </Card>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2 text-lg font-semibold text-foreground">
                  <span className="text-pink-600">✧</span> Key Compatibility
                  Highlights
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-base text-foreground">
                  {summaryHighlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-pink-600">•</span> {h}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Zodiac Detailed Report Banner */}
            <div className="mt-8 rounded-lg bg-white/80 shadow-card p-6 animate-fade-in-up text-left">
              <h3 className="text-lg font-bold text-primary mb-4 text-center">
                Zodiac Sign Detailed Report
              </h3>
              <div className="flex flex-col gap-6">
                {/* Person 1 Zodiac Details */}
                <Card className="bg-white/80 border-0 shadow-card p-4">
                  <h4 className="text-md font-semibold text-primary mb-2">
                    {result.person1Sign}
                  </h4>
                  <div className="mb-1">
                    <span className="font-semibold">Personality Traits:</span>{" "}
                    {zodiacDetails[result.person1Sign]?.traits}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Strengths:</span>{" "}
                    {zodiacDetails[result.person1Sign]?.strengths}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Weaknesses:</span>{" "}
                    {zodiacDetails[result.person1Sign]?.weaknesses}
                  </div>
                  <div>
                    <span className="font-semibold">Love Compatibility:</span>{" "}
                    {zodiacDetails[result.person1Sign]?.love}
                  </div>
                </Card>
                {/* Person 2 Zodiac Details */}
                <Card className="bg-white/80 border-0 shadow-card p-4">
                  <h4 className="text-md font-semibold text-primary mb-2">
                    {result.person2Sign}
                  </h4>
                  <div className="mb-1">
                    <span className="font-semibold">Personality Traits:</span>{" "}
                    {zodiacDetails[result.person2Sign]?.traits}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Strengths:</span>{" "}
                    {zodiacDetails[result.person2Sign]?.strengths}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Weaknesses:</span>{" "}
                    {zodiacDetails[result.person2Sign]?.weaknesses}
                  </div>
                  <div>
                    <span className="font-semibold">Love Compatibility:</span>{" "}
                    {zodiacDetails[result.person2Sign]?.love}
                  </div>
                </Card>
              </div>
            </div>

            {/* Zodiac Suggestions Banner */}
            {result.person1Sign &&
            result.person2Sign &&
            zodiacSuggestions[result.person1Sign] &&
            zodiacSuggestions[result.person2Sign] ? (
              <div className="mb-8 rounded-lg bg-white/80 shadow-card p-6 animate-fade-in-up text-left">
                <h3 className="text-xl font-bold text-primary mb-1 text-center">
                  Date Ideas & Communication Tips{" "}
                  {zodiacEmojis[result.person1Sign]}{" "}
                  {zodiacEmojis[result.person2Sign]}
                </h3>
                <div className="text-muted-foreground text-center mb-6 text-base">
                  {result.person1Sign === result.person2Sign
                    ? `Both of you share the sign ${result.person1Sign}, so your interests and communication styles are naturally aligned!`
                    : `Personalized suggestions for both of you based on your zodiac signs.`}
                </div>
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  {/* Person 1 Suggestions */}
                  <Card className="flex-1 bg-white/80 border-0 shadow-card p-4">
                    <h4 className="text-md font-semibold text-primary mb-2">
                      {zodiacEmojis[result.person1Sign]} {result.person1Sign} (
                      {person1.name || "Person 1"})
                    </h4>
                    <div className="mb-2">
                      <span className="font-semibold">Date Ideas:</span>
                      <ul className="list-disc ml-5 mt-1 text-sm">
                        {zodiacSuggestions[result.person1Sign]?.dateIdeas.map(
                          (idea, i) => (
                            <li key={i}>{idea}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold">Communication Tips:</span>
                      <ul className="list-disc ml-5 mt-1 text-sm">
                        {zodiacSuggestions[
                          result.person1Sign
                        ]?.communicationTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                  {/* Person 2 Suggestions */}
                  <Card className="flex-1 bg-white/80 border-0 shadow-card p-4">
                    <h4 className="text-md font-semibold text-primary mb-2">
                      {zodiacEmojis[result.person2Sign]} {result.person2Sign} (
                      {person2.name || "Person 2"})
                    </h4>
                    <div className="mb-2">
                      <span className="font-semibold">Date Ideas:</span>
                      <ul className="list-disc ml-5 mt-1 text-sm">
                        {zodiacSuggestions[result.person2Sign]?.dateIdeas.map(
                          (idea, i) => (
                            <li key={i}>{idea}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold">Communication Tips:</span>
                      <ul className="list-disc ml-5 mt-1 text-sm">
                        {zodiacSuggestions[
                          result.person2Sign
                        ]?.communicationTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </div>
                {/* Combined Date Ideas */}
                <div className="mt-6 bg-pink-100/60 rounded-xl p-4 text-center">
                  <div className="font-semibold text-primary mb-2">
                    Combined Date Ideas for Both of You
                  </div>
                  <ul className="list-disc ml-5 mt-1 text-sm inline-block text-left">
                    {getCombinedDateIdeas(
                      result.person1Sign,
                      result.person2Sign
                    ).map((idea, i) => (
                      <li key={i}>{idea}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mb-8 rounded-lg bg-white/80 shadow-card p-6 animate-fade-in-up text-center text-muted-foreground">
                <h3 className="text-xl font-bold text-primary mb-1">
                  Date Ideas & Communication Tips
                </h3>
                <div>
                  Enter both birth dates to get personalized suggestions!
                </div>
              </div>
            )}

            {/* Chinese Zodiac Compatibility Banner */}
            {cz1 && cz2 && chineseZodiacResult && (
              <div className="mb-8 rounded-lg bg-white/80 shadow-card p-6 animate-fade-in-up text-left">
                <h3 className="text-xl font-bold text-yellow-700 mb-1 text-center">
                  Chinese Zodiac Compatibility {chineseZodiacEmojis[cz1]}{" "}
                  {chineseZodiacEmojis[cz2]}
                </h3>
                <div className="text-muted-foreground text-center mb-6 text-base">
                  {person1.name || "Person 1"} is a{" "}
                  <span className="font-semibold text-yellow-700">{cz1}</span>{" "}
                  {chineseZodiacEmojis[cz1]}, {person2.name || "Person 2"} is a{" "}
                  <span className="font-semibold text-yellow-700">{cz2}</span>{" "}
                  {chineseZodiacEmojis[cz2]}.
                </div>
                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                  <Card className="flex-1 bg-white/80 border-0 shadow-card p-4 flex flex-col items-center">
                    <div className="text-3xl font-bold text-yellow-700 mb-1">
                      {chineseZodiacResult.score}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {chineseZodiacResult.category}
                    </div>
                  </Card>
                </div>
                <div className="mt-4 text-center text-yellow-800 font-medium">
                  {chineseZodiacResult.detail}
                </div>
              </div>
            )}

            {/* Certificate Section (hidden, styled for download) */}
            <div
              id="certificate-section"
              className="fixed left-[-9999px] top-0 w-[800px] h-[600px] bg-white flex flex-col items-center justify-center border-4 border-pink-300 rounded-2xl shadow-lg p-12 text-center"
            >
              <h2 className="text-3xl font-bold text-primary mb-2">
                Love Compatibility Certificate
              </h2>
              <div className="text-lg mb-4 text-foreground">
                This certifies the cosmic connection between
              </div>
              <div className="text-2xl font-bold text-pink-600 mb-2">
                {person1.name || "Person 1"} &amp; {person2.name || "Person 2"}
              </div>
              <div className="mb-4 text-lg text-foreground">
                with an overall compatibility score of
              </div>
              <div className="text-5xl font-extrabold text-primary mb-4">
                {finalScore}%
              </div>
              <div className="mb-4 text-base text-muted-foreground">
                Numerology: {numerologyScore}% | Zodiac: {zodiacScore}%
              </div>
              <div className="italic text-muted-foreground mb-2">
                {certificateQuotes[
                  getPairKey(result.person1Sign, result.person2Sign)
                ] ||
                  "May your journey together be filled with love, harmony, and cosmic magic."}
              </div>
              <div className="mt-8 text-xs text-muted-foreground">
                Generated by AI Love Calculator
              </div>
            </div>

            <div className="space-y-3 mt-8 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <Button
                onClick={resetCalculator}
                className="w-full sm:w-auto bg-gradient-love hover:opacity-90 text-white border-0 shadow-love"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Calculate Again
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/5"
                onClick={handleShareImage}
              >
                Share on Social Media
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/5"
                onClick={handleDownloadCertificate}
              >
                Download Certificate
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-white/80 shadow-card rounded-lg border-0 mt-8 p-8">
        <div className="p-8">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 mx-auto text-primary animate-bounce-gentle mb-4" />
            <h1 className="text-3xl font-bold bg-gradient-love bg-clip-text text-transparent mb-2">
              Love Calculator
            </h1>
            <p className="text-muted-foreground">
              Discover your romantic compatibility through the stars and
              numerology
            </p>
          </div>

          <div className="space-y-6">
            {/* Person 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                First Person
              </h3>
              <Input
                placeholder="Enter name"
                value={person1.name}
                onChange={(e) =>
                  setPerson1((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-border focus:ring-primary"
              />
              <div className="relative">
                <Input
                  type="date"
                  value={person1.birthDate}
                  onChange={(e) =>
                    setPerson1((prev) => ({
                      ...prev,
                      birthDate: e.target.value,
                    }))
                  }
                  className="border-border focus:ring-primary"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {/* Show zodiac sign for person 1 */}
              {person1.birthDate && person1Sign !== "Unknown" && (
                <div className="text-sm text-primary font-medium mt-1">
                  Zodiac Sign: {person1Sign}
                </div>
              )}
            </div>

            {/* Person 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Second Person
              </h3>
              <Input
                placeholder="Enter name"
                value={person2.name}
                onChange={(e) =>
                  setPerson2((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-border focus:ring-primary"
              />
              <div className="relative">
                <Input
                  type="date"
                  value={person2.birthDate}
                  onChange={(e) =>
                    setPerson2((prev) => ({
                      ...prev,
                      birthDate: e.target.value,
                    }))
                  }
                  className="border-border focus:ring-primary"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {/* Show zodiac sign for person 2 */}
              {person2.birthDate && person2Sign !== "Unknown" && (
                <div className="text-sm text-primary font-medium mt-1">
                  Zodiac Sign: {person2Sign}
                </div>
              )}
            </div>

            <Button
              onClick={calculateCompatibility}
              disabled={
                !person1.name ||
                !person1.birthDate ||
                !person2.name ||
                !person2.birthDate ||
                isCalculating
              }
              className="w-full bg-gradient-love hover:opacity-90 text-white border-0 shadow-love disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <Heart className="w-4 h-4 mr-2 animate-heart-pulse" />
                  Calculating Love...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Calculate Compatibility
                </>
              )}
            </Button>
          </div>

          {/* How It Works Banner */}
          <div className="mt-10 rounded-lg bg-white/80 shadow-card p-6 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-xl font-bold">i</span>
                </div>
              </div>
              <div className="text-left w-full">
                <h2 className="text-lg font-semibold text-foreground mb-1 text-left">
                  How It Works
                </h2>
                <p className="text-muted-foreground mb-2 text-left">
                  Our compatibility calculator combines two powerful ancient
                  systems:
                </p>
                <ul className="space-y-1 text-base text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-pink-600">★</span>
                    <span>
                      <span className="font-semibold text-foreground">
                        Zodiac Compatibility:
                      </span>{" "}
                      Based on your birth dates and astrological signs
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-600">#</span>
                    <span>
                      <span className="font-semibold text-foreground">
                        Numerology Analysis:
                      </span>{" "}
                      Calculated from the vibrations of your names
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-600">♡</span>
                    <span>
                      <span className="font-semibold text-foreground">
                        Combined Score:
                      </span>{" "}
                      A personalized compatibility percentage just for you
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Zodiac Details Modal/Card */}
      {openZodiac && zodiacDetails[openZodiac] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="max-w-md w-full bg-white/90 shadow-card rounded-lg border-0 p-6 relative animate-fade-in-up">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setOpenZodiac(null)}
            >
              ×
            </Button>
            <h2 className="text-xl font-bold mb-2 text-primary">
              {openZodiac}
            </h2>
            <div className="mb-2">
              <span className="font-semibold">Personality Traits:</span>{" "}
              {zodiacDetails[openZodiac].traits}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Strengths:</span>{" "}
              {zodiacDetails[openZodiac].strengths}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Weaknesses:</span>{" "}
              {zodiacDetails[openZodiac].weaknesses}
            </div>
            <div>
              <span className="font-semibold">Love Compatibility:</span>{" "}
              {zodiacDetails[openZodiac].love}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

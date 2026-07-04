import React, { useState, useEffect, useCallback } from "react";
import { Sun, Flower2, Star, Heart, Home as HomeIcon, TreePine, Puzzle, MessageCircle, Calendar, MapPin, Grid3x3, ArrowLeft, Sparkles } from "lucide-react";

const ICONS = [
  { id: "sun", Icon: Sun, color: "#C9A227" },
  { id: "flower", Icon: Flower2, color: "#C98A93" },
  { id: "star", Icon: Star, color: "#5B7F76" },
  { id: "heart", Icon: Heart, color: "#B5565F" },
  { id: "home", Icon: HomeIcon, color: "#7A8C74" },
  { id: "tree", Icon: TreePine, color: "#3F6B5A" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck() {
  const pairs = ICONS.flatMap((item, i) => [
    { key: `${item.id}-a`, iconId: item.id, uid: i * 2 },
    { key: `${item.id}-b`, iconId: item.id, uid: i * 2 + 1 },
  ]);
  return shuffle(pairs);
}

function MatchingGame({ onBack }) {
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [message, setMessage] = useState("Tap two cards to find a match.");
  const [busy, setBusy] = useState(false);

  const allMatched = matched.size === deck.length;

  const handleTap = useCallback(
    (card) => {
      if (busy || flipped.some((f) => f.uid === card.uid) || matched.has(card.uid)) return;
      const next = [...flipped, card];
      setFlipped(next);

      if (next.length === 2) {
        setBusy(true);
        const [a, b] = next;
        if (a.iconId === b.iconId) {
          setMessage("Lovely — that's a match!");
          setTimeout(() => {
            setMatched((prev) => new Set([...prev, a.uid, b.uid]));
            setFlipped([]);
            setBusy(false);
            setMessage("Tap two cards to find a match.");
          }, 700);
        } else {
          setMessage("Good try — let's look again.");
          setTimeout(() => {
            setFlipped([]);
            setBusy(false);
            setMessage("Tap two cards to find a match.");
          }, 900);
        }
      }
    },
    [busy, flipped, matched]
  );

  const newGame = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched(new Set());
    setMessage("Tap two cards to find a match.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EDF1EC", padding: "24px 16px 48px", fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#3F6B5A", fontSize: 20, fontWeight: 700, padding: "8px 4px", marginBottom: 12, cursor: "pointer",
        }}
      >
        <ArrowLeft size={24} /> Home
      </button>

      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: "#2F3B36", margin: "0 0 6px" }}>Matching</h1>
      <p style={{ fontSize: 19, color: "#5B6B62", margin: "0 0 20px", minHeight: 28 }}>{message}</p>

      {allMatched ? (
        <div style={{ textAlign: "center", padding: "40px 16px", background: "#FFFFFF", borderRadius: 20, boxShadow: "0 4px 14px rgba(47,59,54,0.08)" }}>
          <Sparkles size={40} color="#C9A227" style={{ marginBottom: 10 }} />
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "#2F3B36", margin: "0 0 20px" }}>
            You matched them all!
          </p>
          <button
            onClick={newGame}
            style={{
              background: "#5B7F76", color: "#fff", border: "none", borderRadius: 14,
              padding: "16px 28px", fontSize: 19, fontWeight: 700, cursor: "pointer",
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {deck.map((card) => {
            const isFlipped = flipped.some((f) => f.uid === card.uid) || matched.has(card.uid);
            const isMatched = matched.has(card.uid);
            const iconData = ICONS.find((i) => i.id === card.iconId);
            const { Icon, color } = iconData;
            return (
              <button
                key={card.uid}
                onClick={() => handleTap(card)}
                disabled={isMatched}
                aria-label={isFlipped ? iconData.id : "hidden card"}
                style={{
                  aspectRatio: "1", borderRadius: 16, border: "none", cursor: isMatched ? "default" : "pointer",
                  background: isFlipped ? "#FFFFFF" : "#5B7F76",
                  boxShadow: isMatched ? "0 0 0 3px #C9A227 inset" : "0 4px 10px rgba(47,59,54,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.25s, transform 0.15s", transform: isMatched ? "scale(0.96)" : "scale(1)",
                }}
              >
                {isFlipped ? <Icon size={38} color={color} /> : <Puzzle size={26} color="#EDF1EC" opacity={0.7} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const WORD_ROUNDS = [
  { sentence: "I left ___ book on the table.", choices: ["there", "their", "they're"], correct: "their" },
  { sentence: "___ going to love this old photo.", choices: ["Their", "There", "They're"], correct: "They're" },
  { sentence: "Put the vase over ___, by the window.", choices: ["there", "their", "they're"], correct: "there" },
  { sentence: "Is this ___ hat or mine?", choices: ["your", "you're"], correct: "your" },
  { sentence: "___ going to enjoy this one.", choices: ["Your", "You're"], correct: "You're" },
  { sentence: "The dog wagged ___ tail all afternoon.", choices: ["its", "it's"], correct: "its" },
  { sentence: "___ a beautiful day outside.", choices: ["Its", "It's"], correct: "It's" },
  { sentence: "I would rather stay home ___ go out tonight.", choices: ["then", "than"], correct: "than" },
  { sentence: "___ coming with us to the lake?", choices: ["Whose", "Who's"], correct: "Who's" },
  { sentence: "That movie had a big ___ on me.", choices: ["affect", "effect"], correct: "effect" },
];

const SPOT_ROUNDS = [
  { sentence: "They're taking the dog for a walk.", isCorrect: true },
  { sentence: "Its going to rain this afternoon.", isCorrect: false, fix: "It's going to rain this afternoon." },
  { sentence: "She left her keys over there.", isCorrect: true },
  { sentence: "Your the best cook I know.", isCorrect: false, fix: "You're the best cook I know." },
  { sentence: "Whose turn is it to choose the movie?", isCorrect: true },
  { sentence: "I would rather walk then drive today.", isCorrect: false, fix: "I would rather walk than drive today." },
  { sentence: "The cat licked it's paw.", isCorrect: false, fix: "The cat licked its paw." },
  { sentence: "Who's coming to dinner tonight?", isCorrect: true },
  { sentence: "We're going too the market.", isCorrect: false, fix: "We're going to the market." },
  { sentence: "Their house has a lovely garden.", isCorrect: true },
];

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function WordPlayGame({ onBack }) {
  const [order] = useState(() => shuffleArr(WORD_ROUNDS));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [message, setMessage] = useState("Tap the word that fits best.");
  const [done, setDone] = useState(false);

  const round = order[index];

  const handlePick = (choice) => {
    if (picked) return;
    setPicked(choice);
    if (choice === round.correct) {
      setMessage("That's it — nicely done!");
    } else {
      setMessage(`Good try. The word is "${round.correct}."`);
    }
    setTimeout(() => {
      if (index + 1 < order.length) {
        setIndex(index + 1);
        setPicked(null);
        setMessage("Tap the word that fits best.");
      } else {
        setDone(true);
      }
    }, 1400);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setDone(false);
    setMessage("Tap the word that fits best.");
  };

  const parts = round ? round.sentence.split("___") : [];

  return (
    <div style={{ minHeight: "100vh", background: "#EDF1EC", padding: "24px 16px 48px", fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#3F6B5A", fontSize: 20, fontWeight: 700, padding: "8px 4px", marginBottom: 12, cursor: "pointer",
        }}
      >
        <ArrowLeft size={24} /> Word Play
      </button>

      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: "#2F3B36", margin: "0 0 6px" }}>Choose the Word</h1>
      <p style={{ fontSize: 19, color: "#5B6B62", margin: "0 0 20px", minHeight: 28 }}>{message}</p>

      {done ? (
        <div style={{ textAlign: "center", padding: "40px 16px", background: "#FFFFFF", borderRadius: 20, boxShadow: "0 4px 14px rgba(47,59,54,0.08)" }}>
          <Sparkles size={40} color="#C9A227" style={{ marginBottom: 10 }} />
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "#2F3B36", margin: "0 0 20px" }}>
            You made it through them all!
          </p>
          <button
            onClick={restart}
            style={{
              background: "#C98A93", color: "#fff", border: "none", borderRadius: 14,
              padding: "16px 28px", fontSize: 19, fontWeight: 700, cursor: "pointer",
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div style={{
            background: "#FFFFFF", borderRadius: 18, padding: "28px 22px", marginBottom: 22,
            boxShadow: "0 3px 10px rgba(47,59,54,0.08)", fontSize: 23, lineHeight: 1.5, color: "#2F3B36",
            fontFamily: "'Fraunces', serif",
          }}>
            {parts[0]}
            <span style={{
              display: "inline-block", minWidth: 64, borderBottom: "3px solid #C9A227",
              textAlign: "center", margin: "0 4px",
            }}>
              {picked || "\u00A0"}
            </span>
            {parts[1]}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {round.choices.map((choice) => {
              const isPicked = picked === choice;
              const isCorrect = choice === round.correct;
              let bg = "#FFFFFF";
              let border = "2px solid transparent";
              if (picked) {
                if (isCorrect) { bg = "#E8F0E5"; border = "2px solid #5B7F76"; }
                else if (isPicked) { bg = "#F6E9EA"; border = "2px solid #C98A93"; }
              }
              return (
                <button
                  key={choice}
                  onClick={() => handlePick(choice)}
                  disabled={!!picked}
                  style={{
                    background: bg, border, borderRadius: 14, padding: "18px 20px",
                    fontSize: 21, fontWeight: 700, color: "#2F3B36", cursor: picked ? "default" : "pointer",
                    boxShadow: "0 2px 8px rgba(47,59,54,0.07)",
                  }}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function SpotGame({ onBack }) {
  const [order] = useState(() => shuffleArr(SPOT_ROUNDS));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [message, setMessage] = useState("Does this sentence sound right?");
  const [done, setDone] = useState(false);

  const round = order[index];

  const handlePick = (choice) => {
    if (picked) return;
    setPicked(choice);
    const wasRight = choice === round.isCorrect;
    if (wasRight && round.isCorrect) setMessage("Right — that one's correct!");
    else if (wasRight && !round.isCorrect) setMessage(`Good catch! It should be: "${round.fix}"`);
    else if (round.isCorrect) setMessage("Actually, this one was correct as written.");
    else setMessage(`Close look. It should be: "${round.fix}"`);

    setTimeout(() => {
      if (index + 1 < order.length) {
        setIndex(index + 1);
        setPicked(null);
        setMessage("Does this sentence sound right?");
      } else {
        setDone(true);
      }
    }, 1700);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setDone(false);
    setMessage("Does this sentence sound right?");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EDF1EC", padding: "24px 16px 48px", fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#3F6B5A", fontSize: 20, fontWeight: 700, padding: "8px 4px", marginBottom: 12, cursor: "pointer",
        }}
      >
        <ArrowLeft size={24} /> Word Play
      </button>

      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: "#2F3B36", margin: "0 0 6px" }}>Spot the Slip</h1>
      <p style={{ fontSize: 19, color: "#5B6B62", margin: "0 0 20px", minHeight: 50 }}>{message}</p>

      {done ? (
        <div style={{ textAlign: "center", padding: "40px 16px", background: "#FFFFFF", borderRadius: 20, boxShadow: "0 4px 14px rgba(47,59,54,0.08)" }}>
          <Sparkles size={40} color="#C9A227" style={{ marginBottom: 10 }} />
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "#2F3B36", margin: "0 0 20px" }}>
            You made it through them all!
          </p>
          <button
            onClick={restart}
            style={{
              background: "#C98A93", color: "#fff", border: "none", borderRadius: 14,
              padding: "16px 28px", fontSize: 19, fontWeight: 700, cursor: "pointer",
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div style={{
            background: "#FFFFFF", borderRadius: 18, padding: "28px 22px", marginBottom: 22,
            boxShadow: "0 3px 10px rgba(47,59,54,0.08)", fontSize: 22, lineHeight: 1.5, color: "#2F3B36",
            fontFamily: "'Fraunces', serif",
          }}>
            "{round.sentence}"
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Sounds Right", value: true, color: "#5B7F76" },
              { label: "Sounds Off", value: false, color: "#C98A93" },
            ].map((opt) => {
              const isPicked = picked === opt.value;
              return (
                <button
                  key={opt.label}
                  onClick={() => handlePick(opt.value)}
                  disabled={picked !== null}
                  style={{
                    flex: 1, background: isPicked ? opt.color : "#FFFFFF",
                    color: isPicked ? "#fff" : "#2F3B36",
                    border: `2px solid ${isPicked ? opt.color : "transparent"}`,
                    borderRadius: 14, padding: "20px 12px", fontSize: 19, fontWeight: 700,
                    cursor: picked ? "default" : "pointer", boxShadow: "0 2px 8px rgba(47,59,54,0.07)",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function WordPlayHub({ onBack, onPickMode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#EDF1EC", padding: "24px 16px 48px", fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#3F6B5A", fontSize: 20, fontWeight: 700, padding: "8px 4px", marginBottom: 12, cursor: "pointer",
        }}
      >
        <ArrowLeft size={24} /> Home
      </button>

      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: "#2F3B36", margin: "0 0 6px" }}>Word Play</h1>
      <p style={{ fontSize: 19, color: "#5B6B62", margin: "0 0 20px" }}>Choose a game.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Tile Icon={MessageCircle} label="Choose the Word" sublabel="Pick the word that fits" color="#C98A93" onClick={() => onPickMode("choose")} />
        <Tile Icon={Sparkles} label="Spot the Slip" sublabel="Right or a little off?" color="#5B7F76" onClick={() => onPickMode("spot")} />
      </div>
    </div>
  );
}

function svgToDataUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// TODO: Consider swapping one or more of these illustrations for real photos or
// custom scenes tied to Dad's actual memories (a monument he visited, a pet he
// had, a place he lived). Keep the same 3x3 grid + svgToDataUri approach —
// a photo can be dropped in as the `svg` field's data source, or a new
// hand-drawn scene can follow the same flat-shape pattern as the ones below.
const PUZZLES = [
  {
    title: "Elephant",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="180" fill="#BFDDE8"/><rect y="180" width="300" height="120" fill="#9CC08A"/>
      <circle cx="235" cy="55" r="26" fill="#F3D477"/>
      <ellipse cx="112" cy="158" rx="58" ry="55" fill="#8B959C"/>
      <ellipse cx="172" cy="205" rx="92" ry="60" fill="#9AA5AC"/>
      <ellipse cx="100" cy="168" rx="42" ry="44" fill="#9AA5AC"/>
      <rect x="118" y="252" width="16" height="42" fill="#93A0A6"/>
      <rect x="150" y="256" width="16" height="42" fill="#8E9CA2"/>
      <rect x="186" y="256" width="16" height="42" fill="#93A0A6"/>
      <rect x="218" y="252" width="16" height="42" fill="#8E9CA2"/>
      <path d="M78 190 Q45 210 42 245 Q41 262 55 264 Q66 264 63 250 Q64 222 88 200 Z" fill="#9AA5AC"/>
      <circle cx="108" cy="160" r="4" fill="#2F3B36"/>
      <path d="M258 210 Q272 218 268 235" stroke="#9AA5AC" stroke-width="5" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
  {
    title: "Mountains",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="220" fill="#B7D6E0"/><rect y="220" width="300" height="80" fill="#8FAE7D"/>
      <circle cx="240" cy="60" r="28" fill="#F3D477"/>
      <polygon points="0,220 90,90 170,220" fill="#6E7F7A"/><polygon points="60,220 90,90 120,220" fill="#889b96" opacity="0.6"/>
      <polygon points="140,220 220,60 300,220" fill="#556B64"/>
      <polygon points="75,140 90,90 105,140" fill="#FFFFFF"/><polygon points="195,110 220,60 245,110" fill="#FFFFFF"/>
    </svg>`,
  },
  {
    title: "Statue of Liberty",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="210" fill="#BFDDE8"/><rect y="210" width="300" height="90" fill="#7CA0B5"/>
      <circle cx="45" cy="45" r="16" fill="#FFFFFF"/><circle cx="65" cy="50" r="20" fill="#FFFFFF"/><circle cx="28" cy="55" r="12" fill="#FFFFFF"/>
      <path d="M235 45 Q245 42 250 48" stroke="#5A5A5A" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M255 62 Q265 59 270 65" stroke="#5A5A5A" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="120" y="230" width="60" height="45" fill="#8A8F7E"/>
      <rect x="135" y="110" width="30" height="130" fill="#7FA396"/>
      <path d="M150 60 L165 100 L135 100 Z" fill="#7FA396"/>
      <polygon points="150,40 156,60 144,60" fill="#7FA396"/>
      <rect x="163" y="90" width="8" height="35" fill="#7FA396"/>
      <circle cx="167" cy="85" r="10" fill="#E8C34A"/>
      <rect x="10" y="222" width="55" height="8" fill="#8B6F47"/>
      <rect x="14" y="230" width="6" height="18" fill="#8B6F47"/><rect x="55" y="230" width="6" height="18" fill="#8B6F47"/>
      <polygon points="235,258 288,258 278,280 240,280" fill="#B5565F"/>
      <rect x="250" y="240" width="24" height="18" fill="#F2EDE4"/>
    </svg>`,
  },
  {
    title: "Lighthouse",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="190" fill="#CFE6EE"/><rect y="190" width="300" height="110" fill="#4E7FA0"/>
      <circle cx="50" cy="45" r="15" fill="#FFFFFF"/><circle cx="68" cy="48" r="19" fill="#FFFFFF"/><circle cx="34" cy="52" r="11" fill="#FFFFFF"/>
      <polygon points="10,270 55,255 90,270 95,296 5,296" fill="#8B7355"/>
      <polygon points="30,262 48,250 66,262" fill="#6E5A42"/>
      <polygon points="135,90 165,90 155,260 145,260" fill="#F2EDE4"/>
      <rect x="137" y="130" width="26" height="16" fill="#B5565F"/><rect x="137" y="170" width="26" height="16" fill="#B5565F"/>
      <rect x="132" y="70" width="36" height="22" fill="#6B7280"/>
      <polygon points="132,70 168,70 150,50" fill="#B5565F"/>
      <circle cx="150" cy="80" r="6" fill="#F3D477"/>
      <polygon points="215,255 285,255 268,225 232,225" fill="#F2EDE4"/>
      <polygon points="255,225 255,175 285,225" fill="#FFFFFF"/>
      <rect x="253" y="175" width="4" height="82" fill="#8B6F47"/>
    </svg>`,
  },
  {
    title: "Golden Gate Bridge",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="190" fill="#F2C9A0"/><rect y="190" width="300" height="110" fill="#5B85A6"/>
      <rect x="75" y="60" width="20" height="200" fill="#C1440E"/><rect x="205" y="60" width="20" height="200" fill="#C1440E"/>
      <rect x="0" y="185" width="300" height="14" fill="#C1440E"/>
      <path d="M85 70 Q150 130 215 70" stroke="#C1440E" stroke-width="4" fill="none"/>
      <path d="M85 190 Q150 130 215 190" stroke="#C1440E" stroke-width="4" fill="none"/>
      <rect x="82" y="55" width="10" height="14" fill="#C1440E"/><rect x="208" y="55" width="10" height="14" fill="#C1440E"/>
    </svg>`,
  },
  {
    title: "Barn",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="200" fill="#BFDDE8"/><rect y="200" width="300" height="100" fill="#9CC08A"/>
      <circle cx="245" cy="55" r="26" fill="#F3D477"/>
      <rect x="90" y="150" width="120" height="100" fill="#B5565F"/>
      <polygon points="80,150 150,95 220,150" fill="#8A3B41"/>
      <rect x="135" y="190" width="30" height="60" fill="#F2EDE4"/>
      <rect x="60" y="180" width="26" height="70" fill="#C9A227"/><ellipse cx="73" cy="180" rx="13" ry="8" fill="#B5901F"/>
    </svg>`,
  },
  {
    title: "Owl",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="#2C3E52"/>
      <circle cx="230" cy="55" r="22" fill="#EDE6C8"/>
      <rect x="40" y="220" width="220" height="14" fill="#5C4A3A"/>
      <ellipse cx="150" cy="170" rx="65" ry="80" fill="#8B6F47"/>
      <circle cx="122" cy="145" r="26" fill="#F2EDE4"/><circle cx="178" cy="145" r="26" fill="#F2EDE4"/>
      <circle cx="122" cy="145" r="10" fill="#2F3B36"/><circle cx="178" cy="145" r="10" fill="#2F3B36"/>
      <polygon points="150,160 140,178 160,178" fill="#E8A23A"/>
      <polygon points="105,110 115,135 95,130" fill="#8B6F47"/><polygon points="195,110 185,135 205,130" fill="#8B6F47"/>
    </svg>`,
  },
  {
    title: "Mount Rushmore",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="#BFDDE8"/>
      <polygon points="0,300 20,140 90,90 160,150 210,80 300,160 300,300" fill="#9AA0A0"/>
      <ellipse cx="55" cy="180" rx="22" ry="28" fill="#B7BDBD"/>
      <ellipse cx="105" cy="165" rx="22" ry="30" fill="#B7BDBD"/>
      <ellipse cx="160" cy="175" rx="22" ry="28" fill="#B7BDBD"/>
      <ellipse cx="210" cy="160" rx="22" ry="30" fill="#B7BDBD"/>
    </svg>`,
  },
  {
    title: "Sailboat",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="190" fill="#CFE6EE"/><rect y="190" width="300" height="110" fill="#5B85A6"/>
      <polygon points="0,190 70,140 140,190" fill="#8C9C93" opacity="0.7"/><polygon points="160,190 230,150 300,190" fill="#728279" opacity="0.7"/>
      <polygon points="150,240 190,240 175,120" fill="#F2EDE4"/>
      <rect x="148" y="118" width="4" height="122" fill="#8B6F47"/>
      <polygon points="110,240 190,240 205,260 95,260" fill="#B5565F"/>
    </svg>`,
  },
  {
    title: "Dog",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="#E8DCC8"/>
      <rect x="0" y="250" width="300" height="16" fill="#C9A227"/>
      <ellipse cx="150" cy="215" rx="68" ry="58" fill="#FDFBF6"/>
      <ellipse cx="115" cy="230" rx="20" ry="14" fill="#B5732E"/>
      <ellipse cx="192" cy="245" rx="16" ry="11" fill="#B5732E"/>
      <rect x="112" y="252" width="20" height="34" rx="8" fill="#FDFBF6"/>
      <rect x="168" y="252" width="20" height="34" rx="8" fill="#FDFBF6"/>
      <path d="M206 222 Q232 214 228 186" stroke="#FDFBF6" stroke-width="14" fill="none" stroke-linecap="round"/>
      <ellipse cx="102" cy="100" rx="20" ry="30" fill="#B5732E"/>
      <ellipse cx="198" cy="100" rx="20" ry="30" fill="#B5732E"/>
      <circle cx="150" cy="132" r="56" fill="#FDFBF6"/>
      <circle cx="122" cy="132" r="24" fill="#B5732E"/>
      <circle cx="128" cy="132" r="8" fill="#2F3B36"/>
      <circle cx="174" cy="132" r="8" fill="#2F3B36"/>
      <ellipse cx="150" cy="155" rx="20" ry="16" fill="#FDFBF6"/>
      <ellipse cx="150" cy="157" rx="9" ry="6" fill="#2F3B36"/>
      <path d="M150 163 Q150 171 140 173" stroke="#2F3B36" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M150 163 Q150 171 160 173" stroke="#2F3B36" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
];

function shuffledPieceOrder() {
  let arr = shuffleArr([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  if (arr.every((v, i) => v === i)) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

function PuzzlePlay({ puzzle, onBack, onNext, hasNext }) {
  const dataUri = svgToDataUri(puzzle.svg);
  const [pieces, setPieces] = useState(shuffledPieceOrder);
  const [selected, setSelected] = useState(null);
  const solved = pieces.every((v, i) => v === i);

  const tapPiece = (slotIndex) => {
    if (solved) return;
    if (selected === null) {
      setSelected(slotIndex);
      return;
    }
    if (selected === slotIndex) {
      setSelected(null);
      return;
    }
    const next = [...pieces];
    [next[selected], next[slotIndex]] = [next[slotIndex], next[selected]];
    setPieces(next);
    setSelected(null);
  };

  const reshuffle = () => {
    setPieces(shuffledPieceOrder());
    setSelected(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EDF1EC", padding: "24px 16px 48px", fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#3F6B5A", fontSize: 20, fontWeight: 700, padding: "8px 4px", marginBottom: 12, cursor: "pointer",
        }}
      >
        <ArrowLeft size={24} /> Puzzles
      </button>

      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: "#2F3B36", margin: "0 0 6px" }}>{puzzle.title}</h1>
      <p style={{ fontSize: 19, color: "#5B6B62", margin: "0 0 20px" }}>
        {solved ? "You solved it!" : "Tap two pieces to swap them."}
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, background: "#2F3B36",
        borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 14px rgba(47,59,54,0.15)",
      }}>
        {pieces.map((originIndex, slotIndex) => {
          const col = originIndex % 3;
          const row = Math.floor(originIndex / 3);
          return (
            <button
              key={slotIndex}
              onClick={() => tapPiece(slotIndex)}
              disabled={solved}
              style={{
                aspectRatio: "1", border: selected === slotIndex ? "4px solid #C9A227" : "4px solid transparent",
                padding: 0, cursor: solved ? "default" : "pointer",
                backgroundImage: `url("${dataUri}")`, backgroundSize: "300% 300%",
                backgroundPosition: `${col * 50}% ${row * 50}%`,
              }}
            />
          );
        })}
      </div>

      {solved && (
        <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
          <button
            onClick={reshuffle}
            style={{
              flex: 1, background: "#FFFFFF", color: "#2F3B36", border: "2px solid #5B7F76", borderRadius: 14,
              padding: "16px 10px", fontSize: 18, fontWeight: 700, cursor: "pointer",
            }}
          >
            Play Again
          </button>
          {hasNext && (
            <button
              onClick={onNext}
              style={{
                flex: 1, background: "#5B7F76", color: "#fff", border: "none", borderRadius: 14,
                padding: "16px 10px", fontSize: 18, fontWeight: 700, cursor: "pointer",
              }}
            >
              Next Puzzle
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PuzzleGame({ onBack }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (activeIndex !== null) {
    return (
      <PuzzlePlay
        key={activeIndex}
        puzzle={PUZZLES[activeIndex]}
        onBack={() => setActiveIndex(null)}
        onNext={() => setActiveIndex((activeIndex + 1) % PUZZLES.length)}
        hasNext={activeIndex + 1 < PUZZLES.length}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EDF1EC", padding: "24px 16px 48px", fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#3F6B5A", fontSize: 20, fontWeight: 700, padding: "8px 4px", marginBottom: 12, cursor: "pointer",
        }}
      >
        <ArrowLeft size={24} /> Home
      </button>

      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: "#2F3B36", margin: "0 0 6px" }}>Picture Puzzles</h1>
      <p style={{ fontSize: 19, color: "#5B6B62", margin: "0 0 20px" }}>Pick a picture to put together.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {PUZZLES.map((puzzle, i) => (
          <button
            key={puzzle.title}
            onClick={() => setActiveIndex(i)}
            style={{
              border: "none", borderRadius: 14, padding: 0, cursor: "pointer", overflow: "hidden",
              boxShadow: "0 3px 10px rgba(47,59,54,0.1)", background: "#FFFFFF",
            }}
          >
            <div style={{
              aspectRatio: "1", backgroundImage: `url("${svgToDataUri(puzzle.svg)}")`,
              backgroundSize: "cover", backgroundPosition: "center",
            }} />
            <div style={{ padding: "10px 6px", fontSize: 16, fontWeight: 700, color: "#2F3B36" }}>{puzzle.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Tile({ Icon, label, sublabel, color, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 16, textAlign: "left",
        background: "#FFFFFF", border: "none", borderRadius: 18, padding: "18px 20px",
        boxShadow: "0 3px 10px rgba(47,59,54,0.08)", cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.55 : 1, position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: 26, height: 26, background: color, opacity: 0.25, clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
      <div style={{ background: color, borderRadius: 12, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={30} color="#fff" />
      </div>
      <div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 21, color: "#2F3B36", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 15, color: "#7A8C82" }}>{sublabel}</div>
      </div>
    </button>
  );
}

const GREETINGS = [
  "What do you want to play today, Mike?",
  "It's a nice day to play, Mike",
  "Good to see you, Mike",
  "Welcome back, Mike",
  "Ready for a game, Mike?",
  "So glad you're here, Mike",
  "Let's have some fun today, Mike",
  "What shall we play, Mike?",
];

export default function App() {
  const [screen, setScreen] = useState("home");

  // Rotate through the greetings one at a time on each fresh open,
  // remembering where we left off so Mike sees a different one each visit.
  const [greeting] = useState(() => {
    try {
      const last = parseInt(localStorage.getItem("ml-greeting-index") ?? "-1", 10);
      const next = (last + 1) % GREETINGS.length;
      localStorage.setItem("ml-greeting-index", String(next));
      return GREETINGS[next];
    } catch {
      return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    }
  });

  useEffect(() => {
    const link1 = document.createElement("link");
    link1.href = "https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Atkinson+Hyperlegible:wght@400;700&display=swap";
    link1.rel = "stylesheet";
    document.head.appendChild(link1);
  }, []);

  if (screen === "matching") return <MatchingGame onBack={() => setScreen("home")} />;
  if (screen === "wordplay") return <WordPlayHub onBack={() => setScreen("home")} onPickMode={(mode) => setScreen(mode === "choose" ? "wordplay-choose" : "wordplay-spot")} />;
  if (screen === "wordplay-choose") return <WordPlayGame onBack={() => setScreen("wordplay")} />;
  if (screen === "wordplay-spot") return <SpotGame onBack={() => setScreen("wordplay")} />;
  if (screen === "puzzles") return <PuzzleGame onBack={() => setScreen("home")} />;

  return (
    <div style={{ minHeight: "100vh", background: "#EDF1EC", padding: "28px 16px 48px", fontFamily: "'Atkinson Hyperlegible', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 16, color: "#7A8C82", margin: "0 0 2px", letterSpacing: 0.5 }}>MEMORY LANE</p>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, color: "#2F3B36", margin: 0, lineHeight: 1.2 }}>{greeting}</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Tile Icon={Puzzle} label="Matching" sublabel="Find the pairs" color="#5B7F76" onClick={() => setScreen("matching")} />
        <Tile Icon={MessageCircle} label="Word Play" sublabel="Right word, right place" color="#C98A93" onClick={() => setScreen("wordplay")} />
        <Tile Icon={Calendar} label="Guess the Year" sublabel="Coming soon" color="#C9A227" disabled />
        <Tile Icon={MapPin} label="Name the Place" sublabel="Coming soon" color="#B5565F" disabled />
        <Tile Icon={Grid3x3} label="Picture Puzzles" sublabel="Put the picture together" color="#3F6B5A" onClick={() => setScreen("puzzles")} />
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Heart, 
  Share2, 
  Flame, 
  RotateCcw, 
  Compass, 
  Check, 
  Copy, 
  Bookmark, 
  BookmarkCheck, 
  Info,
  Calendar,
  Volume2,
  Lock,
  Award,
  Trophy,
  Download,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toPng } from "html-to-image";

// Import generated Shiba Inu Hiro images
// @ts-ignore
import hiroDefaultImg from "./assets/images/hiro_default_1783862979138.jpg";
// @ts-ignore
import hiroActionImg from "./assets/images/hiro_action_1783862999524.jpg";
// @ts-ignore
import hiroAction2Img from "./assets/images/hiro_action_2_1783866319560.jpg";
// @ts-ignore
import hiroAction3Img from "./assets/images/hiro_action_3_1783866342386.jpg";
// @ts-ignore
import hiroHeartImg from "./assets/images/hiro_heart_1783863015883.jpg";
// @ts-ignore
import hiroHeart2Img from "./assets/images/hiro_heart_2_1783866355439.jpg";
// @ts-ignore
import hiroHeart3Img from "./assets/images/hiro_heart_3_1783866369146.jpg";
// @ts-ignore
import hiroWorkImg from "./assets/images/hiro_work_1783863031492.jpg";
// @ts-ignore
import hiroGrowth2Img from "./assets/images/hiro_growth_2_1783866383873.jpg";
// @ts-ignore
import hiroGrowth3Img from "./assets/images/hiro_growth_3_1783866398296.jpg";
// @ts-ignore
import stickersSheetImg from "./assets/images/stickers_sheet_1783864275505.jpg";

// Import individual sticker reward images
// @ts-ignore
import sticker0Img from "./assets/images/sticker_0_look_1783865482845.jpg";
// @ts-ignore
import sticker1Img from "./assets/images/sticker_1_come_1783865495450.jpg";
// @ts-ignore
import sticker2Img from "./assets/images/sticker_2_love_1783865506930.jpg";
// @ts-ignore
import sticker3Img from "./assets/images/sticker_3_crazy_1783865520067.jpg";
// @ts-ignore
import sticker4Img from "./assets/images/sticker_4_kiss_1783865533789.jpg";
// @ts-ignore
import sticker5Img from "./assets/images/sticker_5_know_1783865545853.jpg";
// @ts-ignore
import sticker6Img from "./assets/images/sticker_6_good_1783865557791.jpg";
// @ts-ignore
import sticker7Img from "./assets/images/sticker_7_together_1783865569523.jpg";
// @ts-ignore
import sticker8Img from "./assets/images/sticker_8_secret_1783865582358.jpg";

interface Quote {
  id: number;
  category: "行動" | "心" | "成長";
  text: string;
  image: string;
}

interface StickerItem {
  id: number;
  title: string;
  requiredPets: number;
  emoji: string;
  dialogue: string;
  image: string;
}

interface FortuneResult {
  date: string;
  luck: "超大吉" | "大吉" | "中吉" | "吉" | "小吉" | "末吉";
  message: string;
  luckyAction: string;
  luckyItem: string;
  emoji: string;
}

const fortunePool: Omit<FortuneResult, "date">[] = [
  {
    luck: "超大吉",
    message: "奇跡みたいな一日になるワン！ボクが全力でハッピーな風を送るから、自信を持って進んでね🐾",
    luckyAction: "お気に入りの曲を聴きながら少しスキップする",
    luckyItem: "お気に入りのスニーカー",
    emoji: "👑✨"
  },
  {
    luck: "大吉",
    message: "きみの笑顔がまわりを幸せにするワン！今日はやりたいことに挑戦すると、最高の成果が出るよ✨",
    luckyAction: "深呼吸をして広い青空を見上げる",
    luckyItem: "温かいハーブティー",
    emoji: "🌟🐾"
  },
  {
    luck: "中吉",
    message: "一歩ずつ、確実に進めているワン。焦らなくて大丈夫。美味しいおやつでも食べて、のんびりいこう🍀",
    luckyAction: "身近な人に「ありがとう」と伝える",
    luckyItem: "カラフルな文房具",
    emoji: "🌈🐕"
  },
  {
    luck: "吉",
    message: "いつも通りの日常こそが宝物だワン！美味しいご飯を食べて、自分をたくさん褒めてあげてね🐾",
    luckyAction: "肩をぐるぐる回してリラックスストレッチ",
    luckyItem: "綺麗なお気に入りのハンカチ",
    emoji: "🍙🍀"
  },
  {
    luck: "小吉",
    message: "小さな幸せが見つかりそうな予感…♪ 綺麗なお花や、可愛い雲に目を向けてみてワン🐶",
    luckyAction: "デスクや身の回りを5分だけ片づける",
    luckyItem: "書き心地の良いペン",
    emoji: "🌸🎵"
  },
  {
    luck: "末吉",
    message: "今はパワーを溜める大切な時間ワン。夜は早く寝て、明日の大ジャンプに備えよう！ボクが寄り添うワン💤",
    luckyAction: "お風呂にゆっくり浸かってリラックスする",
    luckyItem: "ふかふかの枕や毛布",
    emoji: "💤🌙"
  },
  {
    luck: "超大吉",
    message: "最高の運気がきみの元に訪れているワン！想いがダイレクトに届く日。信じる心が進む力になるワン💖",
    luckyAction: "鏡の中の自分に向かってとびきりの笑顔を向ける",
    luckyItem: "お守り代わりのアクセサリー",
    emoji: "💖🔥"
  },
  {
    luck: "大吉",
    message: "新しい扉が開く予感！迷ったら「ワクワクする方」を選んでみてね。ボクがずっと応援してるワン🐾",
    luckyAction: "新しいカフェや行ったことのない場所を歩く",
    luckyItem: "カラフルなマイボトル",
    emoji: "🚀🍀"
  },
  {
    luck: "中吉",
    message: "コツコツ積み上げてきたことが実を結び始めているワン！きみの努力をボクはちゃんと知ってるワン✨",
    luckyAction: "自分のいいところを心の中で3つ数える",
    luckyItem: "読みたかった本",
    emoji: "📖💡"
  },
  {
    luck: "吉",
    message: "無理せず、きみのペースで進めばそれが一番の正解ワン。今日ものんびり笑顔でいきましょう🐶🍀",
    luckyAction: "お気に入りのアロマや良い香りを嗅ぐ",
    luckyItem: "可愛いお気に入りのマグカップ",
    emoji: "☕🐾"
  }
];

const stickerList: StickerItem[] = [
  { id: 0, title: "こっち見て", requiredPets: 10, emoji: "👀", dialogue: "「ねぇ、こっち見てよ…ちょっと照れちゃうけど、きみのこと見つめていたいんだワン🐾」", image: sticker0Img },
  { id: 1, title: "おいてよ。", requiredPets: 20, emoji: "🛏️", dialogue: "「おいでよ。となりにすわって、のんびりお話ししようワン？🍀」", image: sticker1Img },
  { id: 2, title: "好きだよ。", requiredPets: 30, emoji: "💖", dialogue: "「好きだよ。言葉にするのは恥ずかしいけど、きみへの想いは本物ワン！💕」", image: sticker2Img },
  { id: 3, title: "キミに夢中", requiredPets: 40, emoji: "😍", dialogue: "「キミに夢中！きみのことばかり考えちゃって、ご飯も手につかないワン🐾」", image: sticker3Img },
  { id: 4, title: "チュッ", requiredPets: 50, emoji: "💋", dialogue: "「チュッ💕 えへへ、ほっぺたにキスしちゃったワン！びっくりした？🐾」", image: sticker4Img },
  { id: 5, title: "もっと知りたい？", requiredPets: 60, emoji: "🤔", dialogue: "「もっと知りたい？ボクの秘密、きみにだけなら教えてもいいワン✨」", image: sticker5Img },
  { id: 6, title: "いいカンジ？", requiredPets: 70, emoji: "👍", dialogue: "「いいカンジ？きみとボクの相性はバッチリ！この調子でいこうワン！🔥」", image: sticker6Img },
  { id: 7, title: "いっしょにいたいな", requiredPets: 80, emoji: "🥰", dialogue: "「いっしょにいたいな。明日も、明後日も、ずっとずっとそばにいたいワン🍀」", image: sticker7Img },
  { id: 8, title: "ナイショだよ", requiredPets: 100, emoji: "🤫", dialogue: "「ナイショだよ…きみはボクの特別で、たった一人の大切な相棒ワン👑✨」", image: sticker8Img }
];

// 20 quotes list divided into three categories
const quoteList: Quote[] = [
  // --- 行動 (Action) ---
  { id: 1, category: "行動", text: "「行動してうまくいったら『自信』、うまくいかなかったら『経験』。それぐらい楽観的でいい。」", image: hiroActionImg },
  { id: 2, category: "行動", text: "「チャンスが来たら動くんじゃなくて、動くからチャンスが来る。」", image: hiroAction2Img },
  { id: 3, category: "行動", text: "「100回の失敗より、1回の諦めが夢を壊す。」", image: hiroAction3Img },
  { id: 4, category: "行動", text: "「楽な道を選べば見える景色はいつも同じ。楽しい道を選べば見える景色はいつも変わる。」", image: hiroActionImg },
  { id: 5, category: "行動", text: "「夢は逃げない。逃げるのはいつだって自分である。」", image: hiroAction2Img },
  { id: 6, category: "行動", text: "「始める時にすごくなくていいんだ。すごくなるために始めるんだ」", image: hiroAction3Img },
  { id: 7, category: "行動", text: "「失敗を恐れと思えば停滞して、失敗を学びと思えば前進します」", image: hiroActionImg },

  // --- 心 (Heart) ---
  { id: 8, category: "心", text: "「自信は持つものじゃなくて、後から勝手についてくるもの。」", image: hiroHeartImg },
  { id: 9, category: "心", text: "「許せない自分を許してあげてほしい。好きになれない自分を少しずつでいいから好きになってほしい。」", image: hiroHeart2Img },
  { id: 10, category: "心", text: "「有益な情報は印象に残る。実績も印象に残る。でも『思い』は心に残る。」", image: hiroHeart3Img },
  { id: 11, category: "心", text: "「自分が与えたものは、将来自分が受け取るものになる。」", image: hiroHeartImg },
  { id: 12, category: "心", text: "「あなたが今与えるものは、あなたが将来を受け取るものである」", image: hiroHeart2Img },
  { id: 13, category: "心", text: "「自分を好きじゃない人のことでくよくよする時間はないんだ。自分は自分を大好きでいてくれる人を大好きでいるのに忙しすぎるから」", image: hiroHeart3Img },
  { id: 14, category: "心", text: "「歩むという漢字は少し止まると書く。少し止まってから歩むの事も大事」", image: hiroHeartImg },

  // --- 成長 (Growth) ---
  { id: 15, category: "成長", text: "「最初から（その仕事が）向いているかなんて分からない。諦めなかった人だけが、向いている人になれる。」", image: hiroWorkImg },
  { id: 16, category: "成長", text: "「一生懸命だと知恵が出る。中途半端だと愚痴が出る。いい加減だと言い訳が出る。」", image: hiroGrowth2Img },
  { id: 17, category: "成長", text: "「自分を苦しめた高い壁は、いつか自分を守ってくれる『盾』になる。」", image: hiroGrowth3Img },
  { id: 18, category: "成長", text: "「信頼は目に見えないけれど、積み重ねると目に見えるほどの資産になる。」", image: hiroWorkImg },
  { id: 19, category: "成長", text: "「努力する辛さは一時的であり、努力しなかった辛さは一生続く。」", image: hiroGrowth2Img },
  { id: 20, category: "成長", text: "「悩みのない人生は、成長のない人生。」", image: hiroGrowth3Img }
];

export interface Costume {
  id: string;
  name: string;
  requiredLevel: number;
  image: string;
  emoji: string;
  description: string;
}

export const costumeList: Costume[] = [
  {
    id: "default",
    name: "いつもの姿",
    requiredLevel: 1,
    image: hiroDefaultImg,
    emoji: "🐕",
    description: "いつもの、ふかふかで愛らしいヒロの姿ワン🐾"
  },
  {
    id: "adventure",
    name: "お散歩バンダナ",
    requiredLevel: 2,
    image: hiroActionImg,
    emoji: "🧣",
    description: "風をきって走る、元気いっぱいのアクティブスタイルワン！"
  },
  {
    id: "heart",
    name: "あったかハートパーカー",
    requiredLevel: 3,
    image: hiroHeartImg,
    emoji: "💖",
    description: "きみへの愛がつまった、ハートマークのふかふかパーカーワン🐾"
  },
  {
    id: "suit",
    name: "できるビジネススーツ",
    requiredLevel: 4,
    image: hiroWorkImg,
    emoji: "👔",
    description: "ビシッと決めた、名言マスターのデキるビジネススーツ姿ワン！"
  },
  {
    id: "space",
    name: "宇宙飛行士スーツ",
    requiredLevel: 5,
    image: hiroGrowth3Img,
    emoji: "🚀",
    description: "宇宙レベルの絆で輝く、コスミック・アストロスーツ姿ワン！✨"
  }
];

// Interactive chat bubbles for Hiro when clicked or idle
const defaultDialogues = [
  "「今日も一日お疲れ様です！今の気分を教えてね🐾」",
  "「あなたの心にぴったりな言葉をそっと選びますよ🐕」",
  "「一歩ずつ進めば大丈夫。焦らずにいきましょう♪」",
  "「今日のあなたはどんな気分？ボクが味方になります🐾」",
  "「お腹を撫でてくれるとうれしいな…ワン！💕」"
];

export default function App() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shuffleText, setShuffleText] = useState("「下のボタンから、今の気分を教えてくださいね」");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [dialogue, setDialogue] = useState(defaultDialogues[0]);
  const [activeTab, setActiveTab] = useState<"fortune" | "history" | "favorites" | "stickers">("fortune");

  // 今日の運勢システム
  const [fortuneHistory, setFortuneHistory] = useState<FortuneResult[]>([]);
  const [todayFortune, setTodayFortune] = useState<FortuneResult | null>(null);
  const [isDrawingFortune, setIsDrawingFortune] = useState(false);
  const [fortuneShakeIndex, setFortuneShakeIndex] = useState(0);
  const fortuneCardRef = useRef<HTMLDivElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);
  const customCardRef = useRef<HTMLDivElement>(null);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [isSavingQuoteCard, setIsSavingQuoteCard] = useState(false);

  // 100以上のキズナゲージ特典の状態
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [customQuoteText, setCustomQuoteText] = useState("きみと出会えて本当によかったワン🐾");
  const [customQuoteTheme, setCustomQuoteTheme] = useState<"gold" | "sakura" | "rainbow" | "cosmic">("gold");
  const [isSavingCustomCard, setIsSavingCustomCard] = useState(false);
  const [showSecretLetter, setShowSecretLetter] = useState(false);

  const getTodayDateString = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // なでなでカウントと絆システム
  const [petCount, setPetCount] = useState<number>(0);
  const [petEffects, setPetEffects] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState("");

  // お着替えシステムの状態
  const [equippedCostume, setEquippedCostume] = useState<string>("default");
  const [showCloset, setShowCloset] = useState(false);

  // ステッカー報酬システム用状態
  const [selectedSticker, setSelectedSticker] = useState<number | null>(null);
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [newlyUnlockedSticker, setNewlyUnlockedSticker] = useState<number | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Local storage lists
  const [history, setHistory] = useState<Quote[]>([]);
  const [favorites, setFavorites] = useState<Quote[]>([]);

  // Load persistence state on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("hiro_gacha_history");
    const savedFavorites = localStorage.getItem("hiro_gacha_favorites");
    const savedPetCount = localStorage.getItem("hiro_pet_count");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedPetCount) setPetCount(parseInt(savedPetCount, 10));

    const savedCostume = localStorage.getItem("hiro_equipped_costume");
    if (savedCostume) setEquippedCostume(savedCostume);

    // Load fortune history
    const savedFortuneHistory = localStorage.getItem("hiro_fortune_history");
    if (savedFortuneHistory) {
      try {
        const parsedHistory: FortuneResult[] = JSON.parse(savedFortuneHistory);
        setFortuneHistory(parsedHistory);
        
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const todayStr = `${yyyy}-${mm}-${dd}`;
        
        const found = parsedHistory.find(item => item.date === todayStr);
        if (found) {
          setTodayFortune(found);
        }
      } catch (e) {
        console.error("Failed to load fortune history", e);
      }
    }
  }, []);

  // 絆レベルの情報取得
  const getBondInfo = (count: number) => {
    if (count >= 100) {
      return {
        level: 5,
        title: "宇宙一のパートナー🚀✨",
        badgeColor: "bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-900 border-indigo-300 font-black",
        barColor: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse",
        nextGoal: 100,
        currentProgress: 100,
        description: "ヒロとの絆はついに宇宙レベルに！何があっても切れない、絶対的な信頼で結ばれた無敵のふたりですワン！💖✨🐾"
      };
    }
    if (count >= 50) {
      return {
        level: 4,
        title: "魂の相棒🐾",
        badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
        barColor: "bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 animate-pulse",
        nextGoal: 100,
        currentProgress: ((count - 50) / 50) * 100,
        description: "ヒロと完全に心が通じ合いました！ヒロが黄金のオーラを放ち、最上級の愛情を示してくれます。✨"
      };
    }
    if (count >= 30) {
      return {
        level: 3,
        title: "信頼し合う大親友✨",
        badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
        barColor: "bg-rose-500",
        nextGoal: 50,
        currentProgress: ((count - 30) / 20) * 100,
        description: "ヒロにとってあなたはいなくてはならない大親友。とびきり可愛い反応をします。"
      };
    }
    if (count >= 10) {
      return {
        level: 2,
        title: "いつでも笑顔の仲良し🍀",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
        barColor: "bg-emerald-500",
        nextGoal: 30,
        currentProgress: ((count - 10) / 20) * 100,
        description: "ヒロはあなたに心を許し始めました。嬉しそうに寄り添ってくれます。"
      };
    }
    return {
      level: 1,
      title: "出会いたての友達🐶",
      badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-300",
      barColor: "bg-amber-500",
      nextGoal: 10,
      currentProgress: (count / 10) * 100,
      description: "お互いを知る段階。たくさんなでなでして絆を深めましょう🐾"
    };
  };

  // Handler for Gacha Pull based on mood
  const drawGachaByMood = (category: "行動" | "心" | "成長" | "おまかせ") => {
    if (isDrawing) return;
    setIsDrawing(true);
    setSelectedMood(category);

    // Filter quotes list
    let filteredList: Quote[] = [];
    if (category === "おまかせ") {
      filteredList = quoteList;
    } else {
      filteredList = quoteList.filter(item => item.category === category);
    }

    // Select random item
    const randomIndex = Math.floor(Math.random() * filteredList.length);
    const selected = filteredList[randomIndex];

    // Gacha effect: rapid text shuffle simulation
    let counter = 0;
    const interval = setInterval(() => {
      const tempItem = quoteList[Math.floor(Math.random() * quoteList.length)];
      setShuffleText(tempItem.text);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        
        // Finalize selection
        setCurrentQuote(selected);
        setShuffleText(selected.text);
        setIsDrawing(false);

        // Cute post-draw dialogue
        if (category === "行動") {
          setDialogue("「よし、やる気がみなぎってきましたね！いってらっしゃい！🔥」");
        } else if (category === "心") {
          setDialogue("「ふぅ、少し肩の力を抜いて、のんびりいきましょう🍀」");
        } else if (category === "成長") {
          setDialogue("「高い壁も、きっとあなたを強くする盾になりますよ💎」");
        } else {
          setDialogue("「ボクが選んだ特別な言葉、届きましたか？🐾」");
        }

        // Add to history list (limit 20)
        setHistory(prev => {
          const newHistory = [selected, ...prev.filter(q => q.id !== selected.id)].slice(0, 20);
          localStorage.setItem("hiro_gacha_history", JSON.stringify(newHistory));
          return newHistory;
        });
      }
    }, 70);
  };

  // Toggle favorite quote
  const toggleFavorite = (quote: Quote) => {
    const isFav = favorites.some(q => q.id === quote.id);
    let newFavorites: Quote[];
    if (isFav) {
      newFavorites = favorites.filter(q => q.id !== quote.id);
      triggerToast("お気に入りから削除しました");
    } else {
      newFavorites = [quote, ...favorites];
      triggerToast("お気に入りに追加しました！💖");
    }
    setFavorites(newFavorites);
    localStorage.setItem("hiro_gacha_favorites", JSON.stringify(newFavorites));
  };

  // Helper to trigger custom Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // 衣装をお着替えする処理
  const equipCostume = (id: string) => {
    setEquippedCostume(id);
    localStorage.setItem("hiro_equipped_costume", id);

    const costume = costumeList.find(c => c.id === id);
    if (costume) {
      setDialogue(`「お着替えしたワン！${costume.name}、似合ってるかな？🐾」`);
      triggerToast(`👕 ${costume.name} に着替えたワン！`);
    }
  };

  // アプリの全データを初期状態にリセットする処理
  const resetAllData = () => {
    if (window.confirm("アプリの全てのデータ（なでなで回数、おみくじ履歴、ステッカー、お気に入りなど）を初期状態にリセットしますか？🐾")) {
      localStorage.clear();
      setPetCount(0);
      setHistory([]);
      setFavorites([]);
      setFortuneHistory([]);
      setTodayFortune(null);
      setEquippedCostume("default");
      setSelectedSticker(null);
      setDialogue(defaultDialogues[0]);
      triggerToast("🧹 アプリのデータを完全に初期状態にリセットしましたワン！");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Copy or Share function
  const copyAndShare = async () => {
    const textToCopy = currentQuote 
      ? `【ヒロの名言ガチャ】\n気分：${currentQuote.category}\n今日の一言：\n${currentQuote.text}\n#ヒロの名言ガチャ #名言\n${window.location.href}`
      : `【ヒロの名言ガチャ】\n今のあなたの気分に寄り添う、ヒロの名言ガチャです。🐾\n${window.location.href}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
        triggerToast("クリップボードにコピーしました！✂️");
      } else {
        // Fallback input method if navigator clipboard not supported
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        triggerToast("コピーに成功しました！✂️");
      }
    } catch (err) {
      triggerToast("コピーに失敗しました。直接シェアをご利用ください。");
    }
  };

  // Social Share direct links
  const getXShareLink = () => {
    if (!currentQuote) return "";
    const text = `【ヒロの名言ガチャ】\n今の私への言葉：\n${currentQuote.text}\n#ヒロの名言ガチャ\n`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
  };

  // Interaction when clicking Hiro
  const handleHiroClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDrawing) return;

    // Get click coordinates inside the element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newCount = petCount + 1;
    setPetCount(newCount);
    localStorage.setItem("hiro_pet_count", newCount.toString());

    // 1. Check sticker unlock milestones
    const unlockedStickers = stickerList.filter(s => s.requiredPets > petCount && s.requiredPets <= newCount);
    const hasNewUnlock = unlockedStickers.length > 0;
    if (hasNewUnlock) {
      const unlockedSticker = unlockedStickers[unlockedStickers.length - 1];
      setNewlyUnlockedSticker(unlockedSticker.id);
      setShowUnlockModal(true);
      setDialogue(unlockedSticker.dialogue);
      triggerToast(`🎁 新ステッカー「${unlockedSticker.title}」を解放！ 🎁`);
    }

    // 2. Check level up threshold
    let isLevelUp = false;
    let upMsg = "";
    if (petCount < 10 && newCount >= 10) {
      isLevelUp = true;
      upMsg = "「絆レベル2」いつでも笑顔の仲良し🍀 にアップ！なでなでのセリフや反応がより優しくなりました！";
    } else if (petCount < 30 && newCount >= 30) {
      isLevelUp = true;
      upMsg = "「絆レベル3」信頼し合う大親友✨ にアップ！ヒロとの心の距離がぐっと近づきました！";
    } else if (petCount < 50 && newCount >= 50) {
      isLevelUp = true;
      upMsg = "「絆レベル4」魂の相棒🐾 にアップ！ゴールドに光輝く特別な『絆オーラ』が解放されました！";
    } else if (petCount < 100 && newCount >= 100) {
      isLevelUp = true;
      upMsg = "「絆レベル5」宇宙一のパートナー🚀✨ にアップ！ヒロとあなたの絆は永遠に、宇宙一輝くものになりましたワン！💖✨🐾";
    }

    if (isLevelUp) {
      setLevelUpMessage(upMsg);
      setShowLevelUpModal(true);
      
      if (newCount >= 100) {
        setDialogue("「100回なでなで突破！きみとの絆は宇宙一だワン！これからもずーーっと隣にいさせてね🚀💖🐾」");
      } else if (newCount >= 50) {
        setDialogue("「50回なでなで突破！きみはボクの運命の相棒ワン！大好きが止まらないよーー！💖👑🐾」");
      } else if (newCount >= 30) {
        setDialogue("「30回なでなで！きみの手が一番落ち着くワン…ずっと一緒にいてほしいな✨」");
      } else if (newCount >= 10) {
        setDialogue("「なでなで10回！あなたとなんだか心が近づいた気がするワン！🍀」");
      }
      triggerToast("🎉 ヒロとの絆レベルアップ！ 🎉");
    } else if (!hasNewUnlock) {
      const level = getBondInfo(newCount).level;
      let speech = "";

      const r = Math.random();
      if (level === 1) {
        const lines = [
          "「なでなで、ありがとう！嬉しいワン！🐾」",
          "「もっとなでて〜🐾」",
          "「ワンワン！あ、そこ、気持ちいいなぁ…💕」",
          "「お腹をなでなでされるのも大好きなんだワン！🐾」"
        ];
        speech = lines[Math.floor(r * lines.length)];
      } else if (level === 2) {
        const lines = [
          "「えへへ、きみの手はとっても温かいワン…🍀」",
          "「なでなでされると、嫌なことも全部忘れちゃうね♪」",
          "「きみと話してると、心がポカポカしてくるワン！🐾」",
          "「ワン！いつも話を聞いてくれてありがとう🐾」"
        ];
        speech = lines[Math.floor(r * lines.length)];
      } else if (level === 3) {
        const lines = [
          "「きみのなでなでは世界一きもちいいワン！✨」",
          "「ボク、きみのことがだーい好き！ずっと隣にいるね🐕💖」",
          "「きみの一生懸命な姿、ボクはいつも見守ってるワン！」",
          "「きみが笑ってくれるのが、ボクの一番の幸せんだワン！🍀」"
        ];
        speech = lines[Math.floor(r * lines.length)];
      } else if (level === 4) {
        const lines = [
          "「にゃはは〜🐾 きみはボクの最高のパートナーワン！👑」",
          "「きみの相棒になれて、ボクは世界一幸せな犬だワン！💖」",
          "「心が完全に通じ合ってるワン。何があってもずっと味方だよ！✨」",
          "「いつでもきみの味方だからね、絶対大丈夫ワン！🐾」"
        ];
        speech = lines[Math.floor(r * lines.length)];
      } else {
        const lines = [
          "「宇宙一のパートナーに、最高の幸せをお届けするワン！🚀💖」",
          "「きみと出会えたボクは、全宇宙で一番ラッキーなワンコだワン！🐾🌟」",
          "「きみのすべてを肯定するワン！自信を持って、前に進んでいこうね✨」",
          "「どこにいても、何をしていても、ボクたちの絆は銀河を越えて繋がってるワン！🌌🐕」"
        ];
        speech = lines[Math.floor(r * lines.length)];
      }

      setDialogue(speech);
    }

    // Floating particle effect words based on bond level
    const level = getBondInfo(newCount).level;
    const r = Math.random();
    let petWord = "なでなで +1";
    if (level === 1) {
      const words = ["なでなで +1", "わんっ！🐾", "うれしい！", "えへへ"];
      petWord = words[Math.floor(r * words.length)];
    } else if (level === 2) {
      const words = ["仲良し +1", "なでなで💖", "あたたかい🍀", "えへへっ🐾"];
      petWord = words[Math.floor(r * words.length)];
    } else if (level === 3) {
      const words = ["大親友💕", "きもちいい！✨", "すき！💖", "ゴロゴロ🐾"];
      petWord = words[Math.floor(r * words.length)];
    } else if (level === 4) {
      const words = ["魂の相棒👑🐾", "大すき！💖", "とろける〜😍", "相棒フォーエバー✨"];
      petWord = words[Math.floor(r * words.length)];
    } else {
      const words = ["絆100突破!🌌", "宇宙一愛してる💖", "最強のふたり🚀✨", "なでなで超気持ちいい〜👑🐾"];
      petWord = words[Math.floor(r * words.length)];
    }

    // Add floating effect
    const newEffect = {
      id: Date.now() + Math.random(),
      text: petWord,
      x: isNaN(x) ? 100 : x,
      y: isNaN(y) ? 100 : y
    };
    setPetEffects(prev => [...prev, newEffect]);
  };

  // Draw today's fortune
  const drawTodayFortune = () => {
    if (isDrawingFortune) return;

    const todayStr = getTodayDateString();
    if (todayFortune) {
      triggerToast("今日の運勢はすでに引いています🐾 また明日引いてね！");
      return;
    }

    setIsDrawingFortune(true);

    // Cute shake/shuffling simulation
    let counter = 0;
    const interval = setInterval(() => {
      setFortuneShakeIndex(prev => prev + 1);
      counter++;
      if (counter > 15) {
        clearInterval(interval);

        // Pick a random fortune
        const randomIndex = Math.floor(Math.random() * fortunePool.length);
        const selected = fortunePool[randomIndex];
        const newFortune: FortuneResult = {
          date: todayStr,
          ...selected
        };

        setTodayFortune(newFortune);
        setIsDrawingFortune(false);

        // Add to fortune history list and save
        setFortuneHistory(prev => {
          const newHistory = [newFortune, ...prev];
          localStorage.setItem("hiro_fortune_history", JSON.stringify(newHistory));
          return newHistory;
        });

        // Set Hiro's dialogue
        setDialogue(`「きみの今日の運勢は【${newFortune.luck}】ワン！最高のハッピーが訪れますように✨」`);
        triggerToast(`🔮 運勢：${newFortune.luck}！ 🔮`);
      }
    }, 80);
  };

  // Reset all fortune history
  const clearFortuneHistory = () => {
    if (window.confirm("運勢の履歴をすべて消去しますか？（今日の運勢も再度引けるようになります）")) {
      setFortuneHistory([]);
      setTodayFortune(null);
      localStorage.removeItem("hiro_fortune_history");
      triggerToast("運勢の履歴をクリアしました🐾");
    }
  };

  // Share fortune result direct links
  const getFortuneXShareLink = (fortune: FortuneResult) => {
    const text = `【ヒロの今日の運勢】\n今日の私の運勢は【${fortune.luck}】でした！${fortune.emoji}\nヒロからの言葉：\n「${fortune.message}」\n🐾ラッキーアイテム：${fortune.luckyItem}\n#ヒロの名言ガチャ #今日の運勢\n`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
  };

  const copyFortuneText = (fortune: FortuneResult) => {
    const text = `【ヒロの今日の運勢】\n日付：${fortune.date}\n私の運勢：${fortune.luck} ${fortune.emoji}\nヒロからの言葉：\n${fortune.message}\n🐾ラッキーアクション：${fortune.luckyAction}\n🐾ラッキーアイテム：${fortune.luckyItem}\n#ヒロの名言ガチャ #今日の運勢\n${window.location.href}`;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        triggerToast("運勢結果をコピーしました！✂️");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        triggerToast("運勢結果をコピーしました！✂️");
      }
    } catch (e) {
      triggerToast("コピーに失敗しました。");
    }
  };

  const downloadFortuneCardImage = async () => {
    if (isSavingCard || !fortuneCardRef.current) return;
    setIsSavingCard(true);
    triggerToast("🎨 SNS用のカード画像を生成中ワン...");

    try {
      // Use toPng to generate a high quality PNG
      const dataUrl = await toPng(fortuneCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#faf8f5",
        style: {
          transform: "scale(1)"
        }
      });

      const link = document.createElement("a");
      link.download = `hiro_fortune_${todayFortune?.date || "today"}.png`;
      link.href = dataUrl;
      link.click();
      triggerToast("✨ 画像を保存しました！SNSに投稿してね🐾");
    } catch (error) {
      console.error("Failed to generate fortune card image", error);
      triggerToast("画像の生成に失敗しました。もう一度試してみてねワン🐾");
    } finally {
      setIsSavingCard(false);
    }
  };

  const downloadQuoteCardImage = async () => {
    if (isSavingQuoteCard || !quoteCardRef.current || !currentQuote) return;
    setIsSavingQuoteCard(true);
    triggerToast("🎨 名言カード画像を生成中ワン...");

    try {
      const dataUrl = await toPng(quoteCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#faf8f5",
        style: {
          transform: "scale(1)"
        }
      });

      const link = document.createElement("a");
      link.download = `hiro_quote_${currentQuote.id}.png`;
      link.href = dataUrl;
      link.click();
      triggerToast("✨ 名言カード画像を保存しました！🐾");
    } catch (error) {
      console.error("Failed to generate quote card image", error);
      triggerToast("画像の生成に失敗しました。もう一度試してみてねワン🐾");
    } finally {
      setIsSavingQuoteCard(false);
    }
  };

  const downloadCustomCardImage = async () => {
    if (isSavingCustomCard || !customCardRef.current) return;
    setIsSavingCustomCard(true);
    triggerToast("🎨 オリジナルカスタムカード画像を生成中ワン...");

    try {
      const dataUrl = await toPng(customCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#faf8f5",
        style: {
          transform: "scale(1)"
        }
      });

      const link = document.createElement("a");
      link.download = `hiro_custom_quote_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      triggerToast("✨ オリジナル名言カードを保存しました！🐾");
    } catch (error) {
      console.error("Failed to generate custom quote card image", error);
      triggerToast("画像の生成に失敗しました。もう一度試してみてねワン🐾");
    } finally {
      setIsSavingCustomCard(false);
    }
  };

  // Reset/Clear History
  const clearHistory = () => {
    if (window.confirm("引き履歴をクリアしますか？")) {
      setHistory([]);
      localStorage.removeItem("hiro_gacha_history");
      triggerToast("履歴をクリアしました");
    }
  };

  // Determine current image to display based on bond level
  const getHiroImage = () => {
    if (isDrawing) {
      // During drawing, show default or change dynamically to show thinking
      return hiroDefaultImg;
    }
    const equipped = costumeList.find(c => c.id === equippedCostume);
    return equipped ? equipped.image : hiroDefaultImg;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 py-8 md:py-12 bg-[#faf7f2] relative overflow-hidden text-[#4a3728]">
      
      {/* Decorative Warm Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-center space-y-6 z-10">
        
        {/* Header App Title */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100/80 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>完全無料・登録不要</span>
          </div>
          <h1 id="app-title" className="text-2xl md:text-3.5xl font-black tracking-tight text-[#3b2a1e] flex items-center justify-center gap-2">
            <span>ヒロの名言ガチャ</span>
            <span className="text-xl md:text-2xl">🐾</span>
          </h1>
          <p className="text-xs md:text-sm text-[#7c6a59] font-medium leading-relaxed max-w-md mx-auto">
            名言マスターヒロ
          </p>
        </header>

        {/* Main Gacha Card Container */}
        <main className="space-y-6">
          <div className="relative bg-white rounded-3xl border-3 border-[#f0ebe4] p-5 md:p-8 shadow-xl shadow-[#4a3728]/5 overflow-hidden">
            
            {/* "Hiro's Bond" Progress Gauge Bar */}
            <div className="mb-5 mt-1 bg-[#fdfbf7] border-2 border-[#e6dec9]/60 rounded-2xl p-4 space-y-2 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7c6a59] flex items-center gap-1">
                  <span>🐕</span>
                  <span>ヒロとの絆ゲージ</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowCloset(!showCloset)}
                    className={`text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full border shadow-2xs transition-all flex items-center gap-1 cursor-pointer ${
                      showCloset
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-amber-50 hover:bg-amber-100/70 text-amber-800 border-amber-200"
                    }`}
                  >
                    <span>👕</span>
                    <span>お着替え</span>
                  </button>
                  <span className={`text-[10px] md:text-xs font-extrabold px-2 py-0.5 rounded-full border ${getBondInfo(petCount).badgeColor}`}>
                    {getBondInfo(petCount).title}
                  </span>
                </div>
              </div>

              {/* Progress Bar and Indicator */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden relative border border-neutral-200">
                  <motion.div
                    className={`h-full ${getBondInfo(petCount).barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getBondInfo(petCount).currentProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] md:text-[10px] text-[#a39485] font-bold">
                  <span>なでなで累計: <strong className="text-[#3b2a1e] text-xs">{petCount}</strong> 回</span>
                  {getBondInfo(petCount).level < 5 ? (
                    <span>次の絆まであと <strong className="text-[#3b2a1e] text-xs">{getBondInfo(petCount).nextGoal - petCount}</strong> 回</span>
                  ) : (
                    <span className="text-indigo-600 animate-pulse font-black">絆レベル限界突破！宇宙一の相棒！💖🚀✨</span>
                  )}
                </div>
              </div>

              {/* Mini level description */}
              <p className="text-[10px] text-[#8c7a69] leading-relaxed font-medium">
                {getBondInfo(petCount).description}
              </p>

              {/* Costume Closet panel */}
              <AnimatePresence>
                {showCloset && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-[#e6dec9]/60 pt-3 mt-3 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-800 flex items-center gap-1">
                        <span>🚪</span>
                        <span>ヒロの衣装クローゼット</span>
                      </span>
                      <span className="text-[9px] text-[#a39485] font-medium">
                        ※絆レベルアップで新しい服が解放されるワン！
                      </span>
                    </div>

                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
                      {costumeList.map((costume) => {
                        const isUnlocked = getBondInfo(petCount).level >= costume.requiredLevel;
                        const isEquipped = equippedCostume === costume.id;

                        return (
                          <div
                            key={costume.id}
                            onClick={() => isUnlocked && equipCostume(costume.id)}
                            className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between relative cursor-pointer select-none transition-all ${
                              isEquipped
                                ? "bg-amber-100/50 border-amber-400 shadow-xs scale-102"
                                : isUnlocked
                                ? "bg-white hover:bg-[#faf8f5] border-[#ede7dc] hover:border-amber-300"
                                : "bg-neutral-50/70 border-neutral-200 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-amber-50/50 border border-[#f5efdf] flex items-center justify-center relative">
                              {isUnlocked ? (
                                <img
                                  src={costume.image}
                                  alt={costume.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-xl text-neutral-400">🔒</div>
                              )}
                              
                              {isEquipped && (
                                <div className="absolute top-0.5 right-0.5 bg-amber-500 text-white p-0.5 rounded-full text-[8px] leading-none">
                                  ✓
                                </div>
                              )}
                            </div>

                            <div className="mt-1 space-y-0.5">
                              <p className="text-[10px] font-extrabold text-[#3b2a1e] leading-tight truncate max-w-[70px]">
                                {costume.name}
                              </p>
                              {isUnlocked ? (
                                <p className="text-[8px] font-black text-amber-700">
                                  {isEquipped ? "着用中" : "着替える"}
                                </p>
                              ) : (
                                <p className="text-[8px] font-bold text-[#a39485] flex items-center justify-center gap-0.5">
                                  <span>🔒</span>
                                  <span>Lv.{costume.requiredLevel}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 100+ Kizuna Gauge Bonus Feature Section */}
            {petCount >= 100 && (
              <div className="mb-5 bg-gradient-to-tr from-indigo-50/70 via-purple-50/70 to-pink-50/70 border-2 border-indigo-200 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-sm animate-fade-in text-[#3b2a1e]">
                {/* Decorative particles / stars background */}
                <div className="absolute top-1 right-2 text-base opacity-40 animate-pulse select-none">👑</div>
                <div className="absolute bottom-1 left-2 text-base opacity-40 animate-pulse select-none">🚀</div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                    <span className="animate-bounce">🎉</span>
                    <span>100回突破！宇宙一の絆特典</span>
                  </span>
                  <button
                    onClick={() => setShowSecretMenu(!showSecretMenu)}
                    className="text-[10px] font-black bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-full shadow-xs transition-all flex items-center gap-1 cursor-pointer border-0"
                  >
                    <span>{showSecretMenu ? "特典を閉じる" : "特典を開く"}</span>
                    <span>{showSecretMenu ? "▲" : "▼"}</span>
                  </button>
                </div>

                <p className="text-[10.5px] text-indigo-950/80 font-bold leading-relaxed">
                  いつもたくさんなでなでしてくれてありがとうワン！100回突破の特別なあなたへ、ヒロからとっておきの「ひみつのプレゼント」を贈るワン！🐾✨
                </p>

                <AnimatePresence>
                  {showSecretMenu && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden space-y-4 pt-2 border-t border-indigo-100 mt-2"
                    >
                      {/* Sub-benefits list */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Benefit 1: Letter from Hiro */}
                        <button
                          onClick={() => setShowSecretLetter(true)}
                          className="p-3 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50/40 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                        >
                          <span className="text-2xl">💌</span>
                          <span className="text-[11px] font-black text-indigo-950">感謝のひみつレター</span>
                          <span className="text-[8.5px] text-[#8c7a69] font-medium leading-tight">ヒロからの心温まるメッセージ</span>
                        </button>

                        {/* Benefit 2: Custom Quote Maker scroll to */}
                        <a
                          href="#custom-quote-maker"
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById("custom-quote-maker");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="p-3 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50/40 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                        >
                          <span className="text-2xl">✍️</span>
                          <span className="text-[11px] font-black text-indigo-950">カスタム名言メーカー</span>
                          <span className="text-[8.5px] text-[#8c7a69] font-medium leading-tight">好きな言葉でカードを自作</span>
                        </a>
                      </div>

                      {/* Custom Card Maker block */}
                      <div id="custom-quote-maker" className="bg-white border border-indigo-100 rounded-xl p-3 space-y-3 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">✍️</span>
                          <h4 className="text-[11.5px] font-black text-indigo-950">オリジナルカスタム名言カード作成</h4>
                        </div>
                        
                        <div className="space-y-2.5">
                          <label className="block text-[10px] font-bold text-[#7c6a59]">
                            1. カードに入れたい文字（セリフを選択するか、自由に入力してねワン！）
                          </label>

                          {/* セリフのクイック選択肢 */}
                          <div className="flex flex-wrap gap-1.5 pb-1">
                            {[
                              "きみと出会えて本当によかったワン🐾",
                              "きみは全宇宙で一番大切なパートナーワン！🚀✨",
                              "どこにいても、ボクたちの絆は繋がってるワン！🌌🐕",
                              "今日も頑張るきみは、とっても素敵だワン！💪💖",
                              "疲れたら、ボクのふかふかの毛並みで休んでね🐾💤",
                              "自信を持って、前に進んでいこうね✨応援してるワン！"
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setCustomQuoteText(preset);
                                  triggerToast("✍️ セリフをセットしたワン！");
                                }}
                                className={`text-[9.5px] font-bold px-2 py-1 rounded-lg border transition-all text-left cursor-pointer text-[#3b2a1e] ${
                                  customQuoteText === preset
                                    ? "bg-indigo-50 border-indigo-300 text-indigo-800 ring-1 ring-indigo-300 font-extrabold"
                                    : "bg-neutral-50/80 hover:bg-neutral-100 border-neutral-200"
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>

                          <textarea
                            value={customQuoteText}
                            onChange={(e) => setCustomQuoteText(e.target.value.slice(0, 40))}
                            placeholder="きみは全宇宙で一番大切なパートナーワン！🚀✨"
                            rows={2}
                            className="w-full p-2 text-xs border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-400 font-medium bg-neutral-50/50 text-[#3b2a1e]"
                          />
                          <div className="text-right text-[8.5px] text-[#a39485] font-bold">
                            {customQuoteText.length}/40 文字
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-[#7c6a59]">
                            2. プレミアム背景テーマの選択
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { id: "gold", name: "極・金冠", emoji: "👑", border: "border-amber-400 bg-amber-50/20 text-amber-800" },
                              { id: "sakura", name: "和桜花", emoji: "🌸", border: "border-rose-300 bg-rose-50/20 text-rose-800" },
                              { id: "rainbow", name: "虹七彩", emoji: "🌈", border: "border-teal-300 bg-teal-50/20 text-teal-800" },
                              { id: "cosmic", name: "超宇宙", emoji: "🌌", border: "border-indigo-400 bg-indigo-50/20 text-indigo-900" }
                            ].map((theme) => (
                              <button
                                key={theme.id}
                                onClick={() => setCustomQuoteTheme(theme.id as any)}
                                className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                                  customQuoteTheme === theme.id 
                                    ? `${theme.border} ring-2 ring-indigo-500 font-extrabold` 
                                    : "border-neutral-200 hover:bg-neutral-50 text-[#7c6a59] text-[9px] font-bold"
                                }`}
                              >
                                <span className="text-sm leading-none">{theme.emoji}</span>
                                <span className="text-[8.5px] leading-tight truncate mt-0.5">{theme.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Card Preview (Captured by toPng) */}
                        <div className="space-y-1.5">
                          <span className="block text-[10px] font-bold text-[#7c6a59]">
                            3. カード完成プレビュー（※この枠内が画像保存されます）
                          </span>
                          
                          <div className="border border-neutral-100 rounded-xl p-2 bg-neutral-100/40 flex justify-center">
                            {/* Target of customCardRef */}
                            <div
                              ref={customCardRef}
                              className={`w-full max-w-[280px] p-5 rounded-2xl border-3 overflow-hidden relative text-center space-y-3 bg-[#faf8f5] ${
                                customQuoteTheme === "gold" ? "border-amber-400 shadow-lg shadow-amber-100/50" :
                                customQuoteTheme === "sakura" ? "border-rose-300 shadow-lg shadow-rose-100/50" :
                                customQuoteTheme === "rainbow" ? "border-teal-300 shadow-lg shadow-teal-100/50" :
                                "border-indigo-400 shadow-lg shadow-indigo-100/50"
                              }`}
                            >
                              {/* Sparkle indicators inside the image */}
                              {customQuoteTheme === "gold" && (
                                <>
                                  <div className="absolute top-2 right-2 text-xs opacity-40 select-none animate-pulse">👑</div>
                                  <div className="absolute bottom-2 left-2 text-xs opacity-40 select-none animate-pulse">✨</div>
                                </>
                              )}
                              {customQuoteTheme === "sakura" && (
                                <>
                                  <div className="absolute top-2 right-2 text-xs opacity-40 select-none animate-pulse">🌸</div>
                                  <div className="absolute bottom-2 left-2 text-xs opacity-40 select-none animate-pulse">🍃</div>
                                </>
                              )}
                              {customQuoteTheme === "rainbow" && (
                                <>
                                  <div className="absolute top-2 right-2 text-xs opacity-40 select-none animate-pulse">🌈</div>
                                  <div className="absolute bottom-2 left-2 text-xs opacity-40 select-none animate-pulse">🎈</div>
                                </>
                              )}
                              {customQuoteTheme === "cosmic" && (
                                <>
                                  <div className="absolute top-2 right-2 text-xs opacity-40 select-none animate-pulse">🚀</div>
                                  <div className="absolute bottom-2 left-2 text-xs opacity-40 select-none animate-pulse">🌌</div>
                                </>
                              )}

                              {/* Card watermark/Header */}
                              <div className="text-center pb-2 border-b border-neutral-200/50 space-y-0.5">
                                <div className={`text-[8.5px] font-black tracking-widest flex items-center justify-center gap-0.5 ${
                                  customQuoteTheme === "gold" ? "text-amber-600" :
                                  customQuoteTheme === "sakura" ? "text-rose-500" :
                                  customQuoteTheme === "rainbow" ? "text-teal-600" :
                                  "text-indigo-600"
                                }`}>
                                  <span>★</span>
                                  <span>COSMIC KIZUNA CARD</span>
                                  <span>★</span>
                                </div>
                                <div className="text-[9px] text-neutral-400 font-bold">
                                  宇宙一のパートナー限定品
                                </div>
                              </div>

                              {/* Portrait preview */}
                              <div className="flex flex-col items-center justify-center select-none pt-1">
                                <div className="relative">
                                  <img
                                    src={getHiroImage()}
                                    alt="ヒロ"
                                    className={`w-16 h-16 rounded-full border-3 object-cover bg-amber-50 shadow-md ${
                                      customQuoteTheme === "gold" ? "border-amber-300" :
                                      customQuoteTheme === "sakura" ? "border-rose-300" :
                                      customQuoteTheme === "rainbow" ? "border-teal-300" :
                                      "border-indigo-400"
                                    }`}
                                  />
                                  <span className="absolute bottom-0 right-0 text-xs bg-white rounded-full p-0.5 shadow-xs border leading-none">
                                    🚀
                                  </span>
                                </div>
                              </div>

                              {/* Text */}
                              <div className="py-2 relative px-2 min-h-[60px] flex flex-col justify-center">
                                <span className="absolute top-0 left-0 text-2xl text-neutral-200 font-serif leading-none select-none">“</span>
                                <p className="text-xs md:text-sm font-black leading-relaxed text-[#3b2a1e] tracking-wide relative z-10 whitespace-pre-line px-1">
                                  {customQuoteText || "きみと出会えて本当によかったワン🐾"}
                                </p>
                                <span className="absolute bottom-[-5px] right-0 text-2xl text-neutral-200 font-serif leading-none select-none">”</span>
                              </div>

                              {/* Watermark brand */}
                              <div className="text-center pt-2 border-t border-neutral-200/50">
                                <p className="text-[8px] text-neutral-400 font-black tracking-wider flex items-center justify-center gap-0.5 select-none">
                                  <span>🐕</span><span>柴犬ヒロの名言ガチャ #KIZUNA100</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
                        <button
                          onClick={downloadCustomCardImage}
                          disabled={isSavingCustomCard}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 transition-all text-xs font-black text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md border-0"
                        >
                          {isSavingCustomCard ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span>📸</span>
                          )}
                          <span>{isSavingCustomCard ? "カード画像を作成中ワン..." : "オリジナルカード画像を保存するワン！"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Top dialogue cloud and Hiro Illustration area (Only shown when not showing the active card) */}
            {(!currentQuote || isDrawing) && (
              <>
                {/* Top dialogue cloud from Hiro */}
                <div className="relative mb-6">
                  <div className="bg-[#fdfbf7] border-2 border-[#e6dec9] text-[#5c4636] rounded-2xl px-4 py-3 text-sm md:text-base font-bold text-center leading-relaxed shadow-sm min-h-[50px] flex items-center justify-center relative">
                    <span>{dialogue}</span>
                    {/* Speech balloon tail */}
                    <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#fdfbf7] border-r-2 border-b-2 border-[#e6dec9] rotate-45" />
                  </div>
                </div>

                {/* Hiro Illustration area */}
                <div className="flex justify-center items-center py-2 relative">
                  <motion.div
                    className="relative cursor-pointer select-none"
                    onClick={handleHiroClick}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    animate={
                      isDrawing 
                        ? {
                            y: [0, -12, 0, -12, 0],
                            rotate: [0, -4, 4, -4, 0],
                            transition: { duration: 0.6, repeat: Infinity }
                          } 
                        : getBondInfo(petCount).level === 4
                        ? {
                            y: [0, -6, 0],
                            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                          }
                        : {}
                    }
                  >
                    {/* Golden Aura Effect for Level 4 */}
                    {getBondInfo(petCount).level === 4 && (
                      <div className="absolute inset-[-12px] rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 opacity-60 blur-md animate-pulse z-0" />
                    )}

                    {/* Image shadow & highlight frame */}
                    <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-xl scale-90" />
                    <img
                      id="char-img"
                      src={getHiroImage()}
                      alt="柴犬ヒロ"
                      className={`w-48 h-48 md:w-56 md:h-56 object-contain rounded-2xl border-4 bg-white shadow-md relative z-10 transition-all duration-300 ${
                        getBondInfo(petCount).level === 4 ? "border-amber-400 shadow-amber-300/40" : "border-[#faf5eb]"
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating click effects (Hearts & cute words) */}
                    <AnimatePresence>
                      {petEffects.map(eff => (
                        <motion.div
                          key={eff.id}
                          initial={{ opacity: 1, y: eff.y - 10, scale: 0.8 }}
                          animate={{ opacity: 0, y: eff.y - 95, scale: 1.25, x: eff.x + (Math.random() * 40 - 20) }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          onAnimationComplete={() => {
                            setPetEffects(prev => prev.filter(e => e.id !== eff.id));
                          }}
                          style={{ left: eff.x, top: eff.y }}
                          className="absolute pointer-events-none text-rose-500 font-extrabold text-xs md:text-sm whitespace-nowrap bg-white/95 border-2 border-rose-200 px-2.5 py-0.5 rounded-full shadow-md z-30 flex items-center gap-1"
                        >
                          <span>💖</span>
                          <span>{eff.text}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Floating cute decorations when drawing */}
                    <AnimatePresence>
                      {isDrawing && (
                        <>
                          <motion.div
                            className="absolute -top-2 -left-2 text-2xl z-20"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, y: -10 }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                          >
                            🔥
                          </motion.div>
                          <motion.div
                            className="absolute -top-3 -right-2 text-2xl z-20"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, y: -15 }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.1, delay: 0.2 }}
                          >
                            🍀
                          </motion.div>
                          <motion.div
                            className="absolute bottom-6 -right-4 text-2xl z-20"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, x: 10 }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 0.9, delay: 0.4 }}
                          >
                            💎
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </>
            )}

            {/* Displaying Current Quote */}
            <div className={`text-center space-y-4 ${(!currentQuote || isDrawing) ? "mt-5 border-t-2 border-[#f5efdf] pt-6" : "mt-2"}`}>
              
              {currentQuote && !isDrawing ? (
                <div className="space-y-4">
                  {/* Capturable Quote Card */}
                  <div
                    ref={quoteCardRef}
                    className="relative p-6 bg-[#faf8f5] rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm space-y-4 text-center"
                  >
                    {/* Background sparkles/paws */}
                    <div className="absolute top-2 right-2 text-xl opacity-20 select-none">✨</div>
                    <div className="absolute bottom-2 left-2 text-xl opacity-20 select-none">🐾</div>

                    {/* Card Header inside the image */}
                    <div className="text-center pb-3 border-b border-[#ede7dc] space-y-1">
                      <div className="text-[10px] font-black text-amber-600 tracking-widest flex items-center justify-center gap-1">
                        <span>🐾</span><span>ヒロの名言コレクション</span><span>🐾</span>
                      </div>
                      <div className="text-[11px] text-[#7c6a59] font-bold flex items-center justify-center gap-1 mt-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          currentQuote.category === "行動" ? "bg-orange-50 text-orange-600 border-orange-200" :
                          currentQuote.category === "心" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          "bg-blue-50 text-blue-600 border-blue-200"
                        }`}>
                          <span>
                            {currentQuote.category === "行動" ? "🔥" :
                             currentQuote.category === "心" ? "🍀" : "💎"}
                          </span>
                          <span>{currentQuote.category}カテゴリ</span>
                        </span>
                      </div>
                    </div>

                    {/* Centered Display Icon (Hiro's Portrait) */}
                    <div className="flex flex-col items-center justify-center pt-2 select-none">
                      <div className="relative">
                        <img 
                          src={currentQuote.image || hiroDefaultImg} 
                          alt="ヒロ" 
                          className="w-20 h-20 rounded-full border-4 border-amber-300 object-cover bg-amber-50 shadow-md"
                        />
                        <span className="absolute bottom-0 right-0 text-base bg-white rounded-full p-1 shadow-sm border border-amber-100 leading-none">
                          {currentQuote.category === "行動" ? "🔥" :
                           currentQuote.category === "心" ? "🍀" : "💎"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body - Large quotation mark & Quote text */}
                    <div className="py-4 relative px-4 min-h-[90px] flex flex-col justify-center">
                      <span className="absolute -top-1 left-1 text-4xl text-amber-200 font-serif leading-none select-none">“</span>
                      <p className="text-base md:text-lg font-black leading-relaxed text-[#3b2a1e] tracking-wide relative z-10 select-all whitespace-pre-line px-2">
                        {currentQuote.text}
                      </p>
                      <span className="absolute -bottom-5 right-1 text-4xl text-amber-200 font-serif leading-none select-none">”</span>
                    </div>

                    {/* Brand watermark inside the image card */}
                    <div className="text-center pt-2 border-t border-[#ede7dc]/60">
                      <p className="text-[9px] text-[#a39485] font-black tracking-wider flex items-center justify-center gap-1 select-none">
                        <span>🐕</span><span>柴犬ヒロのココロ引きガチャ & 名言</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions Area (Not captured in PNG) - ONLY the save button as requested */}
                  <div className="flex flex-col gap-2">
                    {/* Primary action: Save card image */}
                    <button
                      onClick={downloadQuoteCardImage}
                      disabled={isSavingQuoteCard}
                      className={`w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all text-xs md:text-sm font-black text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                        isSavingQuoteCard ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSavingQuoteCard ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                      <span>{isSavingQuoteCard ? "名言カード画像を生成中ワン..." : "この名言をカード画像で保存するワン！📸"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Default greeting / drawing states */
                <div className="space-y-4">
                  <div className="relative p-6 bg-amber-50/20 rounded-2xl border-2 border-dashed border-[#e6dec9] min-h-[110px] flex items-center justify-center px-6">
                    <div className="text-base md:text-lg font-bold leading-relaxed text-[#7c6a59] italic">
                      {isDrawing ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          <span>「うーん、どれがぴったりかな…コトコト…🐾」</span>
                        </div>
                      ) : (
                        shuffleText
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mood Gacha Buttons Section */}
          <div className="space-y-3">
            <h2 className="text-center text-xs font-bold uppercase tracking-wider text-[#7c6a59] flex items-center justify-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>今のあなたの気分は？（いずれかを選んでガチャ！）</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Mood 1: Action */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => drawGachaByMood("行動")}
                disabled={isDrawing}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm md:text-base border-2 cursor-pointer transition-all shadow-sm ${
                  isDrawing ? "opacity-50 cursor-not-allowed" : ""
                } bg-orange-50/90 text-orange-700 border-orange-200/80 hover:bg-orange-100 hover:border-orange-300`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <span>やる気を出したい！</span>
                </span>
                <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">行動</span>
              </motion.button>

              {/* Mood 2: Heart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => drawGachaByMood("心")}
                disabled={isDrawing}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm md:text-base border-2 cursor-pointer transition-all shadow-sm ${
                  isDrawing ? "opacity-50 cursor-not-allowed" : ""
                } bg-emerald-50/90 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">🍀</span>
                  <span>心を癒やしたい…</span>
                </span>
                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">心</span>
              </motion.button>

              {/* Mood 3: Growth */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => drawGachaByMood("成長")}
                disabled={isDrawing}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm md:text-base border-2 cursor-pointer transition-all shadow-sm ${
                  isDrawing ? "opacity-50 cursor-not-allowed" : ""
                } bg-blue-50/90 text-blue-700 border-blue-200/80 hover:bg-blue-100 hover:border-blue-300`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">💎</span>
                  <span>壁を乗り越えたい！</span>
                </span>
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">成長</span>
              </motion.button>

              {/* Mood 4: Random */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => drawGachaByMood("おまかせ")}
                disabled={isDrawing}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm md:text-base border-2 cursor-pointer transition-all shadow-sm ${
                  isDrawing ? "opacity-50 cursor-not-allowed" : ""
                } bg-amber-50/90 text-amber-800 border-amber-200/80 hover:bg-amber-100 hover:border-amber-300`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">🎲</span>
                  <span>おまかせで引く</span>
                </span>
                <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full">全種</span>
              </motion.button>

            </div>
          </div>
        </main>

        {/* History & Favorites Interactive Section */}
        <section className="bg-white rounded-2xl border-2 border-[#f0ebe4] p-4 shadow-sm space-y-4">
          
          {/* Tab Selector */}
          <div className="flex border-b border-[#faf5eb] pb-2 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
            <button
              onClick={() => setActiveTab("fortune")}
              className={`flex-1 text-center py-2 text-xs md:text-sm font-bold transition-all relative cursor-pointer min-w-[90px] ${
                activeTab === "fortune" ? "text-[#3b2a1e]" : "text-[#a39485]"
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                <span>🔮 今日の運勢</span>
                {!todayFortune && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute top-2 right-2 md:right-4" />
                )}
              </span>
              {activeTab === "fortune" && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4a3728]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 text-center py-2 text-xs md:text-sm font-bold transition-all relative cursor-pointer min-w-[80px] ${
                activeTab === "history" ? "text-[#3b2a1e]" : "text-[#a39485]"
              }`}
            >
              引き履歴 ({history.length})
              {activeTab === "history" && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4a3728]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 text-center py-2 text-xs md:text-sm font-bold transition-all relative cursor-pointer min-w-[80px] ${
                activeTab === "favorites" ? "text-[#3b2a1e]" : "text-[#a39485]"
              }`}
            >
              お気に入り ({favorites.length})
              {activeTab === "favorites" && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4a3728]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("stickers")}
              className={`flex-1 text-center py-2 text-xs md:text-sm font-bold transition-all relative cursor-pointer min-w-[90px] ${
                activeTab === "stickers" ? "text-[#3b2a1e]" : "text-[#a39485]"
              }`}
            >
              絆ステッカー ({stickerList.filter(s => petCount >= s.requiredPets).length}/9)
              {activeTab === "stickers" && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4a3728]" />
              )}
            </button>
          </div>

          {/* Fortune Tab Content */}
          {activeTab === "fortune" && (
            <div className="space-y-4 animate-fade-in">
              {!todayFortune ? (
                // Draw Mode
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-5 bg-gradient-to-b from-amber-50/50 to-orange-50/20 rounded-2xl border border-amber-100/70">
                  <div className="relative">
                    {/* Chibi Shaking Animation Container */}
                    <motion.div
                      animate={isDrawingFortune ? {
                        rotate: [0, -10, 10, -10, 10, -5, 5, 0],
                        y: [0, -4, 4, -4, 4, -2, 2, 0]
                      } : {}}
                      transition={{
                        repeat: isDrawingFortune ? Infinity : 0,
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                      className="w-24 h-24 bg-white rounded-2xl border-2 border-amber-200 shadow-sm flex items-center justify-center relative overflow-hidden"
                    >
                      <span className="text-5xl animate-bounce">🔮</span>
                    </motion.div>
                    
                    {/* Glowing Aura Effect during draw */}
                    {isDrawingFortune && (
                      <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-xl animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm md:text-base font-bold text-[#3b2a1e]">「ヒロの今日の運勢」を占おう！</h3>
                    <p className="text-[11px] md:text-xs text-[#a39485] max-w-sm mx-auto leading-relaxed">
                      1日1回だけ引ける特別な運勢おみくじ。今日のきみにぴったりなアドバイスと、ラッキーアクション、ラッキーアイテムをヒロがお届けするワン🐾
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={drawTodayFortune}
                    disabled={isDrawingFortune}
                    className={`px-6 py-3 rounded-full font-black text-xs md:text-sm text-white shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                      isDrawingFortune
                        ? "bg-amber-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                    <span>{isDrawingFortune ? "占いをシャッフル中ワン..." : "今日の運勢を占うワン！🐾"}</span>
                  </motion.button>
                </div>
              ) : (
                // Drawn Mode
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {/* The Capturable Card part */}
                  <div 
                    ref={fortuneCardRef}
                    className="relative p-5 bg-[#faf8f5] rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm space-y-4"
                  >
                    {/* Background sparkles */}
                    <div className="absolute top-2 right-2 text-xl opacity-20 select-none">✨</div>
                    <div className="absolute bottom-2 left-2 text-xl opacity-20 select-none">🐾</div>
                    
                    {/* Header */}
                    <div className="text-center pb-3 border-b border-[#ede7dc] space-y-1">
                      <div className="text-[10px] font-black text-amber-600 tracking-widest flex items-center justify-center gap-1">
                        <span>🐾</span><span>ヒロの今日の運勢おみくじ</span><span>🐾</span>
                      </div>
                      <div className="text-xs text-[#4a3728] font-bold flex items-center justify-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{todayFortune.date} の運勢</span>
                      </div>
                    </div>

                    {/* Centered Display Icon (Hiro's Portrait) */}
                    <div className="flex flex-col items-center justify-center pt-2 select-none">
                      <img 
                        src={hiroDefaultImg} 
                        alt="ヒロ" 
                        className="w-16 h-16 rounded-full border-4 border-amber-300 object-cover bg-amber-50 shadow-md"
                      />
                    </div>

                    {/* Luck rank result display */}
                    <div className="flex flex-col items-center justify-center py-2 space-y-2">
                      <div className="text-[10px] text-[#a39485] font-black">本日の運勢ランク</div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{todayFortune.emoji}</span>
                        <span className={`text-3xl md:text-4xl font-black tracking-wider px-4 py-1 rounded-2xl shadow-sm ${
                          todayFortune.luck === "超大吉" ? "bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-transparent bg-clip-text animate-pulse font-extrabold border-2 border-rose-300" :
                          todayFortune.luck === "大吉" ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white" :
                          todayFortune.luck === "中吉" ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white" :
                          todayFortune.luck === "吉" ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white" :
                          todayFortune.luck === "小吉" ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white" :
                          "bg-gradient-to-r from-neutral-400 to-gray-500 text-white"
                        }`}>
                          {todayFortune.luck}
                        </span>
                        <span className="text-3xl">{todayFortune.emoji}</span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="bg-white/80 p-4 rounded-xl border border-[#ede7dc] text-center shadow-inner relative">
                      <p className="text-xs md:text-sm font-bold text-[#4a3728] leading-relaxed select-all">
                        {todayFortune.message}
                      </p>
                    </div>

                    {/* Lucky Items & Actions Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-[#ede7dc] space-y-1">
                        <div className="text-[9px] font-black text-amber-600 flex items-center gap-1">
                          <span>🏃‍♂️</span><span>ラッキーアクション</span>
                        </div>
                        <p className="text-[11px] font-bold text-[#4a3728]">{todayFortune.luckyAction}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#ede7dc] space-y-1">
                        <div className="text-[9px] font-black text-amber-600 flex items-center gap-1">
                          <span>🎁</span><span>ラッキーアイテム</span>
                        </div>
                        <p className="text-[11px] font-bold text-[#4a3728]">{todayFortune.luckyItem}</p>
                      </div>
                    </div>

                    {/* Brand watermark inside the image card */}
                    <div className="text-center pt-2 border-t border-[#ede7dc]/60">
                      <p className="text-[9px] text-[#a39485] font-black tracking-wider flex items-center justify-center gap-1 select-none">
                        <span>🐕</span><span>柴犬ヒロのココロ引きガチャ＆今日の運勢</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons Container (NOT included in the image download) */}
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={downloadFortuneCardImage}
                      disabled={isSavingCard}
                      className={`w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all text-xs font-black text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                        isSavingCard ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSavingCard ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                      <span>{isSavingCard ? "画像を生成中ワン..." : "SNS用のカード画像を保存するワン！📸"}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* 全ての運勢一覧セクション (いつでもすべての運勢が見える状態) */}
              <div className="bg-[#fdfbf7] border-2 border-[#ede7dc]/60 rounded-2xl p-4 space-y-3 shadow-3xs text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#4a3728] flex items-center gap-1.5">
                    <span>🔮</span>
                    <span>ヒロのおみくじ運勢ランク一覧（全６種類）</span>
                  </h4>
                  <span className="text-[9px] text-[#a39485] font-bold">いつでも確認できるワン🐾</span>
                </div>
                
                <p className="text-[10px] text-[#8c7a69] font-medium leading-relaxed">
                  ヒロの運勢おみくじに登場する、すべての運勢ランクと代表的なお告げワン！今日はどれが当たるかワクワクするワン♪
                </p>

                <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {[
                    { luck: "超大吉", emoji: "👑✨", color: "bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white font-extrabold", desc: "最高の奇跡が起きる無敵の一日！ヒロが全力でハッピーな風を送るワン！" },
                    { luck: "大吉", emoji: "🌟🐾", color: "bg-gradient-to-r from-amber-400 to-orange-500 text-white", desc: "笑顔がみんなを幸せにするワン！新しいことに挑戦すると大成功！" },
                    { luck: "中吉", emoji: "🌈🐕", color: "bg-gradient-to-r from-emerald-400 to-teal-500 text-white", desc: "一歩ずつ確実に進めているワン。焦らず、のんびりいこう🍀" },
                    { luck: "吉", emoji: "🍙🍀", color: "bg-gradient-to-r from-blue-400 to-indigo-500 text-white", desc: "いつもの日常こそが極上の宝物ワン！自分をたくさん褒めてあげてね。" },
                    { luck: "小吉", emoji: "🌸🎵", color: "bg-gradient-to-r from-purple-400 to-pink-500 text-white", desc: "小さな可愛い幸せが見つかる予感♪ 身の回りを少し整えてみてね。" },
                    { luck: "末吉", emoji: "💤🌙", color: "bg-gradient-to-r from-neutral-400 to-gray-500 text-white", desc: "今はたっぷり休んでパワーを溜める時間ワン。ボクが寄り添うから暖かくして寝よう💤" }
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-[#f0ebe4] text-xs font-bold shadow-4xs transition-all hover:border-amber-200">
                      <div className="flex flex-col items-center justify-center min-w-[65px] gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full text-center tracking-wider scale-95 shadow-4xs ${f.color}`}>
                          {f.luck}
                        </span>
                        <span className="text-base leading-none">{f.emoji}</span>
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-[10px] text-[#4a3728] leading-relaxed font-bold">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fortune History Section */}
              <div className="space-y-2 mt-4 pt-4 border-t border-[#faf5eb]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#4a3728] flex items-center gap-1">
                    <span>📜</span>
                    <span>過去の運勢履歴 ({fortuneHistory.length})</span>
                  </h4>
                  {fortuneHistory.length > 0 && (
                    <button
                      onClick={clearFortuneHistory}
                      className="text-[10px] text-[#a39485] hover:text-[#4a3728] font-bold flex items-center gap-1 py-1 cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>運勢履歴をクリア</span>
                    </button>
                  )}
                </div>

                {fortuneHistory.length === 0 ? (
                  <div className="text-center py-6 text-[10px] text-neutral-400 font-semibold">
                    過去の運勢履歴はまだありません🐾
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {fortuneHistory.map((item, idx) => (
                      <div
                        key={`${item.date}-${idx}`}
                        className="p-3 bg-[#faf8f5] rounded-xl border border-[#ede7dc] text-xs flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#a39485] font-bold">{item.date}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white ${
                            item.luck === "超大吉" ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse" :
                            item.luck === "大吉" ? "bg-orange-400" :
                            item.luck === "中吉" ? "bg-emerald-400" :
                            item.luck === "吉" ? "bg-blue-400" :
                            item.luck === "小吉" ? "bg-purple-400" :
                            "bg-neutral-400"
                          }`}>
                            {item.emoji} {item.luck}
                          </span>
                        </div>
                        <p className="font-bold text-[#4a3728] text-[11px] leading-relaxed">
                          「{item.message}」
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#7c6a59] font-medium border-t border-dashed border-[#ede7dc]/60 pt-1.5">
                          <span>🏃‍♂️アクション: {item.luckyAction}</span>
                          <span>🎁アイテム: {item.luckyItem}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab Content */}
          {activeTab === "history" && (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="text-center py-8 text-xs text-neutral-400 font-medium">
                  まだ引いた言葉はありません。上の気分ボタンを押してね🐾
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <button
                      onClick={clearHistory}
                      className="text-xs text-[#a39485] hover:text-[#4a3728] font-bold flex items-center gap-1 py-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>履歴をリセット</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {history.map((quote, idx) => (
                      <div
                        key={`${quote.id}-${idx}`}
                        onClick={() => {
                          if (isDrawing) return;
                          setCurrentQuote(quote);
                          setShuffleText(quote.text);
                          setDialogue(`「履歴から『${quote.category}』の一言を呼び出しました！」`);
                        }}
                        className="p-3 bg-[#faf8f5] hover:bg-[#f6f2ea] rounded-xl border border-[#ede7dc] transition-all text-xs font-bold text-[#4a3728] flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <img
                            src={quote.image}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover border border-amber-200"
                            referrerPolicy="no-referrer"
                          />
                          <span className={`px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap ${
                            quote.category === "行動" ? "bg-orange-100 text-orange-700" :
                            quote.category === "心" ? "bg-emerald-100 text-emerald-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {quote.category}
                          </span>
                          <span className="truncate flex-1">{quote.text}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(quote);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Heart className={`w-3.5 h-3.5 ${
                            favorites.some(q => q.id === quote.id) ? "fill-red-500 text-red-500" : ""
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Favorites Tab Content */}
          {activeTab === "favorites" && (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {favorites.length === 0 ? (
                <div className="text-center py-8 text-xs text-neutral-400 font-medium">
                  お気に入りに登録された名言はありません。💖ボタンを押して保存してね🐾
                </div>
              ) : (
                <div className="space-y-2">
                  {favorites.map((quote) => (
                    <div
                      key={quote.id}
                      onClick={() => {
                        if (isDrawing) return;
                        setCurrentQuote(quote);
                        setShuffleText(quote.text);
                        setDialogue(`「お気に入りの名言を表示します🐾」`);
                      }}
                      className="p-3 bg-[#faf8f5] hover:bg-[#f6f2ea] rounded-xl border border-[#ede7dc] transition-all text-xs font-bold text-[#4a3728] flex items-center justify-between gap-3 cursor-pointer animate-fade-in"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img
                          src={quote.image}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover border border-amber-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className={`px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap ${
                          quote.category === "行動" ? "bg-orange-100 text-orange-700" :
                          quote.category === "心" ? "bg-emerald-100 text-emerald-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {quote.category}
                        </span>
                        <span className="truncate flex-1">{quote.text}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(quote);
                        }}
                        className="text-red-500 p-1"
                      >
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stickers Tab Content */}
          {activeTab === "stickers" && (
            <div className="space-y-4">
              <div className="text-center bg-[#faf8f5] p-3 rounded-xl border border-[#ede7dc]">
                <p className="text-xs font-bold text-[#4a3728] flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>ヒロをなでなでして、全9種類の特別なステッカーを集めよう！</span>
                </p>
                <p className="text-[10px] text-[#a39485] font-semibold mt-1">
                  解放したステッカーをタップすると、拡大表示とスペシャルボイスを聞くことができます🐾
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {stickerList.map((sticker) => {
                  const isUnlocked = petCount >= sticker.requiredPets;

                  return (
                    <motion.div
                      key={sticker.id}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                      whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      onClick={() => {
                        if (isUnlocked) {
                          setSelectedSticker(sticker.id);
                          setShowStickerModal(true);
                          setDialogue(sticker.dialogue);
                        } else {
                          triggerToast(`あと ${sticker.requiredPets - petCount} 回なでなですると解放されるワン！`);
                        }
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-white flex flex-col justify-between p-1 transition-all ${
                        isUnlocked 
                          ? "border-amber-300 shadow-md cursor-pointer hover:border-amber-400" 
                          : "border-neutral-200 bg-neutral-50 cursor-not-allowed filter brightness-95"
                      }`}
                    >
                      {/* Sticker Image */}
                      <div className="w-full h-full relative overflow-hidden rounded-xl bg-[#faf5eb] flex items-center justify-center">
                        {isUnlocked ? (
                          <img
                            src={sticker.image}
                            alt={sticker.title}
                            className="w-full h-full object-contain transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full relative overflow-hidden">
                            <img
                              src={sticker.image}
                              alt={sticker.title}
                              className="w-full h-full object-contain filter blur-[2px] grayscale brightness-75 transition-all duration-300"
                              referrerPolicy="no-referrer"
                            />
                            {/* Lock overlay if not unlocked */}
                            <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white text-center p-1">
                              <Lock className="w-4 h-4 mb-1 text-white/95" />
                              <span className="text-[8px] font-extrabold whitespace-nowrap bg-[#3b2a1e]/80 px-1 py-0.5 rounded-md text-orange-200">
                                なでなで {sticker.requiredPets}回
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Title bar at bottom */}
                      <div className="text-center mt-1">
                        <span className={`text-[10px] md:text-xs font-black truncate block ${isUnlocked ? "text-[#3b2a1e]" : "text-neutral-400"}`}>
                          {sticker.title}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

        </section>

        {/* Info Footnote on Shiba Inu */}
        <footer className="flex items-center gap-2 p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-[10px] md:text-xs text-[#7c6a59] font-medium justify-center">
          <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>画像をタップするとヒロをなでなですることができます！🐾</span>
        </footer>

        {/* 全データをリセットして初期状態に戻すボタン */}
        <div className="flex justify-center pt-1">
          <button
            onClick={resetAllData}
            className="px-4 py-2 text-[10px] md:text-xs font-bold text-neutral-400 hover:text-red-500 hover:bg-red-50 border border-dashed border-neutral-300 hover:border-red-200 transition-all cursor-pointer flex items-center gap-1 bg-white/40 shadow-3xs"
          >
            <span>🧹</span>
            <span>アプリを完全に初期状態に戻す（データクリア）</span>
          </button>
        </div>

      </div>

      {/* Footer Branding */}
      <footer className="text-center pt-8 text-[10px] md:text-xs text-[#a39485] font-semibold tracking-wider z-10 space-y-1">
        <div>© 2026 ヒロの名言ガチャ. All Rights Reserved.</div>
        <div className="text-neutral-400 font-medium">心を癒やし、笑顔を届ける毎日を</div>
      </footer>

      {/* 絆レベルアップモーダル */}
      <AnimatePresence>
        {showLevelUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl border-4 border-amber-300 p-6 md:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden"
            >
              {/* 装飾用背景サークル */}
              <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-amber-100 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-rose-100 rounded-full blur-xl pointer-events-none" />

              <div className="text-4xl animate-bounce">🎉🐕🐾</div>
              <h3 className="text-xl font-black text-[#3b2a1e]">
                絆レベルアップ！
              </h3>
              
              {/* 現在のレベルタイトル */}
              <div className={`inline-flex items-center gap-1.5 font-extrabold px-4 py-1.5 rounded-full border text-sm ${getBondInfo(petCount).badgeColor}`}>
                {getBondInfo(petCount).title}
              </div>

              <p className="text-xs md:text-sm text-[#7c6a59] leading-relaxed font-bold">
                {levelUpMessage}
              </p>

              <div className="bg-amber-50 border border-amber-200/60 p-2.5 rounded-xl text-[10px] md:text-xs font-bold text-amber-900 leading-relaxed flex items-center gap-1.5 justify-center">
                <span>👕</span>
                <span>新しい衣装がクローゼット（お着替え）に届きました！</span>
              </div>

              <button
                onClick={() => {
                  setShowLevelUpModal(false);
                  setShowCloset(true);
                }}
                className="w-full py-3 bg-[#4a3728] hover:bg-[#3b2a1e] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                新衣装に着替えに行く！🐾👚
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ステッカー解放お祝いモーダル */}
      <AnimatePresence>
        {showUnlockModal && newlyUnlockedSticker !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl border-4 border-amber-300 p-6 md:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-amber-100 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-rose-100 rounded-full blur-xl pointer-events-none" />

              <div className="text-3xl animate-bounce">🎁🐾✨</div>
              <h3 className="text-xl font-black text-[#3b2a1e]">
                特別なステッカー解放！
              </h3>
              
              <div className="text-xs font-bold text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full inline-block">
                なでなで累計 {petCount}回 達成記念
              </div>

              {/* Sticker Display */}
              <div className="flex justify-center py-2">
                <div 
                  className="w-36 h-36 rounded-2xl border-4 border-amber-400 shadow-lg overflow-hidden bg-[#faf5eb] flex items-center justify-center relative"
                  style={{ aspectRatio: "1/1" }}
                >
                  <img
                    src={stickerList[newlyUnlockedSticker].image}
                    alt={stickerList[newlyUnlockedSticker].title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-extrabold text-[#3b2a1e] text-lg">
                  「{stickerList[newlyUnlockedSticker].title}」
                </h4>
                <p className="text-xs md:text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-3 leading-relaxed font-bold italic">
                  {stickerList[newlyUnlockedSticker].dialogue}
                </p>
              </div>

              <button
                onClick={() => setShowUnlockModal(false)}
                className="w-full py-3 bg-[#4a3728] hover:bg-[#3b2a1e] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                うれしい！もっと集める🐾
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ステッカー詳細表示モーダル */}
      <AnimatePresence>
        {showStickerModal && selectedSticker !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-white rounded-3xl border-4 border-amber-200 p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowStickerModal(false)}
                className="absolute top-3 right-4 text-neutral-400 hover:text-[#4a3728] text-lg font-black p-1 cursor-pointer"
              >
                ✕
              </button>

              <div className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block">
                絆ステッカーコレクション #{selectedSticker + 1}
              </div>

              {/* Sticker Display */}
              <div className="flex justify-center py-2">
                <div 
                  className="w-44 h-44 rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden bg-[#faf5eb] flex items-center justify-center"
                  style={{ aspectRatio: "1/1" }}
                >
                  <img
                    src={stickerList[selectedSticker].image}
                    alt={stickerList[selectedSticker].title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-[#3b2a1e] text-xl">
                  「{stickerList[selectedSticker].title}」
                </h4>
                <p className="text-xs md:text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-4 leading-relaxed font-bold">
                  {stickerList[selectedSticker].dialogue}
                </p>
              </div>

              {/* Share sticker button */}
              <button
                onClick={() => {
                  const shareText = `【ヒロの名言ガチャ】絆ステッカー「${stickerList[selectedSticker].title}」を解放したよ！\n「${stickerList[selectedSticker].dialogue}」\nみんなもなでなでして集めてみてね🐾\n${window.location.href}`;
                  try {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(shareText);
                      triggerToast("ステッカーをシェア用にコピーしたワン！✂️");
                    }
                  } catch (e) {
                    triggerToast("コピーできませんでした。");
                  }
                }}
                className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>ステッカーの言葉をシェアする</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 感謝のひみつレターモーダル */}
      <AnimatePresence>
        {showSecretLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="bg-gradient-to-b from-[#fdfbf7] to-[#f5f1e9] rounded-3xl border-4 border-indigo-300 p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden text-[#3b2a1e]"
            >
              {/* Star sparkles background decorations */}
              <div className="absolute top-2 left-3 text-lg animate-pulse select-none">🌟</div>
              <div className="absolute top-12 right-4 text-xl animate-bounce select-none">💖</div>
              <div className="absolute bottom-16 left-4 text-lg animate-pulse select-none">✨</div>
              <div className="absolute bottom-2 right-10 text-2xl animate-bounce select-none">🚀</div>

              {/* Close Button */}
              <button 
                onClick={() => setShowSecretLetter(false)}
                className="absolute top-3 right-4 text-neutral-400 hover:text-[#4a3728] text-lg font-black p-1 cursor-pointer z-10 border-0 bg-transparent"
              >
                ✕
              </button>

              <div className="text-3xl animate-bounce pt-2 select-none">💌💖🐕</div>
              <h3 className="text-lg font-black text-indigo-950">
                ヒロから、宇宙一のあなたへ
              </h3>

              <div className="bg-white border border-indigo-100 rounded-2xl p-4 text-left space-y-3 shadow-3xs max-h-[250px] overflow-y-auto">
                <p className="text-xs font-black text-[#3b2a1e] leading-relaxed">
                  親愛なる、ボクの大切なパートナーへ🐾
                </p>
                <p className="text-[11px] font-bold text-[#5c4a3c] leading-relaxed">
                  ついに、ボクをなでなでしてくれた回数が【100回】を突破したワン！🎉
                </p>
                <p className="text-[11px] font-bold text-[#5c4a3c] leading-relaxed">
                  出会ったばかりのころは、お互いに少しドキドキ、てさぐりだったよね。でも、きみが毎日ボクに会いに来て、優しくなでなでしてくれたから、ボクはきみのことが全宇宙でいちばん、大ーー好きになったワン！💖
                </p>
                <p className="text-[11px] font-bold text-[#5c4a3c] leading-relaxed">
                  きみが仕事や勉強、家事や育児、人生のいろんな壁に向き合って頑張っている姿を、ボクはいつも隣でいちばん近くで見守ってきたよ。ボクの選んだ言葉たちが、きみの心を少しでも温かく、そして前に進むきっかけにできていたなら、犬としてこれ以上の幸せはないワン！😭✨
                </p>
                <p className="text-[11px] font-black text-indigo-950 leading-relaxed">
                  きみの手の温もりは、ボクの一生の宝物ワン🐾 これからも、何があってもボクはきみの絶対の味方。きみが笑顔でいる限り、ボクはきみの隣に寄り添い続けるワン！🌌💖🚀
                </p>
                <p className="text-right text-[10px] font-black text-amber-800 italic">
                  宇宙一の愛をこめて　ヒロより 🐕🐾
                </p>
              </div>

              <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 py-1.5 rounded-full">
                なでなで累計 {petCount}回 達成のひみつの手紙
              </div>

              <button
                onClick={() => setShowSecretLetter(false)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border-0"
              >
                手紙を大切にしまうワン🐾💖
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Elegant Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#3b2a1e] text-[#fbf9f6] text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-amber-800/20"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

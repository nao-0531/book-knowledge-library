"use client";

import { useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ---- サンプルデータ ----

const categories = [
  { id: 1, name: "ビジネス思考", count: 4, dot: "bg-blue-500", coverFrom: "from-blue-600", coverTo: "to-blue-900" },
  { id: 2, name: "習慣・行動",   count: 3, dot: "bg-violet-500", coverFrom: "from-violet-600", coverTo: "to-purple-900" },
  { id: 3, name: "心理・人間関係", count: 3, dot: "bg-rose-500", coverFrom: "from-rose-500", coverTo: "to-pink-800" },
  { id: 4, name: "戦略・マーケティング", count: 2, dot: "bg-orange-500", coverFrom: "from-orange-500", coverTo: "to-red-700" },
  { id: 5, name: "自己啓発",     count: 2, dot: "bg-emerald-500", coverFrom: "from-emerald-500", coverTo: "to-teal-700" },
];

const books: Record<number, Book[]> = {
  1: [
    { id: 1, title: "イシューからはじめよ", author: "安宅和人", readAt: "2025-11", rating: 5, summary: "問題の質を上げることが、生産性を劇的に変える。答える前に「本当に解くべき問いか」を問え。", coverImage: "https://books.google.com/books/content?vid=ISBN9784862760852&printsec=frontcover&img=1&zoom=1" },
    { id: 2, title: "ゼロ秒思考", author: "赤羽雄二", readAt: "2025-09", rating: 4, summary: "A4メモ書きで頭の中を即言語化。1日10枚を続けると思考スピードが格段に上がる。", coverImage: "https://books.google.com/books/content?vid=ISBN9784478025819&printsec=frontcover&img=1&zoom=1" },
    { id: 3, title: "考える技術・書く技術", author: "バーバラ・ミント", readAt: "2025-07", rating: 4, summary: "ピラミッド原則でロジックを構造化。伝わる文章の骨格を作るための普遍的フレームワーク。", coverImage: "https://books.google.com/books/content?vid=ISBN9784478490181&printsec=frontcover&img=1&zoom=1" },
    { id: 4, title: "McKinseyの問題解決思考", author: "大嶋祥誉", readAt: "2025-05", rating: 3, summary: "仮説思考・ロジックツリー・MECE。コンサル流の問題解決プロセスを体系的に学ぶ。" },
  ],
  2: [
    { id: 5, title: "atomic habits", author: "James Clear", readAt: "2026-01", rating: 5, summary: "1%の改善を積み重ねる複利の力。習慣のループ（きっかけ・欲求・反応・報酬）を意図的に設計する。", coverImage: "https://books.google.com/books/content?vid=ISBN9780735211292&printsec=frontcover&img=1&zoom=1" },
    { id: 6, title: "やり抜く力 GRIT", author: "アンジェラ・ダックワース", readAt: "2025-12", rating: 4, summary: "才能よりも情熱×継続こそが長期的な成功を決める。GRITは鍛えられる。", coverImage: "https://books.google.com/books/content?vid=ISBN9784478065648&printsec=frontcover&img=1&zoom=1" },
    { id: 7, title: "スタンフォード式疲れない体", author: "山田知生", readAt: "2025-10", rating: 3, summary: "IAP呼吸とリカバリーの科学。疲れを取るより疲れにくい体を作る仕組みを解説。" },
  ],
  3: [
    { id: 8, title: "影響力の武器", author: "ロバート・チャルディーニ", readAt: "2026-02", rating: 5, summary: "返報性・コミットメント・社会的証明・好意・権威・希少性の6原則。人を動かす心理のメカニズム。", coverImage: "https://books.google.com/books/content?vid=ISBN9784414304213&printsec=frontcover&img=1&zoom=1" },
    { id: 9, title: "人を動かす", author: "D・カーネギー", readAt: "2025-08", rating: 5, summary: "批判しない、誠実な関心を持つ、名前を覚える。人間関係の古典的バイブル。", coverImage: "https://books.google.com/books/content?vid=ISBN9784422100517&printsec=frontcover&img=1&zoom=1" },
    { id: 10, title: "嫌われる勇気", author: "岸見一郎・古賀史健", readAt: "2025-06", rating: 4, summary: "アドラー心理学の核心。課題の分離と承認欲求からの自由が、自分らしく生きる鍵。" },
  ],
  4: [
    { id: 11, title: "ポジショニング戦略", author: "アル・ライズ/ジャック・トラウト", readAt: "2026-03", rating: 4, summary: "市場でNo.1になるには「最初に心を占拠せよ」。ポジショニングの古典にして必読書。" },
    { id: 12, title: "USJを劇的に変えた、たった1つの考え方", author: "森岡毅", readAt: "2026-01", rating: 5, summary: "マーケティングとは「確率を上げる戦い」。消費者心理から逆算する戦略思考の実践書。" },
  ],
  5: [
    { id: 13, title: "7つの習慣", author: "スティーブン・R・コヴィー", readAt: "2024-12", rating: 5, summary: "主体的であること・終わりを思い描くこと・最優先事項を優先すること——成功の原則の体系化。" },
    { id: 14, title: "DIE WITH ZERO", author: "ビル・パーキンス", readAt: "2025-03", rating: 4, summary: "人生最大の後悔は「経験への過小投資」。お金は記憶に変えるための道具と考える生き方の哲学。" },
  ],
};

const notes: Record<number, Note[]> = {
  1: [
    { id: 1, bookId: 1, text: "バリューのある仕事とは「イシュー度」×「解の質」で決まる", usedAt: "2026-05-20", context: "営業企画の優先順位を決める会議で活用。「この問題は本当に解くべきか」を最初に問うことで議論が30分短縮された。" },
    { id: 2, bookId: 1, text: "仮説を立ててから調べる。調べながら考えるのは最悪", usedAt: "2026-04-10", context: "朝のジャーナリングで今週のゴール設定に使用。仮説を書き出してから行動計画を立てたら迷いがなくなった。" },
  ],
  5: [
    { id: 3, bookId: 5, text: "習慣の積み上げ（habit stacking）：既存の習慣の後に新習慣を接続する", usedAt: "2026-05-01", context: "朝の読書習慣を定着させるために活用。コーヒーを淹れた後に必ず本を開く、とルール化したら継続できた。" },
    { id: 4, bookId: 5, text: "2分ルール：新しい習慣は2分でできる形に小さくする", usedAt: "2026-03-15", context: "ジャーナリング習慣の開始時に活用。最初は「1行書くだけ」から始めたら3ヶ月続いた。" },
  ],
  8: [
    { id: 5, bookId: 8, text: "返報性の原理：先に与えた人が有利になる", usedAt: "2026-02-28", context: "チームメンバーへの情報共有を積極的に行い始めた。1ヶ月後に協力してもらいやすくなったと実感。" },
  ],
};

const allNotes = Object.values(notes).flat();
const allBooks  = Object.values(books).flat();

// ---- 型定義 ----
type Book = { id: number; title: string; author: string; readAt: string; rating: number; summary: string; coverImage?: string };
type Note = { id: number; bookId: number; text: string; usedAt: string; context: string };

// ---- 小コンポーネント ----

function StarRating({ rating }: { rating: number }) {
  return <span className="text-amber-400 text-sm tracking-tight">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
}

function BookCover({ title, author, categoryId, coverImage, size = "md" }: {
  title: string; author: string; categoryId: number | null; coverImage?: string; size?: "sm" | "md";
}) {
  const [failed, setFailed] = useState(false);
  const cat = categories.find(c => c.id === categoryId);
  const from = cat?.coverFrom ?? "from-slate-600";
  const to   = cat?.coverTo   ?? "to-slate-900";
  const dim  = size === "sm" ? "w-10 h-14" : "w-16 h-[96px]";
  return (
    <div className="flex-shrink-0" style={{ perspective: "500px" }}>
      <div className={`relative ${dim} rounded-r-sm shadow-lg overflow-hidden`}
        style={{ transform: "rotateY(-10deg)", transformStyle: "preserve-3d" }}>
        {coverImage && !failed
          ? <img src={coverImage} alt={title} className="w-full h-full object-cover"
              onError={() => setFailed(true)} />
          : <div className={`w-full h-full bg-gradient-to-br ${from} ${to} flex flex-col justify-between p-1.5`}>
              <p className="text-white text-[7px] font-bold leading-tight line-clamp-5 pl-1.5 pr-0.5 mt-0.5">{title}</p>
              <p className="text-white/60 text-[6px] pl-1.5 truncate">{author}</p>
            </div>
        }
        <div className="absolute inset-y-0 left-0 w-1.5 bg-black/15" />
      </div>
    </div>
  );
}

// ---- メイン ----

export default function BookKnowledgeLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(1);
  const [selectedBook, setSelectedBook]         = useState<Book | null>(books[1][0]);
  const [selectedNote, setSelectedNote]         = useState<Note | null>(null);
  const [editingNoteId, setEditingNoteId]       = useState<number | null>(null);
  const [editText, setEditText]                 = useState("");

  const [todayNote, setTodayNote] = useState<Note>(allNotes[0]);
  useEffect(() => {
    setTodayNote(allNotes[Math.floor(Math.random() * allNotes.length)]);
  }, []);
  const todayBook  = allBooks.find(b => b.id === todayNote.bookId) ?? null;
  const todayCatId = todayBook ? Number(Object.entries(books).find(([, bks]) => bks.some(b => b.id === todayBook.id))?.[0]) : null;

  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allNotes.filter(n => n.text.toLowerCase().includes(q) || n.context.toLowerCase().includes(q));
  }, [searchQuery]);

  type BookPreview = { title: string; author: string; publisher: string; publishedDate: string; thumbnail: string; isbn: string };

  const [showAddBook, setShowAddBook]   = useState(false);
  const [isbnInput, setIsbnInput]       = useState("");
  const [isbnLoading, setIsbnLoading]   = useState(false);
  const [isbnPreview, setIsbnPreview]   = useState<BookPreview | null>(null);

  // タイトル検索
  const [titleInput, setTitleInput]         = useState("");
  const [titleLoading, setTitleLoading]     = useState(false);
  const [titleResults, setTitleResults]     = useState<BookPreview[]>([]);
  const [searchMode, setSearchMode]         = useState<"isbn" | "title">("title");
  const [searchError, setSearchError]       = useState<string | null>(null);

  async function handleTitleSearch() {
    const q = titleInput.trim();
    if (!q) return;
    setTitleLoading(true); setTitleResults([]);
    setSearchError(null);
    try {
      const res  = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=8`);
      const data = await res.json();
      if (data.error) {
        if (data.error.code === 429) {
          setSearchError("Google Books APIの1日の利用上限に達しました。明日（日本時間午前9時以降）に再試行してください。");
        } else {
          setSearchError(`APIエラー: ${data.error.message}`);
        }
        return;
      }
      const items: BookPreview[] = (data.items ?? []).map((item: {volumeInfo: {title?: string; authors?: string[]; publisher?: string; publishedDate?: string; imageLinks?: {thumbnail?: string}; industryIdentifiers?: {type: string; identifier: string}[]}}) => {
        const v = item.volumeInfo;
        const isbnObj = (v.industryIdentifiers ?? []).find((x: {type: string}) => x.type === "ISBN_13") ?? (v.industryIdentifiers ?? [])[0];
        return {
          title: v.title ?? "",
          author: (v.authors ?? []).join("、"),
          publisher: v.publisher ?? "",
          publishedDate: v.publishedDate ?? "",
          thumbnail: v.imageLinks?.thumbnail ?? "",
          isbn: isbnObj?.identifier ?? "",
        };
      });
      setTitleResults(items);
      if (items.length === 0) setSearchError("本が見つかりませんでした。別のキーワードで試してください。");
    } catch { setSearchError("ネットワークエラーが発生しました。接続を確認してください。"); }
    finally { setTitleLoading(false); }
  }

  async function handleIsbnLookup() {
    const isbn = isbnInput.replace(/-/g, "").trim();
    if (!isbn) return;
    setIsbnLoading(true); setIsbnPreview(null);
    try {
      const res  = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await res.json();
      const item = data.items?.[0]?.volumeInfo;
      if (item) {
        const isbnObj = (item.industryIdentifiers ?? []).find((x: {type: string}) => x.type === "ISBN_13") ?? (item.industryIdentifiers ?? [])[0];
        setIsbnPreview({ title: item.title ?? "", author: (item.authors ?? []).join("、"),
          publisher: item.publisher ?? "", publishedDate: item.publishedDate ?? "",
          thumbnail: item.imageLinks?.thumbnail ?? "", isbn: isbnObj?.identifier ?? isbn });
      } else { alert("本が見つかりませんでした。ISBNを確認してください。"); }
    } catch { alert("取得に失敗しました。"); }
    finally { setIsbnLoading(false); }
  }

  function closeModal() {
    setShowAddBook(false); setIsbnPreview(null); setIsbnInput("");
    setTitleInput(""); setTitleResults([]); setSearchError(null);
  }

  const currentBooks = selectedCategory ? (books[selectedCategory] ?? []) : [];
  const currentNotes = selectedBook ? (notes[selectedBook.id] ?? []) : [];

  function selectCategory(id: number) {
    setSelectedCategory(id);
    setSelectedBook(books[id]?.[0] ?? null);
    setSelectedNote(null); setSearchQuery("");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f4f0] font-sans">

      {/* ═══ Pane 1 — サイドバー（ダーク） ═══ */}
      <div className="w-52 flex-shrink-0 bg-[#0f1f3d] flex flex-col">
        <div className="px-5 pt-6 pb-4">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-1">My Library</p>
          <h1 className="text-lg font-bold text-white leading-tight">読書知識</h1>
          <p className="text-[11px] text-white/40 mt-0.5">{categories.reduce((a, c) => a + c.count, 0)} 冊のライブラリ</p>
        </div>

        <div className="mx-3 mb-2 h-px bg-white/10" />

        <ScrollArea className="flex-1 px-2">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 pt-3 pb-2">カテゴリ</p>
          <div className="space-y-0.5">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => selectCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-all ${
                  selectedCategory === cat.id
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cat.dot}`} />
                <span className="text-[13px] font-medium truncate flex-1">{cat.name}</span>
                <span className={`text-[10px] tabular-nums ${selectedCategory === cat.id ? "text-white/50" : "text-white/25"}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[11px] text-white/25">読書知識ライブラリ</p>
        </div>
      </div>

      {/* ═══ Pane 2 — 本一覧 ═══ */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200/80 flex flex-col">
        <div className="px-4 py-4 flex items-start justify-between border-b border-gray-100">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Books</p>
            <h2 className="text-[15px] font-bold text-gray-900 mt-0.5 leading-tight">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "カテゴリを選択"}
            </h2>
          </div>
          <button onClick={() => setShowAddBook(true)}
            className="mt-0.5 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-base hover:bg-gray-700 active:scale-95 transition-all shadow-sm"
            title="本を追加">+</button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {currentBooks.map(book => (
              <button key={book.id} onClick={() => { setSelectedBook(book); setSelectedNote(null); }}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedBook?.id === book.id
                    ? "bg-blue-50 ring-1 ring-blue-200 shadow-sm"
                    : "hover:bg-gray-50"
                }`}>
                <div className="flex gap-2.5 items-start">
                  <BookCover title={book.title} author={book.author}
                    categoryId={selectedCategory} coverImage={book.coverImage} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 leading-tight line-clamp-2">{book.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{book.author}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-amber-400 text-[11px] tracking-tight">{"★".repeat(book.rating)}</span>
                      <span className="text-[10px] text-gray-300">{book.readAt}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {currentBooks.length === 0 && (
              <p className="text-sm text-gray-400 px-3 py-6 text-center">本がありません</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ═══ Pane 3 — 本の詳細 ═══ */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200/80 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Detail</p>
          <h2 className="text-[15px] font-bold text-gray-900 mt-0.5">本の詳細</h2>
        </div>
        <ScrollArea className="flex-1">
          {selectedBook ? (
            <div className="px-4 py-5">
              {/* カバー＋タイトル */}
              <div className="flex gap-4 mb-5">
                <BookCover title={selectedBook.title} author={selectedBook.author}
                  categoryId={selectedCategory} coverImage={selectedBook.coverImage} />
                <div className="flex flex-col justify-center min-w-0 gap-0.5">
                  <h3 className="text-[14px] font-bold text-gray-900 leading-snug">{selectedBook.title}</h3>
                  <p className="text-[12px] text-gray-500">{selectedBook.author}</p>
                  <StarRating rating={selectedBook.rating} />
                  <p className="text-[11px] text-gray-400">読了 {selectedBook.readAt}</p>
                </div>
              </div>

              {/* ひと言まとめ */}
              <div className="bg-gray-50 rounded-xl p-3.5 mb-5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">ひと言まとめ</p>
                <p className="text-[13px] text-gray-700 leading-relaxed">{selectedBook.summary}</p>
              </div>

              <Separator className="mb-4" />

              {/* 抜き書きリスト */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">抜き書き・活用ログ</p>
                <Badge variant="secondary" className="text-[10px] h-4">{currentNotes.length} 件</Badge>
              </div>
              <div className="space-y-2">
                {currentNotes.map(note => (
                  <button key={note.id} onClick={() => setSelectedNote(note)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                      selectedNote?.id === note.id
                        ? "bg-amber-50 border-amber-300 shadow-sm"
                        : "bg-white border-gray-100 hover:border-amber-200 hover:bg-amber-50/30"
                    }`}>
                    <p className="text-[12px] text-gray-800 leading-snug line-clamp-2 font-medium">{note.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{note.usedAt} に活用</p>
                  </button>
                ))}
                {currentNotes.length === 0 && (
                  <p className="text-[12px] text-gray-400 py-2 text-center">まだメモがありません</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-400 p-8 text-center">
              左から本を選んでください
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ═══ Pane 4 — Knowledge ═══ */}
      <div className="flex-1 bg-[#fafaf8] flex flex-col min-w-0">
        {/* 検索バー */}
        <div className="px-6 py-3.5 border-b border-gray-200/80 bg-white flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-gray-400 focus-within:bg-white transition-colors">
            <span className="text-gray-400 text-sm">🔍</span>
            <input type="text" placeholder="抜き書きをキーワード検索…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSelectedNote(null); }}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-700" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 text-xs leading-none">✕</button>
            )}
          </div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex-shrink-0">Knowledge</p>
        </div>

        {/* 検索結果 */}
        {searchQuery && (
          <div className="border-b border-gray-200/80 bg-white/80 backdrop-blur-sm">
            <div className="px-6 py-3">
              <p className="text-[11px] text-gray-400 mb-2">{searchResults.length} 件ヒット</p>
              <div className="space-y-1.5 pb-1">
                {searchResults.map(n => {
                  const book = allBooks.find(b => b.id === n.bookId);
                  return (
                    <button key={n.id}
                      onClick={() => { setSearchQuery(""); setSelectedNote(n); const b = allBooks.find(b => b.id === n.bookId); if (b) setSelectedBook(b); }}
                      className="w-full text-left bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-amber-300 hover:bg-amber-50/30 transition-colors shadow-sm">
                      <p className="text-[12px] font-semibold text-gray-800 line-clamp-1">{n.text}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{book?.title} · {n.usedAt}</p>
                    </button>
                  );
                })}
                {searchResults.length === 0 && (
                  <p className="text-[12px] text-gray-400 pb-1">該当する抜き書きがありません</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 抜き書き詳細 */}
        {selectedNote && !searchQuery ? (
          <ScrollArea className="flex-1">
            <div className="px-6 py-6">
              {/* 抜き書きカード */}
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-500 text-base">✍️</span>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">抜き書き</p>
                  <span className="text-[10px] text-gray-300 ml-auto">クリックで編集</span>
                </div>
                {editingNoteId === selectedNote.id ? (
                  <textarea className="w-full text-[15px] text-gray-800 font-semibold leading-relaxed bg-amber-50 rounded-lg p-2 resize-none outline-none border border-amber-300"
                    value={editText} onChange={e => setEditText(e.target.value)}
                    onBlur={() => setEditingNoteId(null)} autoFocus rows={3} />
                ) : (
                  <p className="text-[15px] text-gray-800 font-semibold leading-relaxed cursor-text hover:bg-amber-50 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors"
                    onClick={() => { setEditingNoteId(selectedNote.id); setEditText(selectedNote.text); }}>
                    &ldquo;{selectedNote.text}&rdquo;
                  </p>
                )}
              </div>

              {/* 活用ログ */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-500 text-base">📋</span>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">活用ログ</p>
                  <span className="ml-auto text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{selectedNote.usedAt}</span>
                </div>
                <p className="text-[13px] text-gray-700 leading-relaxed">{selectedNote.context}</p>
              </div>

              {/* 今日使えそうか？ */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-indigo-500 text-base">💡</span>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">今日使えそうか？</p>
                </div>
                <textarea className="w-full text-[13px] text-gray-700 bg-transparent resize-none outline-none placeholder:text-gray-400 leading-relaxed"
                  placeholder="今日の仕事・ジャーナリングでどう使えるかをメモする…" rows={3} />
              </div>
            </div>
          </ScrollArea>
        ) : !searchQuery ? (
          /* 今日の1枚 */
          <div className="flex-1 flex flex-col justify-center px-6 py-6">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <span className="text-lg">☀️</span>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">今日の1枚</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* 左：抜き書きテキスト */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3">今日の抜き書き</p>
                    <p className="text-[15px] font-semibold text-gray-800 leading-relaxed">
                      &ldquo;{todayNote.text}&rdquo;
                    </p>
                  </div>
                  <button onClick={() => setSelectedNote(todayNote)}
                    className="mt-4 self-start text-[12px] font-bold text-amber-600 hover:text-amber-700 transition-colors">
                    活用ログを見る →
                  </button>
                </div>
                {/* 右：本の情報 */}
                <div className="bg-gradient-to-br from-[#0f1f3d]/5 to-[#0f1f3d]/10 rounded-2xl border border-[#0f1f3d]/10 p-6 flex items-center gap-5">
                  {todayBook && (
                    <BookCover title={todayBook.title} author={todayBook.author}
                      categoryId={todayCatId} coverImage={todayBook.coverImage} />
                  )}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">出典</p>
                    <p className="text-[14px] font-bold text-gray-800 leading-snug">{todayBook?.title}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{todayBook?.author}</p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 text-center mt-5">
                左から抜き書きを選ぶか、キーワードで検索してください
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* ═══ 本を追加モーダル ═══ */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}>
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-[480px] mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">本を追加</h3>
              <button onClick={closeModal}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition-colors">✕</button>
            </div>

            {/* 検索モード切替 */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
              <button onClick={() => setSearchMode("title")}
                className={`flex-1 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${searchMode === "title" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                タイトルで検索
              </button>
              <button onClick={() => setSearchMode("isbn")}
                className={`flex-1 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${searchMode === "isbn" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                ISBNで検索
              </button>
            </div>

            {/* タイトル検索 */}
            {searchMode === "title" && (
              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  <input type="text" placeholder="例：イシューからはじめよ" value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleTitleSearch()}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors" />
                  <button onClick={handleTitleSearch} disabled={titleLoading}
                    className="px-4 py-2 bg-[#0f1f3d] text-white text-sm rounded-xl hover:bg-[#1a3460] disabled:opacity-40 transition-all active:scale-95">
                    {titleLoading ? "…" : "検索"}
                  </button>
                </div>

                {searchError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
                    <p className="text-[12px] text-red-600 leading-relaxed">{searchError}</p>
                  </div>
                )}

                {titleResults.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{titleResults.length} 件の候補</p>
                    {titleResults.map((book, i) => (
                      <button key={i} onClick={() => { setIsbnPreview(book); setTitleResults([]); setTitleInput(""); }}
                        className="w-full text-left flex gap-3 items-start p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                        {book.thumbnail
                          ? <img src={book.thumbnail} alt={book.title} className="w-9 h-13 object-cover rounded shadow flex-shrink-0" style={{height:"52px"}} />
                          : <div className="w-9 bg-gray-200 rounded flex-shrink-0" style={{height:"52px"}} />
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">{book.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{book.author || "著者不明"}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{book.publisher}{book.publishedDate ? ` · ${book.publishedDate}` : ""}</p>
                        </div>
                        <span className="text-[10px] text-blue-500 font-semibold flex-shrink-0 mt-1">選択 →</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ISBN検索 */}
            {searchMode === "isbn" && (
              <div className="mb-4">
                <div className="flex gap-2">
                  <input type="text" placeholder="例：9784862760852" value={isbnInput}
                    onChange={e => setIsbnInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleIsbnLookup()}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors" />
                  <button onClick={handleIsbnLookup} disabled={isbnLoading}
                    className="px-4 py-2 bg-[#0f1f3d] text-white text-sm rounded-xl hover:bg-[#1a3460] disabled:opacity-40 transition-all active:scale-95">
                    {isbnLoading ? "…" : "検索"}
                  </button>
                </div>
              </div>
            )}

            {/* 選択済みプレビュー */}
            {isbnPreview && (
              <>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex gap-3 items-start mb-4">
                  {isbnPreview.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={isbnPreview.thumbnail} alt={isbnPreview.title}
                      className="w-10 h-14 object-cover rounded-lg shadow flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{isbnPreview.title}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{isbnPreview.author}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{isbnPreview.publisher}{isbnPreview.publishedDate ? ` · ${isbnPreview.publishedDate}` : ""}</p>
                    {isbnPreview.isbn && <p className="text-[10px] text-gray-300 mt-0.5">ISBN: {isbnPreview.isbn}</p>}
                  </div>
                  <button onClick={() => setIsbnPreview(null)} className="text-gray-300 hover:text-gray-500 text-xs flex-shrink-0">✕</button>
                </div>

                <Separator className="mb-4" />

                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">登録情報を確認・編集</p>
                  <input key={`t-${isbnPreview.title}`} type="text" placeholder="タイトル"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
                    defaultValue={isbnPreview.title} />
                  <input key={`a-${isbnPreview.author}`} type="text" placeholder="著者"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400"
                    defaultValue={isbnPreview.author} />
                  <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-400 text-gray-700">
                    <option value="">カテゴリを選択</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <button className="w-full mt-5 py-2.5 bg-[#0f1f3d] text-white text-sm font-bold rounded-2xl hover:bg-[#1a3460] active:scale-[0.98] transition-all shadow-sm">
                  追加する（※現在はサンプル表示）
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

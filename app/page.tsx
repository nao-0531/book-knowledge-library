"use client";

import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ---- サンプルデータ ----

const categories = [
  { id: 1, name: "ビジネス思考", count: 4, color: "bg-blue-100 text-blue-700", coverFrom: "from-blue-600", coverTo: "to-blue-800" },
  { id: 2, name: "習慣・行動", count: 3, color: "bg-purple-100 text-purple-700", coverFrom: "from-purple-600", coverTo: "to-purple-900" },
  { id: 3, name: "心理・人間関係", count: 3, color: "bg-pink-100 text-pink-700", coverFrom: "from-rose-500", coverTo: "to-pink-800" },
  { id: 4, name: "戦略・マーケティング", count: 2, color: "bg-orange-100 text-orange-700", coverFrom: "from-orange-500", coverTo: "to-red-700" },
  { id: 5, name: "自己啓発", count: 2, color: "bg-green-100 text-green-700", coverFrom: "from-emerald-500", coverTo: "to-teal-700" },
];

const books: Record<number, Book[]> = {
  1: [
    { id: 1, title: "イシューからはじめよ", author: "安宅和人", readAt: "2025-11", rating: 5, summary: "問題の質を上げることが、生産性を劇的に変える。答える前に「本当に解くべき問いか」を問え。" },
    { id: 2, title: "ゼロ秒思考", author: "赤羽雄二", readAt: "2025-09", rating: 4, summary: "A4メモ書きで頭の中を即言語化。1日10枚を続けると思考スピードが格段に上がる。" },
    { id: 3, title: "考える技術・書く技術", author: "バーバラ・ミント", readAt: "2025-07", rating: 4, summary: "ピラミッド原則でロジックを構造化。伝わる文章の骨格を作るための普遍的フレームワーク。" },
    { id: 4, title: "McKinseyの問題解決思考", author: "大嶋祥誉", readAt: "2025-05", rating: 3, summary: "仮説思考・ロジックツリー・MECE。コンサル流の問題解決プロセスを体系的に学ぶ。" },
  ],
  2: [
    { id: 5, title: "atomic habits", author: "James Clear", readAt: "2026-01", rating: 5, summary: "1%の改善を積み重ねる複利の力。習慣のループ（きっかけ・欲求・反応・報酬）を意図的に設計する。" },
    { id: 6, title: "やり抜く力 GRIT", author: "アンジェラ・ダックワース", readAt: "2025-12", rating: 4, summary: "才能よりも情熱×継続こそが長期的な成功を決める。GRITは鍛えられる。" },
    { id: 7, title: "スタンフォード式疲れない体", author: "山田知生", readAt: "2025-10", rating: 3, summary: "IAP呼吸とリカバリーの科学。疲れを取るより疲れにくい体を作る仕組みを解説。" },
  ],
  3: [
    { id: 8, title: "影響力の武器", author: "ロバート・チャルディーニ", readAt: "2026-02", rating: 5, summary: "返報性・コミットメント・社会的証明・好意・権威・希少性の6原則。人を動かす心理のメカニズム。" },
    { id: 9, title: "人を動かす", author: "D・カーネギー", readAt: "2025-08", rating: 5, summary: "批判しない、誠実な関心を持つ、名前を覚える。人間関係の古典的バイブル。" },
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
const allBooks = Object.values(books).flat();

// ---- 型定義 ----
type Book = {
  id: number;
  title: string;
  author: string;
  readAt: string;
  rating: number;
  summary: string;
};

type Note = {
  id: number;
  bookId: number;
  text: string;
  usedAt: string;
  context: string;
};

// ---- コンポーネント ----

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function BookCover({ title, author, categoryId }: { title: string; author: string; categoryId: number | null }) {
  const cat = categories.find(c => c.id === categoryId);
  const from = cat?.coverFrom ?? "from-gray-600";
  const to = cat?.coverTo ?? "to-gray-800";
  return (
    <div className="flex-shrink-0" style={{ perspective: "600px" }}>
      <div
        className={`relative w-16 h-24 rounded-r-md shadow-xl bg-gradient-to-br ${from} ${to} flex flex-col justify-between p-1.5`}
        style={{ transformStyle: "preserve-3d", transform: "rotateY(-8deg)" }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-sm bg-black/20" />
        <p className="text-white text-[8px] font-bold leading-tight line-clamp-4 pl-2 pr-0.5 mt-1">{title}</p>
        <p className="text-white/70 text-[7px] pl-2 truncate">{author}</p>
      </div>
    </div>
  );
}

export default function BookKnowledgeLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(books[1][0]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // ② 今日の1枚
  const [todayNote] = useState<Note>(() => allNotes[Math.floor(Math.random() * allNotes.length)]);
  const todayBook = allBooks.find(b => b.id === todayNote.bookId) ?? null;
  const todayCategory = todayBook ? Object.entries(books).find(([, bks]) => bks.some(b => b.id === todayBook.id))?.[0] : null;

  // ③ 検索
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allNotes.filter(n => n.text.toLowerCase().includes(q) || n.context.toLowerCase().includes(q));
  }, [searchQuery]);

  // ① 本追加モーダル
  const [showAddBook, setShowAddBook] = useState(false);
  const [isbnInput, setIsbnInput] = useState("");
  const [isbnLoading, setIsbnLoading] = useState(false);
  const [isbnPreview, setIsbnPreview] = useState<{ title: string; author: string; publisher: string; publishedDate: string; thumbnail: string } | null>(null);

  async function handleIsbnLookup() {
    const isbn = isbnInput.replace(/-/g, "").trim();
    if (!isbn) return;
    setIsbnLoading(true);
    setIsbnPreview(null);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await res.json();
      const item = data.items?.[0]?.volumeInfo;
      if (item) {
        setIsbnPreview({
          title: item.title ?? "",
          author: (item.authors ?? []).join("、"),
          publisher: item.publisher ?? "",
          publishedDate: item.publishedDate ?? "",
          thumbnail: item.imageLinks?.thumbnail ?? "",
        });
      } else {
        setIsbnPreview(null);
        alert("本が見つかりませんでした。ISBNを確認してください。");
      }
    } catch {
      alert("取得に失敗しました。ネットワークを確認してください。");
    } finally {
      setIsbnLoading(false);
    }
  }

  const currentBooks = selectedCategory ? (books[selectedCategory] ?? []) : [];
  const currentNotes = selectedBook ? (notes[selectedBook.id] ?? []) : [];

  function handleCategoryClick(catId: number) {
    setSelectedCategory(catId);
    const firstBook = books[catId]?.[0] ?? null;
    setSelectedBook(firstBook);
    setSelectedNote(null);
    setSearchQuery("");
  }

  function handleBookClick(book: Book) {
    setSelectedBook(book);
    setSelectedNote(null);
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* Pane 1 — カテゴリ */}
      <div className="w-52 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Library</p>
          <h1 className="text-base font-bold text-gray-800 mt-0.5">読書知識</h1>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-2 py-3 space-y-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{cat.name}</span>
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0 ${
                    selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {cat.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-[11px] text-gray-400">
            {categories.reduce((a, c) => a + c.count, 0)} 冊
          </p>
        </div>
      </div>

      {/* Pane 2 — 本一覧 */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Books</p>
            <h2 className="text-base font-bold text-gray-800 mt-0.5">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "カテゴリを選択"}
            </h2>
          </div>
          {/* ① 本を追加ボタン */}
          <button
            onClick={() => setShowAddBook(true)}
            className="w-7 h-7 rounded-full bg-gray-900 text-white text-lg flex items-center justify-center hover:bg-gray-700 transition-colors flex-shrink-0"
            title="本を追加"
          >
            +
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-2 py-3 space-y-0.5">
            {currentBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => handleBookClick(book)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                  selectedBook?.id === book.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{book.title}</p>
                <p className="text-[11px] text-gray-500 mt-1">{book.author}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <StarRating rating={book.rating} />
                  <span className="text-[10px] text-gray-400">{book.readAt}</span>
                </div>
              </button>
            ))}
            {currentBooks.length === 0 && (
              <p className="text-sm text-gray-400 px-3 py-4">本がありません</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Pane 3 — 本の詳細 */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Detail</p>
          <h2 className="text-base font-bold text-gray-800 mt-0.5">本の詳細</h2>
        </div>
        <ScrollArea className="flex-1">
          {selectedBook ? (
            <div className="px-4 py-4">
              <div className="flex gap-4 mb-5">
                <BookCover title={selectedBook.title} author={selectedBook.author} categoryId={selectedCategory} />
                <div className="flex flex-col justify-center min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{selectedBook.title}</h3>
                  <p className="text-[12px] text-gray-500 mt-0.5">{selectedBook.author}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StarRating rating={selectedBook.rating} />
                    <span className="text-[11px] text-gray-400">読了 {selectedBook.readAt}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">ひと言まとめ</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedBook.summary}</p>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">抜き書き・活用ログ</p>
                <Badge variant="secondary" className="text-[10px]">
                  {currentNotes.length} 件
                </Badge>
              </div>
              <div className="mt-2 space-y-2">
                {currentNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                      selectedNote?.id === note.id
                        ? "bg-amber-50 border-amber-200"
                        : "bg-gray-50 border-gray-100 hover:bg-amber-50/50"
                    }`}
                  >
                    <p className="text-[12px] text-gray-700 leading-snug line-clamp-2">{note.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{note.usedAt} に活用</p>
                  </button>
                ))}
                {currentNotes.length === 0 && (
                  <p className="text-[12px] text-gray-400 py-2">まだメモがありません</p>
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

      {/* Pane 4 — 抜き書き・活用ログ */}
      <div className="flex-1 bg-white flex flex-col min-w-0">
        {/* ③ 検索バー */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="抜き書きをキーワード検索…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedNote(null); }}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-700"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
            )}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Knowledge</p>
          </div>
        </div>

        {/* 検索結果 */}
        {searchQuery && (
          <div className="border-b border-gray-100 bg-gray-50">
            <div className="px-5 py-2">
              <p className="text-[11px] text-gray-500 mb-2">{searchResults.length} 件ヒット</p>
              {searchResults.length > 0 ? (
                <div className="space-y-1.5 pb-2">
                  {searchResults.map(n => {
                    const book = allBooks.find(b => b.id === n.bookId);
                    return (
                      <button
                        key={n.id}
                        onClick={() => { setSearchQuery(""); setSelectedNote(n); const b = allBooks.find(b => b.id === n.bookId); if (b) setSelectedBook(b); }}
                        className="w-full text-left bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-amber-300 transition-colors"
                      >
                        <p className="text-[12px] font-medium text-gray-800 line-clamp-1">{n.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{book?.title} · {n.usedAt}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[12px] text-gray-400 pb-2">該当する抜き書きがありません</p>
              )}
            </div>
          </div>
        )}

        {selectedNote && !searchQuery ? (
          <ScrollArea className="flex-1">
            <div className="px-5 py-5 max-w-2xl">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-5">
                <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-widest mb-2">抜き書き</p>
                {editingNoteId === selectedNote.id ? (
                  <textarea
                    className="w-full text-sm text-gray-800 font-medium leading-relaxed bg-transparent resize-none outline-none border-b border-amber-300 pb-1"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onBlur={() => setEditingNoteId(null)}
                    autoFocus
                    rows={3}
                  />
                ) : (
                  <p
                    className="text-sm text-gray-800 font-medium leading-relaxed cursor-text hover:bg-amber-100/50 rounded px-1 -mx-1 transition-colors"
                    onClick={() => { setEditingNoteId(selectedNote.id); setNewNoteText(selectedNote.text); }}
                    title="クリックで編集"
                  >
                    {selectedNote.text}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">活用ログ</p>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                  <span className="text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                    {selectedNote.usedAt}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed mt-2">{selectedNote.context}</p>
                </div>
              </div>

              <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[11px] font-semibold text-blue-600 mb-1">今日使えそうか？</p>
                <textarea
                  className="w-full text-sm text-gray-700 bg-transparent resize-none outline-none placeholder:text-gray-400"
                  placeholder="今日の仕事・ジャーナリングでどう使えるかをメモする…"
                  rows={3}
                />
              </div>
            </div>
          </ScrollArea>
        ) : !searchQuery ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            {/* ② 今日の1枚 */}
            <div className="w-full max-w-md mb-8">
              <div className="flex items-center gap-2 mb-3 justify-center">
                <span className="text-base">☀️</span>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">今日の1枚</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-left shadow-sm">
                <p className="text-sm font-semibold text-gray-800 leading-relaxed mb-3">
                  &ldquo;{todayNote.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {todayBook && (
                    <BookCover
                      title={todayBook.title}
                      author={todayBook.author}
                      categoryId={todayCategory ? Number(todayCategory) : null}
                    />
                  )}
                  <div>
                    <p className="text-[12px] font-medium text-gray-700">{todayBook?.title}</p>
                    <p className="text-[11px] text-gray-400">{todayBook?.author}</p>
                    <button
                      onClick={() => setSelectedNote(todayNote)}
                      className="mt-1.5 text-[11px] text-amber-600 font-semibold hover:underline"
                    >
                      活用ログを見る →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-xs">
              <p className="text-[12px] text-gray-400">左から抜き書きを選ぶか、キーワードで検索してください</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* ① 本を追加モーダル */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => { setShowAddBook(false); setIsbnPreview(null); setIsbnInput(""); }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">本を追加</h3>
              <button onClick={() => { setShowAddBook(false); setIsbnPreview(null); setIsbnInput(""); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="mb-4">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">① ISBN で自動入力</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="例：9784822250157"
                  value={isbnInput}
                  onChange={e => setIsbnInput(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
                <button
                  onClick={handleIsbnLookup}
                  disabled={isbnLoading}
                  className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {isbnLoading ? "…" : "検索"}
                </button>
              </div>
              {isbnPreview && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex gap-3 items-start">
                  {isbnPreview.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={isbnPreview.thumbnail} alt={isbnPreview.title} className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{isbnPreview.title}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{isbnPreview.author}</p>
                    {isbnPreview.publisher && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{isbnPreview.publisher}　{isbnPreview.publishedDate}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">② または手動入力</p>
              <input key={`title-${isbnPreview?.title}`} type="text" placeholder="タイトル" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" defaultValue={isbnPreview?.title ?? ""} />
              <input key={`author-${isbnPreview?.author}`} type="text" placeholder="著者" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" defaultValue={isbnPreview?.author ?? ""} />
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 text-gray-700">
                <option value="">カテゴリを選択</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <button className="w-full mt-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors">
              追加する（※現在はサンプル表示）
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

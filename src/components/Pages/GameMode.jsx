import { useState, useMemo, useEffect } from 'react';
import { quizQuestions } from '../../utils/algorithmHelpers';
import { Trophy, Star, RotateCcw, ChevronRight, CheckCircle, XCircle, Gamepad2, Zap } from 'lucide-react';
import { t } from '../../utils/i18n';

const BEST_SCORES_KEY = 'algoviz_best_scores';

function loadBestScores() {
  try {
    return JSON.parse(localStorage.getItem(BEST_SCORES_KEY)) || {};
  } catch {
    return {};
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DIFFICULTY_CONFIG = {
  all:    { color: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
  easy:   { color: 'from-emerald-500 to-teal-600',  bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  medium: { color: 'from-amber-500 to-orange-600',  bg: 'bg-amber-50 dark:bg-amber-950/40' },
  hard:   { color: 'from-rose-500 to-pink-600',     bg: 'bg-rose-50 dark:bg-rose-950/40' },
};

export default function GameMode({ lang = 'tr' }) {
  const [difficulty, setDifficulty] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [bestScores, setBestScores] = useState(loadBestScores);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const pool = quizQuestions[lang] || quizQuestions.tr;

  const questions = useMemo(() => {
    if (!difficulty) return [];
    const filtered = difficulty === 'all' ? pool : pool.filter(q => q.difficulty === difficulty);
    return shuffle(filtered).slice(0, 10);
  }, [difficulty, pool]);

  const currentQ = questions[currentIdx];

  const handleSelect = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    if (optIdx === currentQ.correct) setScore(s => s + 10);
    setAnswers(a => [...a, { correct: optIdx === currentQ.correct }]);
  };

  const handleNext = () => {
    if (currentIdx >= questions.length - 1) setFinished(true);
    else { setCurrentIdx(i => i + 1); setSelected(null); }
  };

  const reset = () => {
    setDifficulty(null); setCurrentIdx(0); setSelected(null);
    setScore(0); setAnswers([]); setFinished(false); setIsNewRecord(false);
  };

  useEffect(() => {
    if (!finished || !difficulty || questions.length === 0) return;
    const pct = Math.round((score / (questions.length * 10)) * 100);
    setBestScores(prev => {
      const existing = prev[difficulty];
      if (existing && existing.pct >= pct) {
        setIsNewRecord(false);
        return prev;
      }
      setIsNewRecord(true);
      const updated = { ...prev, [difficulty]: { pct, score, total: questions.length, date: new Date().toISOString() } };
      localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(updated));
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const difficultyOptions = [
    { key: 'all',    labelKey: 'game.all',    descKey: 'game.allDesc'    },
    { key: 'easy',   labelKey: 'game.easy',   descKey: 'game.easyDesc'   },
    { key: 'medium', labelKey: 'game.medium', descKey: 'game.mediumDesc' },
    { key: 'hard',   labelKey: 'game.hard',   descKey: 'game.hardDesc'   },
  ];

  if (!difficulty) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Gamepad2 size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-2">{t(lang, 'game.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t(lang, 'game.subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {difficultyOptions.map(({ key, labelKey, descKey }) => {
            const conf = DIFFICULTY_CONFIG[key];
            const best = bestScores[key];
            return (
              <button key={key} onClick={() => setDifficulty(key)}
                className={`relative p-6 rounded-2xl border ${conf.bg} border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                {best && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-white/70 dark:bg-gray-900/70 px-2 py-0.5 rounded-full">
                    <Trophy size={10} /> %{best.pct}
                  </span>
                )}
                <div className={`w-10 h-10 bg-gradient-to-br ${conf.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                  <Star size={18} className="text-white" />
                </div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{t(lang, labelKey)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t(lang, descKey)}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / (questions.length * 10)) * 100);
    const correct = answers.filter(a => a.correct).length;
    const title = pct >= 80 ? t(lang, 'game.excellent') : pct >= 60 ? t(lang, 'game.good') : t(lang, 'game.tryMore');
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fade-in">
        <div className={`w-24 h-24 bg-gradient-to-br ${pct >= 70 ? 'from-amber-400 to-yellow-500' : 'from-gray-400 to-gray-500'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
          <Trophy size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2">{t(lang, 'game.done')}</p>
        <p className="text-sm mb-8">
          {isNewRecord ? (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <Trophy size={14} /> {t(lang, 'game.newRecord')}
            </span>
          ) : bestScores[difficulty] ? (
            <span className="text-gray-400 dark:text-gray-500">{t(lang, 'game.best')}: %{bestScores[difficulty].pct}</span>
          ) : null}
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Zap,          label: t(lang, 'game.total'),   value: score,                     color: 'text-indigo-600 dark:text-indigo-400' },
            { icon: CheckCircle,  label: t(lang, 'game.correct'), value: correct,                   color: 'text-emerald-600 dark:text-emerald-400' },
            { icon: XCircle,      label: t(lang, 'game.wrong'),   value: questions.length - correct, color: 'text-rose-600 dark:text-rose-400' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card text-center">
                <Icon size={24} className={`${s.color} mx-auto mb-2`} />
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            );
          })}
        </div>
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>{t(lang, 'game.success')}</span><span>%{pct}</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${pct >= 70 ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-orange-500'} rounded-full transition-all duration-1000`}
              style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button onClick={reset} className="btn-primary flex items-center gap-2 mx-auto">
          <RotateCcw size={16} /> {t(lang, 'game.replay')}
        </button>
      </div>
    );
  }

  const conf = DIFFICULTY_CONFIG[difficulty];
  const diffLabel = { easy: '🟢', medium: '🟡', hard: '🔴' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{currentIdx + 1} / {questions.length}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${conf.color} text-white font-medium`}>{t(lang, `game.${difficulty}`)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap size={16} className="text-amber-500" />
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{score}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{t(lang, 'game.score')}</span>
        </div>
      </div>

      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${conf.color} rounded-full transition-all duration-300`}
          style={{ width: `${(currentIdx / questions.length) * 100}%` }} />
      </div>

      <div className="card mb-4">
        <div className="flex items-start gap-2 mb-1">
          <span className="text-xs text-gray-400">{diffLabel[currentQ.difficulty] || ''} {currentQ.difficulty}</span>
        </div>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">{currentQ.question}</p>
      </div>

      <div className="space-y-3 mb-5">
        {currentQ.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === currentQ.correct;
          let cls = 'p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 w-full ';
          if (selected === null) {
            cls += 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-gray-700 dark:text-gray-200';
          } else if (isCorrect) {
            cls += 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200';
          } else if (isSelected) {
            cls += 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
          } else {
            cls += 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 opacity-50 text-gray-500 dark:text-gray-400';
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} disabled={selected !== null} className={cls}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                    selected === null ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' :
                    isCorrect ? 'bg-emerald-500 text-white' : isSelected ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>{['A','B','C','D'][i]}</span>
                  <span>{opt}</span>
                </div>
                {selected !== null && (isCorrect ? <CheckCircle size={18} className="text-emerald-500 shrink-0" /> : isSelected ? <XCircle size={18} className="text-rose-500 shrink-0" /> : null)}
              </div>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className={`p-4 rounded-xl mb-5 animate-fade-in border ${selected === currentQ.correct ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'}`}>
          <p className="text-sm font-medium mb-1">{selected === currentQ.correct ? t(lang, 'game.correct_ans') : t(lang, 'game.wrong_ans')}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{currentQ.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button onClick={handleNext} className="btn-primary w-full justify-center animate-fade-in">
          {currentIdx >= questions.length - 1 ? t(lang, 'game.finish') : t(lang, 'game.next')}
          <ChevronRight size={18} />
        </button>
      )}

      <button onClick={reset} className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors py-2">
        {t(lang, 'game.quit')}
      </button>
    </div>
  );
}

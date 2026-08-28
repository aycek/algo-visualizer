import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap } from 'lucide-react';
import { t } from '../../utils/i18n';

const speeds = [
  { label: '0.5x', value: 1200 },
  { label: '1x',   value: 600  },
  { label: '2x',   value: 300  },
  { label: '4x',   value: 150  },
];

export default function ControlPanel({ state, lang = 'tr' }) {
  const { isPlaying, isFirst, isLast, progress, totalSteps, currentStep, speed,
          play, pause, next, prev, reset, setSpeed } = state;

  const playLabel = isPlaying
    ? t(lang, 'control.pause')
    : isLast
      ? t(lang, 'control.replay')
      : t(lang, 'control.play');

  return (
    <div className="card space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{t(lang, 'control.step')} {currentStep + 1} / {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={reset} className="btn-secondary p-2" title={t(lang, 'control.reset')}>
          <RotateCcw size={18} />
        </button>
        <button onClick={prev} disabled={isFirst} className="btn-secondary p-2" title={t(lang, 'control.prev')}>
          <SkipBack size={18} />
        </button>
        <button
          onClick={isPlaying ? pause : play}
          className="btn-primary px-6 py-2"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {playLabel}
        </button>
        <button onClick={next} disabled={isLast} className="btn-secondary p-2" title={t(lang, 'control.next')}>
          <SkipForward size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 justify-center">
        <Zap size={14} className="text-amber-500" />
        <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">{t(lang, 'control.speed')}:</span>
        {speeds.map(s => (
          <button
            key={s.value}
            onClick={() => setSpeed(s.value)}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              speed === s.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

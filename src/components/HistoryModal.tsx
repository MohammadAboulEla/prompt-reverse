import React from 'react';
import { History, X, Trash2, ArrowUpRight, Copy, Check } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onCopyText: (text: string, label: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  onDeleteHistoryItem,
  onCopyText,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyText(item.result.exactPrompt, item.result.title || 'Master Prompt');
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Extraction History</h2>
            <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
              {history.length} saved
            </span>
          </div>

          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button onClick={onClose} className="text-neutral-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-500">
              <History className="h-10 w-10 stroke-[1.5] text-neutral-600 mb-2" />
              <p className="text-sm font-medium text-neutral-300">No prompt extractions yet</p>
              <p className="mt-1 text-xs text-neutral-500">
                Uploaded images and extracted prompts are automatically saved here for quick recall.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="group flex cursor-pointer items-start gap-4 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 transition-all hover:border-neutral-700 hover:bg-neutral-800/40"
              >
                {/* Thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
                  <img
                    src={item.imageThumbnail}
                    alt={item.fileName}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 font-mono text-[9px] text-amber-300">
                    {item.aspectRatio}
                  </span>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate text-xs font-semibold text-white group-hover:text-amber-300">
                      {item.result.title || item.fileName}
                    </h3>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(item.timestamp).toLocaleDateString()} ·{' '}
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="mt-1.5 line-clamp-2 text-xs text-neutral-400 font-mono">
                    {item.result.exactPrompt}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-amber-400/90 flex items-center gap-1 group-hover:underline">
                      Load in workspace <ArrowUpRight className="h-3 w-3" />
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCopy(item, e)}
                        className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300 hover:bg-neutral-700 hover:text-white"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="h-3 w-3 text-amber-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistoryItem(item.id);
                        }}
                        className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-red-400"
                        title="Delete item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

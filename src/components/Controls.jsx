import React from 'react';
import { Volume2, Mic, ChevronRight, RefreshCw } from 'lucide-react';

const Controls = ({ onPlay, onRecord, onNext, isRecording, isPlaying, onPlayRecording, hasRecording }) => {
    return (
        <div className="flex items-center justify-center gap-6">
            <button
                onClick={onPlay}
                disabled={isPlaying || isRecording}
                className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95"
                title="Listen"
            >
                <Volume2 size={32} />
            </button>

            <button
                onClick={onRecord}
                disabled={isPlaying}
                className={`p-6 rounded-full text-white transition-all shadow-lg active:scale-95 ${isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50'
                    : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30'
                    }`}
                title={isRecording ? "Stop Recording" : "Record"}
            >
                <Mic size={40} />
            </button>

            <button
                onClick={onPlayRecording}
                disabled={!hasRecording || isPlaying || isRecording}
                className="p-4 rounded-full bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/30 active:scale-95"
                title="Play My Recording"
            >
                <RefreshCw size={32} />
            </button>

            <button
                onClick={onNext}
                disabled={isRecording}
                className="p-4 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-emerald-500/30 active:scale-95"
                title="Next Sentence"
            >
                <ChevronRight size={32} />
            </button>
        </div>
    );
};

export default Controls;

import React from 'react';

const ScoreBoard = ({ score, feedback }) => {
    if (score === null) return null;

    let colorClass = 'text-gray-500';
    let message = '';

    if (score >= 90) {
        colorClass = 'text-green-500';
        message = 'Perfect! 🌟';
    } else if (score >= 70) {
        colorClass = 'text-blue-500';
        message = 'Great job! 👍';
    } else if (score >= 50) {
        colorClass = 'text-yellow-500';
        message = 'Good try! 🙂';
    } else {
        colorClass = 'text-red-500';
        message = 'Keep practicing! 💪';
    }

    return (
        <div className="mt-8 text-center animate-fade-in-up">
            <div className={`text-6xl font-black mb-2 ${colorClass} drop-shadow-sm`}>
                {score}
            </div>
            <div className="text-xl font-medium text-gray-600">
                {message}
            </div>
            {feedback && (
                <div className="mt-4 p-4 bg-white/50 rounded-xl border border-gray-200 text-gray-700 max-w-md mx-auto">
                    <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">You said:</p>
                    <p className="text-lg">{feedback}</p>
                </div>
            )}
        </div>
    );
};

export default ScoreBoard;

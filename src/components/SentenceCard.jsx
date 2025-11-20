import React from 'react';

const SentenceCard = ({ sentence }) => {
    if (!sentence) return null;

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 w-full max-w-2xl text-center border border-white/50 transition-all duration-500 hover:shadow-2xl">
            <h2 className="text-5xl font-bold text-gray-800 mb-4 tracking-wide leading-tight">
                {sentence.text}
            </h2>
            <div className="text-xl text-gray-500 font-medium mb-2">
                {sentence.jyutping}
            </div>
            <div className="text-lg text-gray-400 italic">
                {sentence.meaning}
            </div>
        </div>
    );
};

export default SentenceCard;

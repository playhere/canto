import React, { useState, useEffect, useRef } from 'react';
import { getRandomSentence } from './data/sentences';
import { speak, listen, calculateScore } from './services/speech';
import SentenceCard from './components/SentenceCard';
import Controls from './components/Controls';
import ScoreBoard from './components/ScoreBoard';

function App() {
    const [currentSentence, setCurrentSentence] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        loadNewSentence();
    }, []);

    const loadNewSentence = () => {
        setCurrentSentence(getRandomSentence());
        setScore(null);
        setFeedback('');
        setAudioBlob(null);
        setIsRecording(false);
        setIsPlaying(false);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handlePlay = () => {
        if (!currentSentence) return;
        setIsPlaying(true);
        speak(currentSentence.text);
        // Reset playing state after a rough estimate or use an event listener if possible
        // SpeechSynthesis doesn't easily give onend for all browsers reliably without wrapper, 
        // but let's assume a timeout for UI feedback or just toggle it back quickly.
        // Better: pass onEnd to speak if we modify it, but for now let's just set it to false after a timeout based on length.
        setTimeout(() => setIsPlaying(false), currentSentence.text.length * 300 + 1000);
    };

    const handlePlayRecording = () => {
        if (!audioBlob) return;
        setIsPlaying(true);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => {
            setIsPlaying(false);
            URL.revokeObjectURL(audioUrl);
        };
        audio.play();
    };

    const handleRecord = () => {
        if (isRecording) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsRecording(false);
            return;
        }

        setIsRecording(true);
        setScore(null);
        setFeedback('');
        setAudioBlob(null);

        recognitionRef.current = listen(
            (transcript) => {
                setFeedback(transcript);
                const calculatedScore = calculateScore(currentSentence.text, transcript);
                setScore(calculatedScore);
            },
            () => {
                setIsRecording(false);
            },
            (blob) => {
                setAudioBlob(blob);
            }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-3xl flex flex-col items-center">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                        Cantonese Master
                    </h1>
                    <p className="text-gray-500 font-medium">Practice your pronunciation</p>
                </header>

                <main className="w-full flex flex-col items-center">
                    <SentenceCard sentence={currentSentence} />

                    <Controls
                        onPlay={handlePlay}
                        onRecord={handleRecord}
                        onNext={loadNewSentence}
                        isRecording={isRecording}
                        isPlaying={isPlaying}
                        onPlayRecording={handlePlayRecording}
                        hasRecording={!!audioBlob}
                    />

                    <ScoreBoard score={score} feedback={feedback} />
                </main>

                <footer className="mt-16 text-gray-400 text-sm">
                    © 2024 AntiGravity Canto
                </footer>
            </div>
        </div>
    );
}

export default App;

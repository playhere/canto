export const speak = (text, onEnd) => {
    if (!window.speechSynthesis) {
        console.error("Speech Synthesis not supported");
        if (onEnd) onEnd();
        return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-HK'; // Cantonese
    utterance.rate = 0.9; // Slightly slower for learning

    // Find a Cantonese voice if available
    const voices = window.speechSynthesis.getVoices();
    const cantoVoice = voices.find(v => v.lang === 'zh-HK' || v.name.includes('Cantonese') || v.name.includes('Hong Kong'));
    if (cantoVoice) {
        utterance.voice = cantoVoice;
    }

    utterance.onend = () => {
        if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
};

export const listen = (onResult, onEnd, onAudioData) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser. Please use Chrome or Edge.");
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-HK';
    recognition.continuous = false;
    recognition.interimResults = false;

    let mediaRecorder = null;
    let audioChunks = [];

    // Request microphone access for MediaRecorder
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                if (onAudioData) onAudioData(audioBlob);

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
        })
        .catch(err => console.error("Error accessing microphone:", err));

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
    };

    recognition.onend = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        if (onEnd) onEnd();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        if (onEnd) onEnd();
    };

    recognition.start();
    return recognition;
};

export const calculateScore = (target, transcript) => {
    if (!target || !transcript) return 0;

    // Simple Levenshtein distance or similarity ratio could be used.
    // For now, let's use a simple character match ratio.
    const cleanTarget = target.replace(/[^\u4e00-\u9fa5]/g, ''); // Keep only Chinese characters
    const cleanTranscript = transcript.replace(/[^\u4e00-\u9fa5]/g, '');

    if (cleanTarget === cleanTranscript) return 100;

    let matchCount = 0;
    const targetChars = cleanTarget.split('');
    const transcriptChars = cleanTranscript.split('');

    // Basic overlap count (not order sensitive, which is a simplification)
    // A better approach is Levenshtein, but let's implement a simple one first.

    // Let's do a simple set intersection for now, or better, a sequence match.
    // Actually, let's implement a basic Levenshtein distance for better accuracy.

    const distance = levenshtein(cleanTarget, cleanTranscript);
    const maxLength = Math.max(cleanTarget.length, cleanTranscript.length);
    if (maxLength === 0) return 0;

    const similarity = (maxLength - distance) / maxLength;
    return Math.round(similarity * 100);
};

// Levenshtein distance implementation
function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

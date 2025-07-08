let currentQuote = '';
let apiKey = 'AIzaSyAynOvXpKEvEXX-XGEAdyvUHWtUp9vIq0s'; 

// Load page
window.addEventListener('load', () => {
    showStatus('Generator siap digunakan! Masukkan topik dan generate quote.', 'info');
});

async function generateQuote() {
    if (!apiKey || apiKey === 'GEMINI_API_KEY') {
        showStatus('API Key belum dikonfigurasi! Silakan masukkan API Key di file JavaScript.', 'error');
        return;
    }

    const topic = document.getElementById('topicInput').value.trim() || 'motivasi';
    const generateBtn = document.getElementById('generateBtn');
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.classList.add('loading');
    generateBtn.textContent = '';
    quoteDisplay.innerHTML = '<div class="placeholder-text"> ⏳ Sedang menghasilkan quote terbaik untuk Anda...</div>';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Buatkan satu quote inspiratif dalam bahasa Indonesia tentang "${topic}". Quote harus:
- Singkat dan bermakna (maksimal 2-3 kalimat)
- Inspiratif dan memotivasi
- Mudah dipahami
- Tidak menggunakan tanda kutip
- Fokus pada tema: ${topic}

Berikan hanya quote-nya saja, tanpa penjelasan tambahan.`
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            currentQuote = data.candidates[0].content.parts[0].text.trim();
            displayQuote(currentQuote);
            showStatus('Quote berhasil dibuat!', 'success');
        } else {
            throw new Error('Format response tidak valid');
        }

    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'Terjadi kesalahan saat menggenerate quote. ';

        if (error.message.includes('401')) {
            errorMessage += 'API Key tidak valid atau sudah expired.';
        } else if (error.message.includes('403')) {
            errorMessage += 'API Key tidak memiliki akses ke Gemini API.';
        } else if (error.message.includes('429')) {
            errorMessage += 'Terlalu banyak request. Coba lagi nanti.';
        } else {
            errorMessage += 'Periksa koneksi internet dan API Key Anda.';
        }

        showStatus(errorMessage, 'error');
        quoteDisplay.innerHTML = '<div class="placeholder-text">Gagal membuat quote. Silakan coba lagi.</div>';
    } finally {
        generateBtn.disabled = false;
        generateBtn.classList.remove('loading');
        generateBtn.textContent = 'Generate Quote';
    }
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = '//pl27115892.profitableratecpm.com/48/9f/8a/489f8ac87e99751590d1ae84853f8b62.js';
    document.body.appendChild(adScript);
}

function displayQuote(quote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const actions = document.getElementById('actions');

    quoteDisplay.innerHTML = `<div class="quote-text">${quote}</div>`;
    quoteDisplay.classList.add('has-quote');
    actions.style.display = 'flex';
}

function copyQuote() {
    if (!currentQuote) return;

    navigator.clipboard.writeText(currentQuote).then(() => {
        showStatus('Quote berhasil dicopy ke clipboard!', 'success');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = currentQuote;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showStatus('Quote berhasil dicopy!', 'success');
    });
}

function shareQuote() {
    if (!currentQuote) return;

    if (navigator.share) {
        navigator.share({
            title: 'Quote Inspiratif',
            text: currentQuote,
            url: window.location.href
        }).catch(console.error);
    } else {
        copyQuote();
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = `status-message status-${type}`;
    statusDiv.style.display = 'block';

    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 4000);
}

// Allow Enter key to generate quote
document.getElementById('topicInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateQuote();
    }
});

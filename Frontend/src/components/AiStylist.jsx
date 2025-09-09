import React, { useRef, useState } from 'react';
import { FaMagic } from 'react-icons/fa';

export default function AiStylist() {
  const [open, setOpen] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [outfit, setOutfit] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [outfits, setOutfits] = useState([]);
  
  const [isListening, setIsListening] = useState(false);
  const [listeningField, setListeningField] = useState(null);
  const recognitionRef = useRef(null);

  const ask = async () => {
    if (!occasion && !outfit) return;
    setLoading(true);
    try {
      const res = await fetch('https://shreepratha.onrender.com/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, outfit })
      });
      const data = await res.json();
      setSuggestions(data?.suggestions || ['No suggestions found.']);
      setOutfits(data?.outfits || []);
    } catch (e) {
      setSuggestions(['Sorry, I could not fetch suggestions right now.']);
    } finally {
      setLoading(false);
    }
  };

  

  // Speech recognition
  let RecognitionCtor;
  if (typeof window !== 'undefined') {
    RecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  }

  const startListening = (field) => {
    if (!RecognitionCtor) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    try {
      const recognition = new RecognitionCtor();
      recognitionRef.current = recognition;
      try { recognition.lang = 'en-IN'; } catch { recognition.lang = 'en-US'; }
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      setIsListening(true);
      setListeningField(field);
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (field === 'occasion') setOccasion((prev) => (prev ? prev + ' ' : '') + transcript);
        if (field === 'outfit') setOutfit((prev) => (prev ? prev + ' ' : '') + transcript);
      };
      recognition.onerror = () => {
        setIsListening(false);
        setListeningField(null);
        recognitionRef.current = null;
      };
      recognition.onend = () => {
        setIsListening(false);
        setListeningField(null);
        recognitionRef.current = null;
      };
      recognition.start();
    } catch (e) {
      setIsListening(false);
      setListeningField(null);
      recognitionRef.current = null;
    }
  };

  const stopListening = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    } catch {}
    setIsListening(false);
    setListeningField(null);
  };

  return (
    <>
      {/* Label */}
      <div className="position-fixed d-none d-sm-block" style={{ right: '86px', bottom: '28px', zIndex: 1050 }}>
        <div style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '6px 12px', borderRadius: '12px', fontSize: '0.85rem', boxShadow: '0 6px 16px rgba(0,0,0,0.25)' }}>
          AI Stylist
        </div>
      </div>

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="position-fixed d-flex align-items-center justify-content-center"
        style={{ right: '20px', bottom: '20px', zIndex: 1050, width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #c02739, #6d214f)', color: '#fff', boxShadow: '0 8px 20px rgba(0,0,0,0.25)', border: 'none' }}
        aria-label="Open AI Stylist"
      >
        <FaMagic />
      </button>

      {open && (
        <div className="position-fixed" style={{ right: '20px', bottom: '88px', width: '340px', zIndex: 1050 }}>
          <div className="w-100" style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ background: 'linear-gradient(90deg, #7a1f2a, #3d1f2b, #111111)', color: '#fff' }}>
              <div className="d-flex align-items-center gap-2">
                <FaMagic />
                <strong>AI Stylist</strong>
              </div>
              <button type="button" className="btn-close btn-close-white" onClick={() => setOpen(false)} />
            </div>
            <div className="p-3" style={{ fontSize: '0.95rem' }}>
              <div className="mb-2">
                <label className="form-label d-flex align-items-center justify-content-between">
                  <span>Occasion</span>
                  <div className="d-flex gap-2">
                    {isListening && listeningField === 'occasion' ? (
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={stopListening}>Stop</button>
                    ) : null}
                  </div>
                </label>
                <input type="text" className="form-control" placeholder="e.g., Wedding, Party, Festive" value={occasion} onChange={(e) => setOccasion(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label d-flex align-items-center justify-content-between">
                  <span>Outfit</span>
                  <div className="d-flex gap-2">
                    {isListening && listeningField === 'outfit' ? (
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={stopListening}>Stop</button>
                    ) : null}
                  </div>
                </label>
                <input type="text" className="form-control" placeholder="e.g., Saree, Gown, Kurti" value={outfit} onChange={(e) => setOutfit(e.target.value)} />
              </div>
              <button type="button" className="btn w-100" onClick={ask} disabled={loading} style={{ background: 'linear-gradient(135deg, #c02739, #6d214f)', color: '#fff', border: 'none' }}>
                {loading ? 'Thinking…' : 'Get Suggestions'}
              </button>
              
              {suggestions.length > 0 && (
                <ul className="mt-3 small mb-0">
                  {suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
              {outfits.length > 0 && (
                <div className="mt-3">
                  <div className="fw-semibold mb-1">Suggested Outfits</div>
                  <ul className="small mb-0">
                    {outfits.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}



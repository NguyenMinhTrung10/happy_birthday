import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Heart, Gift, Music, Volume2, VolumeX, Sparkles, ArrowDown } from 'lucide-react';
import Fireworks from './Fireworks.jsx';
import './styles.css';

const asset = (file) => `${import.meta.env.BASE_URL}${file}`;

const gallery = [
  { file: 'her-3.jpeg', tilt: 'tilt-l', caption: 'Xinh quá đi 🌷' },
  { file: 'her-4.jpeg', tilt: 'tilt-r', caption: 'Giữ mãi nụ cười này nhé 🤍' },
  { file: 'her-5.jpeg', tilt: 'tilt-s', caption: 'Mong em luôn bình an 🙏' },
  { file: 'her-6.jpeg', tilt: 'tilt-x', caption: 'Nắng, biển và em 🌊' },
];

const wish = `Chúc em sinh nhật thật vui vẻ và luôn giữ nụ cười xinh xắn ấy nhé.
Tuổi mới mong em sẽ luôn bình an, hạnh phúc, gặp thật nhiều điều may mắn và những người thật lòng thương em.

Anh không biết món quà này có đủ đặc biệt không, nhưng anh đã dành một chút tâm tư để làm nó cho em.
Hy vọng hôm nay của em thật đẹp — và những ngày sau cũng vậy. ❤️`;

function Hearts() {
  const items = useMemo(() => Array.from({ length: 22 }, () => ({
    '--left': `${Math.random() * 100}%`,
    '--delay': `${Math.random() * 8}s`,
    '--duration': `${6 + Math.random() * 6}s`,
    '--size': `${12 + Math.random() * 20}px`,
  })), []);
  return <div className="hearts">{items.map((x, i) => <Heart key={i} style={x} fill="currentColor" />)}</div>;
}


function Confetti({ active }) {
  const pieces = useMemo(() => Array.from({ length: 90 }, () => ({
    '--left': `${Math.random() * 100}%`,
    '--delay': `${Math.random() * 1.5}s`,
    '--duration': `${2 + Math.random() * 2}s`,
    '--rotate': `${Math.random() * 360}deg`,
    '--i': Math.round(Math.random() * 120),
  })), []);
  if (!active) return null;
  return <div className="confetti">{pieces.map((x, i) => <i key={i} style={x} />)}</div>;
}

function App() {
  const [opened, setOpened] = useState(false);
  const [letter, setLetter] = useState(false);
  const [muted, setMuted] = useState(true);
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    document.body.classList.toggle('opened', opened);
  }, [opened]);

  return (
    <main>
      <div className="ambient a1" />
      <div className="ambient a2" />
      <Hearts />
      <Confetti active={opened} />
      <Fireworks active={opened} />

      <button className="sound" onClick={() => setMuted(!muted)} aria-label="Âm thanh">
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {!opened ? (
        <section className="hero">
          <div className="tiny"><Sparkles size={15} /> A little surprise for you <Sparkles size={15} /></div>
          <div className="gift-wrap">
            <div className="glow" />
            <div className="gift" onClick={() => setOpened(true)}>
              <div className="lid"><span /></div>
              <div className="box"><b /></div>
              <div className="ribbon" />
            </div>
          </div>
          <h1>Có một món quà<br /><em>dành cho em...</em></h1>
          <p>Nhấn vào hộp quà nhé 🎁</p>
          <button className="primary" onClick={() => setOpened(true)}>
            <Gift size={19} /> Mở quà
          </button>
        </section>
      ) : (
        <section className="birthday">
          <div className="badge"><Sparkles size={16} /> TODAY IS YOUR DAY <Sparkles size={16} /></div>
          <h2>Happy Birthday,</h2>
          <h3>Em <Heart className="name-heart" fill="currentColor" strokeWidth={0} /></h3>
          <p className="lead">Chúc mừng sinh nhật cô gái đặc biệt nhất hôm nay.</p>

          <div className="photo-card">
            <div className="photo-glow" />
            <div className="photo-frame" onClick={() => setZoom(asset('her-1.jpeg'))}>
              <img src={asset('her-1.jpeg')} alt="Ảnh kỷ niệm" />
              <div className="photo-caption">Một cô gái rất đặc biệt ✨</div>
            </div>
            <div className="mini-photo" onClick={() => setZoom(asset('her-2.jpeg'))}>
              <img src={asset('her-2.jpeg')} alt="Kỷ niệm" />
            </div>
          </div>

          <div className="gallery">
            {gallery.map(({ file, tilt, caption }) => (
              <figure key={file} className={`polaroid ${tilt}`} onClick={() => setZoom(asset(file))}>
                <img src={asset(file)} alt="Kỷ niệm" loading="lazy" />
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="cake">
            <div className="flame" />
            <div className="candle" />
            <div className="cake-top">♡</div>
            <div className="cake-body"><span>HAPPY</span><strong>BIRTHDAY</strong></div>
          </div>

          <button className="letter-btn" onClick={() => setLetter(true)}>
            <Heart size={18} fill="currentColor" /> Có một điều anh muốn nói...
          </button>

          <div className="scroll"><ArrowDown size={16} /> kéo xuống để xem thêm</div>

          <footer>
            Made with <Heart size={14} fill="currentColor" /> just for you
          </footer>
        </section>
      )}
      {zoom && (
        <div className="zoom-overlay" onClick={() => setZoom(null)}>
          <button className="close" onClick={() => setZoom(null)} aria-label="Đóng ảnh">×</button>
          <img src={zoom} alt="Ảnh phóng to" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {letter && (
        <div className="letter-overlay" onClick={() => setLetter(false)}>
          <article className="letter" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setLetter(false)} aria-label="Đóng thư">×</button>
            <div className="envelope-icon">💌</div>
            <h4>Gửi em,</h4>
            <p>{wish}</p>
            <div className="signature">— Người đang thích em ❤️</div>
          </article>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

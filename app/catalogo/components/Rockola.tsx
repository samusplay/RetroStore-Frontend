'use client';

import { Disc3, Play, Tv2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';

interface RockolaProps {
  albumName: string;
  imageUrl: string;
  youtubeUrl?: string | null;
}

// ─── YouTube helpers ───────────────────────────────────────────────────────────
const extractYouTubeId = (url?: string | null): string | null => {
  if (!url) return null;
  const m = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return m && m[2].length === 11 ? m[2] : null;
};

// Themes keyed by common words in track/artist names
// Each theme has: gradient colors for the section bg, particle emoji, label
const THEMES: { keywords: string[]; colors: [string, string, string]; particle: string; label: string }[] = [
  { keywords: ['thriller', 'horror', 'dead', 'ghost', 'monster', 'nightmare', 'zombie', 'haunted', 'fear', 'dark', 'night'], colors: ['#1a0a00', '#3d1200', '#6b2100'], particle: '💀', label: 'TERROR_MODE' },
  { keywords: ['love', 'heart', 'kiss', 'romance', 'baby', 'girl', 'boy', 'forever', 'dream', 'cherish'], colors: ['#1a0010', '#3d0030', '#800060'], particle: '🌸', label: 'LOVE_MODE' },
  { keywords: ['fire', 'burn', 'hot', 'heat', 'flame', 'inferno', 'rage', 'wild'], colors: ['#1a0500', '#3d1000', '#8b2500'], particle: '🔥', label: 'FIRE_MODE' },
  { keywords: ['sky', 'fly', 'heaven', 'cloud', 'air', 'wind', 'free', 'soar', 'wings', 'angel'], colors: ['#00101a', '#002a40', '#004d7a'], particle: '⭐', label: 'SKY_MODE' },
  { keywords: ['dance', 'groove', 'move', 'party', 'floor', 'beat', 'rhythm', 'boogie', 'funk'], colors: ['#0d001a', '#1a003d', '#2d0066'], particle: '✨', label: 'DANCE_MODE' },
  { keywords: ['rain', 'storm', 'thunder', 'lightning', 'flood', 'wave', 'ocean', 'sea', 'water'], colors: ['#000d1a', '#001a33', '#00264d'], particle: '⚡', label: 'STORM_MODE' },
  { keywords: ['gold', 'money', 'rich', 'king', 'queen', 'crown', 'diamond', 'luxury', 'power'], colors: ['#1a1400', '#3d3000', '#665000'], particle: '👑', label: 'ROYAL_MODE' },
  { keywords: ['rock', 'metal', 'punk', 'rebel', 'fight', 'war', 'battle', 'rebel', 'chaos'], colors: ['#0a0a0a', '#1a1a1a', '#2d2d2d'], particle: '⚡', label: 'ROCK_MODE' },
];
const DEFAULT_THEME = { colors: ['#020408', '#040d12', '#061218'] as [string, string, string], particle: '🎵', label: 'AUDIO_MODE' };

function getTheme(text: string) {
  const lower = text.toLowerCase();
  for (const theme of THEMES) {
    if (theme.keywords.some(k => lower.includes(k))) return theme;
  }
  return DEFAULT_THEME;
}

// ─── Floating Particle ─────────────────────────────────────────────────────────
function Particle({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <span className="absolute select-none pointer-events-none text-2xl animate-float" style={style}>
      {emoji}
    </span>
  );
}

// ─── Vinyl visual ──────────────────────────────────────────────────────────────
function VinylDisc({ imageUrl, albumName, isSpinning }: { imageUrl: string; albumName: string; isSpinning: boolean }) {
  return (
    <div className="relative w-56 h-56 flex items-center justify-center shrink-0 mx-auto">
      {/* Vinyl record */}
      <div
        className="absolute w-full h-full rounded-full border-4 border-[#111] shadow-2xl flex items-center justify-center transition-all duration-700"
        style={{
          background: 'repeating-radial-gradient(circle, #1a1a1a 0%, #0a0a0a 3%, #1a1a1a 4%)',
          animation: isSpinning ? 'spin 4s linear infinite' : 'none',
          filter: isSpinning ? 'drop-shadow(0 0 30px rgba(217,70,239,0.5))' : 'none',
        }}
      >
        <img src={imageUrl} alt={albumName} className="w-1/3 h-1/3 rounded-full object-cover border-2 border-black z-10" />
        <div className="absolute w-3 h-3 bg-[#050508] rounded-full z-20" />
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Rockola({ albumName, imageUrl, youtubeUrl }: RockolaProps) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedAlbum, setResolvedAlbum] = useState('');
  const [albumArtist, setAlbumArtist] = useState('');

  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // View mode per track: 'vinyl' | 'video'
  const [viewMode, setViewMode] = useState<'vinyl' | 'video'>('vinyl');

  // YouTube search result per track
  const [trackVideoId, setTrackVideoId] = useState<string | null>(null);
  const [searchingVideo, setSearchingVideo] = useState(false);

  // YouTube player refs
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Theme
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [particles, setParticles] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  // ─── Fetch tracks from iTunes ────────────────────────────────────────────────
  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setTracks([]);

      // ── Detectar si el nombre es "Artista - Álbum" o solo "Álbum" ──────────────
      const dashIdx = albumName.indexOf(' - ');
      const parsedArtist = dashIdx !== -1 ? albumName.slice(0, dashIdx).trim() : null;
      const parsedAlbum  = dashIdx !== -1 ? albumName.slice(dashIdx + 3).trim() : albumName;

      // Palabras que indican compilación/soundtrack — en estos casos el "artista"
      // antes del guión es en realidad parte del título, no el artista real
      const COMPILATION_KEYWORDS = [
        'soundtrack', 'ost', 'original motion picture', 'banda sonora',
        'compilation', 'greatest hits', 'best of', 'collection', 'anthology',
        'various', 'varios', 'tribute',
      ];
      const isCompilation = COMPILATION_KEYWORDS.some(kw =>
        parsedAlbum.toLowerCase().includes(kw) || albumName.toLowerCase().includes(kw)
      );

      // Si es compilación ignoramos el artista parseado y buscamos el álbum completo
      const effectiveArtist = isCompilation ? null : parsedArtist;
      const effectiveAlbum  = isCompilation ? albumName : parsedAlbum;

      const searchAlbum = async (query: string): Promise<any | null> => {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=8`);
        const data = await res.json();
        if (!data.results?.length) return null;

        if (effectiveArtist) {
          const artistLower = effectiveArtist.toLowerCase();
          const match = data.results.find((r: any) =>
            r.artistName?.toLowerCase().includes(artistLower) ||
            artistLower.includes(r.artistName?.toLowerCase() ?? '')
          );
          if (match) return match;
        }
        // Para compilaciones, preferir el que tenga más tracks (más completo)
        if (isCompilation) {
          return data.results.reduce((best: any, r: any) =>
            (r.trackCount ?? 0) > (best.trackCount ?? 0) ? r : best
          , data.results[0]);
        }
        return data.results[0];
      };

      const loadSongsFromAlbum = async (album: any): Promise<boolean> => {
        const tracksRes = await fetch(`https://itunes.apple.com/lookup?id=${album.collectionId}&entity=song`);
        const tracksData = await tracksRes.json();
        const songs = tracksData.results
          .filter((t: any) => t.wrapperType === 'track' && t.previewUrl)
          .sort((a: any, b: any) => (a.trackNumber ?? 99) - (b.trackNumber ?? 99));
        if (songs.length) {
          setTracks(songs);
          setResolvedAlbum(album.collectionName);
          // Para compilaciones usamos string vacío — YouTube buscará por track+artista del track
          setAlbumArtist(isCompilation ? '' : (album.artistName ?? effectiveArtist ?? ''));
          return true;
        }
        return false;
      };

      try {
        // Intento 1: query principal (artista+álbum o nombre completo si compilación)
        const query1 = effectiveArtist ? `${effectiveArtist} ${effectiveAlbum}` : effectiveAlbum;
        const album1 = await searchAlbum(query1);
        if (album1 && await loadSongsFromAlbum(album1)) { setLoading(false); return; }

        // Intento 2: solo el álbum parseado
        if (effectiveAlbum !== albumName) {
          const album2 = await searchAlbum(effectiveAlbum);
          if (album2 && await loadSongsFromAlbum(album2)) { setLoading(false); return; }
        }

        // Intento 3: fallback canciones directas
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query1)}&entity=song&limit=20`);
        const data = await res.json();
        const seen = new Set<number>();
        setTracks(data.results.filter((t: any) => t.previewUrl && !seen.has(t.trackId) && seen.add(t.trackId)));
        if (effectiveArtist) setAlbumArtist(effectiveArtist);
      } catch { setTracks([]); }
      finally { setLoading(false); }
    };
    if (albumName) fetchTracks();
  }, [albumName]);

  // ─── Search YouTube video — búsqueda en cascada inteligente ────────────────
  const searchYouTubeVideo = useCallback(async (trackName: string, artistName: string, primaryArtist?: string): Promise<string | null> => {
    // Usamos el artista del álbum como fuente de verdad; el del track es fallback
    const artist = primaryArtist || artistName;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!apiKey) return null;

    const scoreResult = (item: any, art: string, track: string): number => {
      const title = (item.snippet?.title ?? '').toLowerCase();
      const channel = (item.snippet?.channelTitle ?? '').toLowerCase();
      const artistLower = art.toLowerCase();
      const trackLower = track.toLowerCase();
      let score = 0;
      if (title.includes(trackLower)) score += 3;
      if (title.includes(artistLower) || channel.includes(artistLower)) score += 3;
      if (title.includes('official') || title.includes('oficial')) score += 2;
      if (title.includes('music video') || title.includes('video oficial')) score += 2;
      if (title.includes('cover') || title.includes('tribute')) score -= 3;
      if (title.includes('lyric') || title.includes('letra')) score -= 1;
      if (title.includes('live') || title.includes('en vivo')) score -= 1;
      return score;
    };

    const search = async (query: string, maxResults = 5) => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${apiKey}`
      );
      const data = await res.json();
      return (data.items ?? []) as any[];
    };

    try {
      setSearchingVideo(true);

      // Intento 1: artista + canción + "video oficial"
      let items = await search(`${artist} ${trackName} video oficial`);

      // Intento 2: ampliar si scores bajos
      if (!items.length || Math.max(...items.map((i: any) => scoreResult(i, artist, trackName))) < 2) {
        const items2 = await search(`${artist} ${trackName} official music video`);
        items = [...items, ...items2];
      }

      // Intento 3: fallback limpio
      if (!items.length) {
        items = await search(`${artist} ${trackName}`);
      }

      if (!items.length) return null;

      const best = items.reduce((prev: any, curr: any) =>
        scoreResult(curr, artist, trackName) > scoreResult(prev, artist, trackName) ? curr : prev
      );

      return best?.id?.videoId ?? null;
    } catch { return null; }
    finally { setSearchingVideo(false); }
  }, []);

  // ─── Generate particles for current theme ────────────────────────────────────
  const spawnParticles = useCallback((emoji: string) => {
    const newParticles = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      style: {
        left: `${Math.random() * 95}%`,
        top: `${Math.random() * 90}%`,
        animationDuration: `${3 + Math.random() * 4}s`,
        animationDelay: `${Math.random() * 3}s`,
        opacity: 0.15 + Math.random() * 0.35,
        fontSize: `${14 + Math.random() * 18}px`,
      } as React.CSSProperties,
    }));
    setParticles(newParticles);
  }, []);

  // ─── Play a track ────────────────────────────────────────────────────────────
  const handlePlayTrack = async (track: any) => {
    if (!audioRef.current) return;

    const isSameTrack = currentTrack?.trackId === track.trackId;

    if (isSameTrack && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (ytPlayer && viewMode === 'video') ytPlayer.pauseVideo();
      return;
    }

    // Switch track
    setCurrentTrack(track);

    // Update theme
    const newTheme = getTheme(`${track.trackName} ${track.artistName}`);
    setTheme(newTheme);
    spawnParticles(newTheme.particle);

    // Reset video state if new track
    if (!isSameTrack) {
      setTrackVideoId(null);
      setViewMode('vinyl');
    }

    // Play audio
    audioRef.current.src = track.previewUrl;
    audioRef.current.play();
    setIsPlaying(true);
  };

  // ─── Toggle vinyl / video ────────────────────────────────────────────────────
  const handleToggleView = async () => {
    if (!currentTrack) return;

    if (viewMode === 'vinyl') {
      // Switch to video — search if not already found
      let vid = trackVideoId;
      if (!vid) {
        vid = await searchYouTubeVideo(currentTrack.trackName, currentTrack.artistName, albumArtist);
        setTrackVideoId(vid);
      }
      setViewMode('video');
      // Pause audio, let video play
      if (audioRef.current) { audioRef.current.pause(); }
    } else {
      // Switch back to vinyl
      setViewMode('vinyl');
      if (ytPlayer) ytPlayer.pauseVideo();
      if (audioRef.current && currentTrack) {
        audioRef.current.src = currentTrack.previewUrl;
        audioRef.current.play();
      }
    }
  };

  const onAudioEnded = () => {
    setIsPlaying(false);
    if (ytPlayer) ytPlayer.pauseVideo();
  };

  // ─── Derived styles ───────────────────────────────────────────────────────────
  const [c0, c1, c2] = theme.colors;
  const sectionBg = `radial-gradient(ellipse at 20% 50%, ${c2}66 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${c1}44 0%, transparent 50%), ${c0}`;

  if (loading) {
    return (
      <div className="w-full mt-12 pt-8 flex justify-center">
        <p className="text-cyan-500 font-mono animate-pulse text-xs tracking-widest">SINTONIZANDO_FRECUENCIAS...</p>
      </div>
    );
  }
  if (!tracks.length) return null;

  return (
    <>
      {/* Floating particle keyframes */}
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0px) scale(1); opacity: var(--op, 0.25); }
          50%  { transform: translateY(-30px) scale(1.15); opacity: calc(var(--op, 0.25) * 1.5); }
          100% { transform: translateY(-60px) scale(0.9); opacity: 0; }
        }
        .animate-float { animation: float-up var(--dur, 4s) ease-in-out var(--delay, 0s) infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scanlines {
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px);
          pointer-events: none;
        }
      `}</style>

      <audio ref={audioRef} onEnded={onAudioEnded} />

      <div
        className="w-full border-t border-cyan-500/20 mt-16 pt-12 pb-16 relative overflow-hidden rounded-2xl transition-all duration-1000"
        style={{ background: sectionBg }}
      >
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000" style={{ background: `${c2}33` }} />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-[100px] transition-all duration-1000" style={{ background: `${c1}22` }} />
        </div>

        {/* Floating particles */}
        {particles.map(p => (
          <Particle key={p.id} emoji={theme.particle} style={{ ...p.style, '--dur': p.style.animationDuration, '--delay': p.style.animationDelay, '--op': p.style.opacity } as any} />
        ))}

        <div className="relative z-10 px-4 md:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-10">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest">
                ROCKOLA <span className="text-fuchsia-400 font-light">SYSTEM</span>
              </h3>
              {currentTrack && (
                <span
                  className="text-[9px] font-mono tracking-widest px-2 py-1 rounded border transition-all duration-700"
                  style={{ borderColor: `${c2}88`, color: c2 === '#0a0a0a' ? '#aaa' : c2, background: `${c2}22` }}
                >
                  {theme.label}
                </span>
              )}
            </div>
            {resolvedAlbum && (
              <p className="text-[10px] text-cyan-600 font-mono tracking-widest uppercase">
                Álbum: <span className="text-cyan-400">{resolvedAlbum}</span>
              </p>
            )}
          </div>

          {/* Main layout — grid cambia según modo */}
          <div className={`grid gap-6 w-full transition-all duration-500 ${
            viewMode === 'video'
              ? 'grid-cols-1 lg:grid-cols-[1fr_320px]'   // video: máximo ancho + tracklist compacto al lado
              : 'grid-cols-1 lg:grid-cols-[auto_1fr] lg:items-center lg:justify-items-center' // vinilo centrado + lista
          }`}>

            {/* ── IZQUIERDA: Vinyl OR Video ── */}
            <div className="flex flex-col items-center gap-4 w-full">

              {/* Toggle button */}
              {currentTrack && (
                <div className="flex justify-start w-full">
                  <button
                    onClick={handleToggleView}
                    disabled={searchingVideo}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/40 text-cyan-400 font-mono text-[10px] uppercase tracking-widest hover:border-fuchsia-400 hover:text-fuchsia-400 transition-all duration-300 bg-black/30 backdrop-blur-sm disabled:opacity-40"
                  >
                    {viewMode === 'vinyl' ? <Tv2 className="w-3.5 h-3.5" /> : <Disc3 className="w-3.5 h-3.5" />}
                    {searchingVideo ? 'BUSCANDO_VIDEO...' : viewMode === 'vinyl' ? 'VER_VIDEO_MUSICAL' : 'VER_VINILO'}
                  </button>
                </div>
              )}

              {/* Vinyl */}
              {viewMode === 'vinyl' && (
                <VinylDisc imageUrl={imageUrl} albumName={albumName} isSpinning={isPlaying} />
              )}

              {/* Video — ocupa todo el ancho de su columna */}
              {viewMode === 'video' && trackVideoId && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-700 shadow-[0_0_60px_rgba(6,182,212,0.35)]">
                  <div className="scanlines absolute inset-0 z-10" />
                  <YouTube
                    videoId={trackVideoId}
                    className="w-full h-full"
                    iframeClassName="w-full h-full pointer-events-none"
                    opts={{
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        modestbranding: 1,
                        rel: 0,
                        disablekb: 1,
                        mute: 0,
                        origin: typeof window !== 'undefined' ? window.location.origin : '',
                      },
                    }}
                    onReady={e => setYtPlayer(e.target)}
                  />
                </div>
              )}

              {/* Video not found */}
              {viewMode === 'video' && !trackVideoId && !searchingVideo && (
                <div className="w-full aspect-video rounded-xl border border-red-500/30 bg-red-900/10 flex flex-col items-center justify-center gap-2">
                  <p className="text-red-400 font-mono text-[10px] uppercase tracking-widest">VIDEO_NO_ENCONTRADO</p>
                  <button onClick={() => setViewMode('vinyl')} className="text-cyan-400 font-mono text-[9px] underline">
                    Volver al vinilo
                  </button>
                </div>
              )}

              {/* Now playing label */}
              {currentTrack && (
                <div className={`${viewMode === 'video' ? 'text-left w-full' : 'text-center'}`}>
                  <p className="text-white font-bold text-sm truncate">{currentTrack.trackName}</p>
                  <p className="text-gray-500 text-[10px] font-mono truncate">{currentTrack.artistName}</p>
                </div>
              )}
            </div>

            {/* ── DERECHA: Tracklist ── */}
            <div className={`bg-black/40 border border-cyan-900/60 rounded-xl p-5 font-mono relative overflow-hidden shadow-2xl backdrop-blur-sm w-full ${
              viewMode === 'vinyl' ? 'max-w-md' : 'h-full'
            }`}>
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(to right, ${c2}, #d946ef)` }} />

              <div className="flex justify-between items-end mb-4">
                <p className="text-[10px] text-cyan-500 tracking-[0.3em] uppercase">&gt; TRACKS</p>
                {isPlaying && viewMode === 'vinyl' && (
                  <span className="text-[9px] text-fuchsia-400 animate-pulse uppercase tracking-widest">Activo</span>
                )}
                {viewMode === 'video' && (
                  <span className="text-[9px] text-cyan-300 animate-pulse uppercase tracking-widest">Video</span>
                )}
              </div>

              {/* Lock overlay */}
              <div className="relative">
                {viewMode === 'video' && (
                  <div className="absolute inset-0 z-20 rounded-lg bg-black/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 cursor-not-allowed">
                    <Tv2 className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <p className="text-cyan-400 font-mono text-[9px] uppercase tracking-widest text-center px-2">
                      Vuelve al vinilo<br/>para cambiar track
                    </p>
                  </div>
                )}
                <div className={`space-y-1 overflow-y-auto pr-1 ${viewMode === 'video' ? 'max-h-[calc(100vh-12rem)]' : 'max-h-[300px]'}`}>
                  {tracks.map((track, index) => {
                    const isActive = currentTrack?.trackId === track.trackId;
                    return (
                      <button
                        key={track.trackId}
                        onClick={() => viewMode === 'vinyl' && handlePlayTrack(track)}
                        disabled={viewMode === 'video'}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-300 border text-left ${
                          isActive
                            ? 'border-fuchsia-500/60 text-white shadow-[0_0_10px_rgba(217,70,239,0.2)]'
                            : 'bg-black/20 border-gray-800/40 text-gray-400 hover:border-cyan-500/40 hover:text-cyan-300'
                        } ${viewMode === 'video' ? 'pointer-events-none' : ''}`}
                        style={isActive ? { background: `${c2}33` } : {}}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`text-xs w-5 shrink-0 ${isActive ? 'text-fuchsia-400' : 'text-gray-600'}`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{track.trackName}</p>
                            <p className="text-[9px] text-gray-600 truncate">{track.artistName}</p>
                          </div>
                        </div>

                        {isActive && isPlaying && viewMode === 'vinyl' ? (
                          <div className="flex gap-0.5 shrink-0 items-end h-3.5 ml-2">
                            <div className="w-0.5 bg-fuchsia-400 animate-bounce" style={{ height: '60%' }} />
                            <div className="w-0.5 bg-fuchsia-400 animate-bounce" style={{ height: '100%', animationDelay: '0.1s' }} />
                            <div className="w-0.5 bg-fuchsia-400 animate-bounce" style={{ height: '40%', animationDelay: '0.2s' }} />
                          </div>
                        ) : isActive && viewMode === 'video' ? (
                          <Tv2 className="w-3 h-3 text-cyan-400 shrink-0 ml-2" />
                        ) : (
                          <Play className="w-3 h-3 opacity-20 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
'use client';

import { Disc3, Play, Tv2, Volume2 } from 'lucide-react';
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

function Particle({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <span className="absolute select-none pointer-events-none text-2xl animate-float drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={style}>
      {emoji}
    </span>
  );
}

function VinylDisc({ imageUrl, albumName, isSpinning }: { imageUrl: string; albumName: string; isSpinning: boolean }) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center shrink-0 mx-auto group perspective-1000">
      <div className={`absolute w-56 h-56 bg-black/50 rounded-full blur-xl transition-all duration-1000 ${isSpinning ? 'opacity-100 scale-110' : 'opacity-50 scale-100'}`}></div>

      <div
        className="absolute w-full h-full rounded-full border-[6px] border-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-1000 overflow-hidden"
        style={{
          background: 'repeating-radial-gradient(circle, #181818 0%, #0d0d0d 3%, #181818 4%)',
          animation: isSpinning ? 'spin 3s linear infinite' : 'none',
          boxShadow: isSpinning ? '0 0 40px rgba(217,70,239,0.3), inset 0 0 20px rgba(0,0,0,1)' : 'inset 0 0 20px rgba(0,0,0,1)',
        }}
      >
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.05)_45deg,rgba(255,255,255,0.2)_90deg,rgba(255,255,255,0.05)_135deg,transparent_180deg,transparent_180deg,rgba(255,255,255,0.05)_225deg,rgba(255,255,255,0.2)_270deg,rgba(255,255,255,0.05)_315deg,transparent_360deg)] pointer-events-none mix-blend-screen"></div>
        <img src={imageUrl} alt={albumName} className="w-[38%] h-[38%] rounded-full object-cover border-[3px] border-[#050505] z-10 shadow-[0_0_15px_rgba(0,0,0,0.9)]" />
        <div className="absolute w-3 h-3 bg-[#111] rounded-full z-20 shadow-inner border border-gray-700/50" />
      </div>
    </div>
  );
}

export default function Rockola({ albumName, imageUrl, youtubeUrl }: RockolaProps) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedAlbum, setResolvedAlbum] = useState('');
  const [albumArtist, setAlbumArtist] = useState('');

  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [viewMode, setViewMode] = useState<'vinyl' | 'video'>('vinyl');
  const [trackVideoId, setTrackVideoId] = useState<string | null>(null);
  const [searchingVideo, setSearchingVideo] = useState(false);

  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [particles, setParticles] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setTracks([]);

      const dashIdx = albumName.indexOf(' - ');
      const parsedArtist = dashIdx !== -1 ? albumName.slice(0, dashIdx).trim() : null;
      const parsedAlbum = dashIdx !== -1 ? albumName.slice(dashIdx + 3).trim() : albumName;

      const COMPILATION_KEYWORDS = ['soundtrack', 'ost', 'original motion picture', 'banda sonora', 'compilation', 'greatest hits', 'best of', 'collection', 'anthology', 'various', 'varios', 'tribute'];
      const isCompilation = COMPILATION_KEYWORDS.some(kw => parsedAlbum.toLowerCase().includes(kw) || albumName.toLowerCase().includes(kw));

      const effectiveArtist = isCompilation ? null : parsedArtist;
      const effectiveAlbum = isCompilation ? albumName : parsedAlbum;

      const searchAlbum = async (query: string): Promise<any | null> => {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=8`);
        const data = await res.json();
        if (!data.results?.length) return null;

        if (effectiveArtist) {
          const artistLower = effectiveArtist.toLowerCase();
          const match = data.results.find((r: any) =>
            r.artistName?.toLowerCase().includes(artistLower) || artistLower.includes(r.artistName?.toLowerCase() ?? '')
          );
          if (match) return match;
        }
        if (isCompilation) {
          return data.results.reduce((best: any, r: any) => (r.trackCount ?? 0) > (best.trackCount ?? 0) ? r : best, data.results[0]);
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
          setAlbumArtist(isCompilation ? '' : (album.artistName ?? effectiveArtist ?? ''));
          return true;
        }
        return false;
      };

      try {
        const query1 = effectiveArtist ? `${effectiveArtist} ${effectiveAlbum}` : effectiveAlbum;
        const album1 = await searchAlbum(query1);
        if (album1 && await loadSongsFromAlbum(album1)) { setLoading(false); return; }

        if (effectiveAlbum !== albumName) {
          const album2 = await searchAlbum(effectiveAlbum);
          if (album2 && await loadSongsFromAlbum(album2)) { setLoading(false); return; }
        }

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

  const searchYouTubeVideo = useCallback(async (trackName: string, artistName: string, primaryArtist?: string): Promise<string | null> => {
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
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${apiKey}`);
      const data = await res.json();
      return (data.items ?? []) as any[];
    };

    try {
      setSearchingVideo(true);
      let items = await search(`${artist} ${trackName} video oficial`);
      if (!items.length || Math.max(...items.map((i: any) => scoreResult(i, artist, trackName))) < 2) {
        const items2 = await search(`${artist} ${trackName} official music video`);
        items = [...items, ...items2];
      }
      if (!items.length) {
        items = await search(`${artist} ${trackName}`);
      }
      if (!items.length) return null;
      const best = items.reduce((prev: any, curr: any) => scoreResult(curr, artist, trackName) > scoreResult(prev, artist, trackName) ? curr : prev);
      return best?.id?.videoId ?? null;
    } catch { return null; }
    finally { setSearchingVideo(false); }
  }, []);

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

  const handlePlayTrack = async (track: any) => {
    if (!audioRef.current) return;
    const isSameTrack = currentTrack?.trackId === track.trackId;

    if (isSameTrack && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (ytPlayer && viewMode === 'video') ytPlayer.pauseVideo();
      return;
    }

    setCurrentTrack(track);
    const newTheme = getTheme(`${track.trackName} ${track.artistName}`);
    setTheme(newTheme);
    spawnParticles(newTheme.particle);

    if (!isSameTrack) {
      setTrackVideoId(null);
      setViewMode('vinyl');
    }

    audioRef.current.src = track.previewUrl;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleToggleView = async () => {
    if (!currentTrack) return;
    if (viewMode === 'vinyl') {
      let vid = trackVideoId;
      if (!vid) {
        vid = await searchYouTubeVideo(currentTrack.trackName, currentTrack.artistName, albumArtist);
        setTrackVideoId(vid);
      }
      setViewMode('video');
      if (audioRef.current) { audioRef.current.pause(); }
    } else {
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

  const [c0, c1, c2] = theme.colors;
  const sectionBg = `radial-gradient(ellipse at 20% 50%, ${c2}44 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${c1}33 0%, transparent 50%), ${c0}`;

  if (loading) {
    return (
      <div className="w-full mt-12 pt-8 flex justify-center items-center gap-3">
        <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cyan-500 font-mono animate-pulse text-xs tracking-widest uppercase">Calibrando Frecuencias...</p>
      </div>
    );
  }
  if (!tracks.length) return null;

  return (
    <>
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0px) scale(1); opacity: var(--op, 0.25); }
          50%  { transform: translateY(-40px) scale(1.15); opacity: calc(var(--op, 0.25) * 1.5); }
          100% { transform: translateY(-80px) scale(0.9); opacity: 0; }
        }
        .animate-float { animation: float-up var(--dur, 4s) ease-in-out var(--delay, 0s) infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scanlines {
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px);
          pointer-events: none;
        }
        .speaker-grill {
          background-image: radial-gradient(#111 20%, transparent 20%), radial-gradient(#111 20%, transparent 20%);
          background-size: 6px 6px;
          background-position: 0 0, 3px 3px;
        }
      `}</style>

      <audio ref={audioRef} onEnded={onAudioEnded} />

      <div
        className="w-full relative overflow-hidden transition-all duration-1000"
        style={{ background: sectionBg, minHeight: '90vh' }}
      >
        <div className="absolute top-0 bottom-0 left-0 w-8 speaker-grill opacity-30 mix-blend-overlay"></div>
        <div className="absolute top-0 bottom-0 right-0 w-8 speaker-grill opacity-30 mix-blend-overlay"></div>

        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000" style={{ background: `${c2}33` }} />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-[100px] transition-all duration-1000" style={{ background: `${c1}22` }} />
        </div>

        {particles.map(p => (
          <Particle key={p.id} emoji={theme.particle} style={{ ...p.style, '--dur': p.style.animationDuration, '--delay': p.style.animationDelay, '--op': p.style.opacity } as any} />
        ))}

        <div className="relative z-10 px-6 py-10 md:px-12">

          {/* HEADER LIMPIO (Sin el botón verde) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-800/50 pb-8">

            <div className="flex items-center gap-4">
              <div className="bg-black/50 p-3 rounded-lg border border-gray-800 shadow-inner">
                <Volume2 className="w-6 h-6 text-fuchsia-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                  ROCKOLA <span className="text-fuchsia-500 font-light italic">HI-FI</span>
                </h3>
                {resolvedAlbum && (
                  <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
                    SRC: <span className="text-cyan-400">{resolvedAlbum}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Nueva sección de "Now Playing" integrada y elegante */}
            {currentTrack && (
              <div className="bg-black/30 border border-gray-800/50 px-6 py-3 rounded-xl flex items-center gap-4 backdrop-blur-sm">
                {isPlaying && (
                  <div className="flex gap-1 h-4 items-end shrink-0">
                    <div className="w-1 bg-fuchsia-500 animate-bounce shadow-[0_0_5px_#d946ef]" style={{ height: '60%' }} />
                    <div className="w-1 bg-cyan-400 animate-bounce shadow-[0_0_5px_#22d3ee]" style={{ height: '100%', animationDelay: '0.1s' }} />
                    <div className="w-1 bg-fuchsia-500 animate-bounce shadow-[0_0_5px_#d946ef]" style={{ height: '40%', animationDelay: '0.2s' }} />
                  </div>
                )}
                <div className="text-left md:text-right">
                  <p className="text-white font-bold text-sm tracking-wide">{currentTrack.trackName}</p>
                  <p className="text-gray-400 font-mono text-[10px] uppercase tracking-widest mt-0.5">{currentTrack.artistName}</p>
                </div>
              </div>
            )}
          </div>

          <div className={`grid gap-10 w-full transition-all duration-500 ${viewMode === 'video' ? 'grid-cols-1 lg:grid-cols-[1fr_350px]' : 'grid-cols-1 lg:grid-cols-[auto_1fr] lg:items-center lg:justify-items-center'
            }`}>

            {/* ── IZQUIERDA: Vinyl OR Video ── */}
            <div className="flex flex-col items-center w-full relative">

              {/* Botón Toggle - Ahora fijado con margen seguro para que jamás choque */}
              {currentTrack && (
                <div className="w-full flex justify-center mb-8">
                  <button
                    onClick={handleToggleView}
                    disabled={searchingVideo}
                    className="group flex items-center gap-3 px-6 py-3 rounded-full border border-cyan-800 text-cyan-400 font-mono text-[10px] uppercase tracking-widest hover:border-fuchsia-500 hover:text-fuchsia-400 hover:bg-fuchsia-900/20 transition-all duration-300 bg-black/60 shadow-[0_5px_15px_rgba(0,0,0,0.5)] disabled:opacity-50"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:bg-fuchsia-500 shadow-[0_0_8px_currentColor]"></div>
                    {viewMode === 'vinyl' ? <Tv2 className="w-4 h-4" /> : <Disc3 className="w-4 h-4" />}
                    {searchingVideo ? 'SINTONIZANDO...' : viewMode === 'vinyl' ? 'ACTIVAR MODO VIDEO' : 'RETORNAR A VINILO'}
                  </button>
                </div>
              )}

              {/* Vinyl */}
              {viewMode === 'vinyl' && (
                <VinylDisc imageUrl={imageUrl} albumName={albumName} isSpinning={isPlaying} />
              )}

              {/* Pantalla de Video */}
              {viewMode === 'video' && trackVideoId && (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-[12px] border-[#111] bg-black shadow-[0_0_50px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(255,255,255,0.1)]">
                  <div className="absolute inset-0 z-20 pointer-events-none rounded-xl shadow-[inset_0_0_40px_rgba(255,255,255,0.1)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
                  <div className="scanlines absolute inset-0 z-10 opacity-40" />

                  <YouTube
                    videoId={trackVideoId}
                    className="w-full h-full"
                    iframeClassName="w-full h-full pointer-events-none scale-[1.05]"
                    opts={{
                      playerVars: {
                        autoplay: 1, controls: 0, modestbranding: 1, rel: 0, disablekb: 1, mute: 0, origin: typeof window !== 'undefined' ? window.location.origin : '',
                      },
                    }}
                    onReady={e => setYtPlayer(e.target)}
                  />
                </div>
              )}

              {/* Error de Video */}
              {viewMode === 'video' && !trackVideoId && !searchingVideo && (
                <div className="w-full aspect-video rounded-xl border-2 border-red-900 bg-[#1a0505] flex flex-col items-center justify-center gap-4 shadow-inner">
                  <div className="w-12 h-12 rounded-full bg-red-950 flex items-center justify-center animate-pulse">
                    <Tv2 className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-red-500 font-mono text-[10px] uppercase tracking-[0.3em]">Señal_Perdida</p>
                  <button onClick={() => setViewMode('vinyl')} className="px-6 py-2 border border-red-800 text-red-400 font-mono text-[9px] hover:bg-red-900/50 uppercase tracking-widest transition-all">
                    Reiniciar Sistema Visual
                  </button>
                </div>
              )}
            </div>

            {/* ── DERECHA: Jukebox Tracklist ── */}
            <div className={`bg-[#050508]/80 border border-gray-800 rounded-2xl p-6 font-mono relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md w-full ${viewMode === 'vinyl' ? 'max-w-[450px]' : 'h-full'}`}>

              <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, ${c2}, #d946ef)` }} />

              <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-4">
                <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase">Selector_de_Pistas</p>
                {isPlaying && viewMode === 'vinyl' && (
                  <span className="text-[9px] text-fuchsia-500 font-bold animate-pulse uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div> Online
                  </span>
                )}
                {viewMode === 'video' && (
                  <span className="text-[9px] text-cyan-400 font-bold animate-pulse uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div> Broadcast
                  </span>
                )}
              </div>

              {/* Lock overlay para modo video */}
              <div className="relative">
                {viewMode === 'video' && (
                  <div className="absolute inset-0 z-20 rounded-xl bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 cursor-not-allowed border border-cyan-900">
                    <div className="p-4 rounded-full bg-cyan-950/50">
                      <Tv2 className="w-8 h-8 text-cyan-500 animate-pulse" />
                    </div>
                    <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.2em] text-center px-4 leading-relaxed">
                      El modo Broadcast bloquea el selector.<br />Retorna al Vinilo para cambiar de pista.
                    </p>
                  </div>
                )}

                <div className={`space-y-2 overflow-y-auto pr-2 custom-scrollbar ${viewMode === 'video' ? 'max-h-[calc(100vh-16rem)]' : 'max-h-[340px]'}`}>
                  {tracks.map((track, index) => {
                    const isActive = currentTrack?.trackId === track.trackId;
                    return (
                      <button
                        key={track.trackId}
                        onClick={() => viewMode === 'vinyl' && handlePlayTrack(track)}
                        disabled={viewMode === 'video'}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 border-l-4 text-left group ${isActive
                            ? 'border-l-fuchsia-500 bg-gradient-to-r from-fuchsia-900/20 to-transparent border-y-transparent border-r-transparent text-white shadow-[inset_0_0_20px_rgba(217,70,239,0.05)]'
                            : 'border-l-transparent border-y-transparent border-r-transparent bg-black/40 text-gray-400 hover:border-l-cyan-500 hover:bg-cyan-900/10 hover:text-cyan-300'
                          } ${viewMode === 'video' ? 'pointer-events-none' : ''}`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`text-[10px] w-6 text-center font-black rounded-sm py-1 ${isActive ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50' : 'bg-gray-900 text-gray-600 border border-gray-800'}`}>
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-white' : 'group-hover:text-cyan-100'}`}>{track.trackName}</p>
                            <p className="text-[9px] text-gray-500 truncate mt-0.5">{track.artistName}</p>
                          </div>
                        </div>

                        {isActive && isPlaying && viewMode === 'vinyl' ? (
                          <div className="flex gap-[3px] shrink-0 items-end h-4 ml-4">
                            <div className="w-1 bg-fuchsia-500 animate-bounce shadow-[0_0_5px_#d946ef]" style={{ height: '60%' }} />
                            <div className="w-1 bg-fuchsia-400 animate-bounce shadow-[0_0_5px_#d946ef]" style={{ height: '100%', animationDelay: '0.1s' }} />
                            <div className="w-1 bg-fuchsia-500 animate-bounce shadow-[0_0_5px_#d946ef]" style={{ height: '40%', animationDelay: '0.2s' }} />
                          </div>
                        ) : isActive && viewMode === 'video' ? (
                          <div className="w-6 h-6 rounded-full bg-cyan-950 flex items-center justify-center shrink-0 ml-4 border border-cyan-800">
                            <Tv2 className="w-3 h-3 text-cyan-400" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center shrink-0 ml-4 group-hover:bg-cyan-950 border border-transparent group-hover:border-cyan-800 transition-colors">
                            <Play className="w-3 h-3 text-gray-600 group-hover:text-cyan-400" />
                          </div>
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
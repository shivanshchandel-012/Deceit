'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Check,
  Copy,
  Crown,
  Eye,
  Gamepad2,
  LogIn,
  MessageCircle,
  Plus,
  RefreshCw,
  Send,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Users,
  Wifi,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { ClientGameState } from '@deceit/game-types';
import { APP_CONFIG } from '@deceit/config';
import { getSocket, getSocketUrl } from '@/lib/socket';

const tabs = [
  { id: 'ONLINE', label: 'Online', icon: Wifi },
  { id: 'LOCAL', label: 'Pass & Play', icon: Smartphone },
  { id: 'RULES', label: 'How to play', icon: Sparkles },
] as const;
type Tab = (typeof tabs)[number]['id'];

type LocalPlayer = { id: number; name: string };
const LOCAL_WORDS = [
  { word: 'INTERSTELLAR', category: 'Movies' },
  { word: 'ALGORITHM', category: 'Technology' },
  { word: 'PIZZA', category: 'Food' },
  { word: 'GUITAR', category: 'Music' },
  { word: 'VOLCANO', category: 'Nature' },
  { word: 'CHESS', category: 'Games' },
  { word: 'LIGHTHOUSE', category: 'Places' },
  { word: 'TELESCOPE', category: 'Science' },
  { word: 'SUBMARINE', category: 'Vehicles' },
];

export default function GamePage() {
  const [tab, setTab] = useState<Tab>('ONLINE');
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [game, setGame] = useState<ClientGameState | null>(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clue, setClue] = useState('');
  const [guess, setGuess] = useState('');
  const [chat, setChat] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; senderName: string; text: string }>>([]);
  const [vote, setVote] = useState<string | null>(null);

  const [localPlayers, setLocalPlayers] = useState<LocalPlayer[]>([
    { id: 1, name: 'Alex' },
    { id: 2, name: 'Sam' },
    { id: 3, name: 'Jordan' },
    { id: 4, name: 'Taylor' },
  ]);
  const [localName, setLocalName] = useState('');
  const [localRunning, setLocalRunning] = useState(false);
  const [localTurn, setLocalTurn] = useState(0);
  const [localRevealed, setLocalRevealed] = useState(false);
  const [localImposter, setLocalImposter] = useState(0);
  const [localWord, setLocalWord] = useState(LOCAL_WORDS[0]);

  const socketReady = Boolean(getSocketUrl());

  useEffect(() => {
    if (!socketReady) return;
    const socket = getSocket();
    const onConnect = () => { setConnected(true); setError(''); };
    const onDisconnect = () => setConnected(false);
    const onState = (state: ClientGameState) => { setGame(state); setError(''); };
    const onError = (e: { message: string }) => setError(e.message);
    const onChat = (m: { id: string; senderName: string; text: string }) => {
      setMessages((prev) => [...prev.slice(-49), m]);
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game:state', onState);
    socket.on('room:error', onError);
    socket.on('chat:message', onChat);
    if (socket.connected) setConnected(true);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game:state', onState);
      socket.off('room:error', onError);
      socket.off('chat:message', onChat);
    };
  }, [socketReady]);

  const onlineConfigured = socketReady;

  const createRoom = () => {
    if (!onlineConfigured) return setError('Online play is not configured yet. Deploy the API and set NEXT_PUBLIC_WS_URL in Vercel.');
    if (!username.trim()) return setError('Choose a codename first.');
    getSocket().emit('room:create', {
      username: username.trim(),
      settings: { imposterCount: 1, imposterHintMode: 'CATEGORY', wordPackId: 'pack-movies-cinema', clueOrder: 'SEQUENTIAL' },
    }, (res) => {
      if (!res.success) setError(res.error || 'Could not create room.');
    });
  };

  const joinRoom = () => {
    if (!onlineConfigured) return setError('Online play is not configured yet.');
    if (!username.trim() || !roomCode.trim()) return setError('Enter your codename and room code.');
    getSocket().emit('room:join', { username: username.trim(), roomCode: roomCode.trim().toUpperCase() }, (res) => {
      if (!res.success) setError(res.error || 'Could not join room.');
    });
  };

  const copyRoom = async () => {
    if (!game) return;
    try {
      await navigator.clipboard.writeText(game.roomCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setError('Could not copy the room code. Select and copy it manually.');
    }
  };

  const startLocal = () => {
    if (localPlayers.length < 3) return setError('Add at least 3 players.');
    setLocalImposter(Math.floor(Math.random() * localPlayers.length));
    setLocalWord(LOCAL_WORDS[Math.floor(Math.random() * LOCAL_WORDS.length)]);
    setLocalTurn(0);
    setLocalRevealed(false);
    setLocalRunning(true);
    setError('');
  };

  const addLocalPlayer = () => {
    const name = localName.trim();
    if (!name) return;
    if (localPlayers.some((p) => p.name.toLowerCase() === name.toLowerCase())) return setError('That player is already added.');
    if (localPlayers.length >= 12) return setError('Maximum 12 players.');
    setLocalPlayers((p) => [...p, { id: Date.now(), name }]);
    setLocalName('');
    setError('');
  };

  const currentLocal = localPlayers[localTurn];

  if (game) return <GameRoom game={game} username={username} connected={connected} error={error} setError={setError} copied={copied} copyRoom={copyRoom} clue={clue} setClue={setClue} guess={guess} setGuess={setGuess} chat={chat} setChat={setChat} messages={messages} vote={vote} setVote={setVote} />;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">D</span><span>DECEIT</span></div>
        <div className="status-pill"><span className={`status-dot ${onlineConfigured ? connected ? 'live' : 'idle' : 'offline'}`} />{onlineConfigured ? connected ? 'Online service connected' : 'Online service ready' : 'Online service not configured'}</div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Zap size={14} /> SOCIAL DEDUCTION • REAL-TIME</div>
          <h1>Trust no one.<br /><span>Find the imposter.</span></h1>
          <p>A sharp, fast party game where one player is bluffing — and everyone else knows the word.</p>
        </div>

        <div className="play-card">
          <nav className="mode-tabs" aria-label="Game mode">
            {tabs.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => { setTab(item.id); setError(''); }} className={tab === item.id ? 'active' : ''}><Icon size={16} />{item.label}</button>; })}
          </nav>

          <AnimatePresence mode="wait">
            {tab === 'ONLINE' && (
              <motion.div key="online" className="panel-body" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="panel-heading"><div><div className="kicker">ONLINE MATCH</div><h2>Enter the game</h2></div><div className="mini-icon"><Gamepad2 size={18} /></div></div>
                {!onlineConfigured && <div className="notice warning"><ShieldAlert size={16} /><span>Frontend is live, but the multiplayer server is not connected. Local Pass & Play works without it.</span></div>}
                {error && <div className="notice error"><ShieldAlert size={16} /><span>{error}</span></div>}
                <label className="field-label">CODENAME<input value={username} onChange={(e) => setUsername(e.target.value.slice(0, 20))} placeholder="e.g. NightOwl" maxLength={20} autoComplete="nickname" /></label>
                <button className="primary-btn" onClick={createRoom} disabled={!onlineConfigured}><Plus size={18} /> Create a room <ArrowRight size={17} /></button>
                <div className="divider"><span>OR JOIN A ROOM</span></div>
                <div className="join-row"><input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))} placeholder="ROOM CODE" /><button className="secondary-btn" onClick={joinRoom} disabled={!onlineConfigured}><LogIn size={17} /> Join</button></div>
                <div className="feature-row"><span><Users size={14} /> 3–24 players</span><span><Zap size={14} /> Live rounds</span><span><ShieldAlert size={14} /> Secret roles</span></div>
              </motion.div>
            )}

            {tab === 'LOCAL' && (
              <motion.div key="local" className="panel-body" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {!localRunning ? <>
                  <div className="panel-heading"><div><div className="kicker">PASS & PLAY</div><h2>One phone. Everyone plays.</h2></div><div className="mini-icon"><Smartphone size={18} /></div></div>
                  {error && <div className="notice error"><ShieldAlert size={16} /><span>{error}</span></div>}
                  <div className="add-player"><input value={localName} onChange={(e) => setLocalName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLocalPlayer()} placeholder="Player name" maxLength={20} /><button className="secondary-btn square" onClick={addLocalPlayer}><Plus size={18} /></button></div>
                  <div className="player-list">{localPlayers.map((p, i) => <div className="player-chip" key={p.id}><span className="avatar">{p.name.slice(0, 1).toUpperCase()}</span><span>{p.name}</span>{i === 0 && <Crown size={13} className="muted-icon" />}<button onClick={() => setLocalPlayers((all) => all.filter((x) => x.id !== p.id))} aria-label={`Remove ${p.name}`}><X size={14} /></button></div>)}</div>
                  <button className="primary-btn" onClick={startLocal}><Sparkles size={18} /> Start local match <ArrowRight size={17} /></button>
                </> : <LocalReveal player={currentLocal} index={localTurn} total={localPlayers.length} revealed={localRevealed} isImposter={localTurn === localImposter} word={localWord.word} category={localWord.category} onReveal={() => setLocalRevealed(true)} onNext={() => { if (localTurn + 1 < localPlayers.length) { setLocalTurn((n) => n + 1); setLocalRevealed(false); } else { setLocalRunning(false); setLocalRevealed(false); } }} />}
              </motion.div>
            )}

            {tab === 'RULES' && <motion.div key="rules" className="panel-body rules" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><div className="kicker">THE QUICK RULEBOOK</div><h2>Four moves. One liar.</h2>{[['01','Reveal','Everyone secretly gets the word — except the Imposter.'],['02','Clue','Give a subtle clue without making the word obvious.'],['03','Discuss & vote','Read the room. Spot the player whose clue feels wrong.'],['04','Final guess','If caught, the Imposter gets one last chance to steal the win.']].map(([n,t,d]) => <div className="rule" key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></div>)}</motion.div>}
          </AnimatePresence>
        </div>
      </section>

      <footer className="footer"><span>© 2026 DECEIT</span><span>{APP_CONFIG.poweredBy}</span></footer>
    </main>
  );
}

function LocalReveal({ player, index, total, revealed, isImposter, word, category, onReveal, onNext }: { player: LocalPlayer; index: number; total: number; revealed: boolean; isImposter: boolean; word: string; category: string; onReveal: () => void; onNext: () => void }) {
  return <div className="reveal-screen"><div className="progress-label">PLAYER {index + 1} OF {total}</div><h2>{player.name}</h2>{!revealed ? <><p>Pass the phone to <b>{player.name}</b>. Make sure nobody else is looking.</p><button className="primary-btn" onClick={onReveal}><Eye size={18} /> Reveal my role</button></> : <div className={`secret-card ${isImposter ? 'imposter' : ''}`}><div className="secret-badge">{isImposter ? 'YOU ARE THE' : 'YOUR SECRET WORD'}</div><strong>{isImposter ? 'IMPOSTER' : word}</strong><p>{isImposter ? `Blend in. You do not know the word. Category: ${category}` : `Category: ${category}`}</p><button className="secondary-btn" onClick={onNext}><Check size={17} /> {index + 1 === total ? 'Finish reveal' : 'Hide & pass on'}</button></div>}</div>;
}

function GameRoom(props: { game: ClientGameState; username: string; connected: boolean; error: string; setError: (s: string) => void; copied: boolean; copyRoom: () => void; clue: string; setClue: (s: string) => void; guess: string; setGuess: (s: string) => void; chat: string; setChat: (s: string) => void; messages: Array<{ id: string; senderName: string; text: string }>; vote: string | null; setVote: (s: string | null) => void }) {
  const { game, username, connected, error, setError, copied, copyRoom, clue, setClue, guess, setGuess, chat, setChat, messages, vote, setVote } = props;
  const socket = getSocket();
  const [now, setNow] = useState(Date.now());
  const me = game.players.find((p) => p.name === username);
  const isTurn = game.currentTurnPlayerId === me?.id;
  const seconds = game.phaseEndTime ? Math.max(0, Math.ceil((game.phaseEndTime - now) / 1000)) : null;

  useEffect(() => {
    if (!game.phaseEndTime) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [game.phaseEndTime]);

  const phaseLabel = game.phase.replaceAll('_', ' ');
  const submitClue = (e: React.FormEvent) => { e.preventDefault(); if (!clue.trim()) return; socket.emit('game:clue_submit', { text: clue.trim() }); setClue(''); };
  const submitVote = () => { if (!vote) return; socket.emit('game:vote_submit', { targetPlayerId: vote }); };
  const submitGuess = (e: React.FormEvent) => { e.preventDefault(); if (!guess.trim()) return; socket.emit('game:imposter_guess', { guessedWord: guess.trim() }); setGuess(''); };
  const submitChat = (e: React.FormEvent) => { e.preventDefault(); if (!chat.trim()) return; socket.emit('chat:send', { text: chat.trim() }); setChat(''); };

  return <main className="room-shell">
    <header className="room-topbar"><div className="brand"><span className="brand-mark">D</span><span>DECEIT</span></div><div className="room-center"><span className="room-code">ROOM {game.roomCode}<button onClick={copyRoom} title="Copy room code">{copied ? <Check size={14} /> : <Copy size={14} />}</button></span><span className="phase-pill">{phaseLabel}</span>{seconds !== null && <span className="timer-pill">{seconds}s</span>}</div><div className={`connection ${connected ? 'ok' : ''}`}>{connected ? <Wifi size={15} /> : <WifiOff size={15} />}{connected ? 'Connected' : 'Reconnecting'}</div></header>
    {error && <div className="notice error room-notice"><ShieldAlert size={16} /><span>{error}</span><button onClick={() => setError('')}><X size={15} /></button></div>}
    <section className="room-grid">
      <div className="main-panel">
        {game.phase === 'LOBBY' && <div className="stage"><div className="stage-head"><div><div className="kicker">ROOM LOBBY</div><h1>Build your crew.</h1><p>Share the room code, add an AI, then launch when at least three players are ready.</p></div><button className="secondary-btn" onClick={() => socket.emit('player:add_bot', { personality: 'balanced' })}><Bot size={17} /> Add AI</button></div><div className="crew-grid">{game.players.map((p) => <div className="crew-card" key={p.id}><span className="avatar">{p.name.slice(0,1).toUpperCase()}</span><div><strong>{p.name}</strong><small>{p.isBot ? 'AI player' : p.isHost ? 'Host' : 'Player'} {p.isConnected ? '• online' : '• offline'}</small></div>{p.isHost && <Crown size={15} className="gold" />}</div>)}</div><button className="primary-btn launch" disabled={game.players.length < 3} onClick={() => socket.emit('game:start')}><Gamepad2 size={18} /> Launch match</button></div>}
        {game.phase === 'ROLE_REVEAL' && <div className="stage centered"><div className="eyebrow"><Eye size={14} /> PRIVATE ROLE</div><h1>You are <span className={game.myInfo.role === 'IMPOSTER' ? 'danger-text' : ''}>{game.myInfo.role}</span>.</h1><p>{game.myInfo.role === 'IMPOSTER' ? 'Blend in, read the clues, and survive the vote.' : 'Protect the word. Give clues that prove you know it without exposing it.'}</p><div className="intel-card">{game.myInfo.secretWord ? <><small>SECRET WORD</small><strong>{game.myInfo.secretWord}</strong><span>{game.myInfo.category}</span></> : <><small>CATEGORY</small><strong>{game.myInfo.category || 'Unknown'}</strong>{game.myInfo.hint && <span>Hint: {game.myInfo.hint}</span>}</>}</div></div>}
        {(game.phase === 'CLUE_PHASE' || game.phase === 'DISCUSSION') && <div className="stage"><div className="stage-head"><div><div className="kicker">ROUND {game.currentRound} • {phaseLabel}</div><h1>{game.phase === 'CLUE_PHASE' ? 'Leave your clue.' : 'Read the room.'}</h1><p>{isTurn ? 'It is your turn.' : 'Watch what everyone says. Someone is bluffing.'}</p></div><div className="round-chip">{game.clues.length} clues</div></div><div className="clue-feed">{game.clues.length ? game.clues.map((c) => <div className="clue" key={c.id}><span className="avatar small">{c.playerName.slice(0,1).toUpperCase()}</span><div><strong>{c.playerName}</strong><p>{c.text}</p></div></div>) : <div className="empty-state"><MessageCircle size={22} /><span>No clues yet. Be the first.</span></div>}</div>{game.phase === 'CLUE_PHASE' && <form className="composer" onSubmit={submitClue}><input value={clue} onChange={(e) => setClue(e.target.value)} placeholder={isTurn ? 'Your subtle clue…' : 'Wait for your turn…'} disabled={!isTurn} maxLength={100} /><button disabled={!isTurn}><Send size={17} /></button></form>}</div>}
        {game.phase === 'VOTING' && <div className="stage"><div className="centered"><div className="eyebrow"><ShieldAlert size={14} /> FINAL CALL</div><h1>Who is the imposter?</h1><p>Choose carefully. Your vote can end the round.</p></div><div className="vote-grid">{game.players.filter((p) => p.isAlive).map((p) => <button key={p.id} className={`vote-card ${vote === p.id ? 'selected' : ''}`} onClick={() => setVote(p.id)}><span className="avatar">{p.name.slice(0,1).toUpperCase()}</span><strong>{p.name}</strong><small>{p.isBot ? 'AI player' : 'Player'}</small></button>)}</div><button className="primary-btn" disabled={!vote} onClick={submitVote}><ShieldAlert size={18} /> Confirm vote</button></div>}
        {game.phase === 'IMPOSTER_GUESS' && <div className="stage centered"><div className="eyebrow danger"><ShieldAlert size={14} /> LAST CHANCE</div><h1>Steal the win.</h1><p>The Imposter has been caught. Guess the secret word correctly to turn the game around.</p>{game.myInfo.role === 'IMPOSTER' ? <form className="guess-form" onSubmit={submitGuess}><input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Secret word" /><button className="primary-btn">Submit guess <ArrowRight size={17} /></button></form> : <div className="waiting"><RefreshCw size={17} /> Waiting for the Imposter…</div>}</div>}
        {(game.phase === 'GAME_RESULT' || game.phase === 'ROUND_RESULT') && <div className="stage centered"><div className="eyebrow"><Sparkles size={14} /> RESULT</div><h1>{game.winnerTeam ? `${game.winnerTeam} wins.` : 'Round complete.'}</h1><p>{game.winReason || 'Get ready for the next round.'}</p>{game.secretWordRevealed && <div className="intel-card"><small>SECRET WORD</small><strong>{game.secretWordRevealed}</strong></div>}{game.phase === 'GAME_RESULT' && <button className="primary-btn" onClick={() => socket.emit('game:rematch')}><RefreshCw size={18} /> Rematch</button>}</div>}
      </div>
      <aside className="side-panel"><div className="side-card"><div className="side-title"><Users size={16} /> Players <span>{game.players.length}/{game.settings.maxPlayers}</span></div><div className="side-players">{game.players.map((p) => <div className="side-player" key={p.id}><span className={`presence ${p.isConnected ? 'on' : ''}`} /><span>{p.name}</span>{p.isHost && <Crown size={12} className="gold" />}</div>)}</div></div><div className="side-card intel-side"><div className="side-title"><Eye size={16} /> {game.phase === 'LOBBY' ? 'Match status' : 'Your intel'}</div>{game.phase === 'LOBBY' ? <><small>ROOM STATE</small><strong>Waiting to start</strong><span>Roles are assigned when the host launches the match.</span></> : <><small>{game.myInfo.role === 'IMPOSTER' ? 'ROLE' : 'SECRET WORD'}</small><strong>{game.myInfo.secretWord || game.myInfo.role}</strong><span>{game.myInfo.category}</span></>}</div><div className="side-card chat-card"><div className="side-title"><MessageCircle size={16} /> Room chat</div><div className="chat-list">{messages.length ? messages.map((m) => <div className="chat-message" key={m.id}><strong>{m.senderName}</strong><p>{m.text}</p></div>) : <div className="empty-state"><MessageCircle size={18} /> No messages yet.</div>}</div><form className="composer" onSubmit={submitChat}><input value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Message the room…" maxLength={200} /><button><Send size={16} /></button></form></div></aside>
    </section>
  </main>;
}

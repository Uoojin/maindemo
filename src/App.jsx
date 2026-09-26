import { useState } from 'react';
import Header from './components/Header/Header.jsx';
import CircleScene from './components/CircleScene/CircleScene.jsx';
import ObjectScene from './components/ObjectScene/ObjectScene.jsx';
import './App.css';

export default function App() {
  const [mode, setMode] = useState('circle');
  const [menuExpanded, setMenuExpanded] = useState(false);

  return (
    <div className={`app-shell${menuExpanded ? ' is-menu-expanded' : ''}`} data-mode={mode}>
      <Header
        mode={mode}
        menuExpanded={menuExpanded}
        onToggleMode={() => setMode((current) => (current === 'circle' ? 'object' : 'circle'))}
        onToggleMenu={() => setMenuExpanded((current) => !current)}
      />

      <main className="hero" aria-live="polite">
        <section className={`scene-layer${mode === 'circle' ? ' is-active' : ''}`} data-mode="circle">
          <CircleScene active={mode === 'circle'} />
        </section>
        <section className={`scene-layer${mode === 'object' ? ' is-active' : ''}`} data-mode="object">
          <ObjectScene active={mode === 'object'} />
        </section>
      </main>
    </div>
  );
}

import './Header.css';

export default function Header({ mode, menuExpanded, onToggleMode, onToggleMenu }) {
  const extraTabIndex = menuExpanded ? 0 : -1;
  const extraHidden = menuExpanded ? 'false' : 'true';

  return (
    <header className="site-header" aria-label="SYNCOPATE navigation">
      <a className="brand" href="#" aria-label="SYNCOPATE">
        <img src="/assets/SYNCOPATE_Logo.png" alt="SYNCOPATE" />
        <span>SYNCOPATE</span>
      </a>

      <nav className="menu-shell header-right" aria-label="Primary">
        <button
          className="mode-button mode-pill"
          type="button"
          aria-label={mode === 'circle' ? 'Switch to object mode' : 'Switch to circle mode'}
          onClick={onToggleMode}
        >
          {mode === 'circle' ? 'CIRCLE' : 'OBJECT'}
        </button>

        <div className="nav-panel menu-pill">
          <div className="nav-list">
            <button className="nav-item" type="button">PROJECT</button>
            <button className="nav-item" type="button">STUDENT</button>
            <button className="nav-item nav-extra" type="button" aria-hidden={extraHidden} tabIndex={extraTabIndex}>CONTENT</button>
            <button className="nav-item nav-extra" type="button" aria-hidden={extraHidden} tabIndex={extraTabIndex}>GUESTBOOK</button>
            <button className="nav-item nav-extra" type="button" aria-hidden={extraHidden} tabIndex={extraTabIndex}>CURRICULUM</button>
            <button className="nav-item nav-extra" type="button" aria-hidden={extraHidden} tabIndex={extraTabIndex}>CREDIT</button>
            <button
              className="arrow-button"
              type="button"
              aria-label={menuExpanded ? 'Collapse menu' : 'Expand menu'}
              onClick={onToggleMenu}
            >
              {menuExpanded ? '<' : '>'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

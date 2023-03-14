const Header = () => {
  return (
    <header>
      <div className="header-left">
        <a>
          <img src='#'></img>
          <span>Kalibrate</span>
        </a>
        <nav>
          <ul>
            <li>
              <a href='#'>Home</a>
            </li>
            <li>
              <a href='#'>About</a>
            </li>
            <li>
              <a href='#'>Team</a>
            </li>
            <li>
              <a href='#'>GitHub</a>
            </li>
            <li>
              <a href='#'>Docs</a>
            </li>
            <li id="start">
              <a href='#'>Get Started</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

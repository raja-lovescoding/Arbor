import SearchBar from "./SearchBar";

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h3 style={{ margin: 0, color: "#000" }}>Branched GPT</h3>
      </div>
      <div className="header-center">
        <SearchBar />
      </div>
      <div className="header-right">
        {user ? (
          <>
            <span className="header-user-name">{user.displayName || user.email}</span>
            <button className="header-auth-button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="header-auth-button">Login/Signup</button>
        )}
      </div>
    </header>
  );
};


export default Header;
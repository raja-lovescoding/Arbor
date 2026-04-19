import SearchBar from "./SearchBar";

const Header = ({ user, onLogout, searchQuery, onSearchChange, onSearchSubmit, onSearchClear }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h3 style={{ margin: 0, color: "#000" }}>Query Tree</h3>
      </div>
      <div className="header-center">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          onClear={onSearchClear}
        />
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
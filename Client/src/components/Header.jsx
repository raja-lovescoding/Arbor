import SearchBar from "./SearchBar";
const Header = () => {
  return (
    <header className="header">
        <div className="header-left">
          <h3 style={{ margin: 0, color: "#000" }}>Branched GPT</h3>
        </div>
        <div className="header-center">
          <SearchBar />
        </div>
        <div className="header-right">
          <h3 style={{ margin: 0, color: "#000", border: "#951b1b solid 1px", borderRadius: "6px", padding: "5px 10px" }}>Login/Signup</h3>
        </div>
    </header>
  );
}


export default Header;
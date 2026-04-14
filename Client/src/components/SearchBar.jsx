const SearchBar = () => {
  return (
    <div style={{ gap: "10px", display: "flex", alignItems: "center" }}>
      <input
        type="text"
        placeholder="Search..."
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#9a9c9e",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
        
    </div>
  );
};

export default SearchBar;
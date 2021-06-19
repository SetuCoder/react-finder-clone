import "./FavoriteFolder.scss";
import { IconContext } from "react-icons";
import { IoFolderOutline } from "react-icons/io5";

function FavoriteFolder({ name, navigateToFavorite, currentFolderName }) {
  const isActive = currentFolderName === name;

  return (
    <div className={`favorites-folder ${isActive ? "active" : ""}`}>
      <IconContext.Provider value={{ className: "favorites-folder-icon" }}>
        <IoFolderOutline />
      </IconContext.Provider>
      <button
        className="favorites-folder-name"
        onClick={() => navigateToFavorite(name)}
      >
        {name}
      </button>
    </div>
  );
}

export default FavoriteFolder;

import style from "./NotFound.module.css";
import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className={style.containerPrincipalNotFound}>
      <div className={style.containerMsg}>
        <h1 className={style.titleError}>HUSKS</h1>
        <h1>Something don't go as planned 🤦 ❌</h1>
        <Link to="/">
          <button>Go back to home</button>
        </Link>
      </div>
    </div>
  );
};

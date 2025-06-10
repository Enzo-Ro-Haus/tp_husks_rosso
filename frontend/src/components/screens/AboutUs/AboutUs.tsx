import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "./AboutUs.module.css";

export const AboutUs = () => {
  return (
    <div className={style.containerAbout}>
      <div>
        <Header />
      </div>
      <div className={style.AboutUs}>
        <div>
        <h1 className={style.AboutUsTitle}>ABOUT US</h1>
        </div>
        <div>
        <p className={style.AboutUsText}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente,
          eveniet aliquam ipsum maiores molestias ducimus quasi vitae cumque
          perspiciatis, quas quo magni necessitatibus, sunt voluptatem
          voluptatibus id nam laudantium quod?
        </p>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

import { Footer } from "../../ui/Footer/Footer";
import { Header } from "../../ui/Header/Header";
import style from "./AboutUs.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export const AboutUs = () => {
  return (
    <div className={style.containerAbout}>
      <Container fluid>
        <Row>
          <Header />
        </Row>
        <Row>
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
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
};

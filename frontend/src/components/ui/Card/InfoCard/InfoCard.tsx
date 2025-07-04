import { Card } from "react-bootstrap";

type InfoCardProp = {
  img: string;
  title: string;
  content: string;
};

export const InfoCard = ({ img, title, content }: InfoCardProp) => {
  return (
    <Card
      style={{
        width: "30%",
        height: "auto",
        backgroundColor: "transparent",
        border: "none",
      }}
    >
      <Card.Img
        variant="top"
        src={img}
        style={{ width: "100%", height: "400px" }}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text style={{ width: "100%", height: "auto" }}>
          {content}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

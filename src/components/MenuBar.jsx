import { Container, Navbar } from "react-bootstrap";

const MenuBar = () => {
  return (
    <Navbar className="sticky-top nav" bg="light">
      <Container>
        <h4 className="py-2 px-2 p-lg-0 p-sm-0 ">Image to Pdf</h4>
      </Container>
    </Navbar>
  );
};

export default MenuBar;

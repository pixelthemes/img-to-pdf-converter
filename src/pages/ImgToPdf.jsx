import jsPDF from "jspdf";
import { useState } from "react";
import { Form } from "react-bootstrap";

const ImgToPdf = () => {
  const [photos, setPhotos] = useState([]);
  const [paperSize, setPaperSize] = useState("a4");
  const [marginSize, setMarginSize] = useState("normal");
  const [imagePosition, setImagePosition] = useState("cover");

  const onChangePhoto = (e) => {
    setPhotos([...photos, ...e.target.files]);
  };
  const removePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };
  const getPageController = () => {
    const unit = {
      a4: { width: 595.28, height: 841.89 },
      letter: { width: 612, height: 792 },
      legal: { width: 612, height: 1008 },
      executive: { width: 522, height: 756 },
    };

    return unit[paperSize];
  };
  const getMarginSize = () => {
    const margins = {
      normal: 20,
      narrow: 10,
      moderate: 15,
    };

    return margins[marginSize];
  };

  const pdfGenerate = () => {
    const { width, height } = getPageController();
    const margin = getMarginSize();

    var doc = new jsPDF("p", "pt", paperSize);

    photos.forEach((photo, index) => {
      var img = URL.createObjectURL(photo);
      if (index !== 0) {
        doc.addPage();
      }

      // Calculate position based on the selected image position
      let x = margin;
      let y = margin;
      let imgWidth = width - 2 * margin;
      let imgHeight = height - 2 * margin;

      switch (imagePosition) {
        case "top":
          y = margin;
          imgHeight = (height - 2 * margin) / 2;
          break;
        case "center":
          y = (height - imgHeight) / 2;
          break;
        case "bottom":
          y = height - imgHeight - margin;
          break;
        case "cover":
          // Stretch to cover the entire page
          x = 0;
          y = 0;
          imgWidth = width;
          imgHeight = height;
          break;
        case "stretch":
          // Stretch image to fit within margins
          imgWidth = width - 2 * margin;
          imgHeight = height - 2 * margin;
          break;
        default:
          break;
      }

      doc.addImage(img, null, x, y, imgWidth, imgHeight);
    });

    doc.save(photos.pdf);
  };

  return (
    <>
      <div className="side-bar">
        <h3 className="text-center mb-4">PDF Settings</h3>
        <Form.Group className="mt-3">
          <Form.Label>Paper Size</Form.Label>
          <Form.Control
            style={{ cursor: "pointer" }}
            as="select"
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
          >
            <option className="" value="a4">
              A4
            </option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
            <option value="executive">Executive</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Margin Size</Form.Label>
          <Form.Control
            as="select"
            value={marginSize}
            onChange={(e) => setMarginSize(e.target.value)}
            style={{ cursor: "pointer" }}
          >
            <option value="normal">Normal</option>
            <option value="narrow">Narrow</option>
            <option value="moderate">Moderate</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Image Position</Form.Label>
          <Form.Control
            style={{ cursor: "pointer" }}
            as="select"
            value={imagePosition}
            onChange={(e) => setImagePosition(e.target.value)}
          >
            <option value="top">Top</option>
            <option value="center">Center</option>
            <option value="bottom">Bottom</option>
            <option value="cover">Cover</option>
            <option value="stretch">Stretch</option>
          </Form.Control>
        </Form.Group>

        <div>
          <button
            className="mt-5 d-flex mx-auto d btn btn-light"
            style={{ cursor: "pointer" }}
            onClick={pdfGenerate}
            disabled={photos.length === 0}
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="container mt-5 converter__container">
        <h2 className="text-center mb-5">Convert Images into PDF</h2>
        <div className="mt-3">
          <div>
            <label form="input-file" className="input-group">
              <input
                className="form-control"
                id="input-file"
                hidden
                multiple
                type="file"
                name="photo"
                onChange={onChangePhoto}
                accept="image/png, image/jpeg, image/jpg"
              />

              <p id="upload-img" className="py-4">
                Drag and drop or click here to upload images
              </p>
            </label>
          </div>

          <div className="mt-5">
            {photos.length > 0 && <h5 className="mt-5">Uploaded</h5>}
            {photos.length === 0 && (
              <p className="text-center">No images uploaded yet.</p>
            )}
            <div className="mt-3">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="photo-item shadow-sm d-flex justify-content-between align-items-center mb-4"
                >
                  <img
                    src={URL.createObjectURL(photo)}
                    alt=""
                    width={"50"}
                    height={"50"}
                    style={{ objectFit: "cover" }}
                    className="rounded mx-4 my-1 image"
                  />
                  <span
                    style={{
                      maxWidth: "400px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {photo.name}
                  </span>
                  <div>
                    <i
                      onClick={() => removePhoto(index)}
                      className="bi bi-trash mx-4"
                      style={{ cursor: "pointer", color: "red" }}
                    ></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImgToPdf;

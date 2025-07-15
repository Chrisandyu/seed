"use client";
import ImageCard from "./ImageCard";

export default function ImageList({ boxName, images, setImages, onSelect }) {
  const deleteImage = (indexToDelete) => {
    const storedBoxes = localStorage.getItem("boxes");
    let boxes = storedBoxes ? JSON.parse(storedBoxes) : [];
    const boxIndex = boxes.findIndex((box) => box.name === boxName);
    if (boxIndex !== -1) {
      boxes[boxIndex].images = boxes[boxIndex].images.filter(
        (_, index) => index !== indexToDelete,
      );
      localStorage.setItem("boxes", JSON.stringify(boxes));
      setImages(boxes[boxIndex].images);
    }
  };

  return (
    <div className="mt-4">
      {images.length === 0 ? (
        <p className="text-gray-500">No images yet!</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
          {images.map((imageObj, index) => (
            <ImageCard
              key={index}
              image={imageObj.image}
              onDelete={() => deleteImage(index)}
              onClick={() => onSelect(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

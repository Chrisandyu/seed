"use client";
import { useState, useRef, useEffect } from "react";
import CameraPage from "./CameraPage";
import ImageView from "../components/ImageView";

export default function SwipeView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [latestImage, setLatestImage] = useState(null);
  const containerRef = useRef(null);

  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationRef = useRef(null);
  const isDragging = useRef(false);

  const clampIndex = (index) => Math.min(Math.max(index, 0), 1);

  useEffect(() => {
    const width = window.innerWidth;
    currentTranslate.current = -currentIndex * width;
    prevTranslate.current = currentTranslate.current;
    setSliderPosition(currentTranslate.current);
  }, [currentIndex]);

  const setSliderPosition = (translateX) => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  const animation = () => {
    setSliderPosition(currentTranslate.current);
    if (isDragging.current) {
      animationRef.current = requestAnimationFrame(animation);
    }
  };

  const touchStart = (index) => (event) => {
    isDragging.current = true;
    startX.current = getPositionX(event);
    animationRef.current = requestAnimationFrame(animation);
  };

  const touchMove = (event) => {
    if (!isDragging.current) return;
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startX.current;

    let newTranslate = prevTranslate.current + diff;
    const width = window.innerWidth;
    const maxTranslate = 0;
    const minTranslate = -width * 1;

    if (newTranslate > maxTranslate) newTranslate = maxTranslate;
    if (newTranslate < minTranslate) newTranslate = minTranslate;

    currentTranslate.current = newTranslate;
  };

  const touchEnd = () => {
    isDragging.current = false;
    cancelAnimationFrame(animationRef.current);

    const movedBy = currentTranslate.current - prevTranslate.current;
    const width = window.innerWidth;

    if (movedBy < -100 && currentIndex < 1) {
      setCurrentIndex((i) => clampIndex(i + 1));
    } else if (movedBy > 100 && currentIndex > 0) {
      setCurrentIndex((i) => clampIndex(i - 1));
    } else {
      setSliderPosition(prevTranslate.current);
    }
  };

  const getPositionX = (event) => {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  };

  return (
    <div
      className="w-screen h-[100dvh] overflow-hidden flex items-center relative"
      style={{ touchAction: "pan-x", userSelect: "none" }}
    >
      <div
        ref={containerRef}
        className="flex h-full transition-transform ease-out"
        style={{
          width: "200vw",
          transition: isDragging.current ? "none" : undefined,
          transform: `translateX(${currentTranslate.current}px)`,
        }}
        onTouchStart={touchStart(currentIndex)}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
        onMouseDown={touchStart(currentIndex)}
        onMouseMove={touchMove}
        onMouseUp={touchEnd}
        onMouseLeave={() => {
          if (isDragging.current) touchEnd();
        }}
      >
        {/* left side */}
        <div className="w-screen h-full">
          <CameraPage setLatestImage={setLatestImage} />
        </div>

        {/* right side */}
        <div className="w-screen h-full overflow-y-auto bg-base-300">
          {latestImage ? (
            <ImageView imageData={latestImage} index={0} />
          ) : (
            <div className="flex items-center justify-center h-full text-xl">
              No image captured yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

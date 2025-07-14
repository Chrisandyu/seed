"use client";
import { useState, useRef, useEffect } from "react";
import CameraPage from "./CameraPage";

export default function SwipeView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationRef = useRef(null);
  const isDragging = useRef(false);

  const clampIndex = (index) => Math.min(Math.max(index, 0), 1);

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
    currentTranslate.current = prevTranslate.current + diff;
  };

  const touchEnd = () => {
    isDragging.current = false;
    cancelAnimationFrame(animationRef.current);

    const movedBy = currentTranslate.current - prevTranslate.current;
    const width = window.innerWidth; // full viewport width for swipe distance

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

  useEffect(() => {
    const width = window.innerWidth; // full viewport width
    currentTranslate.current = -currentIndex * width;
    prevTranslate.current = currentTranslate.current;
    setSliderPosition(currentTranslate.current);
  }, [currentIndex]);

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        touchAction: "pan-y",
        userSelect: "none",
      }}
    >
      <div
        ref={containerRef}
        style={{
          display: "flex",
          width: "200vw", // twice viewport width for 2 pages at 100vw each
          height: "100vh",
          transition: isDragging.current ? "none" : "transform 0.3s ease-out",
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
        {/* Page 1: CameraPage takes full viewport width */}
        <div style={{ width: "100vw", height: "100vh" }}>
          <CameraPage />
        </div>

        {/* Page 2: Fullscreen image takes full viewport width */}
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundImage: "url('/test.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
    </div>
  );
}

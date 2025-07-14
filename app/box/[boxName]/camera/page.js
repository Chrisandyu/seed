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

    // Calculate proposed new translate
    let newTranslate = prevTranslate.current + diff;

    // Clamp limits: left boundary is 0 (no swiping right beyond first page)
    // right boundary is -width * (numberOfPages - 1)
    const width = window.innerWidth; // full viewport width
    const maxTranslate = 0; // leftmost position
    const minTranslate = -width * 1; // rightmost position (index 1)

    if (newTranslate > maxTranslate) newTranslate = maxTranslate;
    if (newTranslate < minTranslate) newTranslate = minTranslate;

    currentTranslate.current = newTranslate;
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

  return (
    <div
      className="overflow-hidden overflow-y-hidden scrollbar-none w-screen h-[calc(100vh-env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]"
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
        {/* Page 1 */}
        <div className="w-screen h-full">
          <CameraPage />
        </div>

        {/* Page 2 */}
        <div
          className="w-screen h-full bg-no-repeat bg-contain bg-center"
          style={{ backgroundImage: "url('/test.jpg')" }}
        />
      </div>
    </div>
  );
}

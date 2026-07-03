import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function BounceCards({
    className = "",
    items = [],
    containerWidth = 420,
    containerHeight = 250,
    animationDelay = 0.5,
    animationStagger = 0.08,
    easeType = "elastic.out(1, 0.5)",
    transformStyles = [],
    onCategoryClick,
}) {
    const containerRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    gsap.fromTo(
                        ".card",
                        {
                            scale: 0,
                            y: 120,
                            opacity: 0,
                        },
                        {
                            scale: 1,
                            y: 0,
                            opacity: 1,
                            stagger: animationStagger,
                            ease: easeType,
                            delay: animationDelay,
                            duration: 1.2,
                        }
                    );

                    setHasAnimated(true);
                }
            },
            { threshold: 0.35 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated, animationDelay, animationStagger, easeType]);

    return (
        <div
            ref={containerRef}
            className={`relative flex items-center justify-center ${className}`}
            style={{
                width: containerWidth,
                height: containerHeight,
            }}
        >
            {items.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => onCategoryClick(item.key)}
                    className="card absolute group"
                    style={{
                        transform: transformStyles[idx],
                    }}
                >
                    <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative">
                        <img
                            src={item.img}
                            alt={item.label}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />

                        {/* dark overlay */}
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition" />

                        {/* category name */}
                        <div className="absolute bottom-3 left-0 right-0 text-center">
                            <span className="bg-white/90 text-black px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                                {item.label}
                            </span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}
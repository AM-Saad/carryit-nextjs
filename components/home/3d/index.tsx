import { Canvas } from '@react-three/fiber'
import React, { useEffect, useState } from 'react'
import MapT from '@/components/home/3d/map/Scene'
import Hero from '@/components/home/3d/hero';


const smoothScrollTo = (endY: any, duration: any) => {
    const startY = window.scrollY || window.pageYOffset;
    const distanceY = endY - startY;
    const startTime = new Date().getTime();

    function easeInOutQuad(t: any) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function scroll() {
        const currentTime = new Date().getTime();
        const time = Math.min(1, (currentTime - startTime) / duration);
        const easedT = easeInOutQuad(time);

        window.scrollTo(0, startY + distanceY * easedT);

        if (time < 1) {
            requestAnimationFrame(scroll);
        }
    }

    requestAnimationFrame(scroll);
};

export default function Map() {
    const [dpr, setDpr] = useState(1.5)

    const [lastScrollTop, setLastScrollTop] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const threshold = window.innerHeight / 4;
            const currentPosition = window.scrollY;

            const isScrollingDown = currentPosition > lastScrollTop;
            const scrollingUpThreshold = threshold * 3

            if (isScrollingDown && currentPosition >= threshold) {
                // Scrolling down and past threshold - Scroll to 100vh
                smoothScrollTo(window.innerHeight, 10); // Adjust duration as needed

            } else if (!isScrollingDown && currentPosition <= scrollingUpThreshold) {
                // Scrolling up and past threshold - Scroll to 0
                smoothScrollTo(0, 10); // Adjust duration as needed
            }

            setLastScrollTop(currentPosition <= 0 ? 0 : currentPosition);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop]);
    return (
        <>
            {/* <Canvas
                style={{ width: '100vw', height: '100vh', margin: '0 auto' }}
                performance={{ min: 0.5, max: 1 }}
                dpr={dpr}
            >
                <Hero />
            </Canvas> */}
            <Canvas
                style={{ width: '100vw', height: '100vh', margin: '0 auto', position: 'relative', zIndex: 2 }}
                performance={{ min: 0.5, max: 1 }}
                dpr={dpr}
            >
                <ambientLight intensity={5} />
                <MapT />
            </Canvas>
        </>
    )
}

'use client';

import React, { useRef, useId, useEffect, useState, CSSProperties, ReactNode } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion';

// Type definitions
interface ResponsiveImage {
    src: string;
    alt?: string;
    srcSet?: string;
}

interface AnimationConfig {
    preview?: boolean;
    scale: number;
    speed: number;
}

interface NoiseConfig {
    opacity: number;
    scale: number;
}

interface ShadowOverlayProps {
    type?: 'preset' | 'custom';
    presetIndex?: number;
    customImage?: ResponsiveImage;
    sizing?: 'fill' | 'stretch';
    color?: string;
    animation?: AnimationConfig;
    noise?: NoiseConfig;
    style?: CSSProperties;
    className?: string;
    /**
     * Content rendered centered on top of the shadow (e.g. a business card).
     * Leave empty for a clean, content-free background.
     */
    children?: ReactNode;
}

/**
 * Render the heavy SVG filter at a fraction of full resolution, then upscale.
 * Safari rasterizes feTurbulence/feDisplacementMap on the CPU, so cutting the
 * pixel count ~4x (0.5 x 0.5) is the single biggest frame-rate win there.
 * Wave size, blur and frequency are compensated below so the look is preserved.
 */
const RESOLUTION = 0.5;

function mapRange(
    value: number,
    fromLow: number,
    fromHigh: number,
    toLow: number,
    toHigh: number
): number {
    if (fromLow === fromHigh) {
        return toLow;
    }
    const percentage = (value - fromLow) / (fromHigh - fromLow);
    return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
    const id = useId();
    const cleanId = id.replace(/:/g, "");
    const instanceId = `shadowoverlay-${cleanId}`;
    return instanceId;
};

export function Component({
    sizing = 'fill',
    color = 'rgba(128, 128, 128, 1)',
    animation,
    noise,
    style,
    className,
    children
}: ShadowOverlayProps) {
    const id = useInstanceId();
    const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
    const hueRotateMotionValue = useMotionValue(180);
    const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);

    // Disable the animation for users who ask for reduced motion. Starts `false`
    // so SSR and the first client render match; updated after mount.
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mq.matches);
        const onChange = () => setReducedMotion(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const animationEnabled = !!animation && animation.scale > 0 && !reducedMotion;

    const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
    const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

    // Only pay the half-resolution cost (and its slight softening) while the
    // filter is actually animating; a static shadow renders at full res.
    const res = animationEnabled ? RESOLUTION : 1;
    const inv = 1 / res;

    // Compensate so the upscaled result matches a full-res render:
    // displacement and blur shrink by `inv`, spatial frequency grows by `inv`.
    const fxDisplacement = displacementScale / inv;
    const fxBlur = 4 / inv;
    const baseFreqX = animation ? mapRange(animation.scale, 0, 100, 0.001, 0.0005) * inv : 0;
    const baseFreqY = animation ? mapRange(animation.scale, 0, 100, 0.004, 0.002) * inv : 0;

    useEffect(() => {
        if (!animationEnabled || !feColorMatrixRef.current) {
            return;
        }
        if (hueRotateAnimation.current) {
            hueRotateAnimation.current.stop();
        }
        hueRotateMotionValue.set(0);
        const controls = animate(hueRotateMotionValue, 360, {
            duration: animationDuration / 25,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0,
            ease: "linear",
            delay: 0,
            onUpdate: (value: number) => {
                if (feColorMatrixRef.current) {
                    feColorMatrixRef.current.setAttribute("values", String(value));
                }
            }
        });
        hueRotateAnimation.current = controls;

        // Stop burning CPU on the filter when the tab isn't visible.
        const onVisibility = () => {
            if (document.hidden) {
                controls.pause();
            } else {
                controls.play();
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            controls.stop();
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [animationEnabled, animationDuration, hueRotateMotionValue]);

    return (
        <div
            className={className}
            style={{
                overflow: "hidden",
                position: "relative",
                width: "100%",
                height: "100%",
                ...style
            }}
        >
            {/* Half-resolution layer: renders the masked shadow + filter small, then
                scales it up. Everything inside is processed at `res` of full size. */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${res * 100}%`,
                    height: `${res * 100}%`,
                    transform: `scale(${inv})`,
                    transformOrigin: "top left"
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: -fxDisplacement,
                        filter: animationEnabled ? `url(#${id}) blur(${fxBlur}px)` : "none"
                    }}
                >
                    {animationEnabled && (
                        <svg style={{ position: "absolute" }}>
                            <defs>
                                <filter id={id}>
                                    <feTurbulence
                                        result="undulation"
                                        numOctaves="2"
                                        baseFrequency={`${baseFreqX},${baseFreqY}`}
                                        seed="0"
                                        type="turbulence"
                                    />
                                    <feColorMatrix
                                        ref={feColorMatrixRef}
                                        in="undulation"
                                        type="hueRotate"
                                        values="180"
                                    />
                                    <feColorMatrix
                                        in="dist"
                                        result="circulation"
                                        type="matrix"
                                        values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                                    />
                                    <feDisplacementMap
                                        in="SourceGraphic"
                                        in2="circulation"
                                        scale={fxDisplacement}
                                        result="dist"
                                    />
                                    <feDisplacementMap
                                        in="dist"
                                        in2="undulation"
                                        scale={fxDisplacement}
                                        result="output"
                                    />
                                </filter>
                            </defs>
                        </svg>
                    )}
                    <div
                        style={{
                            backgroundColor: color,
                            maskImage: `url('/etheral-mask.png')`,
                            WebkitMaskImage: `url('/etheral-mask.png')`,
                            maskSize: sizing === "stretch" ? "100% 100%" : "cover",
                            WebkitMaskSize: sizing === "stretch" ? "100% 100%" : "cover",
                            maskRepeat: "no-repeat",
                            WebkitMaskRepeat: "no-repeat",
                            maskPosition: "center",
                            WebkitMaskPosition: "center",
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </div>
            </div>

            {children && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        zIndex: 10
                    }}
                >
                    {children}
                </div>
            )}

            {noise && noise.opacity > 0 && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url("/etheral-noise.png")`,
                        backgroundSize: noise.scale * 200,
                        backgroundRepeat: "repeat",
                        opacity: noise.opacity / 2
                    }}
                />
            )}
        </div>
    );
}

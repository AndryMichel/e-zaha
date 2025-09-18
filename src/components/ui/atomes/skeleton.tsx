"use client"

// components/ui/atomes/skeleton.tsx
import React from 'react';
import {cn} from "@/lib/utils";

type DimensionValue = string | number;

type DefaultTypes = {
    count?: number;
    spacing?: number;
    borderRadius?: number;
    style?: React.CSSProperties;
    className?: string;
};

export type SkeletonProps<T = boolean> = DefaultTypes & {
    width?: T extends true ? number : DimensionValue;
    circle?: T;
    height?: T extends true ? never : DimensionValue;
};

export const Skeleton = <T, >({
                                  count = 1,
                                  circle,
                                  width,
                                  borderRadius = 4,
                                  spacing = 10,
                                  style,
                                  height,
                                  className,
                                  ...rest
                              }: SkeletonProps<T>) => {
    const elements = [];

    const skeletonStyle: React.CSSProperties = {
        borderRadius: `${borderRadius}px`,
        ...style,
    };

    if (circle) {
        skeletonStyle.borderRadius = '50%';
        skeletonStyle.height = width;
        skeletonStyle.width = width;
    } else {
        if (width !== undefined) skeletonStyle.width = typeof width === 'number' ? `${width}px` : width;
        if (height !== undefined) skeletonStyle.height = typeof height === 'number' ? `${height}px` : height;
    }

    for (let i = 0; i < count; i++) {
        const elementStyle = {...skeletonStyle};
        if (i !== 0) {
            elementStyle.marginTop = `${spacing}px`;
        }

        elements.push(
            <div
                key={i}
                className={cn("bg-gray-200 animate-pulse", className)}
                style={elementStyle}
                {...rest}
            />
        );
    }

    return <>{elements}</>;
};

export default Skeleton;
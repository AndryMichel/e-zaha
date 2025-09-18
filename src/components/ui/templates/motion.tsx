'use client';

import {HTMLMotionProps, motion as framerMotion} from 'framer-motion';

type MotionDivProps = HTMLMotionProps<'div'>;
type MotionButtonProps = HTMLMotionProps<'button'>;
type MotionHeading2Props = HTMLMotionProps<'h2'>;
type MotionHeading1Props = HTMLMotionProps<'h1'>;
type MotionParagraphProps = HTMLMotionProps<'p'>;
type MotionSpanProps = HTMLMotionProps<'span'>;
type MotionSectionProps = HTMLMotionProps<'section'>;
type MotionImgProps = HTMLMotionProps<'img'>;
type MotionLiProps = HTMLMotionProps<'li'>;

export const motion = {
    div: (props: MotionDivProps) => <framerMotion.div {...props} />,
    button: (props: MotionButtonProps) => <framerMotion.button {...props} />,
    h2: (props: MotionHeading2Props) => <framerMotion.h2 {...props} />,
    h1: (props: MotionHeading1Props) => <framerMotion.h1 {...props} />,
    p: (props: MotionParagraphProps) => <framerMotion.p {...props} />,
    span: (props: MotionSpanProps) => <framerMotion.span {...props} />,
    section: (props: MotionSectionProps) => <framerMotion.section {...props} />,
    img: (props: MotionImgProps) => <framerMotion.img {...props} />,
    li: (props: MotionLiProps) => <framerMotion.li {...props} />
};

export type {
    MotionDivProps,
    MotionButtonProps,
    MotionHeading2Props,
    MotionHeading1Props,
    MotionParagraphProps,
    MotionSpanProps,
    MotionSectionProps,
    MotionImgProps,
    MotionLiProps
};

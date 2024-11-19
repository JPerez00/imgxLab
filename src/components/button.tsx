import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import React, { forwardRef } from 'react';
import Link from 'next/link';

const styles = {
  active: 'ring-1 ring-zinc-300 [--btn-bg:theme(colors.zinc.900)]',
  base: [
    'relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base font-semibold',
    'px-3.5 py-2.5 sm:px-3 sm:py-1.5 sm:text-sm',
    'disabled:opacity-50',
    '[&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:w-5 [&>[data-slot=icon]]:h-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:w-4 [&>[data-slot=icon]]:sm:h-4',
  ],
  solid: [
    'border-transparent bg-[--btn-border]',
    'bg-[--btn-bg]',
    'before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-[--btn-bg]',
    'before:shadow',
    'border-white/5',
    'after:absolute after:inset-0 after:-z-10 after:rounded-lg',
    'after:shadow-[inset_0_1px_theme(colors.white/15%)]',
    'after:hover:bg-[--btn-hover-overlay] after:active:bg-[--btn-hover-overlay]',
    'after:-inset-px after:rounded-lg',
    'before:disabled:shadow-none after:disabled:shadow-none',
  ],
  outline: [
    'border-white/15 text-white hover:bg-white/5 active:bg-white/10',
    '[--btn-icon:theme(colors.zinc.500)] hover:[--btn-icon:theme(colors.zinc.400)] active:[--btn-icon:theme(colors.zinc.300)]',
  ],
  plain: [
    'border-transparent text-white hover:bg-white/10 active:bg-white/20',
    '[--btn-icon:theme(colors.zinc.500)] hover:[--btn-icon:theme(colors.zinc.400)] active:[--btn-icon:theme(colors.zinc.300)]',
  ],
  colors: {
    'dark/zinc': [
      'text-white [--btn-bg:theme(colors.zinc.800)] [--btn-border:theme(colors.zinc.950/90%)] [--btn-hover-overlay:theme(colors.white/5%)]',
      '[--btn-icon:theme(colors.zinc.400)] hover:[--btn-icon:theme(colors.zinc.300)] active:[--btn-icon:theme(colors.zinc.300)]',
    ],
  },
};

type ButtonProps = {
  color?: keyof typeof styles.colors;
  outline?: boolean;
  plain?: boolean;
  className?: string;
  children: React.ReactNode;
  active?: boolean; // Added active prop
} & (
  | Omit<Headless.ButtonProps<'button'>, 'as' | 'className'>
  | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
);

export const Button = forwardRef(function Button(
  { color = 'dark/zinc', outline = false, plain = false, className, active = false, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  let variantStyles;

  if (outline) {
    variantStyles = styles.outline;
  } else if (plain) {
    variantStyles = styles.plain;
  } else {
    variantStyles = clsx(styles.solid, styles.colors[color]);
  }

  const classes = clsx(
    className,
    styles.base,
    variantStyles,
    active && styles.active // Apply active styles when active is true
  );

  if ('href' in props) {
    return (
      <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
        {children}
      </Link>
    );
  } else {
    return (
      <Headless.Button
        {...props}
        className={classes}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
      >
        {children}
      </Headless.Button>
    );
  }
});

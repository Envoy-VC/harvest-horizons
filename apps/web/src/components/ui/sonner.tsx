import { useTheme } from 'next-themes';
import type { ComponentProps } from 'react';
import { Toaster as Sonner } from 'sonner';
import Icon from './icon';

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      icons={{
        success: <Icon icon='check' />,
        error: <Icon icon='cross' />,
        loading: <Icon icon='pending' />,
      }}
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:!bg-[#C3AC90] group-[.toaster]:!text-black group-[.toaster]:!border-[2px] group-[.toaster]:!border-[#A85F46] group-[.toaster]:shadow-lg !flex !flex-row !gap-4 !font-minecraftia !items-center',
          description: 'group-[.toast]:text-muted-foreground',
          content: '!translate-y-1  !font-bold',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

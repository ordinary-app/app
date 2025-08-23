import React from "react";
import { ActionIcon } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { useMantineColorScheme } from '@mantine/core';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export function BackButton({ onClick, className = "" }: BackButtonProps) {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <ActionIcon 
        variant="subtle" 
        color={colorScheme === "dark" ? "white" : "gray"} 
        size="lg"
        onClick={handleClick}
      >
        <ArrowLeft size={20} />
      </ActionIcon>
    </div>
  );
}

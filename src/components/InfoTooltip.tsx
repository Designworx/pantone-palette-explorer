
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  popoverId: string;
  openPopover: string | null;
  onPopoverChange: (popoverId: string, isOpen: boolean) => void;
}

export const InfoTooltip = ({
  content,
  popoverId,
  openPopover,
  onPopoverChange
}: InfoTooltipProps) => {
  return (
    <>
      {/* Desktop tooltip */}
      <div className="hidden md:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-help flex-shrink-0 transition-colors" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white border-gray-700" side="bottom">
            <p>{content}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Mobile/tablet popover */}
      <div className="md:hidden">
        <Popover open={openPopover === popoverId} onOpenChange={isOpen => onPopoverChange(popoverId, isOpen)}>
          <PopoverTrigger asChild>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation">
              <Info className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer flex-shrink-0 transition-colors" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-gray-800 text-white border-gray-700 w-64" side="bottom">
            <p className="text-sm">{content}</p>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

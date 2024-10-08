import { Button } from '@nextui-org/react';
import React, { ReactElement } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

import { MobileMenuButtonProps } from '@/types/types';

export default function MobileMenuButton({
  menuOpen,
  setMenuOpen,
}: MobileMenuButtonProps): ReactElement {
  return (
    <div className="md:hidden flex items-center w-min">
      <Button
        variant="bordered"
        className="text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </Button>
    </div>
  );
}

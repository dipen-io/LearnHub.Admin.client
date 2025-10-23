import { SunMoon } from 'lucide-react';
import { useTheme } from '../context/themContext';

const ToggleTheme = () => {
  const { theme, toggleTheme, setStyle } = useTheme();

  return (
    <div className="flex items-center justify-center w-60  hover:bg-white border rounded-md border-amber-700">
      <div className="text-center">
        <button
          onClick={toggleTheme}
          className="px-5 py-1.5"
        >
            <span className='flex gap-3'>
                <SunMoon />
                {theme}
            </span>
        </button>
      </div>
    </div>
  );
}

export default ToggleTheme;

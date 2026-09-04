import { SunMoon } from 'lucide-react';
import { useTheme } from '../context/themContext';

const ToggleTheme = () => {
  const { theme, toggleTheme, setStyle } = useTheme();

  return (
    <div className="flex items-center mx-4 justify-center  hover:bg-white border rounded-md border-amber-700"
          onClick={toggleTheme}
        >
      <div className="text-center">
        <button
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

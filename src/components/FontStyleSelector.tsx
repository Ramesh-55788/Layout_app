
function FontStyleSelector({
    fontWeight,
    fontStyle,
    textDecoration,
    onChange,
    theme
}: {
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    onChange: (values: string[]) => void;
    theme: string;
}) {
    const selected = [
        fontWeight === 'bold' ? 'bold' : null,
        fontStyle === 'italic' ? 'italic' : null,
        textDecoration === 'underline' ? 'underline' : null
    ].filter(Boolean) as string[];

    const handleToggle = (value: string) => {
        const updated = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        onChange(updated);
    };

    const isSelected = (value: string) => selected.includes(value);

    const baseClass =
        'w-8 h-8 flex items-center justify-center border rounded text-sm font-semibold cursor-pointer';
    const activeClass = theme === 'dark'
        ? 'bg-gray-700 text-white border-gray-500'
        : 'bg-gray-200 text-black border-gray-400';
    const inactiveClass = theme === 'dark'
        ? 'bg-gray-900 text-gray-300 border-gray-700'
        : 'bg-white text-gray-600 border-gray-300';

    return (
        <div className="flex flex-col gap-1">
            <label className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Font Style
            </label>
            <div className="flex gap-2">
                <div
                    className={`${baseClass} ${isSelected('bold') ? activeClass : inactiveClass}`}
                    onClick={() => handleToggle('bold')}
                >
                    B
                </div>
                <div
                    className={`${baseClass} ${isSelected('italic') ? activeClass : inactiveClass}`}
                    onClick={() => handleToggle('italic')}
                >
                    <span className="italic">I</span>
                </div>
                <div
                    className={`${baseClass} ${isSelected('underline') ? activeClass : inactiveClass}`}
                    onClick={() => handleToggle('underline')}
                >
                    <span className="underline">U</span>
                </div>
            </div>
        </div>
    );
}

export default FontStyleSelector;

type Props = {
  suggestions: string[];
  onSelect: (
    suggestion: string,
  ) => void;
};

export default function ChatSuggestions({
  suggestions,
  onSelect,
}: Props) {

  return (
    <div className="flex flex-wrap gap-2">

      {suggestions.map(
        (suggestion) => (

          <button
            key={suggestion}
            onClick={() =>
              onSelect(
                suggestion,
              )
            }
            className="
              rounded-full
              border
              border-white/10
              bg-white/5
              px-4
              py-2
              text-sm
              text-white/80
              transition-all
              hover:border-[#C7962D]/40
              hover:bg-[#C7962D]/10
              hover:text-white
              cursor-pointer
            "
          >
            {suggestion}
          </button>
        ),
      )}

    </div>
  );
}
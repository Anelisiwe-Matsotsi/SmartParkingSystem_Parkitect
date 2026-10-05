//(Withfra.me, 2022)
const tabs = [
  { name: "Section A" },
  { name: "Section B" },
  { name: "Section C" },
  { name: "Section D" },
  { name: "Section E" },
];

type Props = {
  selectedSection: string;
  onSelectSection: (section: string) => void;
};

export default function SectionTabs({ selectedSection, onSelectSection }: Props) {
  return (
    <div className="section-tabs" role="tablist">
      {tabs.map((item) => {
        const active = item.name === selectedSection;

        return (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={active}
            className={`section-tab${active ? " is-active" : ""}`}
            onClick={() => onSelectSection(item.name)}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
}

/**
 * References
 * Withfra.me. 2022. Ready to Use React Native Components - WithFrame | withfra.me. (Version 2.0) [Source code] Available at:<https://withfra.me/components > [Accessed 17 Aug. 2026].
 */
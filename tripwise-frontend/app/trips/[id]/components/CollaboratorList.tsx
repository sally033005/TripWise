// CollaboratorList.tsx
interface Props {
    creatorName: string;
    collaboratorNames: string[];
  }
  
  export default function CollaboratorList({ creatorName, collaboratorNames }: Props) {
    const getBgColor = (name: string, isOwner: boolean) => {
      if (isOwner) return "bg-slate-800 text-white border-yellow-400";
      const colors = ["bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600", "bg-rose-100 text-rose-600"];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    };
  
    return (
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {/* Trip Owner */}
          <div
            title={`Owner: ${creatorName}`}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold z-30 transition-transform hover:scale-110 ${getBgColor(creatorName, true)}`}
          >
            {creatorName[0]?.toUpperCase() || "?"}
          </div>
  
          {/* Collaborators */}
          {collaboratorNames.map((name, index) => (
            <div
              key={index}
              title={name}
              style={{ zIndex: 20 - index }}
              className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold hover:z-40 transition-all cursor-default ${getBgColor(name, false)}`}
            >
              {name[0]?.toUpperCase() || "?"}
            </div>
          ))}
        </div>
  
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-700 dark:text-slate-200">
            {collaboratorNames.length + 1} People
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
            Planning together
          </span>
        </div>
      </div>
    );
  }
type StatusBadgeProps = {
  active: boolean;
};

export default function StatusBadge({ active }: StatusBadgeProps) {
  return active ? (
    <div className="w-16 md:w-20 rounded-full p-0 md:p-1 border-2 border-slate-300 bg-green-100 text-center text-slate-500">
      Active
    </div>
  ) : (
    <div className="w-16 md:w-20 rounded-full p-0 md:p-1 border-2 border-slate-300 bg-slate-200 text-center text-slate-500">
      Disabled
    </div>
  );
}

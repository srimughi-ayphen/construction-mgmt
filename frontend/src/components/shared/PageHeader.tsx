export function PageHeader({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: any;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-700" />
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-gray-500 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

import { formatRelativeDate, isOverdue, isDueSoon } from '../utils/formatDate'
import tokens from '../theme/tokens'

const TaskCard = ({ task, onStatusChange }) => {
  const statusMeta = tokens.status[task.status] || tokens.status.todo
  const priorityMeta = tokens.priority[task.priority] || tokens.priority.medium
  const relativeDue = formatRelativeDate(task.due_date)
  const overdue = isOverdue(task.due_date)
  const dueSoon = isDueSoon(task.due_date)

  return (
    <div className="card card-compact bg-base-100/90 backdrop-blur-sm shadow-sm border border-base-300/60">
      <div className="card-body">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-sm">{task.title}</h3>
          <span className={`badge badge-${priorityMeta.color} badge-sm`}>{priorityMeta.label}</span>
        </div>
        {task.description && <p className="text-xs text-base-content/70 line-clamp-2">{task.description}</p>}
        <div className="flex items-center justify-between mt-2">
          <span className={`badge badge-${statusMeta.color} badge-outline text-xs`}>
            {statusMeta.label}
          </span>
          {relativeDue && (
            <span
              className={`text-xs ${overdue ? 'text-error' : dueSoon ? 'text-warning' : 'text-base-content/60'}`}
            >
              {relativeDue}
            </span>
          )}
        </div>
        <div className="mt-2">
          <select
            className="select select-bordered select-xs w-full"
            value={task.status}
            onChange={(event) => onStatusChange(task, event.target.value)}
          >
            {Object.entries(tokens.status).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default TaskCard

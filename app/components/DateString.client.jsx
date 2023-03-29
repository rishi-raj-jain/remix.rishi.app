import { month, weekday } from '../lib/operations'

export default function DateString({ date }) {
  return <span>{`${weekday[date.getDay()]}, ${month[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`}</span>
}

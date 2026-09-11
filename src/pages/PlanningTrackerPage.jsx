import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { planningNotices, noticeCategories, municipalities, getNoticeStats, getUpcomingMeetings, getActiveNotices } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(date.getHours() || date.getMinutes() ? { hour: 'numeric', minute: '2-digit' } : {})
    })
  } catch {
    return dateStr
  }
}

function formatRelativeDate(dateStr) {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    const now = new Date()
    const diffMs = date - now
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Past'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays <= 7) return `In ${diffDays} days`
    if (diffDays <= 14) return `In 1 week`
    if (diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} weeks`
    return formatDate(dateStr)
  } catch {
    return ''
  }
}

function CategoryBadge({ category }) {
  const cat = noticeCategories.find(c => c.key === category)
  if (!cat) return <span className="badge badge-default">{category}</span>
  return (
    <span
      className="badge badge-cat"
      style={{ '--badge-tint': cat.color || 'var(--signal)' }}
      title={cat.label}
    >
      {cat.label}
    </span>
  )
}

function StatusBadge({ status }) {
  const statusConfig = {
    'Public Meeting Scheduled': { label: 'Meeting Scheduled', color: 'var(--primary)' },
    'Hearing Scheduled': { label: 'Hearing Scheduled', color: 'var(--accent)' },
    'Meeting Complete': { label: 'Meeting Complete', color: 'var(--success)' },
    'Hearing Complete': { label: 'Hearing Complete', color: 'var(--success)' },
    'Approved': { label: 'Approved', color: 'var(--success)' },
    'Active': { label: 'Active', color: 'var(--info)' },
    'Under Construction': { label: 'Under Construction', color: 'var(--warning)' },
    'Pre-construction': { label: 'Pre-construction', color: 'var(--warning)' },
    'Complete': { label: 'Complete', color: 'var(--muted)' },
    'Open House Complete': { label: 'Open House Complete', color: 'var(--success)' },
    'Application Complete': { label: 'Application Complete', color: 'var(--info)' },
    'Meeting Scheduled': { label: 'Meeting Scheduled', color: 'var(--primary)' },
  }
  const config = statusConfig[status] || { label: status, color: 'var(--muted)' }
  return (
    <span
      className="badge badge-status"
      style={{ '--badge-tint': config.color }}
      title={config.label}
    >
      {config.label}
    </span>
  )
}

export default function PlanningTrackerPage() {
  return (
    <div className="planning-tracker-page">
      <header className="page-header">
        <div className="container">
          <h1>Planning & Development Tracker</h1>
          <p className="page-subtitle">Restoring full page — please refresh in a moment.</p>
        </div>
      </header>
    </div>
  )
}

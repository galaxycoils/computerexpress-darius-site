export const AUDIT_VIDEO = {
  path: '/video/audit-walkthrough.mp4',
  poster: '/images/gbp/audit-walkthrough-poster.webp',
  title: 'Audit walkthrough preview',
  description:
    'A short preview of the mobile, local search, and conversion checks used during a St. Catharines Digital website audit.',
}

export default function AuditMedia({
  title = AUDIT_VIDEO.title,
  description = AUDIT_VIDEO.description,
  className = '',
}) {
  return (
    <figure className={`audit-media ${className}`.trim()}>
      <video
        className="audit-media-video"
        src={AUDIT_VIDEO.path}
        poster={AUDIT_VIDEO.poster}
        preload="metadata"
        controls
        playsInline
      />
      <figcaption className="audit-media-caption">
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>
    </figure>
  )
}

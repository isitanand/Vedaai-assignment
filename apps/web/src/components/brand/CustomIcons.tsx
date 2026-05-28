import type { SVGProps } from "react";

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

export function MyGroupsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <mask id="my-groups-mask">
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <rect x="6" y="8" width="5" height="2" rx="0.5" fill="black" />
        <rect x="6" y="12" width="4" height="2" rx="0.5" fill="black" />
        <circle cx="15.5" cy="9.5" r="2.2" fill="black" />
        <path d="M12 16.5c0-1.8 1.5-3 3.5-3s3.5 1.2 3.5 3v0.5h-7v-0.5z" fill="black" />
      </mask>
      <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" stroke="none" mask="url(#my-groups-mask)" />
    </svg>
  );
}

export function AssignmentsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 7.5 19.5 7.5" />
      <rect x="7" y="11" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
      <line x1="11" y1="12" x2="16" y2="12" />
      <rect x="7" y="15" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
      <line x1="11" y1="16" x2="14" y2="16" />
    </svg>
  );
}

export function ToolkitIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <line x1="5" y1="17" x2="19" y2="17" />
    </svg>
  );
}

export function LibraryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

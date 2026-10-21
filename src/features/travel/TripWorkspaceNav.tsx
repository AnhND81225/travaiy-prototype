import { useLocation, useNavigate } from 'react-router-dom';
import { useTravel } from './TravelContext';
import './workspace.css';

type WorkspaceSection = {
  label: string;
  href: string;
  matches: (pathname: string) => boolean;
};

/** Keeps trip tools in one context instead of exposing each as a separate app area. */
export function TripWorkspaceNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { plan } = useTravel();
  const sections: WorkspaceSection[] = [
    { label: 'Tổng quan', href: '/trip/overview', matches: path => path === '/trip/overview' },
    { label: 'Lịch trình', href: '/trip/day/1', matches: path => path === '/trip/today' || path.startsWith('/trip/day/') || path.startsWith('/trip/edit/') || path === '/trip/adaptive' },
    { label: 'Bản đồ', href: '/trip/route', matches: path => path === '/trip/route' },
    { label: 'Chuẩn bị', href: '/trip/preparation', matches: path => path === '/trip/preparation' || path === '/trip/packing-list' || path.startsWith('/wallet') },
    ...(plan.companionType === 'group' ? [{ label: 'Nhóm', href: '/trip/group', matches: (path: string) => path.startsWith('/trip/group') || path === '/trip/expenses' }] : []),
    { label: 'Kỷ niệm', href: '/trip/journal', matches: path => path === '/trip/journal' || path === '/trip/camera' || path.startsWith('/trip/recap/') },
  ];

  return <nav className="trip-workspace-nav" aria-label="Không gian chuyến đi">
    {sections.map(section => <button key={section.href} type="button" aria-current={section.matches(pathname) ? 'page' : undefined} onClick={() => navigate(section.href)}>{section.label}</button>)}
  </nav>;
}

import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
    const location = useLocation()

    let currentlink = ''

    const nameMapping = {
        'manage-users': 'Manage Users',
        'admin': 'Admin',
        'pending-requests': 'Pending Requests',
    };

    const crumbs = location.pathname.split('/')
        .filter(crumb => crumb !== '')
        .map((crumb, index, array) => {
            currentlink += `/${crumb}`

            const displayName = nameMapping[crumb] || crumb;
            
            return (
                <li className={`breadcrumb-item ${index === array.length - 1 ? 'active' : ''}`} key={crumb} aria-current={index === array.length - 1 ? 'page' : undefined}>
                    <Link to={currentlink}>{displayName}</Link>
                </li>
            )
        })

    return (
        <div className="breadcrumb-text">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {crumbs}
                </ol>
            </nav>
        </div>
    )
}
import { Link } from 'react-router-dom';

function DashHeader() {
    const content = (
        <header className="dash-header">
            <div className="dash-header__container">
                <Link to="/dash/notes">
                    <h1 className="dash-hedaer__title">techNotes</h1>
                </Link>
                <nav className="dash-header__nav">{/* nav button here */}</nav>
            </div>
        </header>
    );
    return content;
}

export default DashHeader;

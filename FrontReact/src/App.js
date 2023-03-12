import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import UsersList from './features/users/UsersList';
import NotesList from './features/notes/NotesList';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />
                {/* setelah login (dashboard) */}
                <Route path="dash" element={<DashLayout />}>
                    {/* halaman awal berisi menu user dan notes Start*/}
                    <Route index element={<Welcome />} />

                    <Route path="notes">
                        <Route index element={<NotesList />} /> {/*halaman Note */}
                    </Route>

                    <Route path="users">
                        <Route index element={<UsersList />} /> {/* halaman User */}
                    </Route>
                    {/* halaman awal berisi menu user dan notes  End*/}
                </Route>
                {/* bagian akhir login */}
            </Route>
        </Routes>
    );
}

export default App;

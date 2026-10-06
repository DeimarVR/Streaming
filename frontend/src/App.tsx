import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { DemoProvider } from './demo/store';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { AppShell } from './app/Shell';

export default function App() {
  return (
    <ThemeProvider>
      <DemoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={<AppShell />} />
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </ThemeProvider>
  );
}

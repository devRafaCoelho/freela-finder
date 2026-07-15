import { Routes, Route, Navigate } from 'react-router-dom';
import { SearchPage } from '../pages/SearchPage/SearchPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/busca" replace />} />
      <Route path="/busca" element={<SearchPage />} />
      <Route path="*" element={<Navigate to="/busca" replace />} />
    </Routes>
  );
}
